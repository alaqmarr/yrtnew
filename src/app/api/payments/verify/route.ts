import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/modules/payments/service/payment.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, paymentId, signature, linkCode, isTest, mode } = body;

    if (!paymentId) {
      return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
    }

    const isValid = await paymentService.verifyPaymentSignature({
      orderId: orderId || "",
      paymentId: paymentId || "",
      signature: signature || "",
      isTest: Boolean(isTest),
      mode: mode || (isTest ? "test" : undefined),
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    // If linked to a payment link, mark it as paid
    if (linkCode) {
      await paymentService.markLinkPaid(linkCode, paymentId, orderId);
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and recorded!",
      paymentId,
      orderId,
    });
  } catch (error) {
    console.error("POST /api/payments/verify error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Verification failed" },
      { status: 500 }
    );
  }
}
