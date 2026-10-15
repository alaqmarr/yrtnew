import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { teamService } from "@/modules/team/service/team.service";

export async function GET() {
  try {
    const team = await teamService.getAllTeam();
    return NextResponse.json(team);
  } catch (error) {
    console.error("GET /api/team error:", error);
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const created = await teamService.createTeamMember(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/team error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create team member" },
      { status: 500 }
    );
  }
}
