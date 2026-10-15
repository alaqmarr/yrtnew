import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { userService } from "@/modules/users/service/user.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || (role !== "admin" && role !== "superadmin" && role !== "staff")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const user = await userService.getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!session || (role !== "admin" && role !== "superadmin")) {
    return NextResponse.json(
      { error: "Forbidden: Only administrators can modify user accounts" },
      { status: 403 }
    );
  }

  const { id } = await params;
  try {
    const targetUser = await userService.getUserById(id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.role === "superadmin" && role !== "superadmin") {
      return NextResponse.json(
        { error: "Forbidden: Only superadministrators can modify superadmin accounts" },
        { status: 403 }
      );
    }

    const body = await req.json();
    if (body.role) {
      const ALLOWED_ROLES = ["client", "staff", "admin", "superadmin"];
      if (!ALLOWED_ROLES.includes(body.role)) {
        return NextResponse.json(
          { error: `Invalid role: ${body.role}. Must be one of: ${ALLOWED_ROLES.join(", ")}` },
          { status: 400 }
        );
      }
      if (body.role === "superadmin" && role !== "superadmin") {
        return NextResponse.json(
          { error: "Forbidden: Only superadministrators can grant superadmin role" },
          { status: 403 }
        );
      }
    }

    const updated = await userService.updateUser(id, body);
    return NextResponse.json({ user: updated });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update user" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (!session || (role !== "admin" && role !== "superadmin")) {
    return NextResponse.json(
      { error: "Forbidden: Only administrators can delete user accounts" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const currentUserId = session.user.id;

  try {
    const targetUser = await userService.getUserById(id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.role === "superadmin" && role !== "superadmin") {
      return NextResponse.json(
        { error: "Forbidden: Only superadministrators can delete superadmin accounts" },
        { status: 403 }
      );
    }

    await userService.deleteUser(id, currentUserId);
    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete user" },
      { status: 400 }
    );
  }
}
