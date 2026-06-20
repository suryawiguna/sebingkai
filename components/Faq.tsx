"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Shell, Eyebrow } from "./ui";
import { Reveal } from "./Reveal";

const items = [
  {
    q: "Apakah tamu perlu memasang aplikasi?",
    a: "Tidak. Tamu cukup memindai QR dan kamera film langsung terbuka di browser — tanpa unduh, tanpa akun, dari iPhone, Android, atau desktop.",
  },
  {
    q: "Apa itu preset film?",
    a: "Preset meniru karakter film analog — warna, butiran, dan kontrasnya — supaya tiap jepretan terasa seperti kamera sekali pakai yang sesungguhnya.",
  },
  {
    q: "Kapan foto bisa dilihat?",
    a: "Foto tersembunyi hingga waktu reveal yang kamu atur. Saat tiba, semuanya muncul serentak untuk semua orang pada saat yang bersamaan.",
  },
  {
    q: "Bisakah aku mengunduh fotonya?",
    a: "Bisa. Setelah album terungkap, unduh foto satu per satu atau seluruh album sekaligus dalam resolusi penuh.",
  },
  {
    q: "Apakah benar-benar gratis?",
    a: "Album hingga 5 tamu gratis selamanya. Untuk tamu lebih banyak, cukup bayar sekali per acara — tanpa langganan, tanpa perpanjangan.",
  },
];

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3.5 px-1 py-5 text-left"
      >
        <span className="flex-1 font-display text-[17px] font-semibold leading-[1.35] text-ink">
          {q}
        </span>
        {open ? (
          <Minus size={22} className="shrink-0 text-accent" />
        ) : (
          <Plus size={22} className="shrink-0 text-accent" />
        )}
      </button>
      <div
        className="overflow-hidden transition-[max-height] duration-[280ms] ease-in-out"
        style={{ maxHeight: open ? 200 : 0 }}
      >
        <p className="mx-1 mb-[22px] mt-0 max-w-[620px] font-body text-[15.5px] leading-[1.6] text-muted">
          {a}
        </p>
      </div>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="border-t border-border bg-base py-14 desk:py-[84px]">
      <Shell max={760}>
        <Reveal className="mb-12 text-center">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-3 font-display text-[30px] font-semibold leading-[1.08] tracking-[-0.025em] text-ink desk:text-[40px]">
            Ada pertanyaan? <span className="italic">Kami bantu.</span>
          </h2>
        </Reveal>
        <Reveal delay={60} className="border-t border-border">
          {items.map((it, i) => (
            <FaqItem
              key={i}
              q={it.q}
              a={it.a}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </Reveal>
      </Shell>
    </section>
  );
}
