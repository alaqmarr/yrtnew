import { db } from "@/infrastructure/db/client";
import { Booking, CreateBookingDto } from "../domain/booking.entity";

function mapRowToBooking(row: Record<string, unknown>): Booking {
  return {
    id: String(row.id),
    tour_id: row.tour_id ? String(row.tour_id) : null,
    tour_title: row.tour_title ? String(row.tour_title) : undefined,
    user_id: row.user_id ? String(row.user_id) : null,
    family_member_id: row.family_member_id ? String(row.family_member_id) : null,
    customer_name: String(row.customer_name),
    customer_email: String(row.customer_email),
    customer_phone: String(row.customer_phone),
    travel_date: String(row.travel_date),
    travelers_count: Number(row.travelers_count || 1),
    special_requests: row.special_requests ? String(row.special_requests) : null,
    status: row.status as Booking["status"],
    total_amount: row.total_amount ? Number(row.total_amount) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export class BookingRepository {
  async findAll(): Promise<Booking[]> {
    const res = await db.execute(`
      SELECT b.*, t.title as tour_title 
      FROM bookings b 
      LEFT JOIN tours t ON b.tour_id = t.id 
      ORDER BY b.created_at DESC
    `);
    return res.rows.map((r) => mapRowToBooking(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<Booking | null> {
    const res = await db.execute({
      sql: `SELECT b.*, t.title as tour_title 
            FROM bookings b 
            LEFT JOIN tours t ON b.tour_id = t.id 
            WHERE b.id = ? LIMIT 1`,
      args: [id],
    });
    if (!res.rows[0]) return null;
    return mapRowToBooking(res.rows[0] as unknown as Record<string, unknown>);
  }

  async create(data: CreateBookingDto): Promise<Booking> {
    const id = `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO bookings (id, tour_id, user_id, family_member_id, customer_name, customer_email, customer_phone, travel_date, travelers_count, special_requests, status, total_amount, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        data.tour_id ?? null,
        data.user_id ?? null,
        data.family_member_id ?? null,
        data.customer_name ?? "",
        data.customer_email ?? "",
        data.customer_phone ?? "",
        data.travel_date ?? "",
        data.travelers_count ?? 1,
        data.special_requests ?? null,
        "new",
        data.total_amount ?? null,
        now,
        now,
      ],
    });

    return (await this.findById(id))!;
  }

  async updateStatus(id: string, status: Booking["status"]): Promise<Booking> {
    const now = new Date().toISOString();
    await db.execute({
      sql: "UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?",
      args: [status, now, id],
    });
    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM bookings WHERE id = ?",
      args: [id],
    });
    return (res.rowsAffected ?? 0) > 0;
  }
}

export const bookingRepository = new BookingRepository();
