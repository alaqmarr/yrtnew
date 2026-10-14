import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { branchService } from "@/modules/branches/service/branch.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const updated = await branchService.updateBranch({ ...body, id });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/branches/[id] error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update branch" },
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
    const success = await branchService.deleteBranch(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/branches/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete branch" }, { status: 500 });
  }
}
