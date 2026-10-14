import { db } from "@/infrastructure/db/client";
import { GalleryItem, CreateGalleryItemDto } from "../domain/gallery.entity";

function mapRowToGalleryItem(row: Record<string, unknown>): GalleryItem {
  let tags: string[] = [];
  try {
    tags = JSON.parse(String(row.tags_json || "[]"));
  } catch {
    tags = [];
  }

  return {
    id: String(row.id),
    title: String(row.title),
    url: String(row.url),
    r2_key: row.r2_key ? String(row.r2_key) : null,
    category: (row.category as GalleryItem["category"]) || "Destinations",
    caption: row.caption ? String(row.caption) : null,
    tags,
    is_featured: Boolean(row.is_featured),
    created_at: String(row.created_at),
  };
}

export class GalleryRepository {
  async findAll(category?: string): Promise<GalleryItem[]> {
    let sql = "SELECT * FROM gallery_items WHERE 1=1";
    const args: string[] = [];

    if (category && category !== "All") {
      sql += " AND category = ?";
      args.push(category);
    }
    sql += " ORDER BY is_featured DESC, created_at DESC";

    const res = await db.execute({ sql, args });
    return res.rows.map((r) => mapRowToGalleryItem(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<GalleryItem | null> {
    const res = await db.execute({
      sql: "SELECT * FROM gallery_items WHERE id = ? LIMIT 1",
      args: [id],
    });
    if (!res.rows[0]) return null;
    return mapRowToGalleryItem(res.rows[0] as unknown as Record<string, unknown>);
  }

  async create(data: CreateGalleryItemDto): Promise<GalleryItem> {
    const id = `gal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO gallery_items (id, title, url, r2_key, category, caption, tags_json, is_featured, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        data.title ?? "",
        data.url ?? "",
        data.r2_key ?? null,
        data.category ?? "Destinations",
        data.caption ?? null,
        JSON.stringify(data.tags ?? []),
        data.is_featured ? 1 : 0,
        now,
      ],
    });

    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM gallery_items WHERE id = ?",
      args: [id],
    });
    return (res.rowsAffected ?? 0) > 0;
  }
}

export const galleryRepository = new GalleryRepository();
