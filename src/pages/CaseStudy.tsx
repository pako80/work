import { ArrowUpRight, X } from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { createRef, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { CaseStudyRail } from "../components/CaseStudyRail";
import { StageMedia } from "../components/StageMedia";
import { useNavigate } from "react-router";
import {
  CountUp,
  MaskedTitle,
  Reveal,
  ScrollContainer,
  ScrollWord,
  easeOut,
  useScrollContainer,
} from "../components/motion";
import { caseStudies, findCaseStudy, type CaseStudy, type Image, type Learning, type Stage, type StudyLink } from "../content/caseStudies";

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "impact", label: "Impact" },
  { id: "stages", label: "Key stages" },
  { id: "outcomes", label: "Solution" },
  { id: "learnings", label: "Learnings" },
  { id: "links", label: "Prototypes" },
] as const;

// Sheet motion: a soft iOS-style rise that settles without overshoot.
const sheetEase = [0.32, 0.72, 0, 1] as const;

/**
 * A case study opens as a full-height card that rises from the bottom and stops
 * just under the main header, so the site navigation never leaves the screen.
 * The home page stays mounted underneath; closing returns the reader to the exact spot they left.
 */
export function CaseStudySheet({ slug }: { slug: string }) {
  const study = findCaseStudy(slug);
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const close = () => navigate("/");

  // The page behind stays still while the sheet is open.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    frame.current?.focus({ preventScroll: true });
    return () => {
      html.style.overflow = prev;
      document.title = "Mario Borg, Selected Work";
    };
  }, []);

  useEffect(() => {
    document.title = study ? `${study.title}, Mario Borg` : "Case study not found, Mario Borg";
  }, [study]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <>
      <motion.div
        ref={frame}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-title"
        tabIndex={-1}
        data-theme="dark"
        className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-hidden rounded-t-[28px] md:rounded-t-[36px] bg-bg text-fg shadow-[0_-24px_60px_-24px_rgb(14_14_14/0.5)] outline-none"
        initial={reduce ? { opacity: 0 } : { y: "100%" }}
        animate={reduce ? { opacity: 1 } : { y: "0%" }}
        exit={reduce ? { opacity: 0 } : { y: "100%" }}
        transition={{ duration: 0.85, ease: sheetEase }}
      >
        <div ref={scroller} className="relative h-full overflow-y-auto overscroll-contain">
          <ScrollContainer.Provider value={scroller}>
              {/* Moving to another study cross-fades the content inside the same sheet. */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={slug}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: easeOut }}
                >
                  {study ? <StudyContent study={study} /> : <Missing />}
                </motion.div>
              </AnimatePresence>
          </ScrollContainer.Provider>
        </div>

        <CloseButton onClose={close} />
      </motion.div>
    </>
  );
}

/** A project with no headline and no metrics has no Impact section. */
const hasImpact = (study: CaseStudy) => !!study.impact.lead || study.impact.metrics.length > 0;

function StudyContent({ study }: { study: CaseStudy }) {
  const scroller = useScrollContainer();
  // Each study starts from its top, including when arriving from "Next case study".
  useEffect(() => {
    scroller?.current?.scrollTo({ top: 0 });
  }, [scroller]);

  return (
    <>
      <main id="case-main">
        <Intro study={study} />
        {hasImpact(study) && <Impact study={study} />}
        <Stages stages={study.stages} />
        <Outcomes screens={study.outcomeScreens} />
        {study.learnings.length > 0 && <Learnings learnings={study.learnings} />}
        {study.links?.length ? <Links links={study.links} /> : null}
        <MoreStudies current={study} />
      </main>
    </>
  );
}

function Missing() {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-[1400px] flex-col justify-center px-4 md:px-8">
      <h1 id="case-title" className="text-4xl font-medium tracking-[-0.03em] md:text-6xl">
        This case study does not exist.
      </h1>
      <p className="mt-5 max-w-[44ch] text-lg text-muted">The link may be old, or the project may have moved. Close this to see all work.</p>
    </div>
  );
}

