import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { ticketRepository } from "@/modules/account/repository/ticket.repository";
import { TicketCategory, TicketPriority } from "@/modules/account/domain/ticket.entity";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    const email = session.user.email;
    const tickets = await ticketRepository.findByUser(userId, email);

    return NextResponse.json({ success: true, tickets });
  } catch (err: unknown) {
    console.error("Fetch tickets API error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { category, priority, subject, message, customer_name, customer_email, customer_phone } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    const name = customer_name || session?.user?.name || "Traveler";
    const email = customer_email || session?.user?.email || "";
    const phone = customer_phone || (session?.user as { phone?: string })?.phone || "";
    const userId = session?.user ? (session.user as { id?: string }).id : null;

    if (!email) {
      return NextResponse.json(
        { error: "An email address is required to receive support ticket updates" },
        { status: 400 }
      );
    }

    const ticket = await ticketRepository.create({
      user_id: userId,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      category: (category as TicketCategory) || "General Support",
      priority: (priority as TicketPriority) || "medium",
      subject,
      message,
    });

    return NextResponse.json({
      success: true,
      message: `Support ticket ${ticket.ticket_number} created successfully. Our concierge desk is reviewing it.`,
      ticket,
    });
  } catch (err: unknown) {
    console.error("Create ticket API error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
