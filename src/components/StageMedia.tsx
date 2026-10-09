import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { Badge, Image, Screen, Stage } from "../content/caseStudies";
import { LottieIcon } from "./LottieIcon";
import { easeOut } from "./motion";
import { PhoneStage } from "./PhoneStage";
import { TrunfoCard } from "./TrunfoCard";

// Dark grey panel behind a stage's picture.
const PANEL = "bg-[#323232]";

/** A stage's picture: phone mockups by default, or a finished image, a badge row or a cropped screen. */
export function StageMedia({ stage, className, active }: { stage: Stage; className?: string; active?: boolean }) {
  if (stage.marquee) return <MarqueeStage images={stage.marquee} className={className} />;
  if (stage.cardFlip) return <CardFlipStage active={active} className={className} />;
  if (stage.lottie) return <LottieStage src={stage.lottie.src} label={stage.lottie.label} className={className} />;
  if (stage.image) return <ImageStage image={stage.image} width={stage.imageWidth} offset={stage.imageOffset} bottom={stage.imageBottom} top={stage.imageTop} overlay={stage.overlay} className={className} />;
  if (stage.badges) return <BadgeStage badges={stage.badges} className={className} />;
  if (stage.screen) return <ScreenStage screen={stage.screen} className={className} />;
  return <PhoneStage shots={stage.shots ?? []} crop={stage.crop} className={className} />;
}

/** Cards side by side, drifting from right to left. The row is shown twice so the loop has no seam. */
function MarqueeStage({ images, className }: { images: Image[]; className?: string }) {
  const group = (hidden: boolean) => (
    <ul className="flex shrink-0 gap-4 pr-4" aria-hidden={hidden || undefined}>
      {images.map((image) => (
        <li key={image.src} className="h-full shrink-0">
          <img src={image.src} alt={hidden ? "" : image.alt} width={420} height={720} draggable={false} className="block h-full w-auto" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`relative flex items-center overflow-hidden bg-[#1e1e1e] ${className ?? ""}`}>
      <div className="w-full" style={{ height: "74%" }}>
        <div className="card-marquee h-full">
          {group(false)}
          {group(true)}
        </div>
      </div>
    </div>
  );
}

/**
 * The Trunfo card: flips over, floats and glints. It plays when its stage is the one on screen (`active`, or,
 * where the stage stands alone in the page, when it scrolls into view) and sits still otherwise.
 */
function CardFlipStage({ active, className }: { active?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.6 });
  const playing = active ?? seen;
  return (
    <div ref={ref} className={`relative flex items-center justify-center overflow-hidden bg-[#1e1e1e] ${className ?? ""}`}>
      <TrunfoCard playing={playing} style={{ height: "84%" }} />
    </div>
  );
}

/** A looping Lottie animation, centred on a dark panel. */
function LottieStage({ src, label, className }: { src: string; label: string; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-[#1e1e1e] ${className ?? ""}`}>
      <LottieIcon src={src} label={label} className="block aspect-square h-[78%]" />
    </div>
  );
}

/** A finished wide image, centred on the panel; a width above 100 enlarges it so the edge crops its sides. */
function ImageStage({
  image,
  width = 100,
  offset,
  bottom,
  top,
  overlay,
  className,
}: {
  image: Image;
  width?: number;
  offset?: [number, number];
  bottom?: boolean;
  top?: boolean;
  overlay?: Stage["overlay"];
  className?: string;
}) {
  const shift = offset ? ` translate(${offset[0]}px, ${offset[1]}px)` : "";
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${PANEL} ${className ?? ""}`}>
      {!bottom && !top ? (
        <img
          src={image.src}
          alt={image.alt}
          loading="eager"
          draggable={false}
          className="h-auto max-w-none shrink-0"
          style={{ width: `${width}%`, transform: shift.trim() || undefined }}
        />
      ) : (
        // Pin a tall image to the bottom (or top) edge, so the panel crops the other end.
        <img
          src={image.src}
          alt={image.alt}
          loading="eager"
          draggable={false}
          className={`absolute left-1/2 h-auto max-w-none ${top ? "top-0" : "bottom-0"}`}
          style={{ width: `${width}%`, transform: `translateX(-50%)${shift}` }}
        />
      )}
      {overlay && (
        <div className="absolute" style={{
            width: `${overlay.width}%`,
            right: `${overlay.right}%`,
            bottom: `${overlay.bottom}%`,
            transform: overlay.nudge ? `translate(${overlay.nudge[0]}px, ${overlay.nudge[1]}px)` : undefined,
          }}>
          <LottieIcon src={overlay.src} label={overlay.label} className="block aspect-square w-full" />
        </div>
      )}
    </div>
  );
}

/**
 * Animated badges in a row, each icon with its label beside it. A label takes the colour of
 * its icon, so the pair reads as one badge. They rise in one after another once the panel opens.
 */
function BadgeStage({ badges, className }: { badges: Badge[]; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-[#1e1e1e] px-3 ${className ?? ""}`}>
      <ul className="flex items-center justify-center gap-x-10 md:gap-x-14">
        {badges.map((badge, i) => (
          <motion.li
            key={badge.label}
            className="flex items-center gap-2"
            style={{ color: badge.color }}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 1.1 + i * 0.12 }}
          >
            <LottieIcon src={badge.src} label="" className="block size-6" />
            <span className="text-base font-medium leading-none">{badge.label}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

/**
 * One screen, set into the panel like the display of a phone: iPhone-sized rounded top corners and a
 * band of status-bar space above the content. It hangs past the bottom edge, so the panel crops it
 * like a screen scrolling on. Sizes use container units, so corners and spacing scale with the screen.
 */
function ScreenStage({ screen, className }: { screen: Screen; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${PANEL} ${className ?? ""}`}>
      <div className="absolute left-1/2 w-[56%] -translate-x-1/2 [container-type:inline-size]" style={{ top: `${screen.top ?? 10}%` }}>
        <div
          className="overflow-hidden"
          style={{
            borderTopLeftRadius: "12cqw",
            borderTopRightRadius: "12cqw",
            backgroundColor: screen.headerBg ?? "#000",
          }}
        >
          {screen.headerSpace ? <div aria-hidden style={{ height: `${screen.headerSpace}cqw` }} /> : null}
          <img
            src={screen.src}
            alt={screen.alt}
            width={screen.width}
            height={screen.height}
            loading="lazy"
            draggable={false}
            className="block h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
