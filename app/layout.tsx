import type { Metadata } from "next";
import { Fraunces, Inter, DM_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sebingkai · Satu bingkai, satu cerita",
    template: "%s · Sebingkai",
  },
  description:
    "Bagikan satu QR di acaramu. Setiap tamu dapat kamera film sekali pakai di browser — satu preset, satu album yang terungkap bersama setelah acara selesai.",
  keywords: [
    "kamera sekali pakai",
    "kamera film nikahan",
    "foto tamu QR",
    "galeri foto acara",
    "album foto pernikahan",
    "kamera tamu",
    "disposable camera online",
  ],
  applicationName: "Sebingkai",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Sebingkai",
    locale: "id_ID",
    url: "/",
    title: "Sebingkai · Satu bingkai, satu cerita",
    description:
      "Bagikan satu QR di acaramu. Setiap tamu dapat kamera film sekali pakai di browser — satu album yang terungkap bersama setelah acara.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sebingkai · Satu bingkai, satu cerita",
    description:
      "Satu QR untuk acaramu. Setiap tamu dapat kamera film sekali pakai di browser — satu album bersama.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${inter.variable} ${dmMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
