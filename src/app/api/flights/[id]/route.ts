import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { flightInquiryService } from "@/modules/flights/service/flight-inquiry.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const success = await flightInquiryService.deleteInquiry(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/flights/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete flight inquiry" }, { status: 500 });
  }
}
