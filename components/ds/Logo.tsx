type LogoProps = {
  size?: number;
  mark?: boolean;
  color?: string;
  markColor?: string;
  className?: string;
};

export function Logo({
  size = 28,
  mark = true,
  color = "var(--color-ink)",
  markColor,
  className = "",
}: LogoProps) {
  const mc = markColor || color;
  const frame = Math.round(size * 0.92);
  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ gap: Math.round(size * 0.34) }}
    >
      {mark && (
        <span
          aria-hidden="true"
          className="relative box-border shrink-0"
          style={{
            width: frame,
            height: frame,
            borderRadius: Math.round(frame * 0.3),
            border: `${Math.max(2, Math.round(size * 0.1))}px solid ${mc}`,
          }}
        >
          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
            style={{ width: Math.round(frame * 0.3), height: Math.round(frame * 0.3) }}
          />
        </span>
      )}
      <span
        className="font-display font-semibold leading-none"
        style={{ fontSize: size, letterSpacing: "-0.02em", color }}
      >
        Sebingkai
      </span>
    </span>
  );
}
