import { Check } from "lucide-react";
import { PhoneFrame } from "./ds/PhoneFrame";
import { Shell, Eyebrow } from "./ui";
import { Reveal } from "./Reveal";
import { ScreenCamera } from "./screens";

const features = [
  { t: "Satu preset film", d: "Setiap jepretan lewat filter analog yang sama — album terasa utuh." },
  { t: "Penghitung jepretan", d: "Jatah foto terbatas, seperti kamera sekali pakai sungguhan." },
  { t: "Tanpa aplikasi", d: "Terbuka langsung di browser. Tamu cukup pindai QR dan memotret." },
];

// Guest camera — the actual film viewfinder guests hold.
export function KameraTamu() {
  return (
    <section className="border-t border-border bg-phone py-14 desk:py-[84px]">
      <Shell className="grid grid-cols-1 items-center gap-10 desk:grid-cols-2 desk:gap-14">
        <Reveal className="order-2 text-center desk:order-1 desk:text-left">
          <div className="flex justify-center desk:justify-start">
            <Eyebrow dot onDark>
              Kamera tamu
            </Eyebrow>
          </div>
          <h2 className="mt-3.5 font-display text-[32px] font-semibold leading-[1.06] tracking-[-0.025em] text-white desk:text-[44px]">
            Setiap tamu memegang <span className="italic">kamera film.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[440px] font-body text-[16px] leading-[1.55] text-white/[0.66] desk:mx-0 desk:mt-[18px] desk:text-[17.5px]">
            Bukan galeri unggahan. Viewfinder sungguhan dengan butiran film, penghitung jepretan,
            dan tombol rekam merah — persis seperti kamera sekali pakai.
          </p>
          <div className="mx-auto mt-[26px] flex max-w-[420px] flex-col gap-[18px] text-left desk:mx-0 desk:mt-[30px]">
            {features.map((f) => (
              <div key={f.t} className="flex items-start gap-[13px]">
                <Check size={16} strokeWidth={1.8} className="mt-[3px] shrink-0 text-accent" />
                <span>
                  <span className="block font-body text-[15.5px] font-semibold text-white">
                    {f.t}
                  </span>
                  <span className="mt-0.5 block font-body text-[14px] leading-[1.5] text-white/[0.55]">
                    {f.d}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={120} className="order-1 flex justify-center desk:order-2">
          <PhoneFrame className="[--pw:264px] desk:[--pw:290px]">
            <ScreenCamera />
          </PhoneFrame>
        </Reveal>
      </Shell>
    </section>
  );
}
