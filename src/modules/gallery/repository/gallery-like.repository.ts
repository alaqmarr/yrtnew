import { db } from "@/infrastructure/db/client";
import { GalleryItem } from "../domain/gallery.entity";
import { galleryRepository } from "./gallery.repository";

export class GalleryLikeRepository {
  async getUserLikes(userId: string): Promise<string[]> {
    const res = await db.execute({
      sql: "SELECT gallery_id FROM gallery_likes WHERE user_id = ?",
      args: [userId],
    });
    return res.rows.map((r) => String(r.gallery_id));
  }

  async getLikeCounts(): Promise<Record<string, number>> {
    const res = await db.execute({
      sql: `SELECT gallery_id, COUNT(*) as count FROM gallery_likes GROUP BY gallery_id`,
      args: [],
    });
    const counts: Record<string, number> = {};
    for (const row of res.rows) {
      counts[String(row.gallery_id)] = Number(row.count || 0);
    }
    return counts;
  }

  async isLiked(galleryId: string, userId: string): Promise<boolean> {
    const res = await db.execute({
      sql: "SELECT id FROM gallery_likes WHERE gallery_id = ? AND user_id = ? LIMIT 1",
      args: [galleryId, userId],
    });
    return Boolean(res.rows[0]);
  }

  async toggleLike(galleryId: string, userId: string): Promise<{ liked: boolean; count: number }> {
    const existing = await this.isLiked(galleryId, userId);
    if (existing) {
      await db.execute({
        sql: "DELETE FROM gallery_likes WHERE gallery_id = ? AND user_id = ?",
        args: [galleryId, userId],
      });
    } else {
      const id = `glk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await db.execute({
        sql: "INSERT INTO gallery_likes (id, gallery_id, user_id, created_at) VALUES (?, ?, ?, datetime('now'))",
        args: [id, galleryId, userId],
      });
    }

    const countRes = await db.execute({
      sql: "SELECT COUNT(*) as count FROM gallery_likes WHERE gallery_id = ?",
      args: [galleryId],
    });
    const count = Number(countRes.rows[0]?.count || 0);

    return {
      liked: !existing,
      count,
    };
  }

  async getUserLikedItems(userId: string): Promise<GalleryItem[]> {
    const res = await db.execute({
      sql: `SELECT g.* FROM gallery_items g 
            INNER JOIN gallery_likes l ON g.id = l.gallery_id 
            WHERE l.user_id = ? 
            ORDER BY l.created_at DESC`,
      args: [userId],
    });

    return res.rows.map((row) => {
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
    });
  }
}

export const galleryLikeRepository = new GalleryLikeRepository();
