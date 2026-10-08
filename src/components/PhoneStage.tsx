import type { Image } from "../content/caseStudies";

/**
 * Portrait phone mockups (transparent PNGs, 936 x 1836) standing on a tinted stage.
 * - default: phones sit fully in frame, centred
 * - crop: phones rise from the bottom edge and are cut off, for small thumbnails
 * Side phones sit a little lower than the centre one, which reads as depth.
 */
export function PhoneStage({
  shots,
  className,
  crop = false,
  lift = false,
}: {
  shots: Image[];
  className?: string;
  crop?: boolean;
  /** Raise the phones when a parent `.group` is hovered. */
  lift?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-card ${className ?? ""}`}>
      <div
        className={`absolute inset-0 flex justify-center gap-[3%] ${crop ? "items-start pt-[7%]" : "items-center py-[7%]"} ${
          lift ? "transition-transform duration-700 ease-[var(--ease-out)] group-hover:-translate-y-[4%]" : ""
        }`}
      >
        {shots.map((shot, i) => {
          const offset = i - (shots.length - 1) / 2;
          return (
            <div
              key={i}
              className={`aspect-[936/1836] shrink-0 ${crop ? "h-[115%]" : "h-full"}`}
              style={{ transform: `translateY(${Math.abs(offset) * 5}%)` }}
            >
              <img
                src={shot.src}
                alt={shot.alt}
                width={936}
                height={1836}
                loading="lazy"
                draggable={false}
                className="h-full w-full object-contain drop-shadow-[0_24px_32px_rgb(14_14_14/0.28)]"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
