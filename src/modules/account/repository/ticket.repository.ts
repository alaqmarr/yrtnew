import { db } from "@/infrastructure/db/client";
import { SupportTicket, CreateTicketDto, UpdateTicketDto } from "../domain/ticket.entity";

function mapRowToTicket(row: Record<string, unknown>): SupportTicket {
  return {
    id: String(row.id),
    ticket_number: String(row.ticket_number),
    user_id: row.user_id ? String(row.user_id) : null,
    customer_name: String(row.customer_name),
    customer_email: String(row.customer_email),
    customer_phone: String(row.customer_phone),
    category: (row.category as SupportTicket["category"]) || "General Support",
    priority: (row.priority as SupportTicket["priority"]) || "medium",
    subject: String(row.subject),
    message: String(row.message),
    status: (row.status as SupportTicket["status"]) || "open",
    admin_notes: row.admin_notes ? String(row.admin_notes) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export class TicketRepository {
  async findByUser(userId?: string | null, email?: string | null): Promise<SupportTicket[]> {
    if (!userId && !email) return [];

    let sql = "SELECT * FROM support_tickets WHERE 1=0";
    const args: string[] = [];

    if (userId && email) {
      sql = "SELECT * FROM support_tickets WHERE user_id = ? OR customer_email = ? ORDER BY created_at DESC";
      args.push(userId, email.toLowerCase().trim());
    } else if (userId) {
      sql = "SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC";
      args.push(userId);
    } else if (email) {
      sql = "SELECT * FROM support_tickets WHERE customer_email = ? ORDER BY created_at DESC";
      args.push(email.toLowerCase().trim());
    }

    const res = await db.execute({ sql, args });
    return res.rows.map((r) => mapRowToTicket(r as unknown as Record<string, unknown>));
  }

  async findAll(): Promise<SupportTicket[]> {
    const res = await db.execute({
      sql: "SELECT * FROM support_tickets ORDER BY created_at DESC",
      args: [],
    });
    return res.rows.map((r) => mapRowToTicket(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<SupportTicket | null> {
    const res = await db.execute({
      sql: "SELECT * FROM support_tickets WHERE id = ? LIMIT 1",
      args: [id],
    });
    if (!res.rows[0]) return null;
    return mapRowToTicket(res.rows[0] as unknown as Record<string, unknown>);
  }

  async create(data: CreateTicketDto): Promise<SupportTicket> {
    const id = `tck_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const year = new Date().getFullYear();
    const entropy = `${Date.now().toString(36).slice(-4)}${Math.random().toString(36).substring(2, 6)}`.toUpperCase();
    const ticket_number = `YRT-TCK-${year}-${entropy}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO support_tickets (
              id, ticket_number, user_id, customer_name, customer_email, customer_phone,
              category, priority, subject, message, status, admin_notes, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', NULL, ?, ?)`,
      args: [
        id,
        ticket_number,
        data.user_id ?? null,
        data.customer_name.trim(),
        data.customer_email.trim().toLowerCase(),
        data.customer_phone.trim(),
        data.category || "General Support",
        data.priority || "medium",
        data.subject.trim(),
        data.message.trim(),
        now,
        now,
      ],
    });

    return (await this.findById(id))!;
  }

  async update(id: string, data: UpdateTicketDto): Promise<SupportTicket | null> {
    const now = new Date().toISOString();
    const existing = await this.findById(id);
    if (!existing) return null;

    const newStatus = data.status ?? existing.status;
    const newNotes = data.admin_notes !== undefined ? data.admin_notes : existing.admin_notes;
    const newPriority = data.priority ?? existing.priority;

    await db.execute({
      sql: `UPDATE support_tickets SET status = ?, admin_notes = ?, priority = ?, updated_at = ? WHERE id = ?`,
      args: [newStatus, newNotes, newPriority, now, id],
    });

    return this.findById(id);
  }
}

export const ticketRepository = new TicketRepository();
