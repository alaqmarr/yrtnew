import db from "@/infrastructure/db/client";
import {
  Contact,
  ContactLookupResult,
  CustomerActivitySummary,
  CustomerTier,
  TravelPreferences,
} from "../domain/contact.entity";

export function normalizePhone(phone: string): { clean: string; last10: string } {
  const clean = (phone || "").replace(/\D/g, "");
  const last10 = clean.length >= 10 ? clean.slice(-10) : clean;
  return { clean, last10 };
}

export function computeTier(totalSpent: number, dealsCount: number, vipStatus = 0): CustomerTier {
  if (vipStatus === 1 || totalSpent >= 250000 || dealsCount >= 5) return "VIP";
  if (totalSpent >= 150000 || dealsCount >= 4) return "Platinum";
  if (totalSpent >= 75000 || dealsCount >= 2) return "Gold";
  if (totalSpent >= 25000 || dealsCount >= 1) return "Silver";
  return "Standard";
}

function parseContactRow(row: Record<string, unknown>): Contact {
  let tags: string[] = [];
  try {
    tags = JSON.parse(String(row.tags_json || "[]"));
  } catch {
    tags = [];
  }

  let preferences: TravelPreferences = {};
  try {
    preferences = JSON.parse(String(row.preferences_json || "{}"));
  } catch {
    preferences = {};
  }

  return {
    id: String(row.id),
    name: String(row.name),
    phone: String(row.phone),
    phone_clean: String(row.phone_clean),
    email: row.email ? String(row.email) : null,
    city: row.city ? String(row.city) : null,
    state: row.state ? String(row.state) : null,
    address: row.address ? String(row.address) : null,
    tier: (row.tier as CustomerTier) || "Standard",
    vip_status: Number(row.vip_status || 0),
    tags,
    preferences,
    internal_notes: row.internal_notes ? String(row.internal_notes) : null,
    source: String(row.source || "Direct"),
    total_spent: Number(row.total_spent || 0),
    deals_count: Number(row.deals_count || 0),
    last_interaction_at: row.last_interaction_at ? String(row.last_interaction_at) : null,
    created_at: String(row.created_at || new Date().toISOString()),
    updated_at: String(row.updated_at || new Date().toISOString()),
  };
}

export class ContactService {
  /**
   * Fast auto-suggest lookup by partial phone, name, or email.
   * As admin types, returns matches with repeat indicators and preferences.
   */
  async searchContacts(query: string, limit = 8): Promise<ContactLookupResult[]> {
    const q = query.trim();
    if (!q || q.length < 2) return [];

    const digitsOnly = q.replace(/\D/g, "");

    let sql = `
      SELECT * FROM contacts 
      WHERE name LIKE ? 
         OR phone LIKE ? 
         OR phone_clean LIKE ? 
         OR email LIKE ?
      ORDER BY total_spent DESC, deals_count DESC, updated_at DESC
      LIMIT ?
    `;

    const pattern = `%${q}%`;
    const digitPattern = digitsOnly ? `%${digitsOnly}%` : pattern;

    let res = await db.execute({
      sql,
      args: [pattern, pattern, digitPattern, pattern, limit],
    });

    // If contacts table is empty or had no hits, auto-sync and retry once
    if (res.rows.length === 0) {
      const countRes = await db.execute("SELECT COUNT(*) as c FROM contacts");
      const totalCount = Number(countRes.rows[0]?.c || 0);
      if (totalCount === 0) {
        await this.syncAllHistoricalContacts();
        res = await db.execute({
          sql,
          args: [pattern, pattern, digitPattern, pattern, limit],
        });
      }
    }

    return res.rows.map((r) => {
      const contact = parseContactRow(r as Record<string, unknown>);
      const isRepeat = contact.deals_count > 1 || contact.total_spent > 0;
      return {
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        city: contact.city,
        tier: contact.tier,
        vip_status: contact.vip_status === 1,
        total_spent: contact.total_spent,
        deals_count: contact.deals_count,
        is_repeat: isRepeat,
        tags: contact.tags,
        preferences: contact.preferences,
        internal_notes: contact.internal_notes,
      };
    });
  }

