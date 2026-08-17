import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050a02",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 22,
              background: "linear-gradient(135deg, #a3e635, #84cc16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 30px rgba(163, 230, 53, 0.45)",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: 56,
                fontWeight: 900,
                fontFamily: "sans-serif",
                lineHeight: 1,
              }}
            >
              A
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "white",
                fontSize: 52,
                fontWeight: 700,
                fontFamily: "monospace",
                letterSpacing: -1,
              }}
            >
              afraz
            </span>
            <span
              style={{
                color: "#94a3b8",
                fontSize: 22,
                fontFamily: "sans-serif",
                marginTop: 4,
              }}
            >
              Developer Portfolio
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
