import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { branchService } from "@/modules/branches/service/branch.service";

export async function GET() {
  try {
    const branches = await branchService.getActiveBranches();
    return NextResponse.json(branches);
  } catch (error) {
    console.error("GET /api/branches error:", error);
    return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const created = await branchService.createBranch(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/branches error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create branch" },
      { status: 500 }
    );
  }
}