  /**
   * List contacts with search filter, tier filter, and sorting
   */
  async getContacts(options?: {
    search?: string;
    tier?: string;
    onlyRepeat?: boolean;
    sortBy?: "spent" | "recent" | "deals" | "name";
    limit?: number;
    offset?: number;
  }): Promise<{ contacts: Contact[]; total: number }> {
    const search = options?.search?.trim() || "";
    const tier = options?.tier || "";
    const onlyRepeat = options?.onlyRepeat || false;
    const limit = options?.limit || 50;
    const offset = options?.offset || 0;
    const sortBy = options?.sortBy || "spent";

    // Auto-sync on first access if contacts is empty
    const checkCount = await db.execute("SELECT COUNT(*) as c FROM contacts");
    if (Number(checkCount.rows[0]?.c || 0) === 0) {
      await this.syncAllHistoricalContacts();
    }

    const conditions: string[] = ["1=1"];
    const args: (string | number)[] = [];

    if (search) {
      const digits = search.replace(/\D/g, "");
      conditions.push(
        `(name LIKE ? OR phone LIKE ? OR phone_clean LIKE ? OR email LIKE ? OR city LIKE ?)`
      );
      const p = `%${search}%`;
      const dp = digits ? `%${digits}%` : p;
      args.push(p, p, dp, p, p);
    }

    if (tier && tier !== "all") {
      conditions.push(`tier = ?`);
      args.push(tier);
    }

    if (onlyRepeat) {
      conditions.push(`(deals_count > 1 OR total_spent > 0)`);
    }

    const whereClause = conditions.join(" AND ");

    let orderClause = "ORDER BY total_spent DESC, deals_count DESC";
    if (sortBy === "recent") {
      orderClause = "ORDER BY last_interaction_at DESC, updated_at DESC";
    } else if (sortBy === "deals") {
      orderClause = "ORDER BY deals_count DESC, total_spent DESC";
    } else if (sortBy === "name") {
      orderClause = "ORDER BY name ASC";
    }

    const countRes = await db.execute({
      sql: `SELECT COUNT(*) as total FROM contacts WHERE ${whereClause}`,
      args,
    });
    const total = Number(countRes.rows[0]?.total || 0);

    const queryArgs = [...args, limit, offset];
    const dataRes = await db.execute({
      sql: `SELECT * FROM contacts WHERE ${whereClause} ${orderClause} LIMIT ? OFFSET ?`,
      args: queryArgs,
    });

    const contacts = dataRes.rows.map((r) => parseContactRow(r as Record<string, unknown>));
    return { contacts, total };
  }

