export interface FlightInquiry {
  id: string;
  trip_type: "roundtrip" | "oneway" | "multicity";
  from_city: string;
  to_city: string;
  depart_date: string;
  return_date: string | null;
  passengers_adults: number;
  passengers_children: number;
  passengers_infants: number;
  cabin_class: "Economy" | "Premium Economy" | "Business" | "First Class";
  preferred_airline: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: "new" | "contacted" | "quoted" | "booked" | "cancelled";
  notes: string | null;
  created_at: string;
}

export interface CreateFlightInquiryDto {
  trip_type: "roundtrip" | "oneway" | "multicity";
  from_city: string;
  to_city: string;
  depart_date: string;
  return_date?: string | null;
  passengers_adults: number;
  passengers_children: number;
  passengers_infants: number;
  cabin_class: "Economy" | "Premium Economy" | "Business" | "First Class";
  preferred_airline?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes?: string | null;
}
