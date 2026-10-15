import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth-options";

export type AllowedAdminRole = "admin" | "superadmin";
export type AllowedStaffRole = "staff" | "admin" | "superadmin";

export interface GuardResult {
  session: any | null;
  errorResponse: NextResponse | null;
}

/**
 * Ensures request is from an authenticated user with 'admin' or 'superadmin' role.
 */
export async function requireAdmin(): Promise<GuardResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      session: null,
      errorResponse: NextResponse.json({ error: "Unauthorized: Sign in required" }, { status: 401 }),
    };
  }

  const role = (session.user as any)?.role;
  if (role !== "admin" && role !== "superadmin") {
    return {
      session: null,
      errorResponse: NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 }),
    };
  }

  return { session, errorResponse: null };
}

/**
 * Ensures request is from an authenticated user with 'staff', 'admin', or 'superadmin' role.
 */
export async function requireStaffOrAdmin(): Promise<GuardResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      session: null,
      errorResponse: NextResponse.json({ error: "Unauthorized: Sign in required" }, { status: 401 }),
    };
  }

  const role = (session.user as any)?.role;
  if (role !== "staff" && role !== "admin" && role !== "superadmin") {
    return {
      session: null,
      errorResponse: NextResponse.json({ error: "Forbidden: Staff or Admin privileges required" }, { status: 403 }),
    };
  }

  return { session, errorResponse: null };
}

/**
 * Ensures request is from any authenticated user (client, staff, admin).
 */
export async function requireAuth(): Promise<GuardResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      session: null,
      errorResponse: NextResponse.json({ error: "Unauthorized: Sign in required" }, { status: 401 }),
    };
  }

  return { session, errorResponse: null };
}
