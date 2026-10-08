import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { thumbnailOf, type CaseStudy } from "../content/caseStudies";
import { Reveal, easeOut } from "./motion";
import { PhoneStage } from "./PhoneStage";

/**
 * Swipeable row of case study cards: native scroll-snap for touch and trackpads,
 * arrow buttons for mouse users, and a hairline that fills as you move across.
 * Used for the Work section on the home page and at the end of every case study.
 */
export function CaseStudyRail({
  id,
  labelledBy,
  studies,
  heading,
  className,
}: {
  id?: string;
  labelledBy: string;
  studies: CaseStudy[];
  heading: ReactNode;
  className?: string;
}) {
  const rail = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: false });

  // Track whether the rail can move further in either direction, for the arrow buttons.
  const updateEdges = () => {
    const el = rail.current;
    if (!el) return;
    const start = el.scrollLeft <= 4;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, []);

  // Move to the neighbouring card by its exact position, so snapping never fights the scroll.
  const page = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const cards = [...el.querySelectorAll("li")];
    const pad = parseFloat(getComputedStyle(el).scrollPaddingInlineStart) || 0;
    const current = cards.reduce(
      (best, c, i) => (Math.abs(c.offsetLeft - pad - el.scrollLeft) < Math.abs(cards[best].offsetLeft - pad - el.scrollLeft) ? i : best),
      0,
    );
    const target = cards[Math.min(Math.max(current + dir, 0), cards.length - 1)];
    el.scrollTo({ left: target.offsetLeft - pad, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id={id} aria-labelledby={labelledBy} className={className}>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 md:flex-row md:items-end md:justify-between md:px-8">
        <Reveal>{heading}</Reveal>
        <div className="hidden gap-2 md:flex">
          <RailButton label="Previous case study" disabled={edges.start} onClick={() => page(-1)}>
            <ArrowLeft weight="regular" className="size-5" />
          </RailButton>
          <RailButton label="Next case study" disabled={edges.end} onClick={() => page(1)}>
            <ArrowRight weight="regular" className="size-5" />
          </RailButton>
        </div>
      </div>

      <ul
        ref={rail}
        onScroll={updateEdges}
        tabIndex={0}
        aria-label="Case studies, scroll sideways for more"
        className="rail mt-12 flex snap-x snap-mandatory gap-[26px] overflow-x-auto pb-2 focus-visible:outline-offset-[-2px] md:mt-16 md:gap-[34px]"
      >
        {studies.map((study, i) => (
          <motion.li
            key={study.slug}
            className="w-[73vw] shrink-0 snap-start sm:w-[357px] lg:w-[374px]"
            initial={reduce ? false : { opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: easeOut, delay: i * 0.08 }}
          >
            <WorkCard study={study} />
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

function RailButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-12 place-items-center rounded-[10px] border border-line text-fg transition-colors duration-300 hover:border-fg hover:bg-fg hover:text-on-fg active:scale-[0.97] disabled:pointer-events-none disabled:text-soft disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function WorkCard({ study }: { study: CaseStudy }) {
  const soon = !!study.comingSoon;
  const body = (
    <>
      <div className="relative">
        <PhoneStage shots={[thumbnailOf(study)]} crop lift={!soon} className="aspect-[4/5] rounded-[20px]" />
        {soon && (
          <span className="absolute left-4 top-4 rounded-[10px] bg-fg px-3 py-1.5 text-[13px] font-medium text-on-fg">Coming soon</span>
        )}
      </div>
      <h3 className="mt-6 text-2xl font-medium tracking-[-0.02em] md:text-[1.75rem]">{study.title}</h3>
      <p className="mt-3 leading-relaxed text-muted">{study.description}</p>
      {!soon && (
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-medium">
          <ArrowRight className="size-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1" />
          Read case study
        </span>
      )}
    </>
  );

  // A project that is coming soon has nothing to open yet, so its card is not a link.
  if (soon) return <div className="flex h-full flex-col">{body}</div>;
  return (
    <Link to={`/work/${study.slug}`} className="group flex h-full flex-col">
      {body}
    </Link>
  );
}
