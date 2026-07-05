import Link from "next/link";
import { Button } from "./ds/Button";
import { Logo } from "./ds/Logo";
import { PhoneFrame } from "./ds/PhoneFrame";
import { Shell } from "./ui";
import { Reveal } from "./Reveal";
import { ScreenCamera, ScreenAlbum } from "./screens";
import { UNSPLASH } from "@/lib/images";

const filmKeys = [
  "vows", "dj", "toast", "dance", "travel", "city", "balloons", "crowd", "confetti",
];

// Every link resolves to a real destination — section anchors, the demo, or
// the FAQ page. Links without a real target were removed (no auth/blog/privacy
// pages exist yet).
const footerCols = [
  {
    h: "Produk",
    links: [
      { label: "Cara kerja", href: "/#cara-kerja" },
      { label: "Harga", href: "/#harga" },
      { label: "Contoh acara", href: "/#contoh" },
    ],
  },
  {
    h: "Untuk acara",
    links: [
      { label: "Pernikahan", href: "/#contoh" },
      { label: "Ulang tahun", href: "/#contoh" },
      { label: "Pesta", href: "/#contoh" },
      { label: "Perjalanan", href: "/#contoh" },
    ],
  },
  {
    h: "Bantuan",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Coba demo", href: "/demo" },
    ],
  },
];

export function ClosingCta() {
  return (
    <>
      {/* Full-bleed closing — faint filmstrip + dark veil + white headline */}
      <section className="relative overflow-hidden border-t border-border bg-phone">
        <div className="absolute inset-0 flex opacity-[0.18]">
          {filmKeys.map((k, i) => (
            <div key={i} className="min-w-0 flex-1 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://images.unsplash.com/photo-${UNSPLASH[k]}?w=300&q=70&auto=format&fit=crop`}
                alt=""
                className="h-full w-full object-cover [filter:contrast(1.08)_saturate(0.85)_brightness(0.98)]"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.72),rgba(0,0,0,0.90))]" />
        <div className="relative mx-auto max-w-[720px] px-6 py-[72px] text-center desk:py-[108px]">
          <Reveal>
            <h2 className="m-0 font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.03em] text-white desk:text-[52px]">
              Satu acara. Satu album.
              <br />
              <span className="italic">Satu cerita.</span>
            </h2>
            <p className="mx-auto mt-[18px] mb-[30px] max-w-[440px] font-body text-[16px] leading-[1.55] text-white/[0.72] desk:text-[18px]">
              Terlalu banyak momen untuk dipercayakan pada satu kamera.
            </p>
            <Button variant="primary" size="lg">
              Mulai gratis
            </Button>
            <p className="mt-[18px] font-body text-[13px] text-white/[0.48]">
              Tanpa aplikasi · Tanpa akun untuk tamu
            </p>
          </Reveal>

          {/* Twin phone mockups — viewfinder + finished album */}
          <Reveal className="mt-11 flex items-end justify-center desk:mt-16">
            <div className="z-[1] origin-bottom translate-x-[14px] rotate-[-6deg] [filter:drop-shadow(0_30px_60px_rgba(0,0,0,0.5))] desk:translate-x-[28px] desk:rotate-[-7deg]">
              <PhoneFrame float={false} className="[--pw:150px] desk:[--pw:228px]">
                <ScreenCamera />
              </PhoneFrame>
            </div>
            <div className="z-[2] origin-bottom -translate-x-[14px] rotate-[6deg] [filter:drop-shadow(0_30px_60px_rgba(0,0,0,0.5))] desk:-translate-x-[28px] desk:rotate-[7deg]">
              <PhoneFrame float={false} className="[--pw:150px] desk:[--pw:228px]">
                <ScreenAlbum />
              </PhoneFrame>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-base">
        <Shell className="py-10 desk:py-16 desk:pb-10">
          <div className="mb-7 grid grid-cols-2 gap-7 desk:mb-10 desk:grid-cols-[1.6fr_repeat(3,1fr)] desk:gap-10">
            <div className="col-span-2 desk:col-auto">
              <Logo size={22} />
              <p className="mt-4 max-w-[240px] font-body text-[15px] leading-[1.55] text-muted">
                Hari yang terlalu indah untuk satu sudut pandang.
              </p>
            </div>
            {footerCols.map((c) => (
              <div key={c.h}>
                <p className="mb-3.5 font-body text-[12px] font-semibold uppercase tracking-[0.06em] text-ink">
                  {c.h}
                </p>
                <nav className="flex flex-col gap-[11px]">
                  {c.links.map((l) =>
                    l.href.includes("#") ? (
                      // Hash links (incl. /#section): plain <a> guarantees the
                      // browser scrolls to the section from any page.
                      <a
                        key={l.label}
                        href={l.href}
                        className="font-body text-[14px] text-muted no-underline hover:text-ink"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        key={l.label}
                        href={l.href}
                        className="font-body text-[14px] text-muted no-underline hover:text-ink"
                      >
                        {l.label}
                      </Link>
                    )
                  )}
                </nav>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border pt-5">
            <span className="font-mono text-[12px] text-muted">© 2026 Sebingkai</span>
            <span className="font-mono text-[12px] text-muted">sebingkai.id</span>
          </div>
        </Shell>
      </footer>
    </>
  );
}
