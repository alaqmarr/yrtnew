import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { contactService } from "@/modules/contact/service/contact.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const body = await req.json();
    const updated = await contactService.updateStatus(id, body.status);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/contact/[id] error:", error);
    return NextResponse.json({ error: "Failed to update contact message" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const success = await contactService.deleteMessage(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/contact/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete contact message" }, { status: 500 });
  }
}
