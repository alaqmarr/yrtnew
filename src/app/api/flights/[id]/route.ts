import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { flightInquiryService } from "@/modules/flights/service/flight-inquiry.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await req.json();
    const updated = await flightInquiryService.updateStatus(id, body.status, body.notes);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/flights/[id] error:", error);
    return NextResponse.json({ error: "Failed to update flight inquiry" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const success = await flightInquiryService.deleteInquiry(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/flights/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete flight inquiry" }, { status: 500 });
  }
}
