import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { paymentService } from "@/modules/payments/service/payment.service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const links = await paymentService.getAllPaymentLinks();
    return NextResponse.json(links);
  } catch (error) {
    console.error("GET /api/payments/links error:", error);
    return NextResponse.json({ error: "Failed to fetch payment links" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { customer_name, customer_phone, amount, purpose } = body;

    if (!customer_name || !customer_phone || !amount || !purpose) {
      return NextResponse.json(
        { error: "Customer name, phone, amount, and purpose are required." },
        { status: 400 }
      );
    }

    const link = await paymentService.createPaymentLink(body);
    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("POST /api/payments/links error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create payment link" },
      { status: 500 }
    );
  }
}
