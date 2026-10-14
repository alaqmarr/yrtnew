"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Destination } from "../domain/destination.entity";
import { MapPin, ArrowRight, Sun, Calendar } from "lucide-react";
import IOSSpinner from "@/shared/components/IOSSpinner";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col aspect-[4/5] bg-slate-900 border border-slate-200/50"
    >
      {/* In-Element Loader */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center space-y-2 z-0">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <IOSSpinner size="md" color="amber" variant="travel" />
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            {destination.name}...
          </span>
        </div>
      )}

      {/* Background Image with Lazy Loading */}
      <Image
        src={destination.hero_image}
        alt={destination.name}
        fill
        loading="lazy"
        decoding="async"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={() => setImageLoaded(true)}
        className={`object-cover group-hover:scale-105 transition-all duration-700 ease-out ${
          imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/10 group-hover:from-slate-950/95 transition-colors" />

      {/* Top Tag */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
          {destination.is_domestic ? "Domestic Getaway" : "International"}
        </span>
        <span className="text-xs font-medium text-white/95 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-xs">
          {destination.region}
        </span>
      </div>

      {/* Bottom Content with Subtle White Frost Layer Behind Text */}
      <div className="absolute inset-x-3.5 bottom-3.5 p-4 sm:p-5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 shadow-xl flex flex-col text-white transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/35 z-10">
        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-1">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>{destination.country}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1 group-hover:text-amber-300 transition-colors drop-shadow-sm">
          {destination.name}
        </h3>

        {destination.tagline && (
          <p className="text-xs text-white/90 line-clamp-2 mb-2.5 leading-relaxed font-normal drop-shadow-xs">
            {destination.tagline}
          </p>
        )}

        {/* Top Attractions Tags */}
        {destination.top_attractions && destination.top_attractions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {destination.top_attractions.slice(0, 3).map((attr, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-black/30 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-white/95 border border-white/15"
              >
                {attr}
              </span>
            ))}
          </div>
        )}

        <div className="pt-2.5 border-t border-white/20 flex items-center justify-between text-xs font-semibold text-amber-300 group-hover:text-white transition-colors">
          <span className="tracking-wide">Explore Tours</span>
          <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center group-hover:bg-amber-300 group-hover:translate-x-1 transition-all shadow-sm">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
