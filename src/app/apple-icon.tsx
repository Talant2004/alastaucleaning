import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon: A на обсидиане с искрой ember. PNG отдаёт Next через ImageResponse. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14120F",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 600,
            color: "#F7F4EF",
            letterSpacing: "0.02em",
            lineHeight: 1,
          }}
        >
          A
        </div>
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 32,
            width: 14,
            height: 14,
            borderRadius: 999,
            background: "#C9772F",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
