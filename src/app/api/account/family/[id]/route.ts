import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { familyService } from "@/modules/family/service/family.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await familyService.updateMember(session.user.id, id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/account/family/[id] error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update family member" },
      { status: 400 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await familyService.deleteMember(session.user.id, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/account/family/[id] error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete family member" },
      { status: 400 }
    );
  }
}
