import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { siteSettingService } from "@/modules/site-settings/service/site-setting.service";

const SENSITIVE_KEYS = new Set([
  "smtp_pass",
  "r2_secret_access_key",
  "razorpay_key_secret",
  "razorpay_key_secret_live",
  "razorpay_key_secret_test",
]);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    const isAdmin = role === "admin" || role === "superadmin";

    const settings = await siteSettingService.getSettingsMap();
    if (!isAdmin) {
      for (const key of SENSITIVE_KEYS) {
        delete settings[key];
      }
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || (role !== "admin" && role !== "superadmin")) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    await siteSettingService.updateSettings(body);
    const updated = await siteSettingService.getSettingsMap();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
