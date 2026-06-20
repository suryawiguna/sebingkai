"use client";

import { useState } from "react";
import { PhoneFrame } from "./ds/PhoneFrame";
import { Shell, Eyebrow } from "./ui";
import { Reveal } from "./Reveal";
import { FilmImg } from "./FilmImg";

type Category = {
  id: string;
  label: string;
  host: string;
  title: string;
  blurb: string;
  phone: string;
  big: string;
  stack: string[];
};

const categories: Category[] = [
  {
    id: "wedding",
    label: "Pernikahan",
    host: "Dewi",
    title: "Pernikahan Dewi & Arif",
    blurb:
      "Candid yang jujur dari semua sudut. Momen yang terlewat oleh fotografer utama, tertangkap tamu di sebelahmu.",
    phone: "vows",
    big: "toast",
    stack: ["friends", "rings"],
  },
  {
    id: "party",
    label: "Pesta",
    host: "Lucas",
    title: "Ulang Tahun Lucas",
    blurb:
      "Lantai dansa jam dua pagi dari sudut yang tak terhitung. Semua jepretan tamu jadi satu album pesta yang utuh.",
    phone: "dj",
    big: "dance",
    stack: ["balloons", "hands"],
  },
  {
    id: "travel",
    label: "Perjalanan",
    host: "Maya",
    title: "Tokyo 2025",
    blurb:
      "Tujuh hari, satu album. Setiap orang memotret perjalanan yang sama dari matanya masing-masing.",
    phone: "travel",
    big: "city",
    stack: ["road", "crowd"],
  },
];

function ShowcasePhone({ c }: { c: Category }) {
  return (
    <PhoneFrame className="[--pw:180px] desk:[--pw:206px]">
      <div className="relative h-full bg-phone">
        <FilmImg k={c.phone} w={420} sizes="206px" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.05)_36%,rgba(0,0,0,0.9)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 px-[18px] pb-[22px]">
          <div className="mb-[7px] flex items-center gap-[5px] font-mono text-[9.5px] uppercase tracking-[0.1em] text-white/70">
            <span className="size-1.5 rounded-full bg-accent" />
            Diundang oleh {c.host}
          </div>
          <div className="mb-2.5 font-display text-[15px] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
            {c.title}
          </div>
          <div className="flex h-9 items-center justify-center rounded-[8px] bg-accent">
            <span className="font-body text-[12.5px] font-medium text-white">Ambil kameramu</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

// Showcase (interactive tabbed event categories).
export function Showcase() {
  const [active, setActive] = useState(0);
  const cat = categories[active];

  return (
    <section id="contoh" className="bg-base py-14 desk:py-[84px]">
      <Shell>
        <Reveal className="mb-3.5 text-center">
          <Eyebrow>Satu bingkai · setiap cerita</Eyebrow>
          <h2 className="mx-auto mt-3 mb-7 max-w-[560px] font-display text-[32px] font-semibold leading-[1.05] tracking-[-0.025em] text-ink desk:text-[44px]">
            Satu album. <span className="italic">Setiap sudut.</span>
          </h2>
        </Reveal>

        {/* Category tabs */}
        <div className="mb-9 flex justify-center gap-2">
          {categories.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActive(i)}
              className={`rounded-pill border px-5 py-[9px] font-body text-[14.5px] font-medium transition-all duration-150 ${
                active === i
                  ? "border-transparent bg-ink text-base"
                  : "border-border bg-transparent text-ink-soft"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Phone-led showcase grid */}
        <Reveal>
          <div className="grid grid-cols-1 items-stretch gap-4 tab:grid-cols-[0.9fr_1.1fr] desk:grid-cols-[0.92fr_1.18fr_0.9fr]">
            <div className="flex items-center justify-center rounded-lg border border-border bg-base-sunken px-6 py-8 tab:p-6">
              <ShowcasePhone c={cat} key={active} />
            </div>
            <div className="relative min-h-[300px] overflow-hidden rounded-lg border border-border tab:min-h-[360px] desk:min-h-[460px]">
              <FilmImg k={cat.big} w={800} sizes="(max-width:920px) 100vw, 45vw" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,0.84)_100%)]" />
              <div className="absolute inset-x-[22px] bottom-[22px]">
                <div className="font-display text-[22px] font-semibold tracking-[-0.02em] text-white">
                  {cat.label}
                </div>
                <p className="mt-2 font-body text-[14.5px] leading-[1.5] text-white/[0.82]">
                  {cat.blurb}
                </p>
              </div>
            </div>
            <div className="hidden grid-rows-2 gap-4 desk:grid">
              {cat.stack.map((p, i) => (
                <div
                  key={i}
                  className="relative min-h-[180px] overflow-hidden rounded-lg border border-border"
                >
                  <FilmImg k={p} w={600} sizes="25vw" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
