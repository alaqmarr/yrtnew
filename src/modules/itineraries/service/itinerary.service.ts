import { db } from "@/infrastructure/db/client";
import bcrypt from "bcryptjs";
import { itineraryRepository } from "../repository/itinerary.repository";
import { Itinerary, CreateItineraryDto, UpdateItineraryDto } from "../domain/itinerary.entity";
import { contactService } from "@/modules/contacts/service/contact.service";

export async function ensureClientUser(
  clientName: string,
  clientEmail?: string | null,
  clientPhone?: string | null,
  explicitUserId?: string | null
): Promise<string> {
  if (explicitUserId) {
    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE id = ? LIMIT 1",
      args: [explicitUserId],
    });
    if (existing.rows[0]) return String(existing.rows[0].id);
  }

  const cleanEmail = clientEmail ? clientEmail.trim().toLowerCase() : "";
  const cleanPhone = clientPhone ? clientPhone.trim() : "";
  const normalizedPhone = cleanPhone.replace(/[\s\-+]/g, "");

  // 1. Try finding by email
  if (cleanEmail && cleanEmail.includes("@")) {
    const byEmail = await db.execute({
      sql: "SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1",
      args: [cleanEmail],
    });
    if (byEmail.rows[0]) {
      return String(byEmail.rows[0].id);
    }
  }

  // 2. Try finding by phone
  if (cleanPhone && normalizedPhone.length >= 7) {
    const byPhone = await db.execute({
      sql: `SELECT id FROM users 
            WHERE phone = ? 
               OR (REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '+', '') = ? AND ? != '')
            LIMIT 1`,
      args: [cleanPhone, normalizedPhone, normalizedPhone],
    });
    if (byPhone.rows[0]) {
      return String(byPhone.rows[0].id);
    }
  }

  // 3. Auto-provision new client user account
  const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const phoneDigits = normalizedPhone || Math.random().toString(36).substring(2, 8);
  const userEmail =
    cleanEmail && cleanEmail.includes("@")
      ? cleanEmail
      : `traveler_${phoneDigits}@client.yellowribbontravels.com`;

  // Secure temporary password hash so account is active and claimable
  const tempPassword = `YRT-${Math.random().toString(36).substring(2, 10)}!`;
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  await db.execute({
    sql: `INSERT INTO users (id, email, password_hash, name, phone, role, is_active, created_at)
          VALUES (?, ?, ?, ?, ?, 'client', 1, datetime('now'))`,
    args: [
      newUserId,
      userEmail,
      passwordHash,
      clientName.trim() || "Valued Client",
      cleanPhone || null,
    ],
  });

  return newUserId;
}

export class ItineraryService {
  async getAllItineraries(): Promise<Itinerary[]> {
    return itineraryRepository.findAll();
  }

  async getItineraryById(id: string): Promise<Itinerary | null> {
    return itineraryRepository.findById(id);
  }

  async getItinerariesByUser(userId: string): Promise<Itinerary[]> {
    return itineraryRepository.findByUserId(userId);
  }

  async createItinerary(data: CreateItineraryDto): Promise<Itinerary> {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const refNo = `YRT-ITN-${year}-${randomNum}`;

    let userId = data.user_id;
    try {
      userId = await ensureClientUser(
        data.client_name,
        data.client_email,
        data.client_phone,
        data.user_id
      );
    } catch (err) {
      console.error("Auto-provisioning client user failed, proceeding with itinerary save:", err);
    }

    const created = await itineraryRepository.create({ ...data, user_id: userId }, refNo);

    contactService
      .recordCustomerActivity({
        name: data.client_name,
        phone: data.client_phone,
        email: data.client_email,
        amount: data.total_price,
        isPaid: data.status === "Confirmed",
        source: "Quotation / Itinerary",
        notes: `Itinerary created for ${data.destination} (${data.duration_days}D/${data.duration_nights}N)`,
      })
      .catch((err) =>
        console.error("Auto-recording contact for itinerary failed:", err)
      );

    return created;
  }

  async updateItinerary(data: UpdateItineraryDto): Promise<Itinerary> {
    if (!data.user_id && (data.client_name || data.client_email || data.client_phone)) {
      try {
        const existing = await itineraryRepository.findById(data.id);
        if (existing && !existing.user_id) {
          const userId = await ensureClientUser(
            data.client_name || existing.client_name,
            data.client_email !== undefined ? data.client_email : existing.client_email,
            data.client_phone || existing.client_phone
          );
          data.user_id = userId;
        }
      } catch (err) {
        console.error("Error linking user during itinerary update:", err);
      }
    }
    return itineraryRepository.update(data);
  }

  async deleteItinerary(id: string): Promise<boolean> {
    return itineraryRepository.delete(id);
  }
}

export const itineraryService = new ItineraryService();

