import { Shell } from "./ui";
import { Reveal } from "./Reveal";

const stats = [
  { v: "120rb+", l: "momen terabadikan" },
  { v: "3.400", l: "album dibuat" },
  { v: "Rp0", l: "untuk mulai" },
];

// Editorial stats band.
export function StatRow() {
  return (
    <section className="border-y border-border bg-base-sunken">
      <Shell>
        <Reveal className="grid grid-cols-1 items-center gap-8 py-9 desk:grid-cols-[1.5fr_repeat(3,0.7fr)] desk:py-11">
          <p className="m-0 font-display text-[19px] font-semibold italic leading-[1.38] tracking-[-0.01em] text-ink desk:text-[22px]">
            &ldquo;Akhirnya, album yang diisi oleh semua orang yang hadir — bukan cuma satu
            kamera.&rdquo;
          </p>
          {stats.map((s, i) => (
            <div
              key={s.l}
              className={`desk:border-l desk:border-border desk:pl-7 ${
                i > 0 ? "border-t border-border pt-6 desk:border-t-0 desk:pt-0" : ""
              }`}
            >
              <div className="font-display text-[28px] font-semibold tracking-[-0.02em] text-ink desk:text-[34px]">
                {s.v}
              </div>
              <div className="mt-1 font-body text-[13.5px] text-muted">{s.l}</div>
            </div>
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}
