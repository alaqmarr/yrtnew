import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { paymentService } from "@/modules/payments/service/payment.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const success = await paymentService.deletePaymentLink(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/payments/links/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete payment link" }, { status: 500 });
  }
}
