import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";

const RSL_BASE_URL = process.env.RSL_BASE_URL || "https://rsl.alaqmar.dev";
const RSL_API_KEY =
  process.env.RSL_API_KEY ||
  "rpk_live_YMzysplBDL5iXM48L1OLDXDT0dysiF3RvgCaS2cdsbY";

export async function GET(req: NextRequest) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const days = searchParams.get("days") || "30";

    const [clientDataRes, healthRes] = await Promise.all([
      fetch(
        `${RSL_BASE_URL}/api/v1/client/data?include=client,gate,billing,invoices,payments,contracts,fleet,domains,tickets,releases,analytics&days=${encodeURIComponent(
          days
        )}`,
        {
          headers: {
            "x-api-key": RSL_API_KEY,
            Accept: "application/json",
          },
          cache: "no-store",
        }
      ),
      fetch(`${RSL_BASE_URL}/api/v1/health`, {
        headers: {
          "x-api-key": RSL_API_KEY,
          Accept: "application/json",
        },
        cache: "no-store",
      }).catch(() => null),
    ]);

    if (!clientDataRes.ok) {
      const errText = await clientDataRes.text();
      return NextResponse.json(
        {
          error: `RSL Server returned HTTP ${clientDataRes.status}`,
          details: errText,
        },
        { status: clientDataRes.status }
      );
    }

    const clientDataJson = await clientDataRes.json();
    const healthJson = healthRes && healthRes.ok ? await healthRes.json() : null;

    return NextResponse.json({
      data: clientDataJson.data || clientDataJson,
      health: healthJson,
      baseUrl: RSL_BASE_URL,
      clientId: "cli_01M5097SAH26DX9400N6WSYY1Q",
    });
  } catch (error) {
    console.error("GET /api/admin/rsl error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to query RSL Server" },
      { status: 500 }
    );
  }
}
