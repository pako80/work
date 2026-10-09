/**
 * The Trunfo card: flips over, floats and glints (styles in index.css). With `playing` off, or with
 * reduced motion, the card face sits still.
 */
export function TrunfoCard({
  playing,
  grey,
  className,
  style,
}: {
  playing: boolean;
  /** A light grey glow instead of the red one, for light backgrounds. */
  grey?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`trunfo-card ${playing ? "" : "trunfo-card--idle"} ${grey ? "trunfo-card--grey" : ""} ${className ?? ""}`} style={style}>
      <div className="trunfo-card__float">
        <div className="trunfo-card__flip">
          <img src="/work/trunfo/hero-card.png" alt="A KTO Trunfo card" width={827} height={1417} draggable={false} />
          <img className="trunfo-card__back" src="/work/trunfo/card-back.svg" alt="" aria-hidden="true" draggable={false} />
        </div>
        <div className="trunfo-card__shine" aria-hidden="true" />
        <div className="trunfo-card__sweep" aria-hidden="true" />
      </div>
    </div>
  );
}
