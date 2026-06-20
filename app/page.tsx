import { SiteHeader } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StatRow } from "@/components/StatRow";
import { KameraTamu } from "@/components/KameraTamu";
import { CaraKerja } from "@/components/CaraKerja";
import { Showcase } from "@/components/Showcase";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { ClosingCta } from "@/components/Closing";

export default function Home() {
  return (
    <div data-screen-label="Sebingkai landing">
      <SiteHeader />
      <main>
        <Hero />
        <StatRow />
        <KameraTamu />
        <CaraKerja />
        <Showcase />
        <Pricing />
        <Faq />
      </main>
      <ClosingCta />
    </div>
  );
}
