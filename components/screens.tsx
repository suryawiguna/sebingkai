import { Camera, ArrowRight, Share2 } from "lucide-react";
import { FilmImg } from "./FilmImg";
import { ClockText } from "./ClockText";

/* ----------------------------------------------------------------------------
 * App screens that render INSIDE a PhoneFrame. Dark Film theme: pure-black
 * camera/join screens, near-black gallery screens, recording-red accents.
 * -------------------------------------------------------------------------- */

const tabPill = (active: boolean) =>
  `whitespace-nowrap rounded-full px-3 py-1.5 font-body text-[11.5px] font-medium ${
    active ? "bg-ink text-base" : "bg-surface-2 text-muted"
  }`;

// 1) Album / "Rollmu" — the shared gallery of revealed photos.
export function ScreenAlbum() {
  const tiles = [
    { k: "toast", who: "Lucas" },
    { k: "balloons", who: "Mama" },
    { k: "dance", who: "Rangga" },
    { k: "confetti", who: "Kirana" },
    { k: "crowd", who: "Bima" },
    { k: "friends", who: "Sasa" },
  ];
  return (
    <div className="flex h-full flex-col bg-base">
      <div className="px-4 pt-11 pb-2.5">
        <div className="flex items-baseline justify-between">
          <h3 className="m-0 whitespace-nowrap font-display text-[16px] font-semibold tracking-[-0.01em] text-ink">
            Pesta Ultah Lucas
          </h3>
          <span className="font-mono text-[11px] text-muted">24 FOTO</span>
        </div>
        <div className="mt-3 flex gap-[7px] overflow-hidden">
          <span className={tabPill(true)}>Semua</span>
          <span className={tabPill(false)}>Lucas</span>
          <span className={tabPill(false)}>Mama</span>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-2 content-start gap-2 overflow-hidden px-4">
        {tiles.map((t, i) => (
          <div
            key={i}
            className="relative aspect-[1/1.2] overflow-hidden rounded-[12px] border border-border"
          >
            <FilmImg k={t.k} w={300} sizes="150px" />
            <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/55 px-[7px] py-0.5 font-body text-[10px] font-medium text-white backdrop-blur-[2px]">
              {t.who}
            </span>
          </div>
        ))}
      </div>
      <div className="px-4 pt-3 pb-[18px]">
        <div className="flex h-11 items-center justify-center gap-[9px] rounded-[12px] border border-border bg-surface-2">
          <Camera size={15} strokeWidth={1.6} className="text-ink" />
          <span className="font-body text-[13px] font-medium text-ink">Buka kamera</span>
        </div>
      </div>
    </div>
  );
}

// 2) Join — the guest welcome screen after scanning the QR.
export function ScreenJoin() {
  return (
    <div className="relative h-full bg-phone">
      <FilmImg k="dj" w={420} sizes="260px" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.1)_36%,rgba(0,0,0,0.92)_100%)]" />
      <div className="relative flex h-full flex-col px-[18px] pt-[46px] pb-[22px]">
        <span className="self-start rounded-full bg-white/[0.14] px-[11px] py-[5px] font-mono text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur-[4px]">
          Diundang oleh Lucas
        </span>
        <div className="mt-auto">
          <h3 className="m-0 font-display text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
            Pesta Ultah Lucas
          </h3>
          <div className="mt-2 mb-4 flex items-center gap-2 font-mono text-[11px] text-white/[0.78]">
            <span className="inline-flex items-center gap-[5px]">
              <span className="size-1.5 rounded-full bg-accent" />6J TERSISA
            </span>
            <span>·</span>
            <span>24 FOTO</span>
          </div>
          <div className="mb-2.5 flex h-[42px] items-center rounded-[10px] border border-white/[0.22] bg-white/[0.12] px-[13px]">
            <span className="font-body text-[13px] text-white/[0.62]">Masukkan namamu…</span>
          </div>
          <div className="flex h-[46px] items-center justify-center rounded-[10px] bg-accent">
            <span className="font-body text-[14px] font-medium text-white">Ambil kameramu</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3) Camera — live viewfinder with the film overlay + shutter.
export function ScreenCamera() {
  const cornerBase: React.CSSProperties = {
    position: "absolute",
    width: 16,
    height: 16,
    borderColor: "rgba(255,255,255,0.85)",
    borderStyle: "solid",
    borderWidth: 0,
  };
  const corners: React.CSSProperties[] = [
    { top: -1, left: -1, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 8 },
    { top: -1, right: -1, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 8 },
    { bottom: -1, left: -1, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 8 },
    { bottom: -1, right: -1, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 8 },
  ];
  return (
    <div className="flex h-full flex-col bg-phone">
      <div className="flex items-center justify-between px-4 pt-11 pb-2.5">
        <span className="font-mono text-[11px] tracking-[0.04em] text-white/[0.72]">TOKYO 2025</span>
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-[9px] py-1">
          <span className="size-1.5 rounded-full bg-accent" />
          <ClockText
            start={5 * 3600 + 12 * 60 + 8}
            className="font-mono text-[11px] font-medium tabular-nums text-white"
          />
        </span>
      </div>
      <div className="relative mx-[14px] flex-1 overflow-hidden rounded-[14px]">
        <FilmImg k="friends" w={420} sizes="290px" />
        <div className="absolute inset-3 rounded-[8px] border-[1.5px] border-white/50">
          {corners.map((c, i) => (
            <span key={i} style={{ ...cornerBase, ...c }} />
          ))}
        </div>
        <span className="absolute bottom-[18px] left-[18px] font-mono text-[10px] tracking-[0.08em] text-white/[0.88]">
          KODAK · 1/125
        </span>
      </div>
      <div className="relative flex items-center justify-center pt-4 pb-[26px]">
        <span className="absolute left-6 font-mono text-[12px] tabular-nums text-white/[0.72]">
          12 / 24
        </span>
        <span className="flex size-[58px] items-center justify-center rounded-full border-[3px] border-white/85 shadow-rec">
          <span className="size-11 rounded-full bg-accent" />
        </span>
      </div>
    </div>
  );
}

