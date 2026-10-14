export interface PaymentLink {
  id: string;
  link_code: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  amount: number;
  currency: string;
  purpose: string;
  description: string | null;
  status: "pending" | "paid" | "expired" | "cancelled";
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  paid_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentLinkDto {
  customer_name: string;
  customer_email?: string | null;
  customer_phone: string;
  amount: number;
  currency?: string;
  purpose: string;
  description?: string | null;
  expires_at?: string | null;
}

export interface UpdatePaymentLinkStatusDto {
  id: string;
  status: "pending" | "paid" | "expired" | "cancelled";
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  paid_at?: string | null;
}
