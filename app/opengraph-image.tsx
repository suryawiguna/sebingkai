import { ImageResponse } from "next/og";

// Default social share card, inherited by every route (each page's OG
// title/description still come from its own metadata).
export const alt = "Sebingkai · Satu bingkai, satu cerita";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0B",
          padding: "80px",
          color: "#F5F3F0",
        }}
      >
        {/* Wordmark: red camcorder dot + name */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "13px",
              border: "5px solid #F5F3F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "13px",
                height: "13px",
                borderRadius: "50%",
                background: "#FF2D2D",
              }}
            />
          </div>
          <div style={{ fontSize: "40px", fontWeight: 600, letterSpacing: "-0.02em" }}>
            Sebingkai
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "76px",
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
            }}
          >
            Satu acara. Satu album. Satu cerita.
          </div>
          <div
            style={{
              marginTop: "28px",
              fontSize: "30px",
              lineHeight: 1.4,
              color: "#A8A29E",
              maxWidth: "820px",
            }}
          >
            Bagikan satu QR — setiap tamu dapat kamera film sekali pakai di
            browser.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
