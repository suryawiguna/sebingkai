"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

type QrCodeProps = {
  /** The value (URL/text) the QR encodes. */
  value: string;
  /** Rendered pixel size of the square. Defaults to 132. */
  size?: number;
  className?: string;
};

/**
 * QrCode — renders a real, scannable QR to a <canvas> via the `qrcode` lib.
 * High contrast (black on white) with a white quiet zone so it scans cleanly
 * even on the dark Film surfaces.
 */
export function QrCode({ value, size = 132, className = "" }: QrCodeProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current || !value) return;
    QRCode.toCanvas(ref.current, value, {
      width: size,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
      errorCorrectionLevel: "M",
    }).catch(() => {
      /* ignore render failures — the surrounding card still shows its label */
    });
  }, [value, size]);

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={className}
      aria-label="Kode QR demo"
    />
  );
}
