import { destinationService } from "@/modules/destinations/service/destination.service";
import AdminDestinationsManager from "@/modules/destinations/components/AdminDestinationsManager";

export const revalidate = 0;

export default async function AdminDestinationsPage() {
  const destinations = await destinationService.getAllDestinations();
  return <AdminDestinationsManager initialDestinations={destinations} />;
}
