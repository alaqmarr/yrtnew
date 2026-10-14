import { db } from "@/infrastructure/db/client";
import { Branch, CreateBranchDto, UpdateBranchDto } from "../domain/branch.entity";

function mapRowToBranch(row: Record<string, unknown>): Branch {
  return {
    id: String(row.id),
    city: String(row.city),
    state: String(row.state),
    country: String(row.country || "India"),
    is_international: Boolean(row.is_international),
    branch_type: String(row.branch_type || "Branch Office"),
    address: String(row.address),
    phone: String(row.phone),
    email: String(row.email),
    google_maps_url: row.google_maps_url ? String(row.google_maps_url) : null,
    map_embed_url: row.map_embed_url ? String(row.map_embed_url) : null,
    manager_name: row.manager_name ? String(row.manager_name) : null,
    manager_phone: row.manager_phone ? String(row.manager_phone) : null,
    timing: row.timing ? String(row.timing) : null,
    is_active: Boolean(row.is_active),
    created_at: String(row.created_at),
  };
}

export class BranchRepository {
  async findAll(onlyActive = true): Promise<Branch[]> {
    let sql = "SELECT * FROM branches WHERE 1=1";
    if (onlyActive) {
      sql += " AND is_active = 1";
    }
    sql += " ORDER BY CASE WHEN branch_type = 'Head Office' THEN 0 WHEN is_international = 1 THEN 2 ELSE 1 END, city ASC";

    const res = await db.execute(sql);
    return res.rows.map((r) => mapRowToBranch(r as unknown as Record<string, unknown>));
  }

  async findDomestic(onlyActive = true): Promise<Branch[]> {
    let sql = "SELECT * FROM branches WHERE is_international = 0";
    if (onlyActive) {
      sql += " AND is_active = 1";
    }
    sql += " ORDER BY CASE WHEN branch_type = 'Head Office' THEN 0 ELSE 1 END, city ASC";

    const res = await db.execute(sql);
    return res.rows.map((r) => mapRowToBranch(r as unknown as Record<string, unknown>));
  }

  async findInternational(onlyActive = true): Promise<Branch[]> {
    let sql = "SELECT * FROM branches WHERE is_international = 1";
    if (onlyActive) {
      sql += " AND is_active = 1";
    }
    sql += " ORDER BY country ASC, city ASC";

    const res = await db.execute(sql);
    return res.rows.map((r) => mapRowToBranch(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<Branch | null> {
    const res = await db.execute({
      sql: "SELECT * FROM branches WHERE id = ? LIMIT 1",
      args: [id],
    });
    if (!res.rows[0]) return null;
    return mapRowToBranch(res.rows[0] as unknown as Record<string, unknown>);
  }

  async create(data: CreateBranchDto): Promise<Branch> {
    const id = `br_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO branches (id, city, state, country, is_international, branch_type, address, phone, email, google_maps_url, map_embed_url, manager_name, manager_phone, timing, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        data.city ?? "",
        data.state ?? "",
        data.country ?? "India",
        data.is_international ? 1 : 0,
        data.branch_type ?? "Branch Office",
        data.address ?? "",
        data.phone ?? "",
        data.email ?? "",
        data.google_maps_url ?? null,
        data.map_embed_url ?? null,
        data.manager_name ?? null,
        data.manager_phone ?? null,
        data.timing ?? "Mon - Sat: 9:30 AM - 7:00 PM",
        data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1,
        now,
      ],
    });

    return (await this.findById(id))!;
  }

  async update(data: UpdateBranchDto): Promise<Branch> {
    const existing = await this.findById(data.id);
    if (!existing) throw new Error("Branch not found");

    const updated = {
      ...existing,
      ...data,
    };

    await db.execute({
      sql: `UPDATE branches SET
        city = ?, state = ?, country = ?, is_international = ?, branch_type = ?, address = ?, phone = ?, email = ?,
        google_maps_url = ?, map_embed_url = ?, manager_name = ?, manager_phone = ?, timing = ?, is_active = ?
      WHERE id = ?`,
      args: [
        updated.city,
        updated.state,
        updated.country ?? "India",
        updated.is_international ? 1 : 0,
        updated.branch_type,
        updated.address,
        updated.phone,
        updated.email,
        updated.google_maps_url,
        updated.map_embed_url,
        updated.manager_name,
        updated.manager_phone,
        updated.timing,
        updated.is_active ? 1 : 0,
        data.id,
      ],
    });

    return (await this.findById(data.id))!;
  }

  async delete(id: string): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM branches WHERE id = ?",
      args: [id],
    });
    return (res.rowsAffected ?? 0) > 0;
  }
}

export const branchRepository = new BranchRepository();
