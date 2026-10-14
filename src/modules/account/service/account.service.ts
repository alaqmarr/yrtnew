import { db } from "@/infrastructure/db/client";
import { ClientDashboardData, ClientProfile } from "../domain/account.entity";
import { ticketRepository } from "../repository/ticket.repository";
import { galleryLikeRepository } from "@/modules/gallery/repository/gallery-like.repository";
import { Booking } from "@/modules/bookings/domain/booking.entity";
import { FlightInquiry } from "@/modules/flights/domain/flight-inquiry.entity";
import { PaymentLink } from "@/modules/payments/domain/payment-link.entity";
import { Itinerary } from "@/modules/itineraries/domain/itinerary.entity";
import { Invoice } from "@/modules/invoices/domain/invoice.entity";

export class AccountService {
  async getDashboardData(userId: string, email: string, phone?: string): Promise<ClientDashboardData> {
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone ? phone.trim() : "";

    // 1. Fetch user profile
    const userRes = await db.execute({
      sql: "SELECT id, name, email, phone, role FROM users WHERE id = ? OR email = ? LIMIT 1",
      args: [userId, cleanEmail],
    });
    const userRow = userRes.rows[0];

    const profile: ClientProfile = {
      id: userRow ? String(userRow.id) : userId,
      name: userRow ? String(userRow.name) : "Valued Traveler",
      email: userRow ? String(userRow.email) : cleanEmail,
      phone: userRow?.phone ? String(userRow.phone) : cleanPhone,
      role: userRow ? String(userRow.role) : "client",
    };

    // 2. Fetch Bookings
    const bookingsRes = await db.execute({
      sql: `SELECT b.*, t.title as tour_title 
            FROM bookings b 
            LEFT JOIN tours t ON b.tour_id = t.id 
            WHERE LOWER(b.customer_email) = ? OR (b.customer_phone = ? AND ? != '')
            ORDER BY b.created_at DESC`,
      args: [cleanEmail, profile.phone, profile.phone],
    });

    const bookings: Booking[] = bookingsRes.rows.map((row) => ({
      id: String(row.id),
      tour_id: row.tour_id ? String(row.tour_id) : null,
      tour_title: row.tour_title ? String(row.tour_title) : undefined,
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
    const flightsRes = await db.execute({
      sql: `SELECT * FROM flight_inquiries 
            WHERE LOWER(customer_email) = ? OR (customer_phone = ? AND ? != '')
            ORDER BY created_at DESC`,
      args: [cleanEmail, profile.phone, profile.phone],
    });

    const flights: FlightInquiry[] = flightsRes.rows.map((row) => ({
      id: String(row.id),
      trip_type: row.trip_type as FlightInquiry["trip_type"],
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
    const paymentRes = await db.execute({
      sql: `SELECT * FROM payment_links 
            WHERE LOWER(customer_email) = ? OR (customer_phone = ? AND ? != '')
            ORDER BY created_at DESC`,
      args: [cleanEmail, profile.phone, profile.phone],
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
    const itinerariesRes = await db.execute({
      sql: `SELECT * FROM itineraries 
            WHERE user_id = ? OR (LOWER(client_email) = ? AND ? != '') OR (client_phone = ? AND ? != '')
            ORDER BY created_at DESC`,
      args: [profile.id, cleanEmail, cleanEmail, profile.phone, profile.phone],
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
      package_highlights_json: row.package_highlights_json
        ? String(row.package_highlights_json)
        : "[]",
      important_notes_json: row.important_notes_json
        ? String(row.important_notes_json)
        : "[]",
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
    }));

    // 6. Fetch Invoices
    const invoicesRes = await db.execute({
      sql: `SELECT * FROM invoices 
            WHERE LOWER(client_email) = ? OR (client_phone = ? AND ? != '')
            ORDER BY created_at DESC`,
      args: [cleanEmail, profile.phone, profile.phone],
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
    const tickets = await ticketRepository.findByUser(userId, cleanEmail);

    // 8. Fetch Saved Gallery Favorites
    const favorites = await galleryLikeRepository.getUserLikedItems(userId);

    // Calculate quick stats
    const stats = {
      totalBookings: bookings.length,
      activeInquiries: flights.filter((f) => f.status === "new" || f.status === "contacted").length,
      pendingPayments: paymentLinks.filter((p) => p.status === "pending").length,
      openTickets: tickets.filter((t) => t.status === "open" || t.status === "in_progress").length,
      savedFavorites: favorites.length,
      totalItineraries: itineraries.length,
    };

    return {
      profile,
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
