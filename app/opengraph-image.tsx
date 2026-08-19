import { ImageResponse } from "next/og";

export const alt = "Sapiens IA — L’IA utile, adoptée par vos équipes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#c9ff3d",
        color: "#171714",
        padding: "70px",
        fontFamily: "Arial",
      }}
    >
      <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-2px" }}>
        Sapiens IA.
      </div>
      <div
        style={{
          fontSize: 92,
          fontWeight: 700,
          lineHeight: 0.95,
          letterSpacing: "-6px",
          maxWidth: 950,
        }}
      >
        L’IA utile, adoptée par vos équipes.
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
        }}
      >
        <span>Conseil · Formation · Déploiement</span>
        <span>sapiens-ia.com</span>
      </div>
    </div>,
    size,
  );
}
