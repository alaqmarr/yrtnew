import { db } from "@/infrastructure/db/client";
import { ContactMessage, CreateContactDto } from "../domain/contact.entity";

function mapRowToContactMessage(row: Record<string, unknown>): ContactMessage {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone),
    subject: String(row.subject),
    message: String(row.message),
    branch_id: row.branch_id ? String(row.branch_id) : null,
    branch_city: row.branch_city ? String(row.branch_city) : undefined,
    status: row.status as ContactMessage["status"],
    created_at: String(row.created_at),
  };
}

export class ContactRepository {
  async findAll(): Promise<ContactMessage[]> {
    const res = await db.execute(`
      SELECT c.*, b.city as branch_city 
      FROM contact_messages c 
      LEFT JOIN branches b ON c.branch_id = b.id 
      ORDER BY c.created_at DESC
    `);
    return res.rows.map((r) => mapRowToContactMessage(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<ContactMessage | null> {
    const res = await db.execute({
      sql: `SELECT c.*, b.city as branch_city 
            FROM contact_messages c 
            LEFT JOIN branches b ON c.branch_id = b.id 
            WHERE c.id = ? LIMIT 1`,
      args: [id],
    });
    if (!res.rows[0]) return null;
    return mapRowToContactMessage(res.rows[0] as unknown as Record<string, unknown>);
  }

  async create(data: CreateContactDto): Promise<ContactMessage> {
    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO contact_messages (id, name, email, phone, subject, message, branch_id, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        data.name ?? "",
        data.email ?? "",
        data.phone ?? "",
        data.subject ?? "",
        data.message ?? "",
        data.branch_id ?? null,
        "new",
        now,
      ],
    });

    return (await this.findById(id))!;
  }

  async updateStatus(id: string, status: ContactMessage["status"]): Promise<ContactMessage> {
    await db.execute({
      sql: "UPDATE contact_messages SET status = ? WHERE id = ?",
      args: [status, id],
    });
    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM contact_messages WHERE id = ?",
      args: [id],
    });
    return (res.rowsAffected ?? 0) > 0;
  }
}

export const contactRepository = new ContactRepository();
