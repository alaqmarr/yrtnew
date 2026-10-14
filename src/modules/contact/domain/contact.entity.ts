export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  branch_id: string | null;
  branch_city?: string;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
}

export interface CreateContactDto {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  branch_id?: string | null;
}
