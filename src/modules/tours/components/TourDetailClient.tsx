"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tour } from "../domain/tour.entity";
import ItineraryAccordion from "./ItineraryAccordion";
import TourBookingModal from "./TourBookingModal";
import {
  Clock,
  Star,
  Users,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Share2,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  X,
  Camera,
} from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import IOSSpinner from "@/shared/components/IOSSpinner";

interface TourDetailClientProps {
  tour: Tour;
}

export default function TourDetailClient({ tour }: TourDetailClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);
  const [thumbnailLoadedMap, setThumbnailLoadedMap] = useState<Record<number, boolean>>({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const activeImage =
    tour.images[activeImageIndex] ||
    tour.images[0] ||
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80";

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMainImageLoaded(false);
    setActiveImageIndex((prev) => (prev + 1) % tour.images.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMainImageLoaded(false);
    setActiveImageIndex((prev) => (prev - 1 + tour.images.length) % tour.images.length);
  };

  const handleSelectImage = (idx: number) => {
    if (activeImageIndex !== idx) {
      setMainImageLoaded(false);
      setActiveImageIndex(idx);
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, tour.images.length]);

  const discountPercentage =
    tour.original_price && tour.original_price > tour.price
      ? Math.round(((tour.original_price - tour.price) / tour.original_price) * 100)
      : null;
  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-12">
      {/* Breadcrumbs with Schema.org JSON-LD */}
      <Breadcrumbs
        items={[
          { label: "Tour Packages", href: "/tours" },
          { label: tour.title },
        ]}
      />

      {/* Main Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            {tour.category}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {tour.tour_type}
          </span>
          {discountPercentage && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white">
              Save {discountPercentage}%
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {tour.title}
        </h1>

        {tour.subtitle && (
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            {tour.subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>
              {tour.duration_days} Days / {tour.duration_nights} Nights
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{tour.rating} Rating</span>
            <span className="text-slate-400 font-normal">({tour.review_count} verified reviews)</span>
          </div>

          {tour.destination_name && (
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <MapPin className="w-4 h-4 text-cyan-600" />
              <span>{tour.destination_name}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-slate-500">
            <Users className="w-4 h-4" />
            <span>Max Group Size: {tour.max_group_size}</span>
          </div>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        {/* Main Big Photo with In-Element Loader */}
        <div className="lg:col-span-3 relative aspect-[16/10] rounded-3xl overflow-hidden shadow-card bg-slate-100 group">
          {/* In-element Travel Spinner while active image loads */}
          {!mainImageLoaded && (
            <div className="absolute inset-0 bg-slate-100/90 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 z-10 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center justify-center">
                <IOSSpinner size="lg" color="amber" variant="travel" />
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-xs font-bold text-slate-700 tracking-wide block">
                  Loading Tour Image...
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Photo {activeImageIndex + 1} of {tour.images.length}
                </span>
              </div>
            </div>
          )}

          <Image
            src={activeImage}
            alt={`${tour.title} - Photo ${activeImageIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 75vw"
            onLoad={() => setMainImageLoaded(true)}
            className={`object-cover transition-all duration-700 ease-out group-hover:scale-[1.02] cursor-pointer ${
              mainImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            onClick={() => setIsLightboxOpen(true)}
          />

          {/* Floating Prev / Next arrows */}
          {tour.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white backdrop-blur-md border border-white/20 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/40 hover:bg-slate-950/80 text-white backdrop-blur-md border border-white/20 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Floating Destination Badge on Top */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-950/60 text-white backdrop-blur-md border border-white/20 shadow-md">
              {tour.destination_name || "Gallery"}
            </span>
          </div>

          {/* Floating Expand & Counter Controls on Bottom */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-20">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold text-white bg-slate-950/60 backdrop-blur-md border border-white/20 shadow-md">
              {activeImageIndex + 1} / {tour.images.length}
            </span>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-slate-950/70 hover:bg-slate-950/90 backdrop-blur-md border border-white/25 shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>View Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Side Thumbnails Column - Exact symmetric height matching main image */}
        <div className="grid grid-cols-3 lg:flex lg:flex-col gap-3 h-full">
          {tour.images.map((img, idx) => {
            const isCurrent = activeImageIndex === idx;
            const isThumbLoaded = thumbnailLoadedMap[idx];

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectImage(idx)}
                className={`relative aspect-[16/10] lg:aspect-auto lg:flex-1 rounded-2xl overflow-hidden border-2 transition-all group cursor-pointer ${
                  isCurrent
                    ? "border-amber-500 ring-4 ring-amber-400/25 shadow-md scale-[1.02]"
                    : "border-slate-200/90 hover:border-amber-300/80 opacity-80 hover:opacity-100"
                }`}
              >
                {/* In-element thumbnail shimmer while downloading */}
                {!isThumbLoaded && (
                  <div className="absolute inset-0 bg-slate-100 flex items-center justify-center z-0">
                    <IOSSpinner size="sm" color="amber" variant="travel" />
                  </div>
                )}

                <Image
                  src={img}
                  alt={`${tour.title} thumbnail ${idx + 1}`}
                  fill
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 25vw"
                  onLoad={() =>
                    setThumbnailLoadedMap((prev) => ({ ...prev, [idx]: true }))
                  }
                  className={`object-cover group-hover:scale-105 transition-all duration-500 ${
                    isThumbLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Active Photo Glow Indicator */}
                {isCurrent && (
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-xs z-10">
                    Active
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column (Details, Itinerary, Inclusions) */}
        <div className="lg:col-span-8 space-y-12">
          {/* Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Tour Overview
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
              {tour.overview}
            </p>
          </div>

          {/* Highlights */}
          {tour.highlights && tour.highlights.length > 0 && (
            <div className="bg-amber-50/50 rounded-3xl p-6 sm:p-8 border border-amber-200/60 space-y-4">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Trip Highlights</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tour.highlights.map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Day-wise Itinerary */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Day-Wise Itinerary
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customizable to your flight schedules and pace
                </p>
              </div>
            </div>

            <ItineraryAccordion itinerary={tour.itinerary} />
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
            {/* Inclusions */}
            <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-200/60 space-y-4">
              <h3 className="font-bold text-base text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>What's Included</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {tour.inclusions.map((inc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="bg-rose-50/40 rounded-3xl p-6 border border-rose-200/60 space-y-4">
              <h3 className="font-bold text-base text-rose-900 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" />
                <span>What's Not Included</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {tour.exclusions.map((exc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column (Sticky Pricing & Action Box) */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Package Price Per Person
              </span>
              <div className="flex items-baseline gap-3 my-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  ₹{tour.price.toLocaleString("en-IN")}
                </span>
                {tour.original_price && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{tour.original_price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <span className="text-xs text-emerald-600 font-semibold">
                *Inclusive of hotel stays, private transfers & taxes
              </span>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-brand-yellow via-amber-500 to-brand-coral hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Book / Inquire Now</span>
              </button>

              <a
                href={`https://wa.me/919100228152?text=Hello%20Yellow%20Ribbon%20Travels,%20I%20am%20interested%20in%20${encodeURIComponent(tour.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl font-semibold text-xs text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Instant WhatsApp Query</span>
              </a>

              <a
                href="tel:+919100228152"
                className="w-full py-3 rounded-2xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Concierge: +91 91002 28152</span>
              </a>
            </div>

            {/* Trust Assurances */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Verified Hotel Partners</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-500" />
                <span>Flexible Rescheduling Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>Personal Tour Manager Assigned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Inquiry Modal */}
      <TourBookingModal
        tour={tour}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Fullscreen High-Resolution Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header Bar */}
          <div
            className="flex items-center justify-between text-white z-20 pb-2 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white line-clamp-1">
                  {tour.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Photo {activeImageIndex + 1} of {tour.images.length} • {tour.destination_name}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close fullscreen view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Center Image with Prev / Next */}
          <div
            className="relative flex-1 my-3 flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {tour.images.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 sm:left-6 p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 z-30 cursor-pointer shadow-xl"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="relative w-full h-full max-w-6xl max-h-[75vh]">
              <Image
                src={activeImage}
                alt={`${tour.title} full view ${activeImageIndex + 1}`}
                fill
                priority
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {tour.images.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 sm:right-6 p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 z-30 cursor-pointer shadow-xl"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnails Strip */}
          <div
            className="flex items-center justify-center gap-2.5 overflow-x-auto py-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {tour.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectImage(idx)}
                className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  activeImageIndex === idx
                    ? "border-amber-400 ring-4 ring-amber-400/40 scale-105"
                    : "border-transparent opacity-60 hover:opacity-100 hover:scale-102"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
