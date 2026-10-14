import { db } from "@/infrastructure/db/client";
import { Review, CreateReviewDto, ReviewStats } from "../domain/review.entity";

function mapRowToReview(row: Record<string, unknown>): Review {
  return {
    id: String(row.id),
    author_name: String(row.author_name),
    author_avatar: row.author_avatar ? String(row.author_avatar) : null,
    rating: Number(row.rating || 5),
    review_date: String(row.review_date),
    comment: String(row.comment),
    source: (row.source as "Google" | "Direct") || "Google",
    verified: Boolean(row.verified),
    is_published: Boolean(row.is_published),
    trip_type: row.trip_type ? String(row.trip_type) : null,
    helpful_count: Number(row.helpful_count || 0),
    created_at: String(row.created_at),
  };
}

export class ReviewRepository {
  async findAll(options?: { publishedOnly?: boolean; minRating?: number }): Promise<Review[]> {
    let sql = "SELECT * FROM reviews WHERE 1=1";
    const args: (string | number)[] = [];

    if (options?.publishedOnly) {
      sql += " AND is_published = 1";
    }
    if (options?.minRating) {
      sql += " AND rating >= ?";
      args.push(options.minRating);
    }

    sql += " ORDER BY review_date DESC, rating DESC";

    const res = await db.execute({ sql, args });
    return res.rows.map((r) => mapRowToReview(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<Review | null> {
    const res = await db.execute({
      sql: "SELECT * FROM reviews WHERE id = ? LIMIT 1",
      args: [id],
    });
    if (!res.rows[0]) return null;
    return mapRowToReview(res.rows[0] as unknown as Record<string, unknown>);
  }

  async create(data: CreateReviewDto): Promise<Review> {
    const id = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO reviews (id, author_name, author_avatar, rating, review_date, comment, source, verified, is_published, trip_type, helpful_count, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        data.author_name ?? "Anonymous Traveler",
        data.author_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.author_name || "Traveler")}`,
        data.rating ?? 5,
        now.split("T")[0],
        data.comment ?? "",
        data.source ?? "Direct",
        1,
        1, // Published by default or modifiable in admin
        data.trip_type ?? "Holiday Vacation",
        0,
        now,
      ],
    });

    return (await this.findById(id))!;
  }

  async togglePublish(id: string, isPublished: boolean): Promise<Review> {
    await db.execute({
      sql: "UPDATE reviews SET is_published = ? WHERE id = ?",
      args: [isPublished ? 1 : 0, id],
    });
    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM reviews WHERE id = ?",
      args: [id],
    });
    return (res.rowsAffected ?? 0) > 0;
  }

  async getStats(): Promise<ReviewStats> {
    const all = await this.findAll({ publishedOnly: true });
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    for (const r of all) {
      sum += r.rating;
      if (r.rating in dist) {
        dist[r.rating as keyof typeof dist]++;
      }
    }

    const total = all.length;
    const avg = total > 0 ? Number((sum / total).toFixed(1)) : 4.9;

    return {
      averageRating: avg,
      totalReviews: total,
      ratingDistribution: dist,
    };
  }
}

export const reviewRepository = new ReviewRepository();
