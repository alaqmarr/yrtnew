import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
          borderRadius: 38,
          border: "4px solid #FDE68A",
          position: "relative",
        }}
      >
        {/* Ribbon Loop representation */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "#D97706",
              letterSpacing: -2,
            }}
          >
            YR
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#0891B2",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginTop: -6,
            }}
          >
            TRAVELS
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
