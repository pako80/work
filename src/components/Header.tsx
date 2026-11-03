import { List, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router";
import { WRITINGS_NAME, writings } from "../content/writings";
import { easeOut } from "./motion";

// Writings only appears once there is something to read.
const nav = [
  { to: "/#work", id: "work", label: "Work" },
  { to: "/#approach", id: "approach", label: "Approach" },
  { to: "/#experience", id: "experience", label: "Experience" },
  ...(writings.length ? [{ to: "/#writings", id: "writings", label: WRITINGS_NAME }] : []),
  { to: "/#contact", id: "contact", label: "Contact" },
];

/** The section being read: the last one whose top has passed 40% of the viewport. None while in the hero. */
function sectionInView(): string | null {
  const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
  if (atBottom) return "contact";
  let current: string | null = null;
  for (const { id } of nav) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = id;
  }
  return current;
}

// Always pinned to the top, so the main navigation is one click away at any scroll depth.
export function Header() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  const update = useCallback(() => {
    // Only the home page has these sections, and the writings pages mark their own tab; an unknown route clears the underline.
    const next = pathname.startsWith("/writings") ? "writings" : pathname === "/" || pathname.startsWith("/work/") ? sectionInView() : null;
    setActive((prev) => (prev === next ? prev : next));
  }, [pathname]);

  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  return (
    <header className="header-glass fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
        <Link to="/" aria-label="Mario Borg, home" className="group flex items-center gap-3">
          <span
            aria-hidden
            className="mark block h-[46px] w-[41px] bg-fg"
          />
          {/* Name stays hidden until the mark is hovered or focused. It only fades, so it never shifts position. */}
          <span
            aria-hidden
            className="hidden text-[15px] font-medium opacity-0 transition-opacity duration-500 ease-[var(--ease-out)] group-hover:opacity-100 group-focus-visible:opacity-100 sm:inline-block"
          >
            Mario Borg
          </span>
        </Link>
        {/* On phones the tabs live in a menu that drops down from the top. */}
        <button
          ref={menuButton}
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="-mr-2 grid size-11 place-items-center rounded-full text-fg transition-transform duration-200 active:scale-[0.94] sm:hidden"
        >
          <List weight="regular" className="size-7" />
        </button>
        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex items-center gap-6 text-[15px] md:gap-8">
            {nav.map((item) => {
              const selected = active === item.id;
              return (
                <li key={item.to} className="relative">
                  <Link
                    to={item.to}
                    aria-current={selected ? "location" : undefined}
                    className={`block py-2 transition-colors duration-300 hover:text-fg ${selected ? "text-fg" : "text-muted"}`}
                  >
                    {item.label}
                  </Link>
                  {selected && (
                    <motion.span
                      layoutId="nav-underline"
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-[2px] bg-fg"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      {/* In a portal: the header's blur makes it the frame of reference for fixed children, which would shrink the menu to the header's height. */}
      {createPortal(
        <AnimatePresence>
          {menuOpen && (
            <MobileMenu
              active={active}
              onClose={() => {
                setMenuOpen(false);
                menuButton.current?.focus();
              }}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </header>
  );
}

/**
 * Full-screen menu for phones. It drops down from the top over a dark grey panel, the tabs set large in Circular,
 * and it closes with the button, Esc, or by choosing a tab.
 */
function MobileMenu({ active, onClose }: { active: string | null; onClose: () => void }) {
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const closeButton = useRef<HTMLButtonElement>(null);

  // The latest close handler, so the effects below set up once and are not redone every time the header re-renders.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const openedAt = useRef(pathname);

  // Hold the page still behind the menu, close on Esc, and start with focus on the close button.
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Leave the menu when the page changes underneath it.
  useEffect(() => {
    if (pathname !== openedAt.current) closeRef.current();
  }, [pathname]);

  const choose = (to: string, id: string) => {
    onClose();
    // Already on the home page: Home will not scroll for a hash it already has, so do it here.
    if (to.startsWith("/#") && pathname === "/") setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 350);
  };

  return (
    <>
      {/* The logo and close button do not travel with the panel: they sit exactly over the header's own and simply fade in. */}
      <motion.div
        data-theme="dark"
        className="fixed inset-x-0 top-0 z-[71] flex h-16 items-center justify-between bg-transparent px-4 text-fg sm:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Link to="/" aria-label="Mario Borg, home" onClick={onClose} className="block">
          <span aria-hidden className="mark block h-[46px] w-[41px] bg-fg" />
        </Link>
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="-mr-2 grid size-11 place-items-center rounded-full text-fg transition-transform duration-200 active:scale-[0.94]"
        >
          <X className="size-7" />
        </button>
      </motion.div>

      <motion.div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-theme="dark"
        className="fixed inset-0 z-[70] flex flex-col rounded-b-[28px] bg-card text-fg sm:hidden"
        initial={reduce ? { opacity: 0 } : { y: "-100%" }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        exit={reduce ? { opacity: 0 } : { y: "-100%" }}
        transition={{ duration: reduce ? 0.2 : 0.8, ease: easeOut }}
      >
        <div className="h-16 shrink-0" aria-hidden />

        <nav aria-label="Primary" className="flex flex-1 flex-col justify-center px-4 pb-16">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <motion.li
                key={item.to}
                initial={reduce ? false : { opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: easeOut, delay: reduce ? 0 : 0.3 + i * 0.06 }}
              >
                <Link
                  to={item.to}
                  onClick={() => choose(item.to, item.id)}
                  aria-current={active === item.id ? "location" : undefined}
                  className="block py-2.5 text-5xl font-medium leading-[1.1] tracking-[-0.035em] transition-opacity duration-300 active:opacity-60"
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </motion.div>
    </>
  );
}
