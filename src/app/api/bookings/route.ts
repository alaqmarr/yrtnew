import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { bookingService } from "@/modules/bookings/service/booking.service";
import { sendEmail } from "@/infrastructure/email/mailer";
import { siteSettingService } from "@/modules/site-settings/service/site-setting.service";

export async function GET() {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const bookings = await bookingService.getAllBookings();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const session = await getServerSession(authOptions);
    if (session?.user?.id && !body.user_id) {
      body.user_id = session.user.id;
    }

    const created = await bookingService.createBooking(body);

    // Send email notification in background (non-blocking)
    siteSettingService.getSetting("email_primary", "yellowribbontravels@gmail.com").then((adminEmail) => {
      sendEmail({
        to: adminEmail,
        subject: `New Tour Booking Inquiry: ${created.customer_name} (${created.travelers_count} travelers)`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #f59e0b; margin-top: 0;">New Tour Booking Received</h2>
            <p><strong>Customer Name:</strong> ${created.customer_name}</p>
            <p><strong>Email:</strong> ${created.customer_email}</p>
            <p><strong>Phone:</strong> ${created.customer_phone}</p>
            <p><strong>Preferred Travel Date:</strong> ${created.travel_date}</p>
            <p><strong>Travelers:</strong> ${created.travelers_count}</p>
            <p><strong>Special Requests:</strong> ${created.special_requests || "None"}</p>
            <p><strong>Total Estimated Value:</strong> ₹${(created.total_amount || 0).toLocaleString("en-IN")}</p>
          </div>
        `,
      }).catch((e) => console.log("Email notify skipped/error:", e));
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to submit booking" },
      { status: 500 }
    );
  }
}
