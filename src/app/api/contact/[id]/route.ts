import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { contactService } from "@/modules/contact/service/contact.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const success = await contactService.deleteMessage(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/contact/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete contact message" }, { status: 500 });
  }
}
