import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { familyService } from "@/modules/family/service/family.service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await familyService.getFamilyForUser(session.user.id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/account/family error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch family members" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || !body.relationship) {
      return NextResponse.json(
        { error: "Member name and relationship are required" },
        { status: 400 }
      );
    }

    const created = await familyService.addMember(session.user.id, body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/account/family error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to add family member" },
      { status: 400 }
    );
  }
}
