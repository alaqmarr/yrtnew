import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { familyService } from "@/modules/family/service/family.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required to create a sub-account" },
        { status: 400 }
      );
    }

    const result = await familyService.createSubAccountForMember(
      session.user.id,
      id,
      body.email,
      body.password
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/account/family/[id]/create-account error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create sub-account" },
      { status: 400 }
    );
  }
}
