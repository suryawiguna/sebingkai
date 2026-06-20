import Link from "next/link";
import { Button } from "./ds/Button";
import { PhoneFrame } from "./ds/PhoneFrame";
import { Shell, Eyebrow } from "./ui";
import { Reveal } from "./Reveal";
import { RollCard } from "./RollCard";
import { HeroQrCard } from "./HeroQrCard";
import { ScreenJoin } from "./screens";

// Desktop: phone (invite screen) with two floating roll cards tucked at corners.
function HeroStage() {
  return (
    <div className="relative flex items-center justify-center pt-2 desk:h-[540px] desk:pt-0">
      <div className="relative z-[2]">
        <PhoneFrame className="[--pw:232px] desk:[--pw:264px]">
          <ScreenJoin />
        </PhoneFrame>
      </div>
      <div className="absolute right-[-14px] top-[22px] z-[3] hidden desk:block">
        <RollCard
          title="Pernikahan Dewi & Arif"
          count="3 DARI 24 FOTO"
          photos={["vows", "toast"]}
          contributors={["Dewi Lestari", "Arif Pratama", "Putri M"]}
          style={{ width: 224 }}
        />
      </div>
      <div className="absolute bottom-[28px] left-[-18px] z-[1] hidden desk:block">
        <RollCard
          title="Tokyo 2025"
          count="7 FOTO"
          photos={["travel", "city"]}
          contributors={["Maya", "Alex"]}
          style={{ width: 200 }}
        />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-10 pb-4 desk:pt-[76px] desk:pb-16"
    >
      <Shell className="grid grid-cols-1 items-center gap-8 desk:grid-cols-[1.04fr_0.96fr] desk:gap-10">
        <Reveal className="text-center desk:text-left">
          <div className="mb-[22px] flex justify-center desk:justify-start">
            <Eyebrow dot>Kamera film sekali pakai</Eyebrow>
          </div>
          <h1 className="m-0 font-display text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink desk:text-[60px]">
            Lihat lagi momen
            <br />
            yang <span className="italic">kamu lewatkan.</span>
          </h1>
          <p className="mx-auto mt-[22px] max-w-[460px] font-body text-[16.5px] leading-[1.55] text-ink-soft desk:mx-0 desk:mt-[26px] desk:text-[18.5px]">
            Bagikan satu QR di acaramu. Setiap tamu dapat kamera film sekali pakai di browser —
            satu preset, satu album yang terungkap bersama setelah acara selesai.
          </p>
          <div className="mt-[30px] flex justify-center gap-3 desk:justify-start">
            <Button variant="primary" size="lg">
              Mulai gratis
            </Button>
            <Link href="/demo">
              <Button variant="secondary" size="lg">
                Coba demo
              </Button>
            </Link>
          </div>
          <p className="mt-[18px] font-body text-[14px] text-muted">
            Gratis hingga 5 tamu · tanpa kartu kredit
          </p>
          <div className="mt-6 hidden desk:block">
            <HeroQrCard />
          </div>
        </Reveal>

        <Reveal delay={140}>
          <HeroStage />
          <div className="relative z-[3] -mt-7 flex justify-center desk:hidden">
            <RollCard
              title="Pernikahan Dewi & Arif"
              count="3 DARI 24 FOTO"
              photos={["vows", "toast"]}
              contributors={["Dewi Lestari", "Arif Pratama", "Putri M"]}
              style={{ width: 260 }}
            />
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
