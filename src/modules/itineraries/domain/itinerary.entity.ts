export interface ItineraryDay {
  day: number;
  title: string; // e.g. "DAY 01 | GUWAHATI – SHILLONG"
  description: string;
  visit_points?: string[]; // e.g. ["Laitlum Canyons", "Shillong Peak", "Elephant Falls"]
  visit_label?: string; // e.g. "Visit:" or "En-route sightseeing:"
  overnight?: string; // e.g. "Shillong"
  meals?: string; // e.g. "Breakfast"
  hotel?: string;
}

export interface ItineraryFlight {
  flight_no: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
}

export interface ItineraryAccommodation {
  nights: string; // e.g. "26th Nov to 28th Nov"
  city: string; // e.g. "Shillong"
  hotel_name: string; // e.g. "Super Collection O SRS Residency"
  meal_plan: string; // e.g. "Breakfast (CP)"
  room_type: string; // e.g. "Classic Room"
  occupancy: string; // e.g. "3 Adults"
}

export interface CostBreakdownItem {
  item: string;
  description?: string;
  amount?: number | null;
  is_included?: boolean;
}

export interface Itinerary {
  id: string;
  reference_no: string;
  user_id?: string | null;
  client_name: string;
  client_email: string | null;
  client_phone: string;
  destination: string;
  title: string;
  start_date: string | null;
  duration_days: number;
  duration_nights: number;
  travelers_count: number;
  hotel_details: string | null;
  flights_json: string;
  days_json: string;
  inclusions_json: string;
  exclusions_json: string;
  total_price: number;
  currency: string;
  status: "Draft" | "Active" | "Confirmed" | "Completed";
  notes: string | null;
  vehicle: string | null;
  pax_label: string | null;
  price_per_person: number | null;
  accommodations_json: string | null;
  package_highlights_json: string | null;
  important_notes_json: string | null;
  cost_breakdown_json?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateItineraryDto {
  user_id?: string | null;
  client_name: string;
  client_email?: string | null;
  client_phone: string;
  destination: string;
  title: string;
  start_date?: string | null;
  duration_days: number;
  duration_nights: number;
  travelers_count?: number;
  hotel_details?: string | null;
  flights_json?: string;
  days_json: string;
  inclusions_json?: string;
  exclusions_json?: string;
  total_price: number;
  currency?: string;
  status?: "Draft" | "Active" | "Confirmed" | "Completed";
  notes?: string | null;
  vehicle?: string | null;
  pax_label?: string | null;
  price_per_person?: number | null;
  accommodations_json?: string | null;
  package_highlights_json?: string | null;
  important_notes_json?: string | null;
  cost_breakdown_json?: string | null;
}

export interface UpdateItineraryDto extends Partial<CreateItineraryDto> {
  id: string;
}
