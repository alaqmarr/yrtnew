import { destinationService } from "@/modules/destinations/service/destination.service";
import DestinationCard from "@/modules/destinations/components/DestinationCard";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { Compass, MapPin } from "lucide-react";
import Link from "next/link";

export const revalidate = 60; // ISR

export const metadata = {
  title: "Destinations Across India & Worldwide | Yellow Ribbon Travels",
  description:
    "Explore breathtaking travel destinations in Kashmir, Kerala, Rajasthan, Bali, Dubai, Switzerland, Vietnam, and Thailand with Yellow Ribbon Travels.",
};

interface DestinationsPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function DestinationsPage({ searchParams }: DestinationsPageProps) {
  const { type } = await searchParams;
  const isDomesticOnly = type === "domestic";
  const isInternationalOnly = type === "international";

  const destinations = await destinationService.getAllDestinations({
    domesticOnly: isDomesticOnly,
    internationalOnly: isInternationalOnly,
  });

  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-8 sm:space-y-12">
      <Breadcrumbs items={[{ label: "Destinations" }]} />
      {/* Page Header */}
      <div className="text-center max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
          <Compass className="w-3.5 h-3.5" /> Inspiring Locations
        </div>
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-950 tracking-tight">
          Where Do You Want to Journey Next?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          From the serene snows of Kashmir to the tropical cliffs of Bali and futuristic skylines of Dubai, discover our curated holiday destinations with private ground transport and curated hotels.
        </p>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <Link
            href="/destinations"
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              !type
                ? "bg-slate-900 text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All Destinations ({destinations.length})
          </Link>
          <Link
            href="/destinations?type=domestic"
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              type === "domestic"
                ? "bg-gradient-to-r from-brand-yellow to-amber-500 text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Domestic (India)
          </Link>
          <Link
            href="/destinations?type=international"
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              type === "international"
                ? "bg-gradient-to-r from-brand-cyan to-blue-600 text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            International Wonders
          </Link>
        </div>
      </div>

      {/* Full-Width Grid of Destinations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 w-full">
        {destinations.map((destination) => (
          <DestinationCard key={destination.id} destination={destination} />
        ))}
      </div>
    </div>
  );
}
