import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/modules/payments/service/payment.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, purpose, customer_name, customer_phone, link_code, isTest, mode } = body;

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
    }

    const order = await paymentService.createRazorpayOrder({
      amount: parsedAmount,
      currency: currency || "INR",
      receipt: link_code ? `rcpt_${link_code}` : `rcpt_${Date.now()}`,
      isTest: Boolean(isTest),
      mode: mode || (isTest ? "test" : undefined),
      notes: {
        customer_name: customer_name || "",
        customer_phone: customer_phone || "",
        purpose: purpose || "Travel Booking",
        link_code: link_code || "",
        env: isTest ? "test" : "production",
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("POST /api/payments/create-order error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
