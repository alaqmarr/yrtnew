import { db } from "@/infrastructure/db/client";
import { Blog, CreateBlogDto, UpdateBlogDto } from "../domain/blog.entity";

function mapRowToBlog(row: Record<string, unknown>): Blog {
  let tags: string[] = [];
  try {
    tags = JSON.parse(String(row.tags_json || "[]"));
  } catch {
    tags = [];
  }

  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt),
    content: String(row.content),
    cover_image: String(row.cover_image),
    author: String(row.author || "Yellow Ribbon Travels"),
    read_time: String(row.read_time || "5 min read"),
    tags,
    published_at: String(row.published_at),
    is_featured: Boolean(row.is_featured),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export class BlogRepository {
  async findAll(options?: { featuredOnly?: boolean; tag?: string }): Promise<Blog[]> {
    let sql = "SELECT * FROM blogs WHERE 1=1";
    const args: string[] = [];

    if (options?.featuredOnly) {
      sql += " AND is_featured = 1";
    }
    if (options?.tag) {
      sql += " AND tags_json LIKE ?";
      args.push(`%${options.tag}%`);
    }

    sql += " ORDER BY published_at DESC";

    const res = await db.execute({ sql, args });
    return res.rows.map((r) => mapRowToBlog(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<Blog | null> {
    const res = await db.execute({
      sql: "SELECT * FROM blogs WHERE id = ? LIMIT 1",
      args: [id],
    });
    if (!res.rows[0]) return null;
    return mapRowToBlog(res.rows[0] as unknown as Record<string, unknown>);
  }

  async findBySlug(slug: string): Promise<Blog | null> {
    const res = await db.execute({
      sql: "SELECT * FROM blogs WHERE slug = ? LIMIT 1",
      args: [slug],
    });
    if (!res.rows[0]) return null;
    return mapRowToBlog(res.rows[0] as unknown as Record<string, unknown>);
  }

  async create(data: CreateBlogDto): Promise<Blog> {
    const id = `blog_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO blogs (id, slug, title, excerpt, content, cover_image, author, read_time, tags_json, published_at, is_featured, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        data.slug ?? "",
        data.title ?? "",
        data.excerpt ?? "",
        data.content ?? "",
        data.cover_image ?? "",
        data.author ?? "Yellow Ribbon Travels",
        data.read_time ?? "5 min read",
        JSON.stringify(data.tags ?? []),
        now,
        data.is_featured ? 1 : 0,
        now,
        now,
      ],
    });

    return (await this.findById(id))!;
  }

  async update(data: UpdateBlogDto): Promise<Blog> {
    const existing = await this.findById(data.id);
    if (!existing) throw new Error("Blog post not found");

    const now = new Date().toISOString();
    const updated = {
      ...existing,
      ...data,
      updated_at: now,
    };

    await db.execute({
      sql: `UPDATE blogs SET
        slug = ?, title = ?, excerpt = ?, content = ?, cover_image = ?, author = ?,
        read_time = ?, tags_json = ?, is_featured = ?, updated_at = ?
      WHERE id = ?`,
      args: [
        updated.slug,
        updated.title,
        updated.excerpt,
        updated.content,
        updated.cover_image,
        updated.author,
        updated.read_time,
        JSON.stringify(updated.tags || []),
        updated.is_featured ? 1 : 0,
        now,
        data.id,
      ],
    });

    return (await this.findById(data.id))!;
  }

  async delete(id: string): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM blogs WHERE id = ?",
      args: [id],
    });
    return (res.rowsAffected ?? 0) > 0;
  }
}

export const blogRepository = new BlogRepository();
