import { bookingRepository } from "../repository/booking.repository";
import { Booking, CreateBookingDto } from "../domain/booking.entity";

export class BookingService {
  async getAllBookings(): Promise<Booking[]> {
    return bookingRepository.findAll();
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return bookingRepository.findById(id);
  }

  async createBooking(data: CreateBookingDto): Promise<Booking> {
    if (!data.customer_name || !data.customer_email || !data.customer_phone) {
      throw new Error("Full name, email and phone number are required");
    }
    const created = await bookingRepository.create(data);

    // Automatically record / update customer profile in Unified Contacts CRM
    try {
      const { contactService } = await import("@/modules/contacts/service/contact.service");
      await contactService.recordCustomerActivity({
        name: data.customer_name,
        phone: data.customer_phone,
        email: data.customer_email,
        amount: data.total_amount || 0,
        isPaid: false,
        source: "Tour Booking Inquiry",
        notes: `Tour: ${data.tour_id || "Custom"} | Travelers: ${data.travelers_count} | Travel Date: ${data.travel_date}`,
      });
    } catch (crmErr) {
      console.warn("Auto-sync contact for booking non-fatal error:", crmErr);
    }

    return created;
  }

  async updateStatus(id: string, status: Booking["status"]): Promise<Booking> {
    return bookingRepository.updateStatus(id, status);
  }

  async deleteBooking(id: string): Promise<boolean> {
    return bookingRepository.delete(id);
  }
}

export const bookingService = new BookingService();
