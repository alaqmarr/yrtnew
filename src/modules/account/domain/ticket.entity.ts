export type TicketCategory =
  | "Tour Booking"
  | "Flight Inquiry"
  | "Visa Assistance"
  | "Payment & Invoicing"
  | "Custom Itinerary"
  | "General Support";

export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  message: string;
  status: TicketStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketDto {
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  category: TicketCategory;
  priority?: TicketPriority;
  subject: string;
  message: string;
}

export interface UpdateTicketDto {
  status?: TicketStatus;
  admin_notes?: string;
  priority?: TicketPriority;
}
