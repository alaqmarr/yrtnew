import { db } from "@/infrastructure/db/client";
import { Tour, CreateTourDto, UpdateTourDto, TourFilterOptions } from "../domain/tour.entity";

function parseJsonArray<T>(val: unknown, fallback: T[]): T[] {
  if (!val) return fallback;
  try {
    return JSON.parse(String(val)) as T[];
  } catch {
    return fallback;
  }
}

function mapRowToTour(row: Record<string, unknown>): Tour {
  return {
    id: String(row.id),
    destination_id: row.destination_id ? String(row.destination_id) : null,
    destination_name: row.destination_name ? String(row.destination_name) : undefined,
    slug: String(row.slug),
    title: String(row.title),
    subtitle: row.subtitle ? String(row.subtitle) : null,
    duration_days: Number(row.duration_days || 1),
    duration_nights: Number(row.duration_nights || 0),
    price: Number(row.price || 0),
    original_price: row.original_price ? Number(row.original_price) : null,
    featured: Boolean(row.featured),
    category: String(row.category || "Holidays"),
    tour_type: String(row.tour_type || "Customized Tour"),
    overview: String(row.overview || ""),
    highlights: parseJsonArray<string>(row.highlights_json, []),
    inclusions: parseJsonArray<string>(row.inclusions_json, []),
    exclusions: parseJsonArray<string>(row.exclusions_json, []),
    itinerary: parseJsonArray(row.itinerary_json, []),
    images: parseJsonArray<string>(row.images_json, []),
    departure_dates: parseJsonArray<string>(row.departure_dates_json, ["On Request"]),
    rating: Number(row.rating || 4.9),
    review_count: Number(row.review_count || 10),
    max_group_size: Number(row.max_group_size || 15),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export class TourRepository {
  async findAll(options?: TourFilterOptions): Promise<Tour[]> {
    let sql = `
      SELECT t.*, d.name as destination_name 
      FROM tours t 
      LEFT JOIN destinations d ON t.destination_id = d.id 
      WHERE 1=1
    `;
    const args: (string | number)[] = [];

    if (options?.destinationId) {
      sql += " AND t.destination_id = ?";
      args.push(options.destinationId);
    }
    if (options?.destinationSlug) {
      sql += " AND d.slug = ?";
      args.push(options.destinationSlug);
    }
    if (options?.featuredOnly) {
      sql += " AND t.featured = 1";
    }
    if (options?.category && options.category !== "All") {
      sql += " AND t.category LIKE ?";
      args.push(`%${options.category}%`);
    }
    if (options?.minPrice) {
      sql += " AND t.price >= ?";
      args.push(options.minPrice);
    }
    if (options?.maxPrice) {
      sql += " AND t.price <= ?";
      args.push(options.maxPrice);
    }
    if (options?.search) {
      sql += " AND (t.title LIKE ? OR t.overview LIKE ? OR d.name LIKE ?)";
      const pattern = `%${options.search}%`;
      args.push(pattern, pattern, pattern);
    }

    sql += " ORDER BY t.featured DESC, t.price ASC";

    const res = await db.execute({ sql, args });
    return res.rows.map((r) => mapRowToTour(r as unknown as Record<string, unknown>));
  }

  async findFeatured(limit = 6): Promise<Tour[]> {
    const res = await db.execute({
      sql: `SELECT t.*, d.name as destination_name 
            FROM tours t 
            LEFT JOIN destinations d ON t.destination_id = d.id 
            WHERE t.featured = 1 
            ORDER BY t.rating DESC, t.price ASC 
            LIMIT ?`,
      args: [limit],
    });
    return res.rows.map((r) => mapRowToTour(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<Tour | null> {
    const res = await db.execute({
      sql: `SELECT t.*, d.name as destination_name 
            FROM tours t 
            LEFT JOIN destinations d ON t.destination_id = d.id 
            WHERE t.id = ? LIMIT 1`,
      args: [id],
    });
    if (!res.rows[0]) return null;
    return mapRowToTour(res.rows[0] as unknown as Record<string, unknown>);
  }

  async findBySlug(slug: string): Promise<Tour | null> {
    const res = await db.execute({
      sql: `SELECT t.*, d.name as destination_name 
            FROM tours t 
            LEFT JOIN destinations d ON t.destination_id = d.id 
            WHERE t.slug = ? LIMIT 1`,
      args: [slug],
    });
    if (!res.rows[0]) return null;
    return mapRowToTour(res.rows[0] as unknown as Record<string, unknown>);
  }

  async findByDestinationId(destinationId: string): Promise<Tour[]> {
    const res = await db.execute({
      sql: `SELECT t.*, d.name as destination_name 
            FROM tours t 
            LEFT JOIN destinations d ON t.destination_id = d.id 
            WHERE t.destination_id = ? 
            ORDER BY t.featured DESC, t.price ASC`,
      args: [destinationId],
    });
    return res.rows.map((r) => mapRowToTour(r as unknown as Record<string, unknown>));
  }

  async create(data: CreateTourDto): Promise<Tour> {
    const id = `tour_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO tours (
        id, destination_id, slug, title, subtitle, duration_days, duration_nights, price, original_price,
        featured, category, tour_type, overview, highlights_json, inclusions_json, exclusions_json,
        itinerary_json, images_json, departure_dates_json, rating, review_count, max_group_size, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        data.destination_id ?? null,
        data.slug ?? "",
        data.title ?? "",
        data.subtitle ?? null,
        data.duration_days ?? 1,
        data.duration_nights ?? 0,
        data.price ?? 0,
        data.original_price ?? null,
        data.featured ? 1 : 0,
        data.category ?? "Holidays",
        data.tour_type ?? "Customized Tour",
        data.overview ?? "",
        JSON.stringify(data.highlights ?? []),
        JSON.stringify(data.inclusions ?? []),
        JSON.stringify(data.exclusions ?? []),
        JSON.stringify(data.itinerary ?? []),
        JSON.stringify(data.images ?? []),
        JSON.stringify(data.departure_dates ?? ["Daily Departures"]),
        data.rating ?? 4.9,
        data.review_count ?? 10,
        data.max_group_size ?? 15,
        now,
        now,
      ],
    });

    const created = await this.findById(id);
    if (!created) throw new Error("Failed to retrieve created tour");
    return created;
  }

  async update(data: UpdateTourDto): Promise<Tour> {
    const existing = await this.findById(data.id);
    if (!existing) throw new Error("Tour not found");

    const now = new Date().toISOString();
    const updated = {
      ...existing,
      ...data,
      updated_at: now,
    };

    await db.execute({
      sql: `UPDATE tours SET
        destination_id = ?, slug = ?, title = ?, subtitle = ?, duration_days = ?, duration_nights = ?,
        price = ?, original_price = ?, featured = ?, category = ?, tour_type = ?, overview = ?,
        highlights_json = ?, inclusions_json = ?, exclusions_json = ?, itinerary_json = ?,
        images_json = ?, departure_dates_json = ?, rating = ?, review_count = ?, max_group_size = ?, updated_at = ?
      WHERE id = ?`,
      args: [
        updated.destination_id || null,
        updated.slug,
        updated.title,
        updated.subtitle,
        updated.duration_days,
        updated.duration_nights,
        updated.price,
        updated.original_price,
        updated.featured ? 1 : 0,
        updated.category,
        updated.tour_type,
        updated.overview,
        JSON.stringify(updated.highlights || []),
        JSON.stringify(updated.inclusions || []),
        JSON.stringify(updated.exclusions || []),
        JSON.stringify(updated.itinerary || []),
        JSON.stringify(updated.images || []),
        JSON.stringify(updated.departure_dates || []),
        updated.rating,
        updated.review_count,
        updated.max_group_size,
        now,
        data.id,
      ],
    });

    return (await this.findById(data.id))!;
  }

  async delete(id: string): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM tours WHERE id = ?",
      args: [id],
    });
    return (res.rowsAffected ?? 0) > 0;
  }
}

export const tourRepository = new TourRepository();
