import { ImageResponse } from "next/og";

export const alt = "Everlooms — Jouw verhaal, voor altijd dichtbij";
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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #f7f4ee 0%, #eadfcb 100%)",
          color: "#3c4b36",
        }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: 999,
            background: "#56714e",
            color: "#f7f4ee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 52,
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          E
        </div>
        <div style={{ fontSize: 92, letterSpacing: -3 }}>Everlooms</div>
        <div style={{ fontSize: 34, color: "#6f6a5c", marginTop: 8 }}>
          Jouw verhaal. Voor altijd dichtbij.
        </div>
      </div>
    ),
    { ...size },
  );
}
