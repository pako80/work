import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web/build/player/lottie_light";

/**
 * A looping Lottie icon, drawn as inline SVG. The player is loaded on demand so it never
 * weighs down pages that don't use it. With "reduce motion" on it holds a still frame instead.
 */
export function LottieIcon({ src, label, className }: { src: string; label: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    let anim: AnimationItem | undefined;
    let cancelled = false;

    import("lottie-web/build/player/lottie_light").then(({ default: lottie }) => {
      const container = ref.current;
      if (cancelled || !container) return;
      anim = lottie.loadAnimation({
        container,
        renderer: "svg",
        path: src,
        loop: true,
        autoplay: !reduce,
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      if (reduce) anim.addEventListener("DOMLoaded", () => anim?.goToAndStop(Math.round(anim.totalFrames * 0.45), true));
    });

    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, [src, reduce]);

  return <span ref={ref} role="img" aria-label={label} className={className} />;
}