/* Shared section frame: section name on the left, content on the right. */
function Section({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-16 ${className ?? ""}`}>
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 md:px-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] lg:gap-12">
        <h2 id={`${id}-title`} className="text-2xl font-medium tracking-[-0.02em] lg:sticky lg:top-24 lg:self-start">
          {title}
        </h2>
        <div>{children}</div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Introduction */

function Intro({ study }: { study: CaseStudy }) {
  const reduce = useReducedMotion();

  const meta = [
    ["Company", study.company],
    ["Role", study.role],
    ["Years", study.years],
  ];

  return (
    <>
      <header className="mx-auto max-w-[1400px] px-4 pb-8 pt-20 md:px-8 md:pb-10 md:pt-28">
        <motion.p
          className="mb-5 text-[13px] font-bold uppercase tracking-[0.24em] text-soft md:mb-6"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.25 }}
        >
          Case study
        </motion.p>
        <MaskedTitle
          id="case-title"
          text={study.title}
          delay={0.35}
          className="max-w-[18ch] text-5xl font-medium leading-[1.02] tracking-[-0.035em] md:text-7xl lg:text-[5.5rem]"
        />
      </header>

      <SectionNav hasImpact={hasImpact(study)} hasLinks={!!study.links?.length} hasLearnings={study.learnings.length > 0} />

      <Section id="introduction" title="Introduction" className="pt-24 md:pt-40">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_260px] xl:gap-16">
          <div className="flex flex-col gap-8">
            {study.introduction.map((para, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className={i === 0 ? "text-2xl leading-snug tracking-[-0.01em] md:text-3xl" : "max-w-[60ch] text-lg leading-relaxed text-muted"}>
                  {para}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-[15px] xl:grid-cols-1">
              {meta.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-muted">{k}</dt>
                  <dd className="mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

/* ---------------------------------------------------------------- Impact teaser */

function Impact({ study }: { study: CaseStudy }) {
  return (
    <div className="mt-32 bg-card py-24 md:mt-48 md:py-36">
      <Section id="impact" title="Impact">
        <Reveal>
          <p className="max-w-[34ch] text-2xl leading-snug tracking-[-0.01em] md:text-3xl">{study.impact.lead}</p>
        </Reveal>
        <dl className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-0 md:mt-24">
          {study.impact.metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.1} className="sm:border-l sm:border-line sm:px-6 sm:first:border-l-0 sm:first:pl-0">
              <dt className="sr-only">{m.label}</dt>
              <dd className="text-6xl font-medium tracking-[-0.04em] md:text-7xl lg:text-8xl">
                <CountUp value={m.value} />
              </dd>
              <dd className="mt-3 max-w-[24ch] text-[15px] leading-snug text-muted">{m.label}</dd>
            </Reveal>
          ))}
        </dl>
      </Section>
    </div>
  );
}

/* ---------------------------------------------------------------- Key stages */

function Stages({ stages }: { stages: Stage[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  // One ref per step's text block, so the images can follow where each block is on screen.
  const blockRefs = useMemo(() => stages.map(() => createRef<HTMLDivElement>()), [stages]);

  return (
    <section id="stages" aria-labelledby="stages-title" className="scroll-mt-16 pt-32 md:pt-48">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <h2 id="stages-title" className="text-2xl font-medium tracking-[-0.02em]">
          Key stages
        </h2>

        <div className="mt-12 grid gap-12 lg:mt-0 lg:grid-cols-2 lg:gap-16">
          {/* Pinned media: the frame stays put while each stage's image takes its place. */}
          <div className="sticky top-16 hidden h-[calc(100dvh-8rem)] items-center self-start lg:flex">
            <div className="w-full">
              {/* Every step's image is stacked here; the reader's scroll position decides how much of each shows. */}
              <div className="relative aspect-[6/5] w-full overflow-hidden rounded-[20px] bg-card">
                {stages.map((stage, i) => (
                  <ImageLayer key={stage.name} stage={stage} index={i} refs={blockRefs} reduce={!!reduce} />
                ))}
              </div>
              {/* Captions crossfade on the same scroll, set under the image rather than over it. */}
              <div className="relative mt-4 min-h-6">
                {stages.map((stage, i) =>
                  stage.caption ? <CaptionLayer key={stage.name} caption={stage.caption} index={i} refs={blockRefs} /> : null,
                )}
              </div>
              {/* Dots: the current stage stretches to three times the width of the others. */}
              <ol className="mt-3 flex items-center justify-center gap-2" aria-label="Stage progress">
                {stages.map((s, i) => (
                  <li key={s.name} aria-current={i === active ? "step" : undefined} aria-label={`Stage ${i + 1} of ${stages.length}`}>
                    <motion.span
                      className="block h-2 rounded-full"
                      initial={false}
                      animate={{
                        width: i === active ? 24 : 8,
                        backgroundColor: i === active ? "var(--fg)" : "var(--soft)",
                      }}
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                    />
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="flex flex-col gap-24 lg:gap-0">
            {stages.map((stage, i) => (
              <StageBlock key={stage.name} stage={stage} blockRef={blockRefs[i]} onActive={() => setActive(i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * How far through a step's changeover the reader is. A step's picture starts coming in as its text block
 * rises past 75% of the card and is fully in just before the text reaches the middle.
 */
const CHANGEOVER: ["start 0.75", "start 0.15"] = ["start 0.75", "start 0.15"];

function useStageProgress(refs: RefObject<HTMLDivElement | null>[], index: number) {
  const container = useScrollContainer();
  const always = useMotionValue(1);
  const own = useScroll({ target: refs[index], container, offset: CHANGEOVER }).scrollYProgress;
  const next = useScroll({ target: refs[index + 1] ?? refs[index], container, offset: CHANGEOVER }).scrollYProgress;
  const hasNext = index + 1 < refs.length;
  return {
    // 0 to 1 while this step's image comes in. The first step is always in.
    incoming: index === 0 ? always : own,
    // 0 to 1 while the following step's image covers this one.
    outgoing: useTransform(next, (v) => (hasNext ? v : 0)),
  };
}

const smooth = (v: number) => v * v * (3 - 2 * v);

/** One step's image: rises over the previous one as the reader scrolls, while the one beneath eases back. */
function ImageLayer({
  stage,
  index,
  refs,
  reduce,
}: {
  stage: Stage;
  index: number;
  refs: RefObject<HTMLDivElement | null>[];
  reduce: boolean;
}) {
  const progress = useStageProgress(refs, index);
  // A gentle ease at both ends, so the picture settles into place instead of stopping dead.
  const incoming = useTransform(progress.incoming, smooth);
  const outgoing = useTransform(progress.outgoing, smooth);
  const clipPath = useTransform(incoming, (v) => `inset(${(1 - v) * 100}% 0% 0% 0%)`);
  const scale = useTransform([incoming, outgoing], ([i, o]: number[]) => (1.08 - 0.08 * i) * (1 - 0.04 * o));
  const dim = useTransform(outgoing, (o) => 1 - 0.6 * o);

  // With reduced motion the pictures just fade into each other, with no movement.
  if (reduce) {
    return (
      <motion.div className="absolute inset-0" style={{ opacity: incoming, zIndex: index }}>
        <StageMedia stage={stage} className="h-full w-full" />
      </motion.div>
    );
  }
  return (
    <motion.div className="absolute inset-0" style={{ clipPath, zIndex: index }}>
      <motion.div className="h-full w-full" style={{ scale, opacity: dim }}>
        <StageMedia stage={stage} className="h-full w-full" />
      </motion.div>
    </motion.div>
  );
}

/** One step's caption: fades in once its image is mostly in, and out as the next image starts to cover it. */
function CaptionLayer({
  caption,
  index,
  refs,
}: {
  caption: string;
  index: number;
  refs: RefObject<HTMLDivElement | null>[];
}) {
  const { incoming, outgoing } = useStageProgress(refs, index);
  const opacity = useTransform([incoming, outgoing], ([i, o]: number[]) => {
    const fadeIn = Math.min(1, Math.max(0, (i - 0.6) / 0.4));
    const fadeOut = 1 - Math.min(1, Math.max(0, o / 0.4));
    return fadeIn * fadeOut;
  });
  return (
    <motion.p className="absolute inset-x-0 top-0 max-w-[56ch] text-[15px] leading-snug text-muted" style={{ opacity }}>
      {caption}
    </motion.p>
  );
}

function StageBlock({
  stage,
  blockRef: ref,
  onActive,
}: {
  stage: Stage;
  blockRef: RefObject<HTMLDivElement | null>;
  onActive: () => void;
}) {
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);

  return (
    <div ref={ref} className="flex flex-col justify-center lg:min-h-[80dvh]">
      <div className="mb-8 lg:hidden">
        <StageMedia stage={stage} className="aspect-[6/5] rounded-[20px]" />
        {stage.caption && <p className="mt-3 text-[15px] leading-snug text-muted">{stage.caption}</p>}
      </div>
      <Reveal>
        <h3 className="max-w-[24ch] text-3xl font-medium leading-[1.15] tracking-[-0.025em] md:text-4xl">{stage.summary}</h3>
        {stage.body &&
          stage.body.split("\n\n").map((paragraph, i) => (
            <p key={i} className={`${i === 0 ? "mt-5" : "mt-4"} max-w-[52ch] text-lg leading-relaxed text-muted`}>
              {paragraph}
            </p>
          ))}
        {stage.points && <PointList points={stage.points} />}
        {stage.more && (
          <div className="mt-10">
            <p className="max-w-[52ch] text-lg leading-relaxed text-muted">{stage.more.body}</p>
            {stage.more.points && <PointList points={stage.more.points} />}
          </div>
        )}
        {stage.illustration && (
          <img
            src={stage.illustration.src}
            alt={stage.illustration.alt}
            width={stage.illustration.width}
            height={stage.illustration.height}
            loading="lazy"
            draggable={false}
            className="mt-10 h-auto w-full"
            style={{ maxWidth: stage.illustration.width * (stage.illustration.scale ?? 1) }}
          />
        )}
      </Reveal>
    </div>
  );
}

/** A numbered list whose numbers start at the same left edge as the paragraph above it. */
function PointList({ points }: { points: string[] }) {
  return (
    <ol className="mt-4 max-w-[52ch] list-inside list-decimal space-y-0.5 text-lg leading-snug text-muted marker:text-soft">
      {points.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </ol>
  );
}

/* ---------------------------------------------------------------- Outcomes */

/** Solution: up to six full-size phone screenshots, three across on larger screens. */
function Outcomes({ screens }: { screens: Image[] }) {
  return (
    <Section id="outcomes" title="Solution" className="pt-32 md:pt-48">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14">
        {screens.slice(0, 6).map((screen, i) => (
          <li key={`${screen.src}-${i}`}>
            <Reveal delay={(i % 3) * 0.08}>
              <img
                src={screen.src}
                alt={screen.alt}
                width={936}
                height={1836}
                loading="lazy"
                draggable={false}
                className="h-auto w-full"
              />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ---------------------------------------------------------------- Learnings */

function Learnings({ learnings }: { learnings: Learning[] }) {
  return (
    <Section id="learnings" title="Learnings" className="pt-32 md:pt-48">
      <div className="flex flex-col gap-24 md:gap-36">
        {learnings.map((l) => (
          <LearningItem key={l.statement} learning={l} />
        ))}
      </div>
    </Section>
  );
}

function LearningItem({ learning }: { learning: Learning }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const container = useScrollContainer();
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start 0.85", "end 0.45"] });
  const words = learning.statement.split(" ");

  return (
    <div>
      <p ref={ref} className="max-w-[22ch] text-3xl font-medium leading-[1.15] tracking-[-0.025em] md:text-5xl">
        {reduce
          ? learning.statement
          : words.map((w, i) => (
              <ScrollWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                {w}
              </ScrollWord>
            ))}
      </p>
      <Reveal>
        <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted">{learning.body}</p>
      </Reveal>
    </div>
  );
}

/* ---------------------------------------------------------------- Links */

function Links({ links }: { links: StudyLink[] }) {
  return (
    <Section id="links" title="Prototypes" className="pt-32 md:pt-48">
      <ul className="flex flex-col">
        {links.map((l) => (
          <li key={l.url} className="border-t border-line last:border-b">
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-6 py-6 text-2xl font-medium tracking-[-0.02em] md:py-8 md:text-4xl"
            >
              {l.label}
              <ArrowUpRight
                weight="light"
                aria-hidden
                className="size-7 shrink-0 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-1 group-hover:translate-x-1 md:size-10"
              />
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ---------------------------------------------------------------- More case studies */

function MoreStudies({ current }: { current: CaseStudy }) {
  // Start with the study after this one, so the first card is always the natural next read.
  const index = caseStudies.indexOf(current);
  const others = [...caseStudies.slice(index + 1), ...caseStudies.slice(0, index)];

  return (
    <CaseStudyRail
      id="next-study"
      labelledBy="more-title"
      studies={others}
      className="pb-24 pt-40 md:pb-32 md:pt-56"
      heading={
        <h2 id="more-title" className="max-w-[18ch] text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-6xl">
          More case studies
        </h2>
      }
    />
  );
}

/* ---------------------------------------------------------------- Close */

// Fixed to the sheet's top right corner; the content scrolls beneath it.
function CloseButton({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClose}
      aria-label="Close case study"
      title="Close (Esc)"
      className="group absolute right-3 top-4 z-10 grid size-11 place-items-center rounded-full border border-line bg-bg text-fg transition-colors duration-300 hover:border-fg hover:bg-fg hover:text-on-fg active:scale-[0.96] md:right-5 md:top-5"
      initial={reduce ? false : { opacity: 0, scale: 0.8, rotate: -90 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, ease: easeOut, delay: 0.45 }}
    >
      <X className="size-5 transition-transform duration-500 ease-[var(--ease-out)] group-hover:rotate-90" />
    </motion.button>
  );
}

/* ---------------------------------------------------------------- Section navigator */

function SectionNav({ hasImpact, hasLinks, hasLearnings }: { hasImpact: boolean; hasLinks: boolean; hasLearnings: boolean }) {
  const items = sections.filter(
    (s) => (s.id !== "impact" || hasImpact) && (s.id !== "links" || hasLinks) && (s.id !== "learnings" || hasLearnings),
  );
  const [active, setActive] = useState<string>("introduction");
  const reduce = useReducedMotion();

  useEffect(() => {
    const els = items.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Sits under the subtitle, then pins to the top of the card while the reader moves through the sections.
  return (
    <motion.nav
      aria-label="Case study sections"
      className="header-glass sticky top-0 z-20"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: easeOut, delay: 0.9 }}
    >
      <ul className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 overflow-x-auto px-4 pr-20 text-[15px] [scrollbar-width:none] md:gap-8 md:px-8 md:pr-24">
        {items.map((s) => {
          const selected = active === s.id;
          return (
            <li key={s.id} className="relative shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={selected ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(s.id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
                }}
                className={`block py-2 transition-colors duration-300 hover:text-fg ${selected ? "text-fg" : "text-muted"}`}
              >
                {s.label}
              </a>
              {selected && (
                <motion.span
                  layoutId="case-tab-underline"
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-fg"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
