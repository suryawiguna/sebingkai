import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/Header";
import { CaraKerja } from "@/components/CaraKerja";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { ClosingCta } from "@/components/Closing";
import { Button } from "@/components/ds/Button";
import { Shell, Eyebrow } from "@/components/ui";
import { landings, getLanding } from "@/lib/landings";

// Only the known keyword slugs render; any other path 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return landings.map((l) => ({ landing: l.slug }));
}

type Params = { params: Promise<{ landing: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { landing } = await params;
  const l = getLanding(landing);
  if (!l) return {};
  const url = `/${l.slug}`;
  return {
    title: l.title,
    description: l.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${l.title} · Sebingkai`,
      description: l.description,
      url,
      type: "website",
      // Explicit: pages with their own openGraph don't inherit the file-based
      // OG image.
      images: ["/opengraph-image"],
    },
  };
}

export default async function LandingPage({ params }: Params) {
  const { landing } = await params;
  const l = getLanding(landing);
  if (!l) notFound();

  return (
    <div data-screen-label={`Sebingkai · ${l.title}`}>
      <SiteHeader />
      <main>
        {/* Keyword-tailored hero */}
        <section className="border-b border-border bg-base pt-12 pb-14 desk:pt-[76px] desk:pb-[84px]">
          <Shell max={760} className="text-center">
            <div className="mb-5 flex justify-center">
              <Eyebrow dot>{l.eyebrow}</Eyebrow>
            </div>
            <h1 className="m-0 font-display text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink desk:text-[56px]">
              {l.h1} <span className="italic">{l.h1Accent}</span>
            </h1>
            <p className="mx-auto mt-[22px] max-w-[520px] font-body text-[16.5px] leading-[1.55] text-ink-soft desk:text-[18.5px]">
              {l.lead}
            </p>
            <div className="mt-[30px] flex justify-center gap-3">
              <Link href="/demo">
                <Button variant="primary" size="lg">
                  Coba demo
                </Button>
              </Link>
              <a href="#harga">
                <Button variant="secondary" size="lg">
                  Lihat harga
                </Button>
              </a>
            </div>
            <p className="mt-[18px] font-body text-[14px] text-muted">
              Gratis hingga 5 tamu · tanpa aplikasi
            </p>
          </Shell>
        </section>

        {/* Keyword-tailored value points */}
        <section className="border-b border-border bg-base-sunken py-14 desk:py-[84px]">
          <Shell>
            <div className="grid grid-cols-1 gap-6 desk:grid-cols-3 desk:gap-8">
              {l.points.map((pt) => (
                <div
                  key={pt.h}
                  className="rounded-lg border border-border bg-surface px-6 py-7"
                >
                  <h2 className="m-0 font-display text-[19px] font-semibold tracking-[-0.01em] text-ink">
                    {pt.h}
                  </h2>
                  <p className="mt-2.5 font-body text-[14.5px] leading-[1.55] text-muted">
                    {pt.p}
                  </p>
                </div>
              ))}
            </div>
          </Shell>
        </section>

        {/* Shared, substantive sections */}
        <CaraKerja />
        <Pricing />
        <Faq />
      </main>
      <ClosingCta />
    </div>
  );
}
