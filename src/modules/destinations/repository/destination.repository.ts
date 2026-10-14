import { db } from "@/infrastructure/db/client";
import { Destination, CreateDestinationDto, UpdateDestinationDto } from "../domain/destination.entity";

function mapRowToDestination(row: Record<string, unknown>): Destination {
  let topAttractions: string[] = [];
  try {
    topAttractions = JSON.parse(String(row.top_attractions_json || "[]"));
  } catch {
    topAttractions = [];
  }

  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    country: String(row.country),
    region: String(row.region),
    tagline: row.tagline ? String(row.tagline) : null,
    description: String(row.description),
    hero_image: String(row.hero_image),
    is_domestic: Boolean(row.is_domestic),
    is_featured: Boolean(row.is_featured),
    top_attractions: topAttractions,
    best_time_to_visit: row.best_time_to_visit ? String(row.best_time_to_visit) : null,
    weather_info: row.weather_info ? String(row.weather_info) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export class DestinationRepository {
  async findAll(options?: { domesticOnly?: boolean; internationalOnly?: boolean; featuredOnly?: boolean }): Promise<Destination[]> {
    let sql = "SELECT * FROM destinations WHERE 1=1";
    const args: (string | number)[] = [];

    if (options?.domesticOnly) {
      sql += " AND is_domestic = 1";
    }
    if (options?.internationalOnly) {
      sql += " AND is_domestic = 0";
    }
    if (options?.featuredOnly) {
      sql += " AND is_featured = 1";
    }

    sql += " ORDER BY is_featured DESC, name ASC";

    const res = await db.execute({ sql, args });
    return res.rows.map((r) => mapRowToDestination(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<Destination | null> {
    const res = await db.execute({
      sql: "SELECT * FROM destinations WHERE id = ? LIMIT 1",
      args: [id],
    });
    if (!res.rows[0]) return null;
    return mapRowToDestination(res.rows[0] as unknown as Record<string, unknown>);
  }

  async findBySlug(slug: string): Promise<Destination | null> {
    const res = await db.execute({
      sql: "SELECT * FROM destinations WHERE slug = ? LIMIT 1",
      args: [slug],
    });
    if (!res.rows[0]) return null;
    return mapRowToDestination(res.rows[0] as unknown as Record<string, unknown>);
  }

  async create(data: CreateDestinationDto): Promise<Destination> {
    const id = `dest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO destinations (
        id, slug, name, country, region, tagline, description, hero_image,
        is_domestic, is_featured, top_attractions_json, best_time_to_visit, weather_info, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        data.slug ?? "",
        data.name ?? "",
        data.country ?? "",
        data.region ?? "",
        data.tagline ?? null,
        data.description ?? "",
        data.hero_image ?? "",
        data.is_domestic ? 1 : 0,
        data.is_featured ? 1 : 0,
        JSON.stringify(data.top_attractions ?? []),
        data.best_time_to_visit ?? null,
        data.weather_info ?? null,
        now,
        now,
      ],
    });

    const created = await this.findById(id);
    if (!created) throw new Error("Failed to retrieve created destination");
    return created;
  }

  async update(data: UpdateDestinationDto): Promise<Destination> {
    const existing = await this.findById(data.id);
    if (!existing) throw new Error("Destination not found");

    const now = new Date().toISOString();
    const updated = {
      ...existing,
      ...data,
      updated_at: now,
    };

    await db.execute({
      sql: `UPDATE destinations SET
        slug = ?, name = ?, country = ?, region = ?, tagline = ?, description = ?, hero_image = ?,
        is_domestic = ?, is_featured = ?, top_attractions_json = ?, best_time_to_visit = ?, weather_info = ?, updated_at = ?
      WHERE id = ?`,
      args: [
        updated.slug,
        updated.name,
        updated.country,
        updated.region,
        updated.tagline,
        updated.description,
        updated.hero_image,
        updated.is_domestic ? 1 : 0,
        updated.is_featured ? 1 : 0,
        JSON.stringify(updated.top_attractions || []),
        updated.best_time_to_visit,
        updated.weather_info,
        now,
        data.id,
      ],
    });

    return (await this.findById(data.id))!;
  }

  async delete(id: string): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM destinations WHERE id = ?",
      args: [id],
    });
    return (res.rowsAffected ?? 0) > 0;
  }
}

export const destinationRepository = new DestinationRepository();
