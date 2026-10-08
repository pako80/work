import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const nav = [
  { to: "/#work", id: "work", label: "Work" },
  { to: "/#approach", id: "approach", label: "Approach" },
  { to: "/#experience", id: "experience", label: "Experience" },
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

  const update = useCallback(() => {
    // Only the home page has these sections; an unknown route clears the underline.
    const next = pathname === "/" || pathname.startsWith("/work/") ? sectionInView() : null;
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
          {/* Name stays hidden until the mark is hovered or focused. */}
          <span
            aria-hidden
            className="hidden -translate-x-2 text-[15px] font-medium opacity-0 transition-[opacity,transform] duration-500 ease-[var(--ease-out)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:inline-block"
          >
            Mario Borg
          </span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-4 text-[15px] sm:gap-6 md:gap-8">
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
    </header>
  );
}
