import { Avatar } from "./ds/Avatar";
import { FilmImg } from "./FilmImg";

type RollCardProps = {
  title: string;
  count?: string;
  photos?: string[];
  contributors?: string[];
  className?: string;
  style?: React.CSSProperties;
};

// A floating "roll" card — the host/album view with contributor avatars.
export function RollCard({
  title,
  count = "7 Foto",
  photos = [],
  contributors = [],
  className = "",
  style,
}: RollCardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface p-4 shadow-float ${className}`}
      style={{ width: 268, ...style }}
    >
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <div className="font-display text-[16px] font-semibold tracking-[-0.01em] text-ink">
            {title}
          </div>
          <div className="mt-[3px] font-mono text-[11px] text-muted">{count}</div>
        </div>
        <span className="rounded-full bg-accent-soft px-2 py-1 font-mono text-[9.5px] tracking-[0.08em] text-on-soft">
          ALBUM
        </span>
      </div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        {photos.slice(0, 2).map((p, i) => (
          <div
            key={i}
            className="relative aspect-[4/5] overflow-hidden rounded-[12px] bg-base-sunken"
          >
            <FilmImg k={p} w={300} sizes="150px" />
          </div>
        ))}
      </div>
      <div className="flex items-center">
        {contributors.map((c, i) => (
          <Avatar
            key={i}
            name={c}
            size={26}
            className="ring-2 ring-surface"
            style={{ marginLeft: i ? -8 : 0 }}
          />
        ))}
        <span className="ml-2.5 font-body text-[12px] text-muted">+ semua tamu</span>
      </div>
    </div>
  );
}
