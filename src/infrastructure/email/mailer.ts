import nodemailer from "nodemailer";
import { siteSettingRepository } from "@/modules/site-settings/repository/site-setting.repository";

export interface EmailOptions {
  to: string;
  cc?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Dynamically resolves SMTP credentials from database site_settings (falling back to process.env)
 */
export async function getEmailTransporter() {
  const settings = await siteSettingRepository.getAllAsMap();

  const host = settings.smtp_host || process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(settings.smtp_port || process.env.SMTP_PORT || 465);
  const secure =
    settings.smtp_secure !== undefined
      ? settings.smtp_secure === "true"
      : process.env.SMTP_SECURE === "true" || port === 465;
  const user = settings.smtp_user || process.env.SMTP_USER || "";
  const pass = settings.smtp_pass || process.env.SMTP_PASS || "";

  if (!user || !pass) {
    return {
      transporter: null,
      configured: false,
      fromName: settings.smtp_from_name || "Yellow Ribbon Travels",
      fromEmail: settings.smtp_from_email || settings.email_primary || "yellowribbontravels@gmail.com",
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  return {
    transporter,
    configured: true,
    fromName: settings.smtp_from_name || "Yellow Ribbon Travels",
    fromEmail: settings.smtp_from_email || user,
  };
}

/**
 * Sends an email using database-configured credentials.
 * If SMTP is not yet configured, logs the message gracefully without breaking lead submission.
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; message: string }> {
  try {
    const { transporter, configured, fromName, fromEmail } = await getEmailTransporter();

    if (!configured || !transporter) {
      console.log("[Mailer Notice] SMTP not configured in database yet. Email skipped for:", options.to, options.subject);
      return { success: false, message: "SMTP credentials not configured in database." };
    }

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: options.to,
      ...(options.cc ? { cc: options.cc } : {}),
      ...(options.replyTo ? { replyTo: options.replyTo } : {}),
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>?/gm, ""),
    });

    return { success: true, message: `Email dispatched successfully (ID: ${info.messageId})` };
  } catch (error) {
    console.error("[Mailer Error]:", error);
    return { success: false, message: (error as Error).message || "Failed to send email" };
  }
}
