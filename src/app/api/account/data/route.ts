import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { accountService } from "@/modules/account/service/account.service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to view your client portal." },
        { status: 401 }
      );
    }

    const userId = (session.user as { id?: string }).id || "";
    const email = session.user.email || "";
    const phone = (session.user as { phone?: string }).phone || "";

    const data = await accountService.getDashboardData(userId, email, phone);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: unknown) {
    console.error("Account data API error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
