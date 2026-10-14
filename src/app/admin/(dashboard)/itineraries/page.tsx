import { itineraryService } from "@/modules/itineraries/service/itinerary.service";
import AdminItinerariesManager from "@/modules/itineraries/components/AdminItinerariesManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Client Itinerary Builder | Yellow Ribbon Admin",
};

export default async function AdminItinerariesPage() {
  const itineraries = await itineraryService.getAllItineraries();

  return <AdminItinerariesManager initialItineraries={itineraries} />;
}
