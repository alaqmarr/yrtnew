import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { sendEmail } from "@/infrastructure/email/mailer";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetEmail } = await req.json();
    if (!targetEmail) {
      return NextResponse.json({ error: "Target email is required" }, { status: 400 });
    }

    const result = await sendEmail({
      to: targetEmail,
      subject: "Test Email from Yellow Ribbon Travels Admin",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #f59e0b; margin-top: 0;">Yellow Ribbon Travels</h2>
          <p>This is a test notification verifying that your database-configured SMTP credentials (Nodemailer / Gmail) are operating correctly!</p>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">Dispatched on ${new Date().toLocaleString("en-IN")}</p>
        </div>
      `,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to send test email" },
      { status: 500 }
    );
  }
}
