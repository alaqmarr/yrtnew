import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/modules/users/service/user.service";

export async function GET() {
  try {
    const adminCount = await userService.countAdmins();
    return NextResponse.json({
      setupRequired: adminCount === 0,
      adminCount,
    });
  } catch (error) {
    console.error("GET /api/setup error:", error);
    return NextResponse.json(
      { error: "Failed to check setup status" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const hasAdmin = await userService.hasAnyAdmin();
    if (hasAdmin) {
      return NextResponse.json(
        {
          error:
            "Initial setup has already been completed. An active administrator account already exists.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password, phone, department } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const createdAdmin = await userService.createInitialAdmin({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone?.trim() || null,
      department: department?.trim() || "Executive Administration",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Primary administrator account created successfully.",
        user: {
          id: createdAdmin.id,
          name: createdAdmin.name,
          email: createdAdmin.email,
          role: createdAdmin.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/setup error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Setup failed" },
      { status: 500 }
    );
  }
}
