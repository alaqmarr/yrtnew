import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "Yellow Ribbon Travels - Handcrafted Tours & Global Flights";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 60,
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle decorative glow circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)",
          }}
        />

        {/* Top Header / Badges */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                background: "linear-gradient(135deg, #F59E0B 0%, #F43F5E 50%, #06B6D4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 26,
                fontWeight: 900,
              }}
            >
              YR
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  letterSpacing: -0.5,
                  color: "#FFFFFF",
                }}
              >
                YELLOW RIBBON
              </span>
              <span
                style={{
                  fontSize: 12,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: "#F59E0B",
                  fontWeight: 700,
                }}
              >
                TRAVELS & TOURS
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 30,
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#F59E0B",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            ★ 4.9 / 5 Rating • 480+ Reviews
          </div>
        </div>

        {/* Main Center Message */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 900 }}>
          <div
            style={{
              fontSize: 22,
              color: "#38BDF8",
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            EXPERIENCE THE WORLD YOUR WAY
          </div>
          <div
            style={{
              fontSize: 54,
              fontWeight: 900,
              lineHeight: 1.15,
              color: "#FFFFFF",
              letterSpacing: -1,
            }}
          >
            Handcrafted Tours, Luxury Holidays & Global Flight Bookings
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#94A3B8",
              lineHeight: 1.4,
            }}
          >
            Explore Kashmir, Bali, Dubai, Kerala, Vietnam, Switzerland and over 50+ handpicked domestic & international destinations with 24/7 concierge assistance.
          </div>
        </div>

        {/* Footer Badges */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ display: "flex", gap: 24, fontSize: 14, color: "#CBD5E1", fontWeight: 600 }}>
            <span>✈ IATA Certified Global Ticketing</span>
            <span>📍 8+ Global Branch Offices</span>
            <span>💳 Instant Razorpay Checkout</span>
          </div>

          <div
            style={{
              fontSize: 16,
              color: "#F59E0B",
              fontWeight: 700,
            }}
          >
            yellowribbontravels.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
