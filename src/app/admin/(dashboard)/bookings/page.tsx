import { bookingService } from "@/modules/bookings/service/booking.service";
import AdminBookingsManager from "@/modules/bookings/components/AdminBookingsManager";

export const revalidate = 0;

export default async function AdminBookingsPage() {
  const bookings = await bookingService.getAllBookings();
  return <AdminBookingsManager initialBookings={bookings} />;
}
