export interface Booking {
  id: string;
  tour_id: string | null;
  tour_title?: string;
  user_id?: string | null;
  family_member_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  travel_date: string;
  travelers_count: number;
  special_requests: string | null;
  status: "new" | "contacted" | "confirmed" | "cancelled";
  total_amount: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingDto {
  tour_id?: string | null;
  user_id?: string | null;
  family_member_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  travel_date: string;
  travelers_count: number;
  special_requests?: string | null;
  total_amount?: number | null;
}
