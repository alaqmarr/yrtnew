import crypto from "crypto";
import Razorpay from "razorpay";
import { siteSettingService } from "@/modules/site-settings/service/site-setting.service";
import { paymentLinkRepository } from "../repository/payment-link.repository";
import { PaymentLink, CreatePaymentLinkDto } from "../domain/payment-link.entity";
import { contactService } from "@/modules/contacts/service/contact.service";

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  enabled: boolean;
  currency: string;
  mode: "live" | "test";
  isSimulated?: boolean;
}

export class PaymentService {
  async getRazorpayConfig(forcedMode?: "live" | "test"): Promise<RazorpayConfig> {
    // Strictly controlled via database site_settings
    const globalMode = (await siteSettingService.getSetting("razorpay_mode", "live")).toLowerCase();
    const effectiveMode: "live" | "test" = forcedMode || (globalMode === "test" ? "test" : "live");

    let keyId = "";
    let keySecret = "";

    if (effectiveMode === "live") {
      keyId =
        (await siteSettingService.getSetting("razorpay_key_id_live")) ||
        (await siteSettingService.getSetting("razorpay_key_id")) ||
        "";
      keySecret =
        (await siteSettingService.getSetting("razorpay_key_secret_live")) ||
        (await siteSettingService.getSetting("razorpay_key_secret")) ||
        "";
    } else {
      // Test Mode (from database)
      keyId =
        (await siteSettingService.getSetting("razorpay_key_id_test")) ||
        "rzp_test_YellowRibbonTravels";
      keySecret =
        (await siteSettingService.getSetting("razorpay_key_secret_test")) ||
        "rzp_sec_TravelsYRT910022";
    }

    const enabled = (await siteSettingService.getSetting("razorpay_enabled")) !== "false";
    const currency = (await siteSettingService.getSetting("razorpay_currency")) || "INR";

    return { keyId: keyId.trim(), keySecret: keySecret.trim(), enabled, currency, mode: effectiveMode };
  }

  private async getRazorpayInstance(forcedMode?: "live" | "test"): Promise<{ instance: Razorpay; config: RazorpayConfig }> {
    const config = await this.getRazorpayConfig(forcedMode);
    const instance = new Razorpay({
      key_id: config.keyId,
      key_secret: config.keySecret,
    });
    return { instance, config };
  }

  async createRazorpayOrder(params: {
    amount: number; // in Rupees / standard currency units
    currency?: string;
    receipt?: string;
    notes?: Record<string, string>;
    isTest?: boolean;
    mode?: "live" | "test";
  }): Promise<{ orderId: string; amount: number; currency: string; keyId: string; mode: "live" | "test" }> {
    const targetMode: "live" | "test" | undefined = params.mode || (params.isTest ? "test" : undefined);
    const { instance, config } = await this.getRazorpayInstance(targetMode);

    if (!config.enabled) {
      throw new Error("Online payments are currently disabled in settings.");
    }

    if (!config.keyId || !config.keySecret) {
      throw new Error("Razorpay API credentials are not configured.");
    }

    const currency = params.currency || config.currency;
    const amountInSubunits = Math.round(params.amount * 100); // In paise for INR

    try {
      const order = await instance.orders.create({
        amount: amountInSubunits,
        currency: currency,
        receipt: (params.receipt || `rcpt_${Date.now()}`).substring(0, 40),
        notes: params.notes || {},
      });

      return {
        orderId: order.id,
        amount: params.amount,
        currency,
        keyId: config.keyId,
        mode: config.mode,
      };
    } catch (error) {
      console.warn("Razorpay API order creation notice:", (error as Error).message || error);
      // Only allow local development fallback when explicitly in dev environment with non-live keys
      if (process.env.NODE_ENV !== "production" && config.mode === "test") {
        const simulatedOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        return {
          orderId: simulatedOrderId,
          amount: params.amount,
          currency,
          keyId: config.keyId,
          mode: config.mode,
        };
      }
      throw error;
    }
  }