  /**
   * Get deep Customer 360 profile including all quotes, invoices, payments & bookings
   */
  async getContactById(id: string): Promise<CustomerActivitySummary | null> {
    const contactRes = await db.execute({
      sql: "SELECT * FROM contacts WHERE id = ?",
      args: [id],
    });

    if (contactRes.rows.length === 0) return null;
    const contact = parseContactRow(contactRes.rows[0] as Record<string, unknown>);

    const { last10 } = normalizePhone(contact.phone);
    const email = contact.email || "";

    // 1. Itineraries / Quotes
    const itnRes = await db.execute({
      sql: `
        SELECT id, reference_no, title, destination, start_date, duration_days, duration_nights, total_price, price_per_person, status, created_at 
        FROM itineraries 
        WHERE client_phone LIKE ? OR (client_email IS NOT NULL AND client_email = ?)
        ORDER BY created_at DESC
      `,
      args: [`%${last10}%`, email],
    });

    // 2. Razorpay Payments
    const payRes = await db.execute({
      sql: `
        SELECT id, link_code, amount, currency, purpose, status, razorpay_payment_id, paid_at, created_at
        FROM payment_links
        WHERE customer_phone LIKE ? OR (customer_email IS NOT NULL AND customer_email = ?)
        ORDER BY created_at DESC
      `,
      args: [`%${last10}%`, email],
    });

    // 3. Invoices
    const invRes = await db.execute({
      sql: `
        SELECT id, invoice_number, type, subtotal, tax_amount, total_amount, currency, status, due_date, created_at
        FROM invoices
        WHERE client_phone LIKE ? OR (client_email IS NOT NULL AND client_email = ?)
        ORDER BY created_at DESC
      `,
      args: [`%${last10}%`, email],
    });

    // 4. Tour Bookings
    const bookRes = await db.execute({
      sql: `
        SELECT b.id, b.tour_id, t.title as tour_title, b.travel_date, b.travelers_count, b.status, b.total_amount, b.created_at
        FROM bookings b
        LEFT JOIN tours t ON b.tour_id = t.id
        WHERE b.customer_phone LIKE ? OR b.customer_email = ?
        ORDER BY b.created_at DESC
      `,
      args: [`%${last10}%`, email],
    });

    // 5. Family Members
    let familyMembers: any[] = [];
    try {
      const userRes = await db.execute({
        sql: `SELECT id FROM users WHERE (email = ? AND email != '') OR phone = ? LIMIT 1`,
        args: [email, contact.phone],
      });

      if (userRes.rows.length > 0) {
        const userId = String(userRes.rows[0].id);
        const famRes = await db.execute({
          sql: `SELECT * FROM family_members WHERE primary_user_id = ? ORDER BY created_at ASC`,
          args: [userId],
        });
        familyMembers = famRes.rows.map((r: any) => ({
          id: String(r.id),
          primary_user_id: String(r.primary_user_id),
          member_user_id: r.member_user_id ? String(r.member_user_id) : null,
          name: String(r.name),
          relationship: r.relationship,
          gender: r.gender,
          date_of_birth: r.date_of_birth,
          age_group: r.age_group,
          email: r.email,
          phone: r.phone,
          passport_number: r.passport_number,
          passport_expiry: r.passport_expiry,
          nationality: r.nationality,
          dietary_preference: r.dietary_preference,
          notes: r.notes,
          created_at: String(r.created_at),
          updated_at: String(r.updated_at),
        }));
      }
    } catch {
      familyMembers = [];
    }

    return {
      contact,
      familyMembers,
      itineraries: itnRes.rows.map((r) => ({
        id: String(r.id),
        reference_no: String(r.reference_no || r.id),
        title: String(r.title),
        destination: String(r.destination),
        start_date: r.start_date ? String(r.start_date) : null,
        duration_days: Number(r.duration_days || 1),
        duration_nights: Number(r.duration_nights || 1),
        total_price: Number(r.total_price || 0),
        price_per_person: r.price_per_person ? Number(r.price_per_person) : null,
        status: String(r.status || "Active"),
        created_at: String(r.created_at),
      })),
      paymentLinks: payRes.rows.map((r) => ({
        id: String(r.id),
        link_code: String(r.link_code),
        amount: Number(r.amount || 0),
        currency: String(r.currency || "INR"),
        purpose: String(r.purpose || "Travel Payment"),
        status: String(r.status || "pending"),
        razorpay_payment_id: r.razorpay_payment_id ? String(r.razorpay_payment_id) : null,
        paid_at: r.paid_at ? String(r.paid_at) : null,
        created_at: String(r.created_at),
      })),
      invoices: invRes.rows.map((r) => ({
        id: String(r.id),
        invoice_number: String(r.invoice_number),
        type: String(r.type || "Invoice"),
        subtotal: Number(r.subtotal || 0),
        tax_amount: Number(r.tax_amount || 0),
        total_amount: Number(r.total_amount || 0),
        currency: String(r.currency || "INR"),
        status: String(r.status || "Draft"),
        due_date: r.due_date ? String(r.due_date) : null,
        created_at: String(r.created_at),
      })),
      bookings: bookRes.rows.map((r) => ({
        id: String(r.id),
        tour_id: r.tour_id ? String(r.tour_id) : null,
        tour_title: r.tour_title ? String(r.tour_title) : "Custom Holiday Tour",
        travel_date: String(r.travel_date),
        travelers_count: Number(r.travelers_count || 1),
        status: String(r.status),
        total_amount: r.total_amount ? Number(r.total_amount) : null,
        created_at: String(r.created_at),
      })),
    };
  }

