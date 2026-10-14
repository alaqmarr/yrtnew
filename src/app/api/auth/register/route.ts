import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/infrastructure/db/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? phone.trim() : "";

    // Check if user with email already exists
    const existing = await db.execute({
      sql: "SELECT id, role FROM users WHERE LOWER(email) = ? LIMIT 1",
      args: [cleanEmail],
    });

    if (existing.rows[0]) {
      const existingUser = existing.rows[0];
      // If client account was auto-provisioned from quotation or booking
      if (String(existingUser.role) === "client") {
        if (password.length < 6) {
          return NextResponse.json(
            { error: "Password must be at least 6 characters long" },
            { status: 400 }
          );
        }
        const passwordHash = await bcrypt.hash(password, 10);
        await db.execute({
          sql: `UPDATE users SET 
                  password_hash = ?, 
                  name = COALESCE(NULLIF(?, ''), name), 
                  phone = COALESCE(NULLIF(?, ''), phone),
                  is_active = 1 
                WHERE id = ?`,
          args: [passwordHash, name.trim(), cleanPhone, existingUser.id],
        });
        return NextResponse.json({
          success: true,
          message: "Welcome back! Your traveler account and quotations are now active and ready.",
          user: {
            id: String(existingUser.id),
            name: name.trim(),
            email: cleanEmail,
            phone: cleanPhone,
            role: "client",
          },
        });
      }

      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO users (id, email, password_hash, name, phone, role, created_at)
            VALUES (?, ?, ?, ?, ?, 'client', ?)`,
      args: [id, cleanEmail, passwordHash, name.trim(), cleanPhone, now],
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully! You can now sign in.",
      user: {
        id,
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        role: "client",
      },
    });
  } catch (err: unknown) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
