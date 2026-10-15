"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Tour } from "../domain/tour.entity";
import { Star, Clock, MapPin, Users, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import IOSSpinner from "@/shared/components/IOSSpinner";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const primaryImage =
    tour.images?.[0] ||
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";

  const discountPercentage =
    tour.original_price && tour.original_price > tour.price
      ? Math.round(((tour.original_price - tour.price) / tour.original_price) * 100)
      : null;

  const tourUrl = `/tours/${tour.slug || tour.id}`;
  const whatsappUrl = `https://wa.me/919100228152?text=${encodeURIComponent(
    `Hi Yellow Ribbon Travels, I am interested in: ${tour.title} (Starting from ₹${tour.price.toLocaleString("en-IN")})`
  )}`;

  return (
    <div className="group rounded-3xl overflow-hidden bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_45px_rgba(245,158,11,0.14)] hover:border-amber-400/80 hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full relative">
      {/* 1. THUMBNAIL AREA WITH FROSTED BADGES & IN-ELEMENT TRAVEL LOADER */}
      <div className="relative aspect-[16/10.5] overflow-hidden bg-slate-100">
        {/* In-element Travel Loading Indicator */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-100/90 backdrop-blur-xs flex flex-col items-center justify-center space-y-2.5 z-0">
            <div className="p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center justify-center">
              <IOSSpinner size="md" color="amber" variant="travel" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 tracking-wide">
              Loading {tour.destination_name || "Tour"}...
            </span>
          </div>
        )}

        <Image
          src={primaryImage}
          alt={tour.title}
          fill
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
          onLoad={() => setImageLoaded(true)}
          className={`object-cover group-hover:scale-105 transition-all duration-700 ease-out ${
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />

        {/* Cinematic Gradient Overlays for Badges Legibility */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-950/60 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none" />

        {/* Top Badges (Category & Discount/Featured) */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/90 backdrop-blur-md text-slate-900 border border-white/70 shadow-md">
            {tour.category}
          </span>

          <div className="flex items-center gap-1.5">
            {tour.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400/95 backdrop-blur-md text-slate-950 border border-amber-200 shadow-md">
                <Sparkles className="w-3 h-3 text-slate-950" />
                Featured
              </span>
            )}
            {discountPercentage && (
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md border border-white/40 tracking-tight">
                {discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Bottom Image Badges (Duration & Rating) */}
        <div className="absolute bottom-2.5 sm:bottom-3 inset-x-2.5 sm:inset-x-3.5 flex items-center justify-between text-white text-[11px] sm:text-xs font-semibold z-10 pointer-events-none">
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/70 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-md border border-white/20 shadow-md">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            <span className="truncate max-w-[120px] sm:max-w-none">
              {tour.duration_days}D / {tour.duration_nights}N
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950/70 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full backdrop-blur-md border border-white/20 shadow-md shrink-0">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
            <span>{tour.rating}</span>
            <span className="text-white/75 font-normal text-[10px] sm:text-xs">({tour.review_count})</span>
          </div>
        </div>
      </div>

      {/* 2. BODY CONTENT AREA */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between bg-gradient-to-b from-white to-slate-50/40">
        <div>
          {/* Destination and Tour Type Row */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            {tour.destination_name ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-[11px] font-bold border border-amber-300/40">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{tour.destination_name}</span>
              </div>
            ) : (
              <div />
            )}

            {tour.tour_type && (
              <span className="text-[11px] font-semibold text-slate-500 tracking-wide">
                {tour.tour_type}
              </span>
            )}
          </div>

          {/* Tour Title (2-line clamped with min-height for uniform card grid alignment) */}
          <h3 className="font-black text-lg sm:text-[19px] text-slate-950 group-hover:text-amber-600 transition-colors line-clamp-2 min-h-[3.25rem] leading-snug mb-2">
            <Link href={tourUrl} className="hover:underline">
              {tour.title}
            </Link>
          </h3>

          {/* Overview / Subtitle */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {tour.subtitle || tour.overview}
          </p>

          {/* Key Highlights Frosted Pill Container */}
          {tour.highlights && tour.highlights.length > 0 && (
            <div className="rounded-2xl p-3 bg-slate-100/75 backdrop-blur-xs border border-slate-200/70 mb-4 space-y-1.5">
              {tour.highlights.slice(0, 2).map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{hl}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. PRICING & ACTIONS BOTTOM ROW */}
        <div className="pt-3.5 sm:pt-4 border-t border-slate-200/70 flex items-center justify-between gap-2 sm:gap-3 mt-auto">
          {/* Price Block */}
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-700/80 leading-none mb-1">
              Starting From
            </div>
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-lg sm:text-2xl font-black text-slate-950 tracking-tight leading-none">
                ₹{tour.price.toLocaleString("en-IN")}
              </span>
              {tour.original_price && tour.original_price > tour.price && (
                <span className="text-[11px] sm:text-xs text-slate-400 line-through font-medium">
                  ₹{tour.original_price.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium block mt-0.5">
              per person (all incl.)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-3 rounded-xl sm:rounded-2xl text-white bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/35 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              title="Quick WhatsApp Booking Inquiry"
              aria-label={`Inquire about ${tour.title} on WhatsApp`}
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
            </a>

            <Link
              href={tourUrl}
              className="group/btn inline-flex items-center justify-center gap-1 sm:gap-1.5 px-3 py-2 sm:px-4.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
