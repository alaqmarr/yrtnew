import { db } from "@/infrastructure/db/client";
import { Invoice, CreateInvoiceDto, UpdateInvoiceDto } from "../domain/invoice.entity";

function mapRowToInvoice(row: Record<string, unknown>): Invoice {
  return {
    id: String(row.id),
    invoice_number: String(row.invoice_number),
    type: (row.type as Invoice["type"]) || "Invoice",
    client_name: String(row.client_name),
    client_email: row.client_email ? String(row.client_email) : null,
    client_phone: String(row.client_phone),
    client_address: row.client_address ? String(row.client_address) : null,
    items_json: String(row.items_json || "[]"),
    subtotal: Number(row.subtotal || 0),
    tax_percent: Number(row.tax_percent || 0),
    tax_amount: Number(row.tax_amount || 0),
    discount_amount: Number(row.discount_amount || 0),
    total_amount: Number(row.total_amount || 0),
    currency: String(row.currency || "INR"),
    status: (row.status as Invoice["status"]) || "Draft",
    due_date: row.due_date ? String(row.due_date) : null,
    notes: row.notes ? String(row.notes) : null,
    terms: row.terms ? String(row.terms) : null,
    payment_link_id: row.payment_link_id ? String(row.payment_link_id) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export class InvoiceRepository {
  async findAll(): Promise<Invoice[]> {
    const res = await db.execute("SELECT * FROM invoices ORDER BY created_at DESC");
    return res.rows.map((r) => mapRowToInvoice(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<Invoice | null> {
    const res = await db.execute({
      sql: "SELECT * FROM invoices WHERE id = ? OR invoice_number = ? LIMIT 1",
      args: [id, id],
    });
    if (!res.rows[0]) return null;
    return mapRowToInvoice(res.rows[0] as unknown as Record<string, unknown>);
  }

  async create(data: CreateInvoiceDto, invoiceNumber: string): Promise<Invoice> {
    const id = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO invoices (
        id, invoice_number, type, client_name, client_email, client_phone, client_address,
        items_json, subtotal, tax_percent, tax_amount, discount_amount, total_amount,
        currency, status, due_date, notes, terms, payment_link_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        invoiceNumber,
        data.type || "Invoice",
        data.client_name,
        data.client_email ?? null,
        data.client_phone,
        data.client_address ?? null,
        data.items_json,
        data.subtotal,
        data.tax_percent ?? 5,
        data.tax_amount ?? 0,
        data.discount_amount ?? 0,
        data.total_amount,
        data.currency || "INR",
        data.status || "Draft",
        data.due_date ?? null,
        data.notes ?? null,
        data.terms ?? null,
        data.payment_link_id ?? null,
        now,
        now,
      ],
    });

    return (await this.findById(id))!;
  }

  async update(data: UpdateInvoiceDto): Promise<Invoice> {
    const existing = await this.findById(data.id);
    if (!existing) throw new Error("Invoice not found");

    const updated = { ...existing, ...data };
    const now = new Date().toISOString();

    await db.execute({
      sql: `UPDATE invoices SET
        type = ?, client_name = ?, client_email = ?, client_phone = ?, client_address = ?,
        items_json = ?, subtotal = ?, tax_percent = ?, tax_amount = ?, discount_amount = ?,
        total_amount = ?, currency = ?, status = ?, due_date = ?, notes = ?, terms = ?,
        payment_link_id = ?, updated_at = ?
      WHERE id = ?`,
      args: [
        updated.type,
        updated.client_name,
        updated.client_email,
        updated.client_phone,
        updated.client_address,
        updated.items_json,
        updated.subtotal,
        updated.tax_percent,
        updated.tax_amount,
        updated.discount_amount,
        updated.total_amount,
        updated.currency,
        updated.status,
        updated.due_date,
        updated.notes,
        updated.terms,
        updated.payment_link_id,
        now,
        data.id,
      ],
    });

    return (await this.findById(data.id))!;
  }

  async delete(id: string): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM invoices WHERE id = ?",
      args: [id],
    });
    return (res.rowsAffected ?? 0) > 0;
  }
}

export const invoiceRepository = new InvoiceRepository();
