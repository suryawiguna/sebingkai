import type { Metadata } from "next";
import { Fraunces, Inter, DM_Mono } from "next/font/google";
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
  title: "Sebingkai · Satu bingkai, satu cerita",
  description:
    "Bagikan satu QR di acaramu. Setiap tamu dapat kamera film sekali pakai di browser — satu preset, satu album yang terungkap bersama setelah acara selesai.",
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
