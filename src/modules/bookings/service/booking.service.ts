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
    return bookingRepository.create(data);
  }

  async updateStatus(id: string, status: Booking["status"]): Promise<Booking> {
    return bookingRepository.updateStatus(id, status);
  }

  async deleteBooking(id: string): Promise<boolean> {
    return bookingRepository.delete(id);
  }
}

export const bookingService = new BookingService();
