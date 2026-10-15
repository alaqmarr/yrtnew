import { db } from "@/infrastructure/db/client";
import { FamilyMember, CreateFamilyMemberDto, UpdateFamilyMemberDto } from "../domain/family.entity";

function mapRowToFamilyMember(row: Record<string, unknown>): FamilyMember {
  return {
    id: String(row.id),
    primary_user_id: String(row.primary_user_id),
    member_user_id: row.member_user_id ? String(row.member_user_id) : null,
    name: String(row.name),
    relationship: row.relationship as FamilyMember["relationship"],
    gender: row.gender ? String(row.gender) : null,
    date_of_birth: row.date_of_birth ? String(row.date_of_birth) : null,
    age_group: (row.age_group as FamilyMember["age_group"]) || "Adult",
    email: row.email ? String(row.email) : null,
    phone: row.phone ? String(row.phone) : null,
    passport_number: row.passport_number ? String(row.passport_number) : null,
    passport_expiry: row.passport_expiry ? String(row.passport_expiry) : null,
    nationality: String(row.nationality || "Indian"),
    dietary_preference: String(row.dietary_preference || "Any"),
    notes: row.notes ? String(row.notes) : null,
    can_login: Number(row.can_login || 0) === 1,
    created_at: String(row.created_at || new Date().toISOString()),
    updated_at: String(row.updated_at || new Date().toISOString()),
  };
}