  /**
   * Update contact preferences, VIP tier, tags, and notes
   */
  async updateContact(
    id: string,
    data: {
      name?: string;
      email?: string | null;
      phone?: string;
      city?: string | null;
      state?: string | null;
      address?: string | null;
      tier?: CustomerTier;
      vip_status?: number;
      tags?: string[];
      preferences?: TravelPreferences;
      internal_notes?: string | null;
    }
  ): Promise<Contact | null> {
    const existing = await db.execute({
      sql: "SELECT * FROM contacts WHERE id = ?",
      args: [id],
    });
    if (existing.rows.length === 0) return null;

    const current = parseContactRow(existing.rows[0] as Record<string, unknown>);

    const name = data.name !== undefined ? data.name : current.name;
    const phone = data.phone !== undefined ? data.phone : current.phone;
    const { clean: phone_clean } = normalizePhone(phone);
    const email = data.email !== undefined ? data.email : current.email;
    const city = data.city !== undefined ? data.city : current.city;
    const state = data.state !== undefined ? data.state : current.state;
    const address = data.address !== undefined ? data.address : current.address;
    const vip_status = data.vip_status !== undefined ? data.vip_status : current.vip_status;
    const tier =
      data.tier !== undefined
        ? data.tier
        : computeTier(current.total_spent, current.deals_count, vip_status);
    const tags = data.tags !== undefined ? data.tags : current.tags;
    const preferences = data.preferences !== undefined ? data.preferences : current.preferences;
    const internal_notes =
      data.internal_notes !== undefined ? data.internal_notes : current.internal_notes;

    const now = new Date().toISOString();

    await db.execute({
      sql: `
        UPDATE contacts SET
          name = ?,
          phone = ?,
          phone_clean = ?,
          email = ?,
          city = ?,
          state = ?,
          address = ?,
          tier = ?,
          vip_status = ?,
          tags_json = ?,
          preferences_json = ?,
          internal_notes = ?,
          updated_at = ?
        WHERE id = ?
      `,
      args: [
        name,
        phone,
        phone_clean,
        email,
        city,
        state,
        address,
        tier,
        vip_status,
        JSON.stringify(tags),
        JSON.stringify(preferences),
        internal_notes,
        now,
        id,
      ],
    });

    return this.getContactById(id).then((res) => res?.contact || null);
  }

  /**
   * Delete contact
   */
  async deleteContact(id: string): Promise<boolean> {
    const res = await db.execute({
      sql: "DELETE FROM contacts WHERE id = ?",
      args: [id],
    });
    return (res.rowsAffected || 0) > 0;
  }

  /**
   * Upsert a contact when a new quote/itinerary, payment link, invoice, or booking is created
   */
  async recordCustomerActivity(params: {
    name: string;
    phone: string;
    email?: string | null;
    amount?: number;
    isPaid?: boolean;
    source?: string;
    city?: string | null;
    notes?: string | null;
  }): Promise<Contact> {
    const { clean, last10 } = normalizePhone(params.phone);
    const amount = Number(params.amount || 0);
    const isPaid = !!params.isPaid;
    const now = new Date().toISOString();

    const hasValidPhone = Boolean(last10 && last10.length >= 8);
    const hasValidEmail = Boolean(params.email && params.email.trim().includes("@"));

    let existingRes = { rows: [] as unknown[] };

    if (hasValidPhone && hasValidEmail) {
      existingRes = await db.execute({
        sql: `SELECT * FROM contacts WHERE phone_clean LIKE ? OR LOWER(email) = ? LIMIT 1`,
        args: [`%${last10}%`, params.email!.trim().toLowerCase()],
      });
    } else if (hasValidPhone) {
      existingRes = await db.execute({
        sql: `SELECT * FROM contacts WHERE phone_clean LIKE ? LIMIT 1`,
        args: [`%${last10}%`],
      });
    } else if (hasValidEmail) {
      existingRes = await db.execute({
        sql: `SELECT * FROM contacts WHERE LOWER(email) = ? LIMIT 1`,
        args: [params.email!.trim().toLowerCase()],
      });
    }

    if (existingRes.rows.length > 0) {
      const contact = parseContactRow(existingRes.rows[0] as Record<string, unknown>);
      const newSpent = isPaid ? contact.total_spent + amount : contact.total_spent;
      const newDeals = contact.deals_count + 1;
      const newTier = computeTier(newSpent, newDeals, contact.vip_status);

      await db.execute({
        sql: `
          UPDATE contacts SET
            name = COALESCE(NULLIF(?, ''), name),
            email = COALESCE(NULLIF(?, ''), email),
            total_spent = ?,
            deals_count = ?,
            tier = ?,
            last_interaction_at = ?,
            updated_at = ?
          WHERE id = ?
        `,
        args: [
          params.name || "",
          params.email || "",
          newSpent,
          newDeals,
          newTier,
          now,
          now,
          contact.id,
        ],
      });

      return {
        ...contact,
        total_spent: newSpent,
        deals_count: newDeals,
        tier: newTier,
        last_interaction_at: now,
      };
    } else {
      // Create fresh contact
      const id = `CONT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      const newSpent = isPaid ? amount : 0;
      const dealsCount = 1;
      const tier = computeTier(newSpent, dealsCount, 0);

      await db.execute({
        sql: `
          INSERT INTO contacts (
            id, name, phone, phone_clean, email, city, tier, vip_status,
            tags_json, preferences_json, internal_notes, source,
            total_spent, deals_count, last_interaction_at, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, '[]', '{}', ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          id,
          params.name.trim(),
          params.phone.trim(),
          clean,
          params.email?.trim() || null,
          params.city || null,
          tier,
          params.notes || null,
          params.source || "System",
          newSpent,
          dealsCount,
          now,
          now,
          now,
        ],
      });

