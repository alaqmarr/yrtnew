export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  type: "Invoice" | "Quote";
  client_name: string;
  client_email: string | null;
  client_phone: string;
  client_address: string | null;
  items_json: string;
  subtotal: number;
  tax_percent: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  status: "Draft" | "Sent" | "Paid" | "Cancelled";
  due_date: string | null;
  notes: string | null;
  terms: string | null;
  payment_link_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceDto {
  type: "Invoice" | "Quote";
  client_name: string;
  client_email?: string | null;
  client_phone: string;
  client_address?: string | null;
  items_json: string;
  subtotal: number;
  tax_percent?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount: number;
  currency?: string;
  status?: "Draft" | "Sent" | "Paid" | "Cancelled";
  due_date?: string | null;
  notes?: string | null;
  terms?: string | null;
  payment_link_id?: string | null;
}

export interface UpdateInvoiceDto extends Partial<CreateInvoiceDto> {
  id: string;
}
