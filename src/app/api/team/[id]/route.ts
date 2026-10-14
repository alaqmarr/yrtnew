import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { teamService } from "@/modules/team/service/team.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const updated = await teamService.updateTeamMember({ ...body, id });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/team/[id] error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const success = await teamService.deleteTeamMember(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/team/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}
