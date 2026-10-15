import { db } from "@/infrastructure/db/client";
import { FlightInquiry, CreateFlightInquiryDto } from "../domain/flight-inquiry.entity";

function mapRowToFlightInquiry(row: Record<string, unknown>): FlightInquiry {
  return {
    id: String(row.id),
    trip_type: row.trip_type as FlightInquiry["trip_type"],
    user_id: row.user_id ? String(row.user_id) : null,
    family_member_id: row.family_member_id ? String(row.family_member_id) : null,
    from_city: String(row.from_city),
    to_city: String(row.to_city),
    depart_date: String(row.depart_date),
    return_date: row.return_date ? String(row.return_date) : null,
    passengers_adults: Number(row.passengers_adults || 1),
    passengers_children: Number(row.passengers_children || 0),
    passengers_infants: Number(row.passengers_infants || 0),
    cabin_class: row.cabin_class as FlightInquiry["cabin_class"],
    preferred_airline: row.preferred_airline ? String(row.preferred_airline) : null,
    customer_name: String(row.customer_name),
    customer_email: String(row.customer_email),
    customer_phone: String(row.customer_phone),
    status: row.status as FlightInquiry["status"],
    notes: row.notes ? String(row.notes) : null,
    created_at: String(row.created_at),
  };
}

export class FlightInquiryRepository {
  async findAll(): Promise<FlightInquiry[]> {
    const res = await db.execute("SELECT * FROM flight_inquiries ORDER BY created_at DESC");
    return res.rows.map((r) => mapRowToFlightInquiry(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<FlightInquiry | null> {
    const res = await db.execute({
      sql: "SELECT * FROM flight_inquiries WHERE id = ? LIMIT 1",
      args: [id],
    });
    if (!res.rows[0]) return null;
    return mapRowToFlightInquiry(res.rows[0] as unknown as Record<string, unknown>);
  }

  async create(data: CreateFlightInquiryDto): Promise<FlightInquiry> {
    const id = `flt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO flight_inquiries (
        id, trip_type, user_id, family_member_id, from_city, to_city, depart_date, return_date,
        passengers_adults, passengers_children, passengers_infants,
        cabin_class, preferred_airline, customer_name, customer_email, customer_phone, status, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        data.trip_type ?? "roundtrip",
        data.user_id ?? null,
        data.family_member_id ?? null,
        data.from_city ?? "",
        data.to_city ?? "",
        data.depart_date ?? "",
        data.return_date ?? null,
        data.passengers_adults ?? 1,
        data.passengers_children ?? 0,
        data.passengers_infants ?? 0,
        data.cabin_class ?? "Economy",
        data.preferred_airline ?? null,
        data.customer_name ?? "",
        data.customer_email ?? "",
        data.customer_phone ?? "",
        "new",
        data.notes ?? null,
        now,
      ],
    });

    return (await this.findById(id))!;
  }

  async updateStatus(id: string, status: FlightInquiry["status"], notes?: string): Promise<FlightInquiry> {
    let sql = "UPDATE flight_inquiries SET status = ?";
    const args: (string | null)[] = [status];

    if (notes !== undefined) {
      sql += ", notes = ?";
      args.push(notes);
    }
    sql += " WHERE id = ?";
    args.push(id);

    await db.execute({ sql, args });
    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM flight_inquiries WHERE id = ?",
      args: [id],
    });
    return (res.rowsAffected ?? 0) > 0;
  }
}

export const flightInquiryRepository = new FlightInquiryRepository();