export class FamilyRepository {
  async findByPrimaryUserId(primaryUserId: string): Promise<FamilyMember[]> {
    const res = await db.execute({
      sql: "SELECT * FROM family_members WHERE primary_user_id = ? ORDER BY created_at ASC",
      args: [primaryUserId],
    });
    return res.rows.map((r) => mapRowToFamilyMember(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<FamilyMember | null> {
    const res = await db.execute({
      sql: "SELECT * FROM family_members WHERE id = ? LIMIT 1",
      args: [id],
    });
    if (!res.rows[0]) return null;
    return mapRowToFamilyMember(res.rows[0] as unknown as Record<string, unknown>);
  }

  async findByMemberUserId(memberUserId: string): Promise<FamilyMember | null> {
    const res = await db.execute({
      sql: "SELECT * FROM family_members WHERE member_user_id = ? LIMIT 1",
      args: [memberUserId],
    });
    if (!res.rows[0]) return null;
    return mapRowToFamilyMember(res.rows[0] as unknown as Record<string, unknown>);
  }

  async findByEmail(email: string): Promise<FamilyMember | null> {
    const cleanEmail = email.trim().toLowerCase();
    const res = await db.execute({
      sql: "SELECT * FROM family_members WHERE LOWER(email) = ? LIMIT 1",
      args: [cleanEmail],
    });
    if (!res.rows[0]) return null;
    return mapRowToFamilyMember(res.rows[0] as unknown as Record<string, unknown>);
  }

  async create(
    primaryUserId: string,
    data: CreateFamilyMemberDto,
    memberUserId?: string | null
  ): Promise<FamilyMember> {
    const id = `fam_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const canLogin = memberUserId ? 1 : 0;

    await db.execute({
      sql: `INSERT INTO family_members (
        id, primary_user_id, member_user_id, name, relationship, gender,
        date_of_birth, age_group, email, phone, passport_number, passport_expiry,
        nationality, dietary_preference, notes, can_login, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        primaryUserId,
        memberUserId || null,
        data.name.trim(),
        data.relationship,
        data.gender || null,
        data.date_of_birth || null,
        data.age_group || "Adult",
        data.email ? data.email.trim().toLowerCase() : null,
        data.phone ? data.phone.trim() : null,
        data.passport_number ? data.passport_number.trim().toUpperCase() : null,
        data.passport_expiry || null,
        data.nationality || "Indian",
        data.dietary_preference || "Any",
        data.notes || null,
        canLogin,
        now,
        now,
      ],
    });

    const created = await this.findById(id);
    if (!created) throw new Error("Failed to create family member");
    return created;
  }

  async update(id: string, data: UpdateFamilyMemberDto): Promise<FamilyMember | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const sets: string[] = [];
    const args: (string | null)[] = [];

    if (data.name !== undefined) {
      sets.push("name = ?");
      args.push(data.name.trim());
    }
    if (data.relationship !== undefined) {
      sets.push("relationship = ?");
      args.push(data.relationship);
    }
    if (data.gender !== undefined) {
      sets.push("gender = ?");
      args.push(data.gender || null);
    }
    if (data.date_of_birth !== undefined) {
      sets.push("date_of_birth = ?");
      args.push(data.date_of_birth || null);
    }
    if (data.age_group !== undefined) {
      sets.push("age_group = ?");
      args.push(data.age_group || "Adult");
    }
    if (data.email !== undefined) {
      sets.push("email = ?");
      args.push(data.email ? data.email.trim().toLowerCase() : null);
    }
    if (data.phone !== undefined) {
      sets.push("phone = ?");
      args.push(data.phone ? data.phone.trim() : null);
    }
    if (data.passport_number !== undefined) {
      sets.push("passport_number = ?");
      args.push(data.passport_number ? data.passport_number.trim().toUpperCase() : null);
    }
    if (data.passport_expiry !== undefined) {
      sets.push("passport_expiry = ?");
      args.push(data.passport_expiry || null);
    }
    if (data.nationality !== undefined) {
      sets.push("nationality = ?");
      args.push(data.nationality || "Indian");
    }
    if (data.dietary_preference !== undefined) {
      sets.push("dietary_preference = ?");
      args.push(data.dietary_preference || "Any");
    }
    if (data.notes !== undefined) {
      sets.push("notes = ?");
      args.push(data.notes || null);
    }

    if (sets.length === 0) return existing;

    const now = new Date().toISOString();
    sets.push("updated_at = ?");
    args.push(now);
    args.push(id);

    await db.execute({
      sql: `UPDATE family_members SET ${sets.join(", ")} WHERE id = ?`,
      args,
    });

    // If this family member has a linked user account, synchronize changes to users table
    if (existing.member_user_id) {
      const userSets: string[] = [];
      const userArgs: (string | null)[] = [];
      if (data.name && data.name.trim()) {
        userSets.push("name = ?");
        userArgs.push(data.name.trim());
      }
      if (data.email && data.email.trim()) {
        userSets.push("email = ?");
        userArgs.push(data.email.trim().toLowerCase());
      }
      if (data.phone !== undefined) {
        userSets.push("phone = ?");
        userArgs.push(data.phone ? data.phone.trim() : null);
      }
      if (userSets.length > 0) {
        userSets.push("updated_at = ?");
        userArgs.push(now);
        userArgs.push(existing.member_user_id);
        try {
          await db.execute({
            sql: `UPDATE users SET ${userSets.join(", ")} WHERE id = ?`,
            args: userArgs,
          });
        } catch (e) {
          console.error("Failed to sync family member changes to user record:", e);
        }
      }
    }

    return this.findById(id);
  }

  async linkSubAccount(id: string, memberUserId: string): Promise<boolean> {
    const now = new Date().toISOString();
    const res = await db.execute({
      sql: "UPDATE family_members SET member_user_id = ?, can_login = 1, updated_at = ? WHERE id = ?",
      args: [memberUserId, now, id],
    });
    return (res.rowsAffected || 0) > 0;
  }

  async unlinkSubAccount(id: string): Promise<boolean> {
    const now = new Date().toISOString();
    const res = await db.execute({
      sql: "UPDATE family_members SET member_user_id = NULL, can_login = 0, updated_at = ? WHERE id = ?",
      args: [now, id],
    });
    return (res.rowsAffected || 0) > 0;
  }

  async delete(id: string): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM family_members WHERE id = ?",
      args: [id],
    });
    return (res.rowsAffected || 0) > 0;
  }
}

export const familyRepository = new FamilyRepository();
