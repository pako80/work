import { ArrowUpRight } from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const EMAIL = "marioborg@gmail.com";

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);

  return (
    <footer
      id="contact"
      ref={ref}
      className="mx-auto max-w-[1400px] scroll-mt-16 overflow-hidden px-4 pb-10 pt-32 md:px-8 md:pt-48"
    >
      <motion.div style={reduce ? undefined : { y }}>
        <p className="max-w-[40ch] text-lg text-muted">
          Hiring a design leader, or want the full story behind a project? I'm happy to walk you through it.
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="group mt-6 inline-flex items-center gap-3 text-5xl font-medium tracking-[-0.03em] md:mt-8 md:gap-5 md:text-8xl"
        >
          <span className="relative">
            Get in touch
            <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-fg transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-x-100" />
          </span>
          <ArrowUpRight
            weight="light"
            className="size-10 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-2 group-hover:translate-x-2 md:size-20"
          />
        </a>
      </motion.div>

      <div className="mt-24 flex flex-col gap-6 border-t border-line pt-6 text-[15px] text-muted md:mt-40 md:flex-row md:items-center md:justify-between">
        <p>Mario Borg, Product Design and Branding</p>
        <ul className="flex gap-6">
          <li>
            <a className="hover:text-fg" href={`mailto:${EMAIL}`}>
              Email
            </a>
          </li>
          <li>
            <a className="hover:text-fg" href="https://www.linkedin.com/in/marioborg" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a className="hover:text-fg" href="https://www.marioborg.com" target="_blank" rel="noopener noreferrer">
              Profile
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
