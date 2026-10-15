import bcrypt from "bcryptjs";
import { db } from "@/infrastructure/db/client";
import { familyRepository } from "../repository/family.repository";
import {
  FamilyMember,
  CreateFamilyMemberDto,
  UpdateFamilyMemberDto,
  FamilyGroupData,
} from "../domain/family.entity";

export class FamilyService {
  async getFamilyForUser(userId: string): Promise<FamilyGroupData> {
    // 1. Check if user is a sub-account (has family_head_id)
    const userRes = await db.execute({
      sql: "SELECT id, name, email, phone, family_head_id, relationship_to_head FROM users WHERE id = ? LIMIT 1",
      args: [userId],
    });

    const currentUser = userRes.rows[0];
    const familyHeadId = currentUser?.family_head_id ? String(currentUser.family_head_id) : null;

    if (familyHeadId) {
      // Current user is a Sub-Account: strictly restricted view
      const headRes = await db.execute({
        sql: "SELECT id, name, email, phone FROM users WHERE id = ? LIMIT 1",
        args: [familyHeadId],
      });
      const headRow = headRes.rows[0];

      const myMembership =
        (await familyRepository.findByMemberUserId(userId)) ||
        (await familyRepository.findByEmail(String(currentUser?.email || "")));

      return {
        isFamilyHead: false,
        headUser: headRow
          ? {
              id: String(headRow.id),
              name: String(headRow.name),
              email: String(headRow.email),
              phone: headRow.phone ? String(headRow.phone) : null,
            }
          : null,
        members: myMembership ? [myMembership] : [],
        myMembership: myMembership || null,
      };
    }

    // Current user is the Primary Account / Family Head
    const members = await familyRepository.findByPrimaryUserId(userId);

    return {
      isFamilyHead: true,
      headUser: currentUser
        ? {
            id: String(currentUser.id),
            name: String(currentUser.name),
            email: String(currentUser.email),
            phone: currentUser.phone ? String(currentUser.phone) : null,
          }
        : null,
      members,
      myMembership: null,
    };
  }

  async addMember(primaryUserId: string, data: CreateFamilyMemberDto): Promise<FamilyMember> {
    // Verify user is not a sub-account
    const userRes = await db.execute({
      sql: "SELECT id, family_head_id FROM users WHERE id = ? LIMIT 1",
      args: [primaryUserId],
    });
    if (userRes.rows[0]?.family_head_id) {
      throw new Error("Sub-accounts are not authorized to manage family members.");
    }

    let subAccountUserId: string | null = null;

    // Check if separate login account requested
    if (data.create_account) {
      if (!data.email || !data.email.trim()) {
        throw new Error("An email address is required to create a separate login account.");
      }
      if (!data.password || data.password.length < 6) {
        throw new Error("A secure password of at least 6 characters is required.");
      }

      const cleanEmail = data.email.trim().toLowerCase();

      // Check if email already registered
      const existingUser = await db.execute({
        sql: "SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1",
        args: [cleanEmail],
      });
      if (existingUser.rows.length > 0) {
        throw new Error(`An account with email "${cleanEmail}" is already registered.`);
      }

      // Hash password and insert user
      subAccountUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const passwordHash = await bcrypt.hash(data.password, 10);
      const now = new Date().toISOString();

      await db.execute({
        sql: `INSERT INTO users (
          id, email, password_hash, name, phone, role, family_head_id, relationship_to_head, is_active, created_at
        ) VALUES (?, ?, ?, ?, ?, 'client', ?, ?, 1, ?)`,
        args: [
          subAccountUserId,
          cleanEmail,
          passwordHash,
          data.name.trim(),
          data.phone ? data.phone.trim() : null,
          primaryUserId,
          data.relationship,
          now,
        ],
      });
    }

    return familyRepository.create(primaryUserId, data, subAccountUserId);
  }

  async createSubAccountForMember(
    primaryUserId: string,
    memberId: string,
    email: string,
    password: string
  ): Promise<{ member: FamilyMember; subAccountUserId: string }> {
    const member = await familyRepository.findById(memberId);
    if (!member) throw new Error("Family member not found.");
    if (member.primary_user_id !== primaryUserId) {
      throw new Error("Unauthorized: you can only manage your own family members.");
    }
    if (member.member_user_id) {
      throw new Error("This family member already has an active sub-account.");
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) throw new Error("Email is required.");
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    // Check email uniqueness
    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1",
      args: [cleanEmail],
    });
    if (existing.rows.length > 0) {
      throw new Error(`An account with email "${cleanEmail}" is already registered.`);
    }

    const subAccountUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    await db.execute({
      sql: `INSERT INTO users (
        id, email, password_hash, name, phone, role, family_head_id, relationship_to_head, is_active, created_at
      ) VALUES (?, ?, ?, ?, ?, 'client', ?, ?, 1, ?)`,
      args: [
        subAccountUserId,
        cleanEmail,
        passwordHash,
        member.name,
        member.phone || null,
        primaryUserId,
        member.relationship,
        now,
      ],
    });

    await familyRepository.linkSubAccount(memberId, subAccountUserId);
    // Also update member's email
    await familyRepository.update(memberId, { email: cleanEmail });

    const updated = await familyRepository.findById(memberId);
    if (!updated) throw new Error("Failed to retrieve updated family member.");

    return { member: updated, subAccountUserId };
  }

  async updateMember(
    primaryUserId: string,
    memberId: string,
    data: UpdateFamilyMemberDto
  ): Promise<FamilyMember> {
    const member = await familyRepository.findById(memberId);
    if (!member) throw new Error("Family member not found.");
    if (member.primary_user_id !== primaryUserId) {
      throw new Error("Unauthorized: you can only manage your own family members.");
    }

    const updated = await familyRepository.update(memberId, data);
    if (!updated) throw new Error("Failed to update family member.");

    // If sub-account exists, keep name, phone, and relationship in sync
    if (member.member_user_id) {
      await db.execute({
        sql: `UPDATE users SET
          name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          relationship_to_head = COALESCE(?, relationship_to_head)
        WHERE id = ?`,
        args: [
          data.name !== undefined ? data.name.trim() : null,
          data.phone !== undefined ? (data.phone ? data.phone.trim() : null) : null,
          data.relationship !== undefined ? data.relationship : null,
          member.member_user_id,
        ],
      });
    }

    return updated;
  }

  async deleteMember(primaryUserId: string, memberId: string): Promise<boolean> {
    const member = await familyRepository.findById(memberId);
    if (!member) throw new Error("Family member not found.");
    if (member.primary_user_id !== primaryUserId) {
      throw new Error("Unauthorized: you can only delete your own family members.");
    }

    // If member has a linked sub-account, unlink them from the family head
    if (member.member_user_id) {
      await db.execute({
        sql: "UPDATE users SET family_head_id = NULL, relationship_to_head = NULL WHERE id = ?",
        args: [member.member_user_id],
      });
    }

    return familyRepository.delete(memberId);
  }
}

export const familyService = new FamilyService();
