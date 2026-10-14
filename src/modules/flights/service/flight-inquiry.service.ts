import { flightInquiryRepository } from "../repository/flight-inquiry.repository";
import { FlightInquiry, CreateFlightInquiryDto } from "../domain/flight-inquiry.entity";

export class FlightInquiryService {
  async getAllInquiries(): Promise<FlightInquiry[]> {
    return flightInquiryRepository.findAll();
  }

  async getInquiryById(id: string): Promise<FlightInquiry | null> {
    return flightInquiryRepository.findById(id);
  }

  async submitInquiry(data: CreateFlightInquiryDto): Promise<FlightInquiry> {
    // Validate email & phone
    if (!data.customer_email || !data.customer_phone || !data.customer_name) {
      throw new Error("Customer name, email and phone number are required");
    }
    if (!data.from_city || !data.to_city || !data.depart_date) {
      throw new Error("Origin, destination and travel date are required");
    }

    return flightInquiryRepository.create(data);
  }

  async updateStatus(id: string, status: FlightInquiry["status"], notes?: string): Promise<FlightInquiry> {
    return flightInquiryRepository.updateStatus(id, status, notes);
  }

  async deleteInquiry(id: string): Promise<boolean> {
    return flightInquiryRepository.delete(id);
  }
}

export const flightInquiryService = new FlightInquiryService();
