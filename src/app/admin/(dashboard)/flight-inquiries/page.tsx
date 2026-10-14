import { flightInquiryService } from "@/modules/flights/service/flight-inquiry.service";
import AdminFlightsManager from "@/modules/flights/components/AdminFlightsManager";

export const revalidate = 0;

export default async function AdminFlightInquiriesPage() {
  const inquiries = await flightInquiryService.getAllInquiries();
  return <AdminFlightsManager initialInquiries={inquiries} />;
}
