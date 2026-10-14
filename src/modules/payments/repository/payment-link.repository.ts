import { db } from "@/infrastructure/db/client";
import { PaymentLink, CreatePaymentLinkDto, UpdatePaymentLinkStatusDto } from "../domain/payment-link.entity";

function mapRowToPaymentLink(row: Record<string, unknown>): PaymentLink {
  return {
    id: String(row.id),
    link_code: String(row.link_code),
    customer_name: String(row.customer_name),
    customer_email: row.customer_email ? String(row.customer_email) : null,
    customer_phone: String(row.customer_phone),
    amount: Number(row.amount || 0),
    currency: String(row.currency || "INR"),
    purpose: String(row.purpose),
    description: row.description ? String(row.description) : null,
    status: (row.status as PaymentLink["status"]) || "pending",
    razorpay_order_id: row.razorpay_order_id ? String(row.razorpay_order_id) : null,
    razorpay_payment_id: row.razorpay_payment_id ? String(row.razorpay_payment_id) : null,
    paid_at: row.paid_at ? String(row.paid_at) : null,
    expires_at: row.expires_at ? String(row.expires_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export class PaymentLinkRepository {
  async findAll(): Promise<PaymentLink[]> {
    const res = await db.execute("SELECT * FROM payment_links ORDER BY created_at DESC");
    return res.rows.map((r) => mapRowToPaymentLink(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<PaymentLink | null> {
    const res = await db.execute({
      sql: "SELECT * FROM payment_links WHERE id = ? LIMIT 1",
      args: [id],
    });
    if (!res.rows[0]) return null;
    return mapRowToPaymentLink(res.rows[0] as unknown as Record<string, unknown>);
  }

  async findByCode(code: string): Promise<PaymentLink | null> {
    const res = await db.execute({
      sql: "SELECT * FROM payment_links WHERE UPPER(link_code) = UPPER(?) LIMIT 1",
      args: [code.trim()],
    });
    if (!res.rows[0]) return null;
    return mapRowToPaymentLink(res.rows[0] as unknown as Record<string, unknown>);
  }

  async create(data: CreatePaymentLinkDto, linkCode: string): Promise<PaymentLink> {
    const id = `pl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO payment_links (
        id, link_code, customer_name, customer_email, customer_phone, amount, currency,
        purpose, description, status, expires_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
      args: [
        id,
        linkCode,
        data.customer_name,
        data.customer_email ?? null,
        data.customer_phone,
        data.amount,
        data.currency || "INR",
        data.purpose,
        data.description ?? null,
        data.expires_at ?? null,
        now,
        now,
      ],
    });

    return (await this.findById(id))!;
  }

  async updateStatus(data: UpdatePaymentLinkStatusDto): Promise<PaymentLink> {
    const now = new Date().toISOString();
    await db.execute({
      sql: `UPDATE payment_links SET
        status = ?,
        razorpay_order_id = COALESCE(?, razorpay_order_id),
        razorpay_payment_id = COALESCE(?, razorpay_payment_id),
        paid_at = COALESCE(?, paid_at),
        updated_at = ?
      WHERE id = ?`,
      args: [
        data.status,
        data.razorpay_order_id ?? null,
        data.razorpay_payment_id ?? null,
        data.paid_at ?? null,
        now,
        data.id,
      ],
    });

    return (await this.findById(data.id))!;
  }

  async markAsPaid(code: string, paymentId: string, orderId?: string): Promise<PaymentLink | null> {
    const link = await this.findByCode(code);
    if (!link) return null;

    const now = new Date().toISOString();
    await db.execute({
      sql: `UPDATE payment_links SET
        status = 'paid',
        razorpay_payment_id = ?,
        razorpay_order_id = COALESCE(?, razorpay_order_id),
        paid_at = ?,
        updated_at = ?
      WHERE id = ?`,
      args: [paymentId, orderId ?? null, now, now, link.id],
    });

    return (await this.findById(link.id))!;
  }

  async delete(id: string): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM payment_links WHERE id = ?",
      args: [id],
    });
    return (res.rowsAffected ?? 0) > 0;
  }
}

export const paymentLinkRepository = new PaymentLinkRepository();
