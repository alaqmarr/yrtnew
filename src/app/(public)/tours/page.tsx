import Link from "next/link";
import { tourService } from "@/modules/tours/service/tour.service";
import { destinationService } from "@/modules/destinations/service/destination.service";
import TourCard from "@/modules/tours/components/TourCard";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { Sparkles, Compass, Search, Filter, X, MapPin } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "All Holiday Tour Packages | Yellow Ribbon Travels",
  description:
    "Explore our complete collection of domestic and international holiday tour packages. Filter by destination, category, and budget.",
};

interface ToursPageProps {
  searchParams: Promise<{ category?: string; destination?: string; q?: string }>;
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const { category, destination: destinationSlug, q: search } = await searchParams;

  const [tours, destinations] = await Promise.all([
    tourService.getAllTours({
      category: category && category !== "All" ? category : undefined,
      destinationSlug: destinationSlug || undefined,
      search: search || undefined,
    }),
    destinationService.getAllDestinations(),
  ]);

  const categories = [
    "All",
    "International Holidays",
    "Domestic Holidays",
    "Honeymoon & Family",
    "Luxury & Family",
    "Honeymoon & Romance",
  ];

  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-8 sm:space-y-12">
      <Breadcrumbs items={[{ label: "Tour Packages" }]} />

      {/* Header */}
      <div className="text-center max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
          <Sparkles className="w-3.5 h-3.5" /> Curated Vacation Packages
        </div>
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-950 tracking-tight">
          Discover Handcrafted Tour Packages
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Every package features verified boutique accommodations, private chauffeured transfers, daily gourmet meals, guided excursions, and 24/7 dedicated on-tour concierge.
        </p>
      </div>

      {/* Full-Width Filter & Search Bar */}
      <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Categories:
          </span>
          {categories.map((cat) => {
            const isSelected = (!category && cat === "All") || category === cat;
            return (
              <Link
                key={cat}
                href={
                  cat === "All"
                    ? destinationSlug
                      ? `/tours?destination=${destinationSlug}`
                      : "/tours"
                    : `/tours?category=${encodeURIComponent(cat)}${destinationSlug ? `&destination=${destinationSlug}` : ""}`
                }
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Destination Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Destinations:
          </span>
          <Link
            href={category ? `/tours?category=${encodeURIComponent(category)}` : "/tours"}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              !destinationSlug
                ? "bg-amber-100 text-amber-800 border border-amber-300"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All Regions
          </Link>
          {destinations.map((d) => {
            const isSelected = destinationSlug === d.slug;
            return (
              <Link
                key={d.id}
                href={`/tours?destination=${d.slug}${category ? `&category=${encodeURIComponent(category)}` : ""}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-amber-100 text-amber-800 border border-amber-300 font-bold"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {d.name}
              </Link>
            );
          })}
        </div>

        {/* Active Filters Summary */}
        {(category || destinationSlug || search) && (
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span>Showing filtered results</span>
              {category && <span className="font-semibold text-slate-800">Category: {category}</span>}
              {destinationSlug && <span className="font-semibold text-slate-800">Destination: {destinationSlug}</span>}
              {search && <span className="font-semibold text-slate-800">Search: &quot;{search}&quot;</span>}
            </div>

            <Link href="/tours" className="inline-flex items-center gap-1 text-rose-600 hover:underline font-semibold">
              <X className="w-3.5 h-3.5" /> Clear Filters
            </Link>
          </div>
        )}
      </div>

      {/* Package Cards Grid - Ultra Wide Responsive Grid */}
      {tours.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 w-full">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center space-y-4 border border-slate-200/80 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Tours Found</h3>
          <p className="text-xs sm:text-sm text-slate-500">
            We couldn&apos;t find packages matching your current filter selection. Try changing the category or destination.
          </p>
          <Link
            href="/tours"
            className="inline-block px-6 py-2.5 rounded-full text-xs font-semibold bg-slate-900 text-white hover:bg-amber-600 transition-colors"
          >
            Reset Filters
          </Link>
        </div>
      )}
    </div>
  );
}
