import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { branchService } from "@/modules/branches/service/branch.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

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
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const success = await branchService.deleteBranch(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("DELETE /api/branches/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete branch" }, { status: 500 });
  }
}
