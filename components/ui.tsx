// Layout + text primitives shared across sections.

type ShellProps = {
  children: React.ReactNode;
  max?: number;
  className?: string;
  style?: React.CSSProperties;
};

// Centered container. `max` caps width; gutter grows on wider screens.
export function Shell({ children, max = 1120, className = "", style }: ShellProps) {
  return (
    <div
      className={`mx-auto box-border w-full px-[clamp(20px,5vw,40px)] ${className}`}
      style={{ maxWidth: max, ...style }}
    >
      {children}
    </div>
  );
}

type EyebrowProps = {
  children: React.ReactNode;
  dot?: boolean;
  onDark?: boolean;
  className?: string;
};

// Mono eyebrow (the camcorder detail). Optional leading recording-red dot.
export function Eyebrow({ children, dot = false, onDark = false, className = "" }: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[12px] font-medium uppercase tracking-[0.14em] ${
        onDark ? "text-white/60" : "text-muted"
      } ${className}`}
    >
      {dot && <span className="size-2 shrink-0 rounded-full bg-accent" />}
      {children}
    </span>
  );
}