// 4) Naming — Step 01: name the film.
export function ScreenNaming() {
  return (
    <div className="flex h-full flex-col bg-base px-[18px] pt-12 pb-[22px]">
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-accent">
        Langkah 01
      </span>
      <h3 className="mt-2.5 font-display text-[22px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink">
        Apa nama acaramu?
      </h3>
      <p className="mt-2 mb-[18px] font-body text-[12.5px] leading-[1.5] text-muted">
        Nama ini akan dilihat semua tamu film.
      </p>
      <div className="flex h-[46px] items-center gap-px rounded-[10px] border-[1.5px] border-accent bg-surface px-[13px]">
        <span className="font-body text-[15px] text-ink">Pesta Ultah Lucas</span>
        <span className="ml-px h-[18px] w-[1.5px] bg-accent" />
      </div>
      <p className="mt-4 mb-2 font-body text-[11px] text-muted">Saran</p>
      <div className="flex flex-wrap gap-[7px]">
        {["Ultah Lucas ke-7", "Pesta Lucas", "Lucas Day"].map((s) => (
          <span
            key={s}
            className="rounded-full border border-border bg-surface-2 px-3 py-[7px] font-body text-[12px] text-ink-soft"
          >
            {s}
          </span>
        ))}
      </div>
      <div className="mt-auto">
        <div className="flex h-[46px] items-center justify-center gap-1.5 rounded-[10px] bg-accent">
          <span className="font-body text-[14px] font-medium text-white">Lanjut</span>
          <ArrowRight size={16} className="text-white" />
        </div>
      </div>
    </div>
  );
}

// 5) QR — Step 02: share one code. White QR card for scannable authenticity.
export function ScreenQR() {
  const N = 13;
  const cells: boolean[] = [];
  let seed = 7;
  for (let i = 0; i < N * N; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    cells.push((seed >> 16) % 100 < 52);
  }
  const finder = (r: number, c: number) =>
    (r < 4 && c < 4) || (r < 4 && c > N - 5) || (r > N - 5 && c < 4);
  return (
    <div className="flex h-full flex-col bg-base px-[18px] pt-12 pb-[22px]">
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-accent">
        Langkah 02
      </span>
      <h3 className="mt-2.5 mb-4 font-display text-[22px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink">
        Filmmu sudah siap
      </h3>
      <div className="flex flex-col items-center rounded-[16px] bg-white p-[18px]">
        <div
          className="grid aspect-square w-full max-w-[150px] gap-[1.5px]"
          style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}
        >
          {cells.map((on, i) => {
            const r = Math.floor(i / N);
            const c = i % N;
            const show = finder(r, c) ? true : on;
            return (
              <span
                key={i}
                className="rounded-[1px]"
                style={{ background: show ? "#000" : "transparent" }}
              />
            );
          })}
        </div>
      </div>
      <div className="mt-3.5 flex h-[38px] items-center justify-center rounded-[10px] border border-border bg-surface">
        <span className="font-mono text-[12px] text-ink-soft">sebingkai.id/lucas</span>
      </div>
      <div className="mt-auto flex gap-2">
        <div className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-accent">
          <Share2 size={15} className="text-white" />
          <span className="font-body text-[13.5px] font-medium text-white">Bagikan QR</span>
        </div>
        <div className="flex h-11 w-24 items-center justify-center rounded-[10px] border border-border bg-surface">
          <span className="font-body text-[13.5px] font-medium text-ink">Salin</span>
        </div>
      </div>
    </div>
  );
}

// 6) Reveal — Step 03: everyone sees the album at once.
export function ScreenReveal() {
  const tiles = [
    "hands", "concert", "dance", "crowd", "confetti", "stage",
    "toast", "balloons", "friends", "group", "dj", "travel",
  ];
  return (
    <div className="flex h-full flex-col bg-base">
      <div className="px-4 pt-[46px] pb-3 text-center">
        <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-accent">
          Baru terungkap
        </span>
        <h3 className="mt-1.5 font-display text-[20px] font-semibold tracking-[-0.02em] text-ink">
          128 foto, sekaligus
        </h3>
      </div>
      <div className="grid min-h-0 flex-1 auto-rows-[1fr] grid-cols-3 gap-1.5 overflow-hidden px-[14px] pb-4">
        {tiles.map((k, i) => (
          <div
            key={i}
            className="reveal-pop relative overflow-hidden rounded-[9px] border border-border"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <FilmImg k={k} w={220} sizes="90px" />
          </div>
        ))}
      </div>
    </div>
  );
}
