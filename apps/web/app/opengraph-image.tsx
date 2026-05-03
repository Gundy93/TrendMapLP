import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TrendMap — 지금 여기, 진짜 핫한 메뉴";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#18181b",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
            color: "#a1a1aa",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              background: "#a1a1aa",
              borderRadius: 999,
            }}
          />
          Coming Soon
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.1,
            textAlign: "center",
            marginBottom: 36,
          }}
        >
          지금 여기, 진짜 핫한 메뉴.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#a1a1aa",
            textAlign: "center",
          }}
        >
          출시 알림을 이메일로 받아보세요 — TrendMap
        </div>
      </div>
    ),
    { ...size },
  );
}
