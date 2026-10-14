import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { destinationService } from "@/modules/destinations/service/destination.service";
import { tourService } from "@/modules/tours/service/tour.service";
import TourCard from "@/modules/tours/components/TourCard";
import { MapPin, Sun, Calendar, CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import Breadcrumbs from "@/shared/components/Breadcrumbs";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const destination = await destinationService.getDestinationBySlug(slug);
  if (!destination) return { title: "Destination Not Found" };

  return {
    title: `${destination.name} Holiday Tour Packages | Yellow Ribbon Travels`,
    description: destination.description.slice(0, 160),
    alternates: {
      canonical: `/destinations/${destination.slug || slug}`,
    },
    openGraph: {
      title: `${destination.name} Holiday Tour Packages | Yellow Ribbon Travels`,
      description: destination.description.slice(0, 160),
      images: destination.hero_image ? [{ url: destination.hero_image }] : [],
    },
  };
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const destination = await destinationService.getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const mappedTours = await tourService.getToursByDestination(destination.id);

  return (
    <div className="pb-20 space-y-12">
      {/* Hero Banner */}
      <div className="relative h-[65vh] min-h-[420px] bg-slate-900 overflow-hidden">
        <Image
          src={destination.hero_image}
          alt={destination.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-end pb-12">
          <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
          {/* Breadcrumbs */}
          <div className="mb-4 [&_*]:text-white/80 [&_a:hover]:text-white [&_span[aria-current]]:text-amber-400">
            <Breadcrumbs
              items={[
                { label: "Destinations", href: "/destinations" },
                { label: destination.name },
              ]}
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30 w-fit mb-3">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{destination.country} • {destination.region}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            {destination.name}
          </h1>

          {destination.tagline && (
            <p className="text-base sm:text-lg text-slate-200 mt-2 max-w-2xl leading-relaxed">
              {destination.tagline}
            </p>
          )}

          {/* Quick Stats Pill Bar */}
          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-white">
            {destination.best_time_to_visit && (
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Best Season: {destination.best_time_to_visit}</span>
              </div>
            )}
            {destination.weather_info && (
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Weather: {destination.weather_info}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Main Body */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 space-y-16 py-8">
        {/* Overview & Attractions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                About {destination.name}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                {destination.description}
              </p>
            </div>

            {/* Top Attractions */}
            {destination.top_attractions && destination.top_attractions.length > 0 && (
              <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80">
                <h3 className="font-bold text-base text-slate-900 mb-4">
                  Must-Experience Highlights in {destination.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destination.top_attractions.map((attr, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{attr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Inquiry Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Customized Package
              </span>
              <h3 className="font-bold text-lg text-slate-900">
                Plan a Trip to {destination.name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Have specific dates or hotel preferences? Our destination specialist will create a tailored proposal for your group.
              </p>

              <div className="pt-2 space-y-2">
                <a
                  href={`https://wa.me/919100228152?text=Hello%20Yellow%20Ribbon%20Travels,%20I%20am%20interested%20in%20a%20holiday%20package%20to%20${encodeURIComponent(destination.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>WhatsApp Destination Desk</span>
                </a>

                <Link
                  href="/contact"
                  className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Request Custom Itinerary</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mapped Tours Section */}
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Tour Packages for {destination.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Handcrafted itineraries mapped specifically to this destination.
              </p>
            </div>
          </div>

          {mappedTours.length === 0 ? (
            <div className="p-8 bg-slate-50 rounded-2xl text-center text-sm text-slate-500 border border-slate-200">
              We offer bespoke, private custom tour itineraries for {destination.name}. Please contact our travel desk to curate your vacation.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {mappedTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
