export type CustomerTier = "Standard" | "Silver" | "Gold" | "Platinum" | "VIP";

export interface TravelPreferences {
  hotel_category?: string;
  meal_preference?: string;
  vehicle_preference?: string;
  flight_seat?: string;
  budget_tier?: string;
  preferred_destinations?: string[];
  special_notes?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  phone_clean: string;
  email: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  tier: CustomerTier;
  vip_status: number;
  tags: string[];
  preferences: TravelPreferences;
  internal_notes: string | null;
  source: string;
  total_spent: number;
  deals_count: number;
  last_interaction_at: string | null;
  created_at: string;
  updated_at: string;
}

import { FamilyMember } from "@/modules/family/domain/family.entity";

export interface CustomerActivitySummary {
  contact: Contact;
  familyMembers?: FamilyMember[];
  itineraries: Array<{
    id: string;
    reference_no: string;
    title: string;
    destination: string;
    start_date: string | null;
    duration_days: number;
    duration_nights: number;
    total_price: number;
    price_per_person: number | null;
    status: string;
    created_at: string;
  }>;
  paymentLinks: Array<{
    id: string;
    link_code: string;
    amount: number;
    currency: string;
    purpose: string;
    status: string;
    razorpay_payment_id: string | null;
    paid_at: string | null;
    created_at: string;
  }>;
  invoices: Array<{
    id: string;
    invoice_number: string;
    type: string;
    subtotal: number;
    tax_amount: number;
    total_amount: number;
    currency: string;
    status: string;
    due_date: string | null;
    created_at: string;
  }>;
  bookings: Array<{
    id: string;
    tour_id: string | null;
    tour_title?: string;
    travel_date: string;
    travelers_count: number;
    status: string;
    total_amount: number | null;
    created_at: string;
  }>;
}

export interface ContactLookupResult {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  tier: CustomerTier;
  vip_status: boolean;
  total_spent: number;
  deals_count: number;
  is_repeat: boolean;
  tags: string[];
  preferences: TravelPreferences;
  internal_notes: string | null;
  last_deal?: {
    type: "quote" | "payment" | "invoice";
    description: string;
    amount: number;
    date: string;
  } | null;
}
