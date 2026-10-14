import { db } from "@/infrastructure/db/client";
import { Itinerary, CreateItineraryDto, UpdateItineraryDto } from "../domain/itinerary.entity";

function mapRowToItinerary(row: Record<string, unknown>): Itinerary {
  return {
    id: String(row.id),
    reference_no: String(row.reference_no),
    user_id: row.user_id ? String(row.user_id) : null,
    client_name: String(row.client_name),
    client_email: row.client_email ? String(row.client_email) : null,
    client_phone: String(row.client_phone),
    destination: String(row.destination),
    title: String(row.title),
    start_date: row.start_date ? String(row.start_date) : null,
    duration_days: Number(row.duration_days || 1),
    duration_nights: Number(row.duration_nights || 1),
    travelers_count: Number(row.travelers_count || 2),
    hotel_details: row.hotel_details ? String(row.hotel_details) : null,
    flights_json: String(row.flights_json || "[]"),
    days_json: String(row.days_json || "[]"),
    inclusions_json: String(row.inclusions_json || "[]"),
    exclusions_json: String(row.exclusions_json || "[]"),
    total_price: Number(row.total_price || 0),
    currency: String(row.currency || "INR"),
    status: (row.status as Itinerary["status"]) || "Draft",
    notes: row.notes ? String(row.notes) : null,
    vehicle: row.vehicle ? String(row.vehicle) : "Toyota Etios",
    pax_label: row.pax_label ? String(row.pax_label) : "2 Adults",
    price_per_person: row.price_per_person !== undefined && row.price_per_person !== null ? Number(row.price_per_person) : null,
    accommodations_json: row.accommodations_json ? String(row.accommodations_json) : "[]",
    package_highlights_json: row.package_highlights_json ? String(row.package_highlights_json) : "[]",
    important_notes_json: row.important_notes_json ? String(row.important_notes_json) : "[]",
    cost_breakdown_json: row.cost_breakdown_json ? String(row.cost_breakdown_json) : "[]",
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export class ItineraryRepository {
  async findAll(): Promise<Itinerary[]> {
    const res = await db.execute("SELECT * FROM itineraries ORDER BY created_at DESC");
    return res.rows.map((r) => mapRowToItinerary(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<Itinerary | null> {
    const res = await db.execute({
      sql: "SELECT * FROM itineraries WHERE id = ? OR reference_no = ? LIMIT 1",
      args: [id, id],
    });
    if (!res.rows[0]) return null;
    return mapRowToItinerary(res.rows[0] as unknown as Record<string, unknown>);
  }

  async findByUserId(userId: string): Promise<Itinerary[]> {
    const res = await db.execute({
      sql: "SELECT * FROM itineraries WHERE user_id = ? ORDER BY created_at DESC",
      args: [userId],
    });
    return res.rows.map((r) => mapRowToItinerary(r as unknown as Record<string, unknown>));
  }

  async create(data: CreateItineraryDto, refNo: string): Promise<Itinerary> {
    const id = `itin_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO itineraries (
        id, reference_no, user_id, client_name, client_email, client_phone, destination, title,
        start_date, duration_days, duration_nights, travelers_count, hotel_details,
        flights_json, days_json, inclusions_json, exclusions_json, total_price, currency,
        status, notes, vehicle, pax_label, price_per_person, accommodations_json,
        package_highlights_json, important_notes_json, cost_breakdown_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        refNo,
        data.user_id ?? null,
        data.client_name,
        data.client_email ?? null,
        data.client_phone,
        data.destination,
        data.title,
        data.start_date ?? null,
        data.duration_days || 1,
        data.duration_nights || 1,
        data.travelers_count || 2,
        data.hotel_details ?? null,
        data.flights_json || "[]",
        data.days_json,
        data.inclusions_json || "[]",
        data.exclusions_json || "[]",
        data.total_price || 0,
        data.currency || "INR",
        data.status || "Active",
        data.notes ?? null,
        data.vehicle ?? "Toyota Etios",
        data.pax_label ?? `${data.travelers_count || 2} Adults`,
        data.price_per_person ?? null,
        data.accommodations_json ?? "[]",
        data.package_highlights_json ?? "[]",
        data.important_notes_json ?? "[]",
        data.cost_breakdown_json ?? "[]",
        now,
        now,
      ],
    });

    return (await this.findById(id))!;
  }

  async update(data: UpdateItineraryDto): Promise<Itinerary> {
    const existing = await this.findById(data.id);
    if (!existing) throw new Error("Itinerary not found");

    const updated = { ...existing, ...data };
    const now = new Date().toISOString();

    await db.execute({
      sql: `UPDATE itineraries SET
        user_id = COALESCE(?, user_id),
        client_name = ?, client_email = ?, client_phone = ?, destination = ?, title = ?,
        start_date = ?, duration_days = ?, duration_nights = ?, travelers_count = ?,
        hotel_details = ?, flights_json = ?, days_json = ?, inclusions_json = ?,
        exclusions_json = ?, total_price = ?, currency = ?, status = ?, notes = ?,
        vehicle = ?, pax_label = ?, price_per_person = ?, accommodations_json = ?,
        package_highlights_json = ?, important_notes_json = ?, cost_breakdown_json = ?, updated_at = ?
      WHERE id = ?`,
      args: [
        data.user_id ?? null,
        updated.client_name,
        updated.client_email,
        updated.client_phone,
        updated.destination,
        updated.title,
        updated.start_date,
        updated.duration_days,
        updated.duration_nights,
        updated.travelers_count,
        updated.hotel_details,
        updated.flights_json,
        updated.days_json,
        updated.inclusions_json,
        updated.exclusions_json,
        updated.total_price,
        updated.currency,
        updated.status,
        updated.notes,
        updated.vehicle ?? "Toyota Etios",
        updated.pax_label ?? `${updated.travelers_count || 2} Adults`,
        updated.price_per_person ?? null,
        updated.accommodations_json ?? "[]",
        updated.package_highlights_json ?? "[]",
        updated.important_notes_json ?? "[]",
        updated.cost_breakdown_json ?? "[]",
        now,
        data.id,
      ],
    });

    return (await this.findById(data.id))!;
  }

  async delete(id: string): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM itineraries WHERE id = ?",
      args: [id],
    });
    return (res.rowsAffected ?? 0) > 0;
  }
}

export const itineraryRepository = new ItineraryRepository();
