import { tourService } from "@/modules/tours/service/tour.service";
import { destinationService } from "@/modules/destinations/service/destination.service";
import AdminToursManager from "@/modules/tours/components/AdminToursManager";

export const revalidate = 0;

export default async function AdminToursPage() {
  const [tours, destinations] = await Promise.all([
    tourService.getAllTours(),
    destinationService.getAllDestinations(),
  ]);

  return <AdminToursManager initialTours={tours} destinations={destinations} />;
}
