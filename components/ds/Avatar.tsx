import Image from "next/image";

type AvatarProps = {
  src?: string;
  name?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
};

// Avatar — round image or initial chip for a guest / host.
export function Avatar({ src, name = "", size = 40, className = "", style }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-pill border border-border bg-surface-2 font-body font-medium text-ink ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36), ...style }}
    >
      {src ? (
        <Image src={src} alt={name} fill className="object-cover" sizes={`${size}px`} />
      ) : (
        initials || "?"
      )}
    </div>
  );
}
