import { db } from "@/infrastructure/db/client";
import { ClientDashboardData, ClientProfile } from "../domain/account.entity";
import { ticketRepository } from "../repository/ticket.repository";
import { galleryLikeRepository } from "@/modules/gallery/repository/gallery-like.repository";
import { familyRepository } from "@/modules/family/repository/family.repository";
import { FamilyMember } from "@/modules/family/domain/family.entity";
import { Booking } from "@/modules/bookings/domain/booking.entity";
import { FlightInquiry } from "@/modules/flights/domain/flight-inquiry.entity";
import { PaymentLink } from "@/modules/payments/domain/payment-link.entity";
import { Itinerary } from "@/modules/itineraries/domain/itinerary.entity";
import { Invoice } from "@/modules/invoices/domain/invoice.entity";

export class AccountService {
  async getDashboardData(userId: string, email: string, phone?: string): Promise<ClientDashboardData> {
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone ? phone.trim() : "";

    // 1. Fetch user profile with family fields
    const userRes = await db.execute({
      sql: "SELECT id, name, email, phone, role, family_head_id, relationship_to_head FROM users WHERE id = ? OR email = ? LIMIT 1",
      args: [userId, cleanEmail],
    });
    const userRow = userRes.rows[0];

    const familyHeadId = userRow?.family_head_id ? String(userRow.family_head_id) : null;
    const isFamilyHead = !familyHeadId;

    const profile: ClientProfile = {
      id: userRow ? String(userRow.id) : userId,
      name: userRow ? String(userRow.name) : "Valued Traveler",
      email: userRow ? String(userRow.email) : cleanEmail,
      phone: userRow?.phone ? String(userRow.phone) : cleanPhone,
      role: userRow ? String(userRow.role) : "client",
      family_head_id: familyHeadId,
      relationship_to_head: userRow?.relationship_to_head ? String(userRow.relationship_to_head) : null,
    };

    let familyHead: ClientDashboardData["familyHead"] = null;
    let familyMembers: FamilyMember[] = [];

    // Filter sets for database queries
    let queryEmails: string[] = [cleanEmail];
    let queryPhones: string[] = profile.phone ? [profile.phone] : [];
    let queryUserIds: string[] = [profile.id];
    let queryFamilyMemberIds: string[] = [];

    if (!isFamilyHead && familyHeadId) {
      // ----------------------------------------------------
      // CASE A: SUB-ACCOUNT (Strictly isolated view)
      // ----------------------------------------------------
      const headRes = await db.execute({
        sql: "SELECT id, name, email, phone FROM users WHERE id = ? LIMIT 1",
        args: [familyHeadId],
      });
      if (headRes.rows[0]) {
        familyHead = {
          id: String(headRes.rows[0].id),
          name: String(headRes.rows[0].name),
          email: String(headRes.rows[0].email),
          phone: headRes.rows[0].phone ? String(headRes.rows[0].phone) : null,
        };
      }

      // Find own family member entry
      const myMem =
        (await familyRepository.findByMemberUserId(profile.id)) ||
        (await familyRepository.findByEmail(cleanEmail));
      if (myMem) {
        familyMembers = [myMem];
        queryFamilyMemberIds.push(myMem.id);
      }

      // Note: queryEmails, queryPhones, queryUserIds remain ONLY the sub-account's own credentials!
    } else {
      // ----------------------------------------------------
      // CASE B: MAIN ACCOUNT (Family Head with full visibility)
      // ----------------------------------------------------
      familyMembers = await familyRepository.findByPrimaryUserId(profile.id);
      queryFamilyMemberIds = familyMembers.map((m) => m.id);

      // Fetch linked sub-accounts
      const subAccountsRes = await db.execute({
        sql: "SELECT id, email, phone FROM users WHERE family_head_id = ?",
        args: [profile.id],
      });

      for (const row of subAccountsRes.rows) {
        if (row.id) queryUserIds.push(String(row.id));
        if (row.email) queryEmails.push(String(row.email).toLowerCase().trim());
        if (row.phone) queryPhones.push(String(row.phone).trim());
      }

      // Add emails and phones from family members list
      for (const m of familyMembers) {
        if (m.email) queryEmails.push(m.email.toLowerCase().trim());
        if (m.phone) queryPhones.push(m.phone.trim());
        if (m.member_user_id) queryUserIds.push(m.member_user_id);
      }

      queryEmails = Array.from(new Set(queryEmails.filter(Boolean)));
      queryPhones = Array.from(new Set(queryPhones.filter(Boolean)));
      queryUserIds = Array.from(new Set(queryUserIds.filter(Boolean)));
      queryFamilyMemberIds = Array.from(new Set(queryFamilyMemberIds.filter(Boolean)));
    }

    // 2. Fetch Bookings
    const emailPlaceholders = queryEmails.map(() => "?").join(",");
    const phonePlaceholders = queryPhones.length > 0 ? queryPhones.map(() => "?").join(",") : "''";
    const userPlaceholders = queryUserIds.map(() => "?").join(",");
    const memberPlaceholders =
      queryFamilyMemberIds.length > 0 ? queryFamilyMemberIds.map(() => "?").join(",") : "''";

    const bookingSql = `
      SELECT b.*, t.title as tour_title 
      FROM bookings b 
      LEFT JOIN tours t ON b.tour_id = t.id 
      WHERE (b.user_id IN (${userPlaceholders}))
         ${queryFamilyMemberIds.length > 0 ? `OR (b.family_member_id IN (${memberPlaceholders}))` : ""}
         OR (b.user_id IS NULL AND (
           (LOWER(b.customer_email) IN (${emailPlaceholders}))
           ${queryPhones.length > 0 ? `OR (b.customer_phone IN (${phonePlaceholders}))` : ""}
         ))
      ORDER BY b.created_at DESC
    `;

    const bookingArgs = [
      ...queryUserIds,
      ...(queryFamilyMemberIds.length > 0 ? queryFamilyMemberIds : []),
      ...queryEmails,
      ...(queryPhones.length > 0 ? queryPhones : []),
    ];

    const bookingsRes = await db.execute({
      sql: bookingSql,
      args: bookingArgs,
    });

    const bookings: Booking[] = bookingsRes.rows.map((row) => ({
      id: String(row.id),
      tour_id: row.tour_id ? String(row.tour_id) : null,
      tour_title: row.tour_title ? String(row.tour_title) : undefined,
      user_id: row.user_id ? String(row.user_id) : null,
      family_member_id: row.family_member_id ? String(row.family_member_id) : null,
      customer_name: String(row.customer_name),
      customer_email: String(row.customer_email),
      customer_phone: String(row.customer_phone),
      travel_date: String(row.travel_date),
      travelers_count: Number(row.travelers_count || 1),
      special_requests: row.special_requests ? String(row.special_requests) : null,
      status: row.status as Booking["status"],
      total_amount: row.total_amount ? Number(row.total_amount) : null,
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    }));

    // 3. Fetch Flight Inquiries
    const flightsSql = `
      SELECT * FROM flight_inquiries 
      WHERE (user_id IN (${userPlaceholders}))
         ${queryFamilyMemberIds.length > 0 ? `OR (family_member_id IN (${memberPlaceholders}))` : ""}
         OR (user_id IS NULL AND (
           (LOWER(customer_email) IN (${emailPlaceholders}))
           ${queryPhones.length > 0 ? `OR (customer_phone IN (${phonePlaceholders}))` : ""}
         ))
      ORDER BY created_at DESC
    `;

    const flightsRes = await db.execute({
      sql: flightsSql,
      args: bookingArgs,
    });

    const flights: FlightInquiry[] = flightsRes.rows.map((row) => ({
      id: String(row.id),
      trip_type: row.trip_type as FlightInquiry["trip_type"],
      user_id: row.user_id ? String(row.user_id) : null,
      family_member_id: row.family_member_id ? String(row.family_member_id) : null,
      from_city: String(row.from_city),
      to_city: String(row.to_city),
      depart_date: String(row.depart_date),
      return_date: row.return_date ? String(row.return_date) : null,
      passengers_adults: Number(row.passengers_adults || 1),
      passengers_children: Number(row.passengers_children || 0),
      passengers_infants: Number(row.passengers_infants || 0),
      cabin_class: row.cabin_class as FlightInquiry["cabin_class"],
      preferred_airline: row.preferred_airline ? String(row.preferred_airline) : null,
      customer_name: String(row.customer_name),
      customer_email: String(row.customer_email),
      customer_phone: String(row.customer_phone),
      status: row.status as FlightInquiry["status"],
      notes: row.notes ? String(row.notes) : null,
      created_at: String(row.created_at),
    }));

    // 4. Fetch Payment Links
    const paymentSql = `
      SELECT * FROM payment_links 
      WHERE (LOWER(customer_email) IN (${emailPlaceholders}))
         OR (customer_phone IN (${phonePlaceholders}))
      ORDER BY created_at DESC
    `;
    const paymentArgs = [...queryEmails, ...(queryPhones.length > 0 ? queryPhones : [])];
    const paymentRes = await db.execute({
      sql: paymentSql,
      args: paymentArgs,
    });

    const paymentLinks: PaymentLink[] = paymentRes.rows.map((row) => ({
      id: String(row.id),
      link_code: String(row.link_code),
      customer_name: String(row.customer_name),
      customer_email: row.customer_email ? String(row.customer_email) : null,
      customer_phone: String(row.customer_phone),
      amount: Number(row.amount),
      currency: String(row.currency || "INR"),
      purpose: String(row.purpose),
      description: row.description ? String(row.description) : null,
      status: row.status as PaymentLink["status"],
      razorpay_order_id: row.razorpay_order_id ? String(row.razorpay_order_id) : null,
      razorpay_payment_id: row.razorpay_payment_id ? String(row.razorpay_payment_id) : null,
      paid_at: row.paid_at ? String(row.paid_at) : null,
      expires_at: row.expires_at ? String(row.expires_at) : null,
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    }));

    // 5. Fetch Custom Itineraries
    const itinerariesSql = `
      SELECT * FROM itineraries 
      WHERE (user_id IN (${userPlaceholders}))
         OR (LOWER(client_email) IN (${emailPlaceholders}))
         OR (client_phone IN (${phonePlaceholders}))
      ORDER BY created_at DESC
    `;
    const itinerariesRes = await db.execute({
      sql: itinerariesSql,
      args: [...queryUserIds, ...queryEmails, ...(queryPhones.length > 0 ? queryPhones : [])],
    });

    const itineraries: Itinerary[] = itinerariesRes.rows.map((row) => ({
      id: String(row.id),
      reference_no: String(row.reference_no),
      user_id: row.user_id ? String(row.user_id) : null,
      client_name: String(row.client_name),
      client_email: row.client_email ? String(row.client_email) : null,
      client_phone: String(row.client_phone),
      destination: String(row.destination),
      title: String(row.title),
      start_date: row.start_date ? String(row.start_date) : null,
      duration_days: Number(row.duration_days),
      duration_nights: Number(row.duration_nights),
      travelers_count: Number(row.travelers_count),
      hotel_details: row.hotel_details ? String(row.hotel_details) : null,
      flights_json: String(row.flights_json || "[]"),
      days_json: String(row.days_json || "[]"),
      inclusions_json: String(row.inclusions_json || "[]"),
      exclusions_json: String(row.exclusions_json || "[]"),
      total_price: Number(row.total_price),
      currency: String(row.currency || "INR"),
      status: (row.status as Itinerary["status"]) || "Active",
      notes: row.notes ? String(row.notes) : null,
      vehicle: row.vehicle ? String(row.vehicle) : "Toyota Etios",
      pax_label: row.pax_label ? String(row.pax_label) : `${row.travelers_count || 2} Adults`,
      price_per_person:
        row.price_per_person !== undefined && row.price_per_person !== null
          ? Number(row.price_per_person)
          : null,
      accommodations_json: row.accommodations_json ? String(row.accommodations_json) : "[]",
      package_highlights_json: row.package_highlights_json ? String(row.package_highlights_json) : "[]",
      important_notes_json: row.important_notes_json ? String(row.important_notes_json) : "[]",
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    }));

    // 6. Fetch Invoices
    const invoicesSql = `
      SELECT * FROM invoices 
      WHERE (LOWER(client_email) IN (${emailPlaceholders}))
         OR (client_phone IN (${phonePlaceholders}))
      ORDER BY created_at DESC
    `;
    const invoicesRes = await db.execute({
      sql: invoicesSql,
      args: paymentArgs,
    });

    const invoices: Invoice[] = invoicesRes.rows.map((row) => ({
      id: String(row.id),
      invoice_number: String(row.invoice_number),
      type: (row.type as Invoice["type"]) || "Invoice",
      client_name: String(row.client_name),
      client_email: row.client_email ? String(row.client_email) : null,
      client_phone: String(row.client_phone),
      client_address: row.client_address ? String(row.client_address) : null,
      items_json: String(row.items_json || "[]"),
      subtotal: Number(row.subtotal),
      tax_percent: Number(row.tax_percent),
      tax_amount: Number(row.tax_amount),
      discount_amount: Number(row.discount_amount),
      total_amount: Number(row.total_amount),
      currency: String(row.currency || "INR"),
      status: (row.status as Invoice["status"]) || "Draft",
      due_date: row.due_date ? String(row.due_date) : null,
      notes: row.notes ? String(row.notes) : null,
      terms: row.terms ? String(row.terms) : null,
      payment_link_id: row.payment_link_id ? String(row.payment_link_id) : null,
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    }));

    // 7. Fetch Support Tickets
    let tickets = await ticketRepository.findByUser(profile.id, cleanEmail);
    if (isFamilyHead && queryUserIds.length > 1) {
      // Also fetch tickets from sub-accounts for the family head
      for (const subId of queryUserIds) {
        if (subId !== profile.id) {
          const subTickets = await ticketRepository.findByUser(subId);
          tickets = [...tickets, ...subTickets];
        }
      }
      // Deduplicate by ticket id
      const seen = new Set<string>();
      tickets = tickets.filter((t) => {
        if (seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      });
    }

    // 8. Fetch Saved Gallery Favorites
    const favorites = await galleryLikeRepository.getUserLikedItems(profile.id);

    // Calculate quick stats
    const stats = {
      totalBookings: bookings.length,
      activeInquiries: flights.filter((f) => f.status === "new" || f.status === "contacted").length,
      pendingPayments: paymentLinks.filter((p) => p.status === "pending").length,
      openTickets: tickets.filter((t) => t.status === "open" || t.status === "in_progress").length,
      savedFavorites: favorites.length,
      totalItineraries: itineraries.length,
      totalFamilyMembers: familyMembers.length,
    };

    return {
      profile,
      isFamilyHead,
      familyHead,
      familyMembers,
      bookings,
      flights,
      paymentLinks,
      itineraries,
      invoices,
      tickets,
      favorites,
      stats,
    };
  }
}

export const accountService = new AccountService();
