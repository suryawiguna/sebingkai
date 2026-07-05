import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: { absolute: "Coba Sebingkai · Demo" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-base">{children}</div>;
}
