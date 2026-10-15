import { db } from "@/infrastructure/db/client";
import type { InValue } from "@libsql/client";
import bcrypt from "bcryptjs";
import { UserAccount, CreateUserDto, UpdateUserDto, UserRole } from "../domain/user.entity";

function mapRowToUser(row: Record<string, unknown>): UserAccount {
  return {
    id: String(row.id),
    email: String(row.email),
    name: String(row.name),
    phone: row.phone ? String(row.phone) : null,
    avatar: row.avatar ? String(row.avatar) : null,
    role: (row.role as UserRole) || "client",
    department: row.department ? String(row.department) : null,
    branch_id: row.branch_id ? String(row.branch_id) : null,
    branch_city: row.branch_city ? String(row.branch_city) : null,
    is_active: row.is_active === 1 || row.is_active === true,
    created_at: String(row.created_at),
  };
}

export class UserRepository {
  async findAll(filter?: {
    role?: string;
    search?: string;
    branchId?: string;
    isActive?: boolean;
  }): Promise<UserAccount[]> {
    let sql = `
      SELECT u.id, u.email, u.name, u.phone, u.avatar, u.role, u.department, u.branch_id, u.is_active, u.created_at,
             b.city AS branch_city
      FROM users u
      LEFT JOIN branches b ON u.branch_id = b.id
      WHERE 1=1
    `;
    const args: InValue[] = [];

    if (filter?.role) {
      if (filter.role === "admin") {
        sql += " AND (u.role = 'admin' OR u.role = 'superadmin')";
      } else {
        sql += " AND u.role = ?";
        args.push(filter.role);
      }
    }

    if (filter?.branchId) {
      sql += " AND u.branch_id = ?";
      args.push(filter.branchId);
    }

    if (filter?.isActive !== undefined) {
      sql += " AND u.is_active = ?";
      args.push(filter.isActive ? 1 : 0);
    }

    if (filter?.search?.trim()) {
      const q = `%${filter.search.trim().toLowerCase()}%`;
      sql += " AND (LOWER(u.name) LIKE ? OR LOWER(u.email) LIKE ? OR LOWER(COALESCE(u.phone, '')) LIKE ? OR LOWER(COALESCE(u.department, '')) LIKE ?)";
      args.push(q, q, q, q);
    }

    sql += " ORDER BY CASE WHEN u.role IN ('superadmin', 'admin') THEN 0 WHEN u.role = 'staff' THEN 1 ELSE 2 END, u.created_at DESC";

    const res = await db.execute({ sql, args });
    return res.rows.map((r) => mapRowToUser(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<UserAccount | null> {
    const res = await db.execute({
      sql: `
        SELECT u.id, u.email, u.name, u.phone, u.avatar, u.role, u.department, u.branch_id, u.is_active, u.created_at,
               b.city AS branch_city
        FROM users u
        LEFT JOIN branches b ON u.branch_id = b.id
        WHERE u.id = ?
        LIMIT 1
      `,
      args: [id],
    });

    if (res.rows.length === 0) return null;
    return mapRowToUser(res.rows[0] as unknown as Record<string, unknown>);
  }

  async findByEmail(email: string): Promise<UserAccount | null> {
    const res = await db.execute({
      sql: `
        SELECT u.id, u.email, u.name, u.phone, u.avatar, u.role, u.department, u.branch_id, u.is_active, u.created_at,
               b.city AS branch_city
        FROM users u
        LEFT JOIN branches b ON u.branch_id = b.id
        WHERE LOWER(u.email) = ?
        LIMIT 1
      `,
      args: [email.trim().toLowerCase()],
    });

    if (res.rows.length === 0) return null;
    return mapRowToUser(res.rows[0] as unknown as Record<string, unknown>);
  }

  async create(dto: CreateUserDto): Promise<UserAccount> {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const emailNormalized = dto.email.trim().toLowerCase();
    const isActiveInt = dto.is_active === false ? 0 : 1;

    await db.execute({
      sql: `
        INSERT INTO users (id, email, password_hash, name, phone, role, department, branch_id, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `,
      args: [
        id,
        emailNormalized,
        passwordHash,
        dto.name.trim(),
        dto.phone?.trim() || null,
        dto.role || "staff",
        dto.department?.trim() || null,
        dto.branch_id || null,
        isActiveInt,
      ],
    });

    const created = await this.findById(id);
    if (!created) throw new Error("Failed to retrieve created user account");
    return created;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserAccount> {
    const existing = await this.findById(id);
    if (!existing) throw new Error("User account not found");

    // Safety: ensure we never deactivate or demote the last remaining active admin
    const isTargetActiveAdmin =
      (existing.role === "admin" || existing.role === "superadmin") && existing.is_active;
    const willDeactivate = dto.is_active === false;
    const willDemote = dto.role !== undefined && dto.role !== "admin" && dto.role !== "superadmin";

    if (isTargetActiveAdmin && (willDeactivate || willDemote)) {
      const activeAdminCount = await this.countAdmins();
      if (activeAdminCount <= 1) {
        throw new Error("Cannot deactivate or change role of the only active administrator account.");
      }
    }

    const sets: string[] = [];
    const args: InValue[] = [];

    if (dto.name !== undefined) {
      sets.push("name = ?");
      args.push(dto.name.trim());
    }
    if (dto.email !== undefined) {
      sets.push("email = ?");
      args.push(dto.email.trim().toLowerCase());
    }
    if (dto.phone !== undefined) {
      sets.push("phone = ?");
      args.push(dto.phone?.trim() || null);
    }
    if (dto.role !== undefined) {
      sets.push("role = ?");
      args.push(dto.role);
    }
    if (dto.department !== undefined) {
      sets.push("department = ?");
      args.push(dto.department?.trim() || null);
    }
    if (dto.branch_id !== undefined) {
      sets.push("branch_id = ?");
      args.push(dto.branch_id || null);
    }
    if (dto.is_active !== undefined) {
      sets.push("is_active = ?");
      args.push(dto.is_active ? 1 : 0);
    }
    if (dto.password && dto.password.trim().length > 0) {
      const hash = await bcrypt.hash(dto.password, 10);
      sets.push("password_hash = ?");
      args.push(hash);
    }

    if (sets.length > 0) {
      args.push(id);
      await db.execute({
        sql: `UPDATE users SET ${sets.join(", ")} WHERE id = ?`,
        args,
      });
    }

    const updated = await this.findById(id);
    if (!updated) throw new Error("Failed to retrieve updated user account");
    return updated;
  }

  async delete(id: string, requesterUserId?: string): Promise<boolean> {
    if (requesterUserId && id === requesterUserId) {
      throw new Error("You cannot delete your own account.");
    }

    const target = await this.findById(id);
    if (!target) return false;

    // Safety: ensure we never delete the last remaining admin
    if (target.role === "admin" || target.role === "superadmin") {
      const adminCountRes = await db.execute(
        "SELECT COUNT(*) as cnt FROM users WHERE role IN ('admin', 'superadmin') AND is_active = 1"
      );
      const count = Number(adminCountRes.rows[0]?.cnt || 0);
      if (count <= 1) {
        throw new Error("Cannot delete the only active administrator account.");
      }
    }

    await db.execute({
      sql: "DELETE FROM users WHERE id = ?",
      args: [id],
    });

    return true;
  }

  async getRoleStats(): Promise<{
    total: number;
    admins: number;
    staff: number;
    clients: number;
    active: number;
    suspended: number;
  }> {
    const res = await db.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN role IN ('admin', 'superadmin') THEN 1 ELSE 0 END) as admins,
        SUM(CASE WHEN role = 'staff' THEN 1 ELSE 0 END) as staff,
        SUM(CASE WHEN role = 'client' THEN 1 ELSE 0 END) as clients,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as suspended
      FROM users
    `);

    const r = res.rows[0] as Record<string, unknown>;
    return {
      total: Number(r?.total || 0),
      admins: Number(r?.admins || 0),
      staff: Number(r?.staff || 0),
      clients: Number(r?.clients || 0),
      active: Number(r?.active || 0),
      suspended: Number(r?.suspended || 0),
    };
  }

  async countAdmins(): Promise<number> {
    const res = await db.execute(
      "SELECT COUNT(*) as cnt FROM users WHERE role IN ('admin', 'superadmin') AND is_active = 1"
    );
    return Number(res.rows[0]?.cnt || 0);
  }

  async hasAnyAdmin(): Promise<boolean> {
    const count = await this.countAdmins();
    return count > 0;
  }
}

export const userRepository = new UserRepository();
