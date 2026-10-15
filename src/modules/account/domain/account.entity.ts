import { Booking } from "@/modules/bookings/domain/booking.entity";
import { FlightInquiry } from "@/modules/flights/domain/flight-inquiry.entity";
import { PaymentLink } from "@/modules/payments/domain/payment-link.entity";
import { Itinerary } from "@/modules/itineraries/domain/itinerary.entity";
import { Invoice } from "@/modules/invoices/domain/invoice.entity";
import { GalleryItem } from "@/modules/gallery/domain/gallery.entity";
import { SupportTicket } from "./ticket.entity";
import { FamilyMember } from "@/modules/family/domain/family.entity";

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  family_head_id?: string | null;
  relationship_to_head?: string | null;
}

export interface ClientDashboardData {
  profile: ClientProfile;
  isFamilyHead: boolean;
  familyHead?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  } | null;
  familyMembers: FamilyMember[];
  bookings: Booking[];
  flights: FlightInquiry[];
  paymentLinks: PaymentLink[];
  itineraries: Itinerary[];
  invoices: Invoice[];
  tickets: SupportTicket[];
  favorites: GalleryItem[];
  stats: {
    totalBookings: number;
    activeInquiries: number;
    pendingPayments: number;
    openTickets: number;
    savedFavorites: number;
    totalItineraries?: number;
    totalFamilyMembers?: number;
  };
}