  async verifyPaymentSignature(params: {
    orderId: string;
    paymentId: string;
    signature: string;
    isTest?: boolean;
    mode?: "live" | "test";
  }): Promise<boolean> {
    const targetMode: "live" | "test" | undefined = params.mode || (params.isTest ? "test" : undefined);
    const config = await this.getRazorpayConfig(targetMode);

    if (!params.paymentId || !params.orderId) {
      return false;
    }

    // Only allow simulated bypass in local dev test mode when key is empty or placeholder mock
    const isMockLocalDev =
      process.env.NODE_ENV !== "production" &&
      config.mode === "test" &&
      (!config.keySecret || config.keySecret.includes("mock") || config.keySecret === "placeholder");

    if (
      isMockLocalDev &&
      (params.orderId?.startsWith("order_sim_") || params.paymentId?.startsWith("pay_sim_"))
    ) {
      return true;
    }

    if (!config.keySecret || !params.signature) {
      return false;
    }

    try {
      const generatedSignature = crypto
        .createHmac("sha256", config.keySecret)
        .update(`${params.orderId}|${params.paymentId}`)
        .digest("hex");

      const a = Buffer.from(generatedSignature);
      const b = Buffer.from(params.signature);
      if (a.length !== b.length) return false;
      return crypto.timingSafeEqual(a, b);
    } catch (err) {
      console.error("Signature verification error:", err);
      return false;
    }
  }

  async createPaymentLink(data: CreatePaymentLinkDto): Promise<PaymentLink> {
    const prefix = "PAY";
    const randomSuffix = `${Date.now().toString(36).slice(-4)}${Math.random().toString(36).substring(2, 6)}`.toUpperCase();
    const cleanPurpose = data.purpose
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 6)
      .toUpperCase();

    const linkCode = `${prefix}-${cleanPurpose || "BOOKING"}-${randomSuffix}`;
    const created = await paymentLinkRepository.create(data, linkCode);

    contactService
      .recordCustomerActivity({
        name: data.customer_name,
        phone: data.customer_phone,
        email: data.customer_email,
        amount: data.amount,
        isPaid: false,
        source: "Razorpay Link",
        notes: `Payment link created: ${linkCode} (${data.purpose})`,
      })
      .catch((err) =>
        console.error("Auto-recording contact for payment link failed:", err)
      );

    return created;
  }

  async getAllPaymentLinks(): Promise<PaymentLink[]> {
    return paymentLinkRepository.findAll();
  }

  async getPaymentLinkByCode(code: string): Promise<PaymentLink | null> {
    return paymentLinkRepository.findByCode(code);
  }

  async getPaymentLinkById(id: string): Promise<PaymentLink | null> {
    return paymentLinkRepository.findById(id);
  }

  async markLinkPaid(code: string, paymentId: string, orderId?: string): Promise<PaymentLink | null> {
    const updated = await paymentLinkRepository.markAsPaid(code, paymentId, orderId);
    if (updated) {
      contactService
        .recordCustomerActivity({
          name: updated.customer_name,
          phone: updated.customer_phone,
          email: updated.customer_email,
          amount: updated.amount,
          isPaid: true,
          source: "Razorpay Online Settlement",
          notes: `Payment settled: ₹${updated.amount} for ${updated.purpose} (Txn: ${paymentId})`,
        })
        .catch((err) =>
          console.error("Auto-updating contact for paid payment link failed:", err)
        );
    }
    return updated;
  }

  async recordCustomPayment(data: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string | null;
    amount: number;
    currency?: string;
    purpose: string;
    description?: string | null;
    razorpay_order_id?: string | null;
    razorpay_payment_id: string;
    link_code?: string;
  }): Promise<PaymentLink> {
    const linkCode =
      data.link_code || `PAY-${data.razorpay_payment_id.slice(-6).toUpperCase()}`;
    const created = await paymentLinkRepository.createPaid(data, linkCode);
    contactService
      .recordCustomerActivity({
        name: data.customer_name,
        phone: data.customer_phone,
        email: data.customer_email ?? undefined,
        amount: data.amount,
        isPaid: true,
        source: "Razorpay Custom Payment",
        notes: `Payment settled: ₹${data.amount} for ${data.purpose} (Txn: ${data.razorpay_payment_id})`,
      })
      .catch((err) =>
        console.error("Auto-recording contact for custom payment failed:", err)
      );
    return created;
  }


  async deletePaymentLink(id: string): Promise<boolean> {
    return paymentLinkRepository.delete(id);
  }
}

export const paymentService = new PaymentService();
