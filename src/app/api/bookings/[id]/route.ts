import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { bookingService } from "@/modules/bookings/service/booking.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await req.json();
    const updated = await bookingService.updateStatus(id, body.status);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/bookings/[id] error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const success = await bookingService.deleteBooking(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/bookings/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
