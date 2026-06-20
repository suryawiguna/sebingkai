type PhoneFrameProps = {
  children: React.ReactNode;
  float?: boolean;
  screenBg?: string;
  /** Set the phone width with arbitrary-property classes, e.g.
   *  `[--pw:264px] desk:[--pw:290px]`. Defaults to 320px. */
  className?: string;
};

/**
 * PhoneFrame — pure-CSS iPhone-style mockup. All dimensions derive from the
 * `--pw` custom property (the phone width) so it can be made responsive with
 * Tailwind arbitrary-property variants. Spec: 320×660 body, scaled proportionally.
 */
export function PhoneFrame({
  children,
  float = true,
  screenBg = "var(--color-base)",
  className = "",
}: PhoneFrameProps) {
  // value scaled from the 320px reference width
  const v = (n: number) => `calc(var(--pw, 320px) * ${n} / 320)`;
  return (
    <div
      className={`relative shrink-0 [--pw:320px] ${className}`}
      style={{
        width: "var(--pw, 320px)",
        height: v(660),
        background: "var(--color-phone)",
        borderRadius: v(46),
        padding: v(10),
        boxShadow: float ? "var(--shadow-float)" : "none",
        border: "1px solid rgba(255,255,255,0.22)",
        outline: "1px solid rgba(0,0,0,0.6)",
        outlineOffset: "-2px",
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden"
        style={{ background: screenBg, borderRadius: v(38) }}
      >
        <div
          className="absolute left-1/2 z-20 -translate-x-1/2"
          style={{
            top: v(10),
            width: v(92),
            height: v(26),
            background: "var(--color-phone)",
            borderRadius: v(16),
          }}
        />
        {children}
      </div>
    </div>
  );
}
