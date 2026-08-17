import { ImageResponse } from "next/og";
import { CONTACT } from "@/lib/contact";

export const alt = "ALAS — чистота и обряд Аластау";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#14120F",
          padding: "64px 72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: 340,
            width: 520,
            height: 520,
            borderRadius: 999,
            background: "#B4551F",
            opacity: 0.28,
          }}
        />

        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              fontSize: 36,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 600,
              color: "#F7F4EF",
              letterSpacing: "0.16em",
            }}
          >
            ALAS
          </div>
          <div
            style={{
              width: 10,
              height: 10,
              marginLeft: 14,
              borderRadius: 999,
              background: "#C9772F",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 64,
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 500,
              color: "#F2EDE4",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 900,
            }}
          >
            Чистота и обряд Аластау
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 28,
              color: "#B99A6B",
              letterSpacing: "0.04em",
            }}
          >
            {`Премиальный клининг · ${CONTACT.city}`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 24,
            color: "#C9C6BE",
          }}
        >
          <div>Премиальный клининг</div>
          <div style={{ fontVariantNumeric: "tabular-nums" }}>{CONTACT.phoneDisplay}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
