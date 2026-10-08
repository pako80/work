import { motion, useReducedMotion } from "motion/react";
import type { Badge, Image, Screen, Stage } from "../content/caseStudies";
import { LottieIcon } from "./LottieIcon";
import { easeOut } from "./motion";
import { PhoneStage } from "./PhoneStage";

// Dark grey panel behind a stage's picture.
const PANEL = "bg-[#323232]";

/** A stage's picture: phone mockups by default, or a finished image, a badge row or a cropped screen. */
export function StageMedia({ stage, className }: { stage: Stage; className?: string }) {
  if (stage.image) return <ImageStage image={stage.image} width={stage.imageWidth} offset={stage.imageOffset} bottom={stage.imageBottom} className={className} />;
  if (stage.badges) return <BadgeStage badges={stage.badges} className={className} />;
  if (stage.screen) return <ScreenStage screen={stage.screen} className={className} />;
  return <PhoneStage shots={stage.shots ?? []} crop={stage.crop} className={className} />;
}

/** A finished wide image, centred on the panel; a width above 100 enlarges it so the edge crops its sides. */
function ImageStage({
  image,
  width = 100,
  offset,
  bottom,
  className,
}: {
  image: Image;
  width?: number;
  offset?: [number, number];
  bottom?: boolean;
  className?: string;
}) {
  const shift = offset ? ` translate(${offset[0]}px, ${offset[1]}px)` : "";
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${PANEL} ${className ?? ""}`}>
      {!bottom ? (
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          draggable={false}
          className="h-auto max-w-none shrink-0"
          style={{ width: `${width}%`, transform: shift.trim() || undefined }}
        />
      ) : (
        // Pin a tall image to the bottom edge, so the panel crops its top.
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          draggable={false}
          className="absolute bottom-0 left-1/2 h-auto max-w-none"
          style={{ width: `${width}%`, transform: `translateX(-50%)${shift}` }}
        />
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
