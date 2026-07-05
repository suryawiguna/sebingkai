import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/Header";
import { ClosingCta } from "@/components/Closing";
import { FaqAccordion } from "@/components/Faq";
import { Button } from "@/components/ds/Button";
import { Shell, Eyebrow } from "@/components/ui";
import { faqItems } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Pertanyaan umum",
  description:
    "Jawaban untuk pertanyaan tersering soal Sebingkai — kamera film sekali pakai lewat QR, preset film, waktu reveal, mengunduh foto, dan harga.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Pertanyaan umum · Sebingkai",
    description:
      "Jawaban untuk pertanyaan tersering soal Sebingkai — QR, preset film, waktu reveal, unduh foto, dan harga.",
    url: "/faq",
    type: "website",
    // Pages that declare their own openGraph don't inherit the file-based OG
    // image, so reference it explicitly.
    images: ["/opengraph-image"],
  },
};

// FAQPage structured data so answers can surface directly in search results.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((it) => ({
    "@type": "Question",
    name: it.q,
    acceptedAnswer: { "@type": "Answer", text: it.a },
  })),
};

export default function FaqPage() {
  return (
    <div data-screen-label="Sebingkai FAQ">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-base py-14 desk:py-[84px]">
          <Shell max={760}>
            <div className="mb-10 text-center desk:mb-12">
              <Eyebrow>FAQ</Eyebrow>
              <h1 className="mt-3 font-display text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] text-ink desk:text-[44px]">
                Pertanyaan <span className="italic">umum.</span>
              </h1>
              <p className="mx-auto mt-4 max-w-[480px] font-body text-[15.5px] leading-[1.55] text-ink-soft desk:text-[17px]">
                Semua yang perlu kamu tahu sebelum membuat album pertamamu. Masih
                ada yang ingin ditanyakan? Coba dulu demonya.
              </p>
            </div>

            <div className="border-t border-border">
              <FaqAccordion />
            </div>

            <div className="mt-10 flex justify-center">
              <Link href="/demo">
                <Button variant="primary" size="lg">
                  Coba demo
                </Button>
              </Link>
            </div>
          </Shell>
        </section>
      </main>
      <ClosingCta />
    </div>
  );
}
