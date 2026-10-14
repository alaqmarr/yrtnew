import { invoiceRepository } from "../repository/invoice.repository";
import { Invoice, CreateInvoiceDto, UpdateInvoiceDto } from "../domain/invoice.entity";
import { contactService } from "@/modules/contacts/service/contact.service";

export class InvoiceService {
  async getAllInvoices(): Promise<Invoice[]> {
    return invoiceRepository.findAll();
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    return invoiceRepository.findById(id);
  }

  async createInvoice(data: CreateInvoiceDto): Promise<Invoice> {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = data.type === "Quote" ? "QTE" : "INV";
    const invoiceNumber = `${prefix}-${year}-${randomNum}`;

    const created = await invoiceRepository.create(data, invoiceNumber);

    contactService
      .recordCustomerActivity({
        name: data.client_name,
        phone: data.client_phone,
        email: data.client_email,
        amount: data.total_amount,
        isPaid: data.status === "Paid",
        source: data.type || "Invoice",
        city: data.client_address || undefined,
        notes: `${data.type || "Invoice"} issued: ${invoiceNumber} (₹${data.total_amount})`,
      })
      .catch((err) =>
        console.error("Auto-recording contact for invoice failed:", err)
      );

    return created;
  }

  async updateInvoice(data: UpdateInvoiceDto): Promise<Invoice> {
    const updated = await invoiceRepository.update(data);
    if (updated && updated.status === "Paid") {
      contactService
        .recordCustomerActivity({
          name: updated.client_name,
          phone: updated.client_phone,
          email: updated.client_email,
          amount: updated.total_amount,
          isPaid: true,
          source: updated.type || "Invoice",
          notes: `Invoice paid: ${updated.invoice_number} (₹${updated.total_amount})`,
        })
        .catch((err) =>
          console.error("Auto-updating contact for paid invoice failed:", err)
        );
    }
    return updated;
  }

  async deleteInvoice(id: string): Promise<boolean> {
    return invoiceRepository.delete(id);
  }
}

export const invoiceService = new InvoiceService();
