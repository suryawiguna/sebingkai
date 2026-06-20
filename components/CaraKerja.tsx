import { PhoneFrame } from "./ds/PhoneFrame";
import { Shell, Eyebrow } from "./ui";
import { Reveal } from "./Reveal";
import { ScreenNaming, ScreenQR, ScreenReveal } from "./screens";

const steps = [
  {
    n: "01",
    t: "Buat albummu",
    d: "Beri nama acara, pilih preset film, dan atur kapan semua foto terungkap. Selesai dalam dua menit.",
    Screen: ScreenNaming,
  },
  {
    n: "02",
    t: "Bagikan satu QR",
    d: "Satu kode. Tanpa aplikasi, tanpa daftar. Tamu memindai dan langsung memotret dari browser.",
    Screen: ScreenQR,
  },
  {
    n: "03",
    t: "Ungkap bersama",
    d: "Foto tersembunyi sampai acara usai — lalu semua orang melihatnya sekaligus. Di situlah keajaibannya.",
    Screen: ScreenReveal,
  },
];

// How it works (3-col, each step shown on a real phone).
export function CaraKerja() {
  return (
    <section
      id="cara-kerja"
      className="border-t border-border bg-base py-14 desk:py-[84px]"
    >
      <Shell>
        <Reveal className="mb-10 text-center desk:mb-[60px]">
          <Eyebrow>Cara kerja</Eyebrow>
          <h2 className="mx-auto mt-3 max-w-[560px] font-display text-[32px] font-semibold leading-[1.06] tracking-[-0.025em] text-ink desk:text-[44px]">
            Bagaimana satu hari menjadi <span className="italic">satu album film.</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-[52px] tab:grid-cols-3 tab:gap-4 desk:gap-7">
          {steps.map((s, i) => (
            <Reveal
              key={s.n}
              delay={i * 90}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-[26px]">
                <PhoneFrame className="[--pw:252px] tab:[--pw:248px] desk:[--pw:230px]">
                  <s.Screen />
                </PhoneFrame>
              </div>
              <div className="mb-2.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.1em] text-accent">
                Langkah {s.n}
              </div>
              <h3 className="mb-2 font-display text-[22px] font-semibold tracking-[-0.01em] text-ink">
                {s.t}
              </h3>
              <p className="m-0 max-w-[300px] font-body text-[15px] leading-[1.55] text-muted">
                {s.d}
              </p>
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}
