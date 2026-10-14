import { db } from "@/infrastructure/db/client";
import { TeamMember, CreateTeamMemberDto, UpdateTeamMemberDto } from "../domain/team.entity";

function mapRowToTeamMember(row: Record<string, unknown>): TeamMember {
  return {
    id: String(row.id),
    name: String(row.name),
    designation: String(row.designation),
    department: String(row.department),
    bio: String(row.bio),
    image_url: String(row.image_url),
    phone: row.phone ? String(row.phone) : null,
    email: row.email ? String(row.email) : null,
    linkedin: row.linkedin ? String(row.linkedin) : null,
    order_index: Number(row.order_index || 0),
    created_at: String(row.created_at),
  };
}

export class TeamRepository {
  async findAll(): Promise<TeamMember[]> {
    const res = await db.execute("SELECT * FROM team_members ORDER BY order_index ASC, name ASC");
    return res.rows.map((r) => mapRowToTeamMember(r as unknown as Record<string, unknown>));
  }

  async findById(id: string): Promise<TeamMember | null> {
    const res = await db.execute({
      sql: "SELECT * FROM team_members WHERE id = ? LIMIT 1",
      args: [id],
    });
    if (!res.rows[0]) return null;
    return mapRowToTeamMember(res.rows[0] as unknown as Record<string, unknown>);
  }

  async create(data: CreateTeamMemberDto): Promise<TeamMember> {
    const id = `tm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO team_members (id, name, designation, department, bio, image_url, phone, email, linkedin, order_index, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        data.name ?? "",
        data.designation ?? "",
        data.department ?? "",
        data.bio ?? "",
        data.image_url ?? "",
        data.phone ?? null,
        data.email ?? null,
        data.linkedin ?? null,
        data.order_index ?? 0,
        now,
      ],
    });

    return (await this.findById(id))!;
  }

  async update(data: UpdateTeamMemberDto): Promise<TeamMember> {
    const existing = await this.findById(data.id);
    if (!existing) throw new Error("Team member not found");

    const updated = { ...existing, ...data };

    await db.execute({
      sql: `UPDATE team_members SET
        name = ?, designation = ?, department = ?, bio = ?, image_url = ?,
        phone = ?, email = ?, linkedin = ?, order_index = ?
      WHERE id = ?`,
      args: [
        updated.name,
        updated.designation,
        updated.department,
        updated.bio,
        updated.image_url,
        updated.phone,
        updated.email,
        updated.linkedin,
        updated.order_index,
        data.id,
      ],
    });

    return (await this.findById(data.id))!;
  }

  async delete(id: string): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM team_members WHERE id = ?",
      args: [id],
    });
    return (res.rowsAffected ?? 0) > 0;
  }
}

export const teamRepository = new TeamRepository();