      return {
        id,
        name: params.name.trim(),
        phone: params.phone.trim(),
        phone_clean: clean,
        email: params.email?.trim() || null,
        city: params.city || null,
        state: null,
        address: null,
        tier,
        vip_status: 0,
        tags: [],
        preferences: {},
        internal_notes: params.notes || null,
        source: params.source || "System",
        total_spent: newSpent,
        deals_count: dealsCount,
        last_interaction_at: now,
        created_at: now,
        updated_at: now,
      };
    }
  }

  /**
   * Syncs and aggregates all historical contacts from payment_links, itineraries, invoices, bookings, and users.
   */
  async syncAllHistoricalContacts(): Promise<{ syncedCount: number }> {
    // 1. Gather all unique contacts across tables
    const phoneMap = new Map<
      string,
      {
        name: string;
        phone: string;
        email: string | null;
        totalSpent: number;
        dealsCount: number;
        sources: Set<string>;
        latestDate: string;
      }
    >();

    const recordEntry = (
      name: string,
      phone: string,
      email: string | null,
      amount: number,
      isPaid: boolean,
      source: string,
      date: string
    ) => {
      if (!phone && !name) return;
      const { last10 } = normalizePhone(phone);
      const key = last10 && last10.length >= 8 ? last10 : email || name.toLowerCase().trim();
      if (!key) return;

      const existing = phoneMap.get(key);
      const validAmount = Number(amount || 0);

      if (existing) {
        if (!existing.email && email) existing.email = email;
        if (existing.name.length < name.length && name) existing.name = name;
        if (isPaid) existing.totalSpent += validAmount;
        existing.dealsCount += 1;
        existing.sources.add(source);
        if (date && date > existing.latestDate) existing.latestDate = date;
      } else {
        phoneMap.set(key, {
          name: name.trim(),
          phone: phone.trim() || "+91 ",
          email: email?.trim() || null,
          totalSpent: isPaid ? validAmount : 0,
          dealsCount: 1,
          sources: new Set([source]),
          latestDate: date || new Date().toISOString(),
        });
      }
    };

    // A. Scan payment links
    try {
      const payLinks = await db.execute(
        "SELECT customer_name, customer_phone, customer_email, amount, status, razorpay_payment_id, paid_at, created_at FROM payment_links"
      );
      for (const r of payLinks.rows) {
        const isPaid = r.status === "paid" || !!r.razorpay_payment_id;
        recordEntry(
          String(r.customer_name || ""),
          String(r.customer_phone || ""),
          r.customer_email ? String(r.customer_email) : null,
          Number(r.amount || 0),
          isPaid,
          "Payment",
          String(r.paid_at || r.created_at || "")
        );
      }
    } catch (e) {
      console.error("Error reading payment_links for contact sync:", e);
    }

    // B. Scan itineraries (quotes)
    try {
      const itineraries = await db.execute(
        "SELECT client_name, client_phone, client_email, total_price, status, created_at FROM itineraries"
      );
      for (const r of itineraries.rows) {
        const isConfirmed = r.status === "Confirmed";
        recordEntry(
          String(r.client_name || ""),
          String(r.client_phone || ""),
          r.client_email ? String(r.client_email) : null,
          Number(r.total_price || 0),
          isConfirmed,
          "Itinerary",
          String(r.created_at || "")
        );
      }
    } catch (e) {
      console.error("Error reading itineraries for contact sync:", e);
    }

    // C. Scan invoices
    try {
      const invoices = await db.execute(
        "SELECT client_name, client_phone, client_email, total_amount, status, created_at FROM invoices"
      );
      for (const r of invoices.rows) {
        const isPaid = r.status === "Paid";
        recordEntry(
          String(r.client_name || ""),
          String(r.client_phone || ""),
          r.client_email ? String(r.client_email) : null,
          Number(r.total_amount || 0),
          isPaid,
          "Invoice",
          String(r.created_at || "")
        );
      }
    } catch (e) {
      console.error("Error reading invoices for contact sync:", e);
    }

    // D. Scan bookings
    try {
      const bookings = await db.execute(
        "SELECT customer_name, customer_phone, customer_email, total_amount, status, created_at FROM bookings"
      );
      for (const r of bookings.rows) {
        const isCompleted = r.status === "confirmed" || r.status === "completed";
        recordEntry(
          String(r.customer_name || ""),
          String(r.customer_phone || ""),
          r.customer_email ? String(r.customer_email) : null,
          Number(r.total_amount || 0),
          isCompleted,
          "Booking",
          String(r.created_at || "")
        );
      }
    } catch (e) {
      console.error("Error reading bookings for contact sync:", e);
    }

    // E. Scan users (registered clients)
    try {
      const users = await db.execute(
        "SELECT name, phone, email, created_at FROM users WHERE role = 'client'"
      );
      for (const r of users.rows) {
        recordEntry(
          String(r.name || ""),
          String(r.phone || ""),
          r.email ? String(r.email) : null,
          0,
          false,
          "User Account",
          String(r.created_at || "")
        );
      }
    } catch (e) {
      console.error("Error reading users for contact sync:", e);
    }

    // Now upsert all accumulated contacts
    let syncedCount = 0;
    const now = new Date().toISOString();

    for (const [, item] of phoneMap.entries()) {
      const { clean, last10 } = normalizePhone(item.phone);
      if (!item.name || item.name.length < 2) continue;

      const tier = computeTier(item.totalSpent, item.dealsCount, 0);
      const sourceStr = Array.from(item.sources).join(", ") || "Direct";

      // Check if contact already exists
      const existing = await db.execute({
        sql: "SELECT id, internal_notes, preferences_json, tags_json, vip_status FROM contacts WHERE phone_clean LIKE ? OR (email IS NOT NULL AND email = ?)",
        args: [`%${last10}%`, item.email || "NO_EMAIL_MATCH"],
      });

      if (existing.rows.length > 0) {
        const row = existing.rows[0];
        const vipStatus = Number(row.vip_status || 0);
        const finalTier = computeTier(item.totalSpent, item.dealsCount, vipStatus);

        await db.execute({
          sql: `
            UPDATE contacts SET
              name = COALESCE(NULLIF(?, ''), name),
              phone = COALESCE(NULLIF(?, ''), phone),
              phone_clean = ?,
              email = COALESCE(NULLIF(?, ''), email),
              total_spent = MAX(total_spent, ?),
              deals_count = MAX(deals_count, ?),
              tier = ?,
              last_interaction_at = MAX(COALESCE(last_interaction_at, ''), ?),
              updated_at = ?
            WHERE id = ?
          `,
          args: [
            item.name,
            item.phone,
            clean,
            item.email,
            item.totalSpent,
            item.dealsCount,
            finalTier,
            item.latestDate,
            now,
            String(row.id),
          ],
        });
      } else {
        const newId = `CONT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
        await db.execute({
          sql: `
            INSERT INTO contacts (
              id, name, phone, phone_clean, email, city, tier, vip_status,
              tags_json, preferences_json, internal_notes, source,
              total_spent, deals_count, last_interaction_at, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, NULL, ?, 0, '[]', '{}', NULL, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            newId,
            item.name,
            item.phone,
            clean,
            item.email,
            tier,
            sourceStr,
            item.totalSpent,
            item.dealsCount,
            item.latestDate,
            now,
            now,
          ],
        });
      }
      syncedCount++;
    }

    return { syncedCount };
  }
}

export const contactService = new ContactService();
