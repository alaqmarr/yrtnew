import { NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { ticketRepository } from "@/modules/account/repository/ticket.repository";

export async function GET() {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const tickets = await ticketRepository.findAll();
    return NextResponse.json(tickets);
  } catch (err: unknown) {
    console.error("Admin tickets API error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
