import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { flightInquiryService } from "@/modules/flights/service/flight-inquiry.service";
import { sendEmail } from "@/infrastructure/email/mailer";
import { siteSettingService } from "@/modules/site-settings/service/site-setting.service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inquiries = await flightInquiryService.getAllInquiries();
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("GET /api/flights error:", error);
    return NextResponse.json({ error: "Failed to fetch flight inquiries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await flightInquiryService.submitInquiry(body);

    // Send email notification in background
    siteSettingService.getSetting("email_primary", "yellowribbontravels@gmail.com").then((adminEmail) => {
      sendEmail({
        to: adminEmail,
        subject: `New Flight Inquiry: ${created.from_city} ➔ ${created.to_city} (${created.customer_name})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #06b6d4; margin-top: 0;">New Flight Booking Request</h2>
            <p><strong>Customer:</strong> ${created.customer_name} (${created.customer_phone})</p>
            <p><strong>Route:</strong> ${created.from_city} to ${created.to_city} [${created.trip_type}]</p>
            <p><strong>Dates:</strong> Depart: ${created.depart_date} ${created.return_date ? `| Return: ${created.return_date}` : ""}</p>
            <p><strong>Passengers:</strong> ${created.passengers_adults} Adults, ${created.passengers_children} Children</p>
            <p><strong>Cabin Class:</strong> ${created.cabin_class}</p>
            <p><strong>Notes:</strong> ${created.notes || "None"}</p>
          </div>
        `,
      }).catch((e) => console.log("Flight notify email skipped/error:", e));
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/flights error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to submit flight inquiry" },
      { status: 500 }
    );
  }
}
