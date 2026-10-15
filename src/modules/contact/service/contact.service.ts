import { contactRepository } from "../repository/contact.repository";
import { ContactMessage, CreateContactDto } from "../domain/contact.entity";

export class ContactService {
  async getAllMessages(): Promise<ContactMessage[]> {
    return contactRepository.findAll();
  }

  async getMessageById(id: string): Promise<ContactMessage | null> {
    return contactRepository.findById(id);
  }

  async sendMessage(data: CreateContactDto): Promise<ContactMessage> {
    if (!data.name || !data.email || !data.message) {
      throw new Error("Name, email and message are required");
    }
    const created = await contactRepository.create(data);

    // Automatically record / update customer profile in Unified Contacts CRM
    try {
      const { contactService: crmContactService } = await import("@/modules/contacts/service/contact.service");
      await crmContactService.recordCustomerActivity({
        name: data.name,
        phone: data.phone || "",
        email: data.email,
        amount: 0,
        isPaid: false,
        source: "Contact Form Message",
        notes: `Subject: ${data.subject || "General Inquiry"}`,
      });
    } catch (crmErr) {
      console.warn("Auto-sync contact for message non-fatal error:", crmErr);
    }

    return created;
  }

  async updateStatus(id: string, status: ContactMessage["status"]): Promise<ContactMessage> {
    return contactRepository.updateStatus(id, status);
  }

  async deleteMessage(id: string): Promise<boolean> {
    return contactRepository.delete(id);
  }
}

export const contactService = new ContactService();
