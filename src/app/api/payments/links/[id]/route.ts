import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { paymentService } from "@/modules/payments/service/payment.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const success = await paymentService.deletePaymentLink(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/payments/links/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete payment link" }, { status: 500 });
  }
}
