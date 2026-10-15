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
    if (!data.customer_phone || !data.customer_name) {
      throw new Error("Customer name and phone number are required");
    }
    if (!data.from_city || !data.to_city || !data.depart_date) {
      throw new Error("Origin, destination and travel date are required");
    }

    const effectiveEmail =
      data.customer_email?.trim() ||
      `${data.customer_phone.replace(/\D/g, "") || "traveler"}@inquiry.yellowribbontravels.com`;

    const created = await flightInquiryRepository.create({
      ...data,
      customer_email: effectiveEmail,
    });

    // Automatically record / update customer profile in Unified Contacts CRM
    try {
      const { contactService } = await import("@/modules/contacts/service/contact.service");
      await contactService.recordCustomerActivity({
        name: data.customer_name,
        phone: data.customer_phone,
        email: effectiveEmail,
        amount: 0,
        isPaid: false,
        source: "Flight Inquiry",
        notes: `Flight: ${data.from_city} -> ${data.to_city} (${data.trip_type}) | Cabin: ${data.cabin_class}`,
      });
    } catch (crmErr) {
      console.warn("Auto-sync contact for flight non-fatal error:", crmErr);
    }

    return created;
  }

  async updateStatus(id: string, status: FlightInquiry["status"], notes?: string): Promise<FlightInquiry> {
    return flightInquiryRepository.updateStatus(id, status, notes);
  }

  async deleteInquiry(id: string): Promise<boolean> {
    return flightInquiryRepository.delete(id);
  }
}

export const flightInquiryService = new FlightInquiryService();
