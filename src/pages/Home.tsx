import { ArrowDown, ArrowRight } from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { CaseStudyRail } from "../components/CaseStudyRail";
import { Contact } from "../components/Contact";
import { MaskedTitle, Reveal, easeOut } from "../components/motion";
import { caseStudies, thumbnailOf } from "../content/caseStudies";

export function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    document.title = "Mario Borg, Selected Work";
    if (!hash) return;
    // Wait for the curtain to lift before jumping to the section.
    const t = setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }), 350);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <>
      <main id="main">
        <Hero />
        <Work />
        <Approach />
        <Companies />
      </main>
      <Contact />
    </>
  );
}

/* ---------------------------------------------------------------- Hero */

function Hero() {
  const reduce = useReducedMotion();
  // One phone at a time, advancing on its own. The list marks which project is on screen.
  const [slide, setSlide] = useState(0);
  // Each project can show more than one phone, so the hero steps through slides and the list follows the project.
  const slides = caseStudies.flatMap((study, project) => (study.heroShots ?? [thumbnailOf(study)]).map((image) => ({ project, image })));
  const current = slides[slide].project;

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setSlide((n) => (n + 1) % slides.length), 4800);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section className="mx-auto grid min-h-[100dvh] max-w-[1400px] items-center gap-12 px-4 pb-16 pt-24 md:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-8">
      <div>
        <MaskedTitle
          text="From idea to product"
          className="max-w-[11ch] text-6xl font-medium leading-[0.92] tracking-[-0.035em] md:text-8xl"
        />
        <p className="mt-6 max-w-[34ch] text-balance text-lg leading-relaxed text-muted md:text-xl">
          Products and brand experiences I’ve led from vision to execution.
        </p>
        <ul className="mt-6 flex flex-col gap-1 md:mt-8" aria-label="Case studies">
          {caseStudies.map((study, i) => (
            <motion.li
              key={study.slug}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.45 + i * 0.07 }}
            >
              <Link
                to={`/work/${study.slug}`}
                className={`group inline-flex items-center gap-3 py-1.5 text-lg no-underline transition-colors duration-700 ${
                  current === i ? "text-fg" : "text-soft"
                }`}
              >
                <ArrowRight
                  weight="regular"
                  aria-hidden
                  className="size-4 shrink-0 text-muted transition-[transform,color] duration-500 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:text-fg group-focus-visible:translate-x-1"
                />
                <span className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1 group-focus-visible:translate-x-1">
                  {study.title}
                </span>
                {study.comingSoon && (
                  <span className="rounded-[10px] border border-line px-2 py-0.5 text-[12px] font-medium text-muted">Coming soon</span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-6"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.8 }}
        >
          <a
            href="#work"
            className="group inline-flex items-center gap-3 rounded-[10px] bg-fg px-6 py-4 text-[15px] font-medium text-on-fg transition-transform duration-200 active:scale-[0.98]"
          >
            All case studies
            <ArrowDown weight="bold" className="size-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-1" />
          </a>
          <a href="#contact" className="text-[15px] text-muted underline decoration-line hover:text-fg hover:decoration-fg">
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* The phone is as large as the screen allows and runs off the bottom edge. */}
      <div aria-hidden className="relative mx-auto h-[78dvh] w-full max-w-[640px] [clip-path:inset(-240px_-240px_0_-240px)] lg:h-[100dvh] lg:-my-24">
        <AnimatePresence initial>
          <motion.img
            key={slide}
            src={slides[slide].image.src}
            alt=""
            width={936}
            height={1836}
            draggable={false}
            className="absolute left-1/2 top-[8%] block h-auto w-[min(65vw,387px)] max-w-none drop-shadow-[0_40px_60px_rgb(14_14_14/0.3)] lg:top-[12dvh] lg:w-[min(30.6vw,51.3dvh)]"
            style={{ x: "-50%" }}
            initial={reduce ? false : { opacity: 0, y: 70, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.01 }}
            transition={{ duration: 1.1, ease: easeOut }}
          />
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Work */

function Work() {
  return (
    <CaseStudyRail
      id="work"
      labelledBy="work-title"
      studies={caseStudies}
      className="scroll-mt-16 pt-16 md:pt-32"
      heading={
        <>
          <h2 id="work-title" className="max-w-[26ch] text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-6xl">
            Most Recent &amp; Impactful Case Studies
          </h2>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted">
            Each case study runs from introduction to learnings, so you can see the thinking as well as the pixels.
          </p>
        </>
      }
    />
  );
}

/* ---------------------------------------------------------------- Approach */

const principles = [
  {
    icon: "/icons/alignment.svg",
    title: "Stakeholder alignment",
    body: "I believe successful projects are built through continuous alignment. I connect business needs, user needs, and brand vision to shape a design direction that delivers against the bigger goal.",
  },
  {
    icon: "/icons/proto.svg",
    title: "Prototype smarter",
    body: "I use AI to explore, test, and iterate at speed, rapidly prototyping ideas, flows, and motion, validating assumptions with users and data, then refining what works into polished UI.",
  },
  {
    icon: "/icons/ship.svg",
    title: "Ship pragmatically",
    body: "I understand the codebase, constraints, and possibilities. I work in close partnership with product and engineering to turn design intent into practical, production-ready experiences.",
  },
];

const phases = ["Discover", "Define", "Develop", "Deliver"];

function Approach() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const drawn = useMotionValue(1);

  return (
    <section id="approach" ref={ref} className="mx-auto max-w-[1400px] scroll-mt-16 px-4 pt-40 md:px-8 md:pt-56">
      <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="max-w-[16ch] text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-6xl">
            Design language &amp; approach
          </h2>
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-muted">
            Understand the problem. Align around the goal. Explore ideas quickly. Deliver &amp; Make them real.
          </p>
          <DoubleDiamond progress={reduce ? drawn : draw} />
        </div>

        <ol className="flex flex-col gap-16 lg:gap-28 lg:pt-48">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <li className="border-t border-line pt-6">
                {/* Masked so the mark takes the text colour in both themes. */}
                <span
                  aria-hidden
                  className="mb-6 block h-12 w-10 bg-fg"
                  style={{
                    maskImage: `url(${p.icon})`,
                    WebkitMaskImage: `url(${p.icon})`,
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskPosition: "left bottom",
                    WebkitMaskPosition: "left bottom",
                  }}
                />
                <h3 className="text-2xl font-medium tracking-[-0.02em] md:text-3xl">{p.title}</h3>
                <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-muted">{p.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function DoubleDiamond({ progress }: { progress: MotionValue<number> }) {
  const left = useTransform(progress, [0, 0.5], [0, 1]);
  const right = useTransform(progress, [0.35, 0.85], [0, 1]);

  return (
    <figure className="mt-12 md:mt-16">
      <svg
        viewBox="0 0 640 300"
        className="w-full max-w-[560px] overflow-visible"
        role="img"
        aria-label="Double diamond: problem space then solution space, across discover, define, develop and deliver"
      >
        <motion.path d="M 10 150 L 165 20 L 320 150 L 165 280 Z" fill="none" stroke="var(--fg)" strokeWidth={1.5} style={{ pathLength: left }} />
        <motion.path d="M 320 150 L 475 20 L 630 150 L 475 280 Z" fill="none" stroke="var(--fg)" strokeWidth={1.5} style={{ pathLength: right }} />
        {phases.map((label, i) => (
          <PhaseLabel key={label} label={label} index={i} progress={progress} />
        ))}
      </svg>
      <figcaption className="mt-4 flex max-w-[560px] justify-between text-[15px] text-muted">
        <span>Problem</span>
        <span>Solution</span>
      </figcaption>
    </figure>
  );
}

function PhaseLabel({ label, index, progress }: { label: string; index: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.1 + index * 0.18, 0.25 + index * 0.18], [0.25, 1]);
  return (
    <motion.text
      x={[100, 230, 410, 540][index]}
      y={156}
      textAnchor="middle"
      fill="var(--fg)"
      style={{ opacity, fontSize: 21, fontWeight: 500 }}
    >
      {label}
    </motion.text>
  );
}

/* ---------------------------------------------------------------- Companies */

const logos = [
  { src: "/logos/kto.svg", alt: "KTO" },
  { src: "/logos/betsson.svg", alt: "Betsson" },
  { src: "/logos/kambi.svg", alt: "Kambi" },
  { src: "/logos/altenar.svg", alt: "Altenar" },
  { src: "/logos/netrefer.svg", alt: "NetRefer" },
  { src: "/logos/authentic-gaming.png", alt: "Authentic Gaming", tall: true },
];

function Companies() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-16 pb-24 pt-40 md:pb-40 md:pt-56">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <Reveal>
          <h2 id="experience-title" className="text-4xl font-medium leading-[1.05] tracking-[-0.03em] md:text-6xl">
            Experience
          </h2>
          <p className="mt-5 text-lg text-muted">Companies I worked for and collaborated with</p>
        </Reveal>
      </div>
      <div className="marquee mt-12 md:mt-16 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <ul className="marquee-track flex w-max items-center">
          {[...logos, ...logos].map((logo, i) => (
            <li key={i} className="flex h-16 w-56 shrink-0 items-center justify-center px-8 md:w-72" aria-hidden={i >= logos.length}>
              <img src={logo.src} alt={i < logos.length ? logo.alt : ""} className={`logo-mark max-w-full object-contain ${"tall" in logo ? "max-h-14" : "max-h-9"}`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
