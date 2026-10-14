import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { userService } from "@/modules/users/service/user.service";
import { CreateUserDto } from "@/modules/users/domain/user.entity";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || (role !== "admin" && role !== "superadmin" && role !== "staff")) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const roleFilter = searchParams.get("role") || undefined;
  const search = searchParams.get("search") || undefined;
  const branchId = searchParams.get("branchId") || undefined;
  const activeParam = searchParams.get("active");
  const isActive = activeParam !== null ? activeParam === "true" || activeParam === "1" : undefined;

  try {
    const [users, stats] = await Promise.all([
      userService.getAllUsers({ role: roleFilter, search, branchId, isActive }),
      userService.getRoleStats(),
    ]);

    return NextResponse.json({ users, stats });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  // Only Admins and Superadmins can create staff/admin accounts
  if (!session || (role !== "admin" && role !== "superadmin")) {
    return NextResponse.json(
      { error: "Forbidden: Only administrators can create new admin or staff accounts" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, password, role: userRole, phone, department, branch_id, is_active } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const newUser = await userService.createUser({
      name,
      email,
      password,
      role: userRole || "staff",
      phone,
      department,
      branch_id,
      is_active: is_active !== false,
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create user account" },
      { status: 400 }
    );
  }
}
