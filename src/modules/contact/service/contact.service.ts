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
    return contactRepository.create(data);
  }

  async updateStatus(id: string, status: ContactMessage["status"]): Promise<ContactMessage> {
    return contactRepository.updateStatus(id, status);
  }

  async deleteMessage(id: string): Promise<boolean> {
    return contactRepository.delete(id);
  }
}

export const contactService = new ContactService();
