import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

export const easeOut = [0.16, 1, 0.3, 1] as const;

/**
 * The element that scrolls. Undefined means the window; the case study sheet
 * provides its own scroller so scroll-linked effects track the sheet, not the page.
 */
export const ScrollContainer = createContext<RefObject<HTMLElement | null> | undefined>(undefined);
export const useScrollContainer = () => useContext(ScrollContainer);

/** Headline that rises word by word out of a mask. Used once per page, on the title. */
export function MaskedTitle({
  text,
  as: Tag = "h1",
  className,
  delay = 0,
  id,
}: {
  id?: string;
  text: string;
  as?: "h1" | "h2";
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <Tag id={id} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.16em] -mb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, ease: easeOut, delay: delay + i * 0.06 }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Fades content up the first time it enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: easeOut, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Counts up the leading number of a value like "38%", "2.4x" or "120k". */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[2]) : 0;
  const decimals = match?.[2].split(".")[1]?.length ?? 0;
  const animatable = !!match && target > 0 && !reduce;
  const [display, setDisplay] = useState(animatable ? (0).toFixed(decimals) : match?.[2] ?? value);

  useEffect(() => {
    if (!inView || !animatable) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: easeOut,
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, animatable, target, decimals]);

  return (
    <span ref={ref} className={`tabular ${className ?? ""}`}>
      {match ? `${match[1]}${display}${match[3]}` : value}
    </span>
  );
}

/** A word whose opacity follows a slice of a scroll progress value. */
export function ScrollWord({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}
