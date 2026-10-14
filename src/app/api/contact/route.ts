import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { contactService } from "@/modules/contact/service/contact.service";
import { branchService } from "@/modules/branches/service/branch.service";
import { sendEmail } from "@/infrastructure/email/mailer";
import { siteSettingService } from "@/modules/site-settings/service/site-setting.service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await contactService.getAllMessages();
    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await contactService.sendMessage(body);

    // Dispatch emails to concerned branch manager & head office asynchronously
    (async () => {
      try {
        const adminEmail = await siteSettingService.getSetting(
          "email_primary",
          "yellowribbontravels@gmail.com"
        );

        let branch = null;
        if (created.branch_id) {
          branch = await branchService.getBranchById(created.branch_id);
        }

        const concernedPerson = branch?.manager_name || "Branch Manager / Operations Desk";
        const branchTitle = branch
          ? `${branch.city} (${branch.branch_type})`
          : "Secunderabad (Head Office)";
        const targetEmail =
          branch?.email && branch.email.includes("@") ? branch.email : adminEmail;
        const ccEmail = targetEmail.toLowerCase() !== adminEmail.toLowerCase() ? adminEmail : undefined;

        // 1. Dispatch internal lead notification to concerned branch person
        await sendEmail({
          to: targetEmail,
          cc: ccEmail,
          replyTo: created.email,
          subject: `[New Lead - ${branchTitle}] ${created.subject} from ${created.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
              <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 12px; margin-bottom: 16px;">
                <h2 style="color: #0f172a; margin: 0; font-size: 20px;">Yellow Ribbon Travels - Web Inquiry</h2>
                <p style="color: #64748b; margin: 4px 0 0 0; font-size: 13px;">
                  Assigned Desk: <strong>${concernedPerson}</strong> • ${branchTitle}
                </p>
              </div>

              <div style="background: #f8fafc; padding: 16px; border-radius: 12px; margin-bottom: 16px;">
                <p style="margin: 6px 0;"><strong>Customer Name:</strong> ${created.name}</p>
                <p style="margin: 6px 0;"><strong>Email Address:</strong> <a href="mailto:${created.email}">${created.email}</a></p>
                <p style="margin: 6px 0;"><strong>Phone / WhatsApp:</strong> <a href="tel:${created.phone}">${created.phone}</a> | <a href="https://wa.me/${created.phone.replace(/[^0-9]/g, "")}">WhatsApp Direct</a></p>
                <p style="margin: 6px 0;"><strong>Subject:</strong> ${created.subject}</p>
                <p style="margin: 6px 0;"><strong>Assigned Branch:</strong> ${branchTitle}</p>
                ${branch?.phone ? `<p style="margin: 6px 0;"><strong>Branch Phone:</strong> ${branch.phone}</p>` : ""}
              </div>

              <div style="margin-bottom: 16px;">
                <p style="font-weight: bold; margin-bottom: 6px; color: #334155;">Customer Message:</p>
                <blockquote style="background: #fffbeb; border-left: 4px solid #f59e0b; margin: 0; padding: 14px; border-radius: 6px; color: #1e293b; font-size: 14px; line-height: 1.5;">
                  ${created.message.replace(/\n/g, "<br/>")}
                </blockquote>
              </div>

              <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                Timestamp: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST • Reply directly to this email to contact the customer.
              </div>
            </div>
          `,
        });

        // 2. Dispatch automated acknowledgement to customer
        if (created.email && created.email.includes("@")) {
          await sendEmail({
            to: created.email,
            subject: `Thank you for contacting Yellow Ribbon Travels - We have received your inquiry`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h2 style="color: #f59e0b; margin: 0; font-size: 22px;">Yellow Ribbon Travels</h2>
                  <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Tailored Holidays, Flight Bookings & Global Vacations</p>
                </div>

                <p style="color: #1e293b; font-size: 15px;">Dear <strong>${created.name}</strong>,</p>
                <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                  Thank you for reaching out to Yellow Ribbon Travels. Your travel inquiry regarding <em>"${created.subject}"</em> has been assigned directly to our <strong>${branchTitle}</strong> team.
                </p>

                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 12px; margin: 16px 0;">
                  <p style="color: #166534; font-size: 13px; margin: 0 0 4px 0; font-weight: bold;">Your Assigned Travel Consultant:</p>
                  <p style="color: #15803d; font-size: 14px; margin: 0;"><strong>${concernedPerson}</strong> (${branchTitle})</p>
                  ${branch?.phone ? `<p style="color: #15803d; font-size: 13px; margin: 4px 0 0 0;">Branch Phone: ${branch.phone}</p>` : ""}
                </div>

                <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                  Our tour specialist will review your requirements and reach out to you within 2 to 4 business hours.
                </p>

                <div style="text-align: center; margin-top: 24px;">
                  <a href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels,%20I%20have%20submitted%20an%20inquiry%20regarding%20${encodeURIComponent(created.subject)}" style="background: #25D366; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                    Chat with Concierge on WhatsApp
                  </a>
                </div>

                <div style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; text-align: center;">
                  Head Office: 2-2-51, Mittal Chambers, M.G. Road, Secunderabad, Telangana - 500003<br/>
                  Phone: +91 91002 28152 | Email: yellowribbontravels@gmail.com
                </div>
              </div>
            `,
          });
        }
      } catch (emailErr) {
        console.error("Error dispatching contact notifications:", emailErr);
      }
    })();

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to send message" },
      { status: 500 }
    );
  }
}
