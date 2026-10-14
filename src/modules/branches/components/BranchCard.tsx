"use client";

import { useState } from "react";
import { Branch } from "../domain/branch.entity";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  User,
  Navigation,
  Globe2,
  Building2,
  Sparkles,
} from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import IOSSpinner from "@/shared/components/IOSSpinner";
import { getBranchMapEmbedUrl, getBranchDirectionsUrl } from "../utils/map-url";
import { Coordinates, getDirectNavigationUrl } from "../utils/geo";

interface BranchCardProps {
  branch: Branch;
  distanceFormatted?: string;
  estimatedDriveTime?: string;
  isClosest?: boolean;
  userCoords?: Coordinates | null;
}

export default function BranchCard({
  branch,
  distanceFormatted,
  estimatedDriveTime,
  isClosest = false,
  userCoords,
}: BranchCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const isHQ = branch.branch_type === "Head Office";
  const isIntl = Boolean(branch.is_international);
  const mapEmbedUrl = getBranchMapEmbedUrl(branch);
  const directionsUrl = userCoords
    ? getDirectNavigationUrl(userCoords, branch)
    : getBranchDirectionsUrl(branch);
  const phoneClean = branch.phone.replace(/[^0-9]/g, "");

  return (
    <div
      className={`group rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 h-full ${
        isClosest
          ? "bg-white/95 backdrop-blur-md border-2 border-amber-500 shadow-2xl ring-4 ring-amber-400/25 hover:shadow-2xl"
          : isHQ
          ? "bg-white/90 backdrop-blur-md border-2 border-amber-400/90 shadow-xl ring-4 ring-amber-400/10 hover:shadow-2xl"
          : isIntl
          ? "bg-white/90 backdrop-blur-md border-2 border-cyan-400/80 shadow-lg ring-4 ring-cyan-400/10 hover:shadow-2xl"
          : "bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-amber-400/60"
      }`}
    >
      <div>
        {/* 1. INTEGRATED MAP SECTION WITH FROSTED OVERLAYS */}
        <div className="relative w-full h-48 sm:h-52 bg-slate-100 overflow-hidden border-b border-slate-200/80">
          {/* Frosted Shimmer with iOS Travel Spinner while Map Initializes */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-slate-100/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-2.5 z-0">
              <div className="p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-md flex items-center justify-center">
                <IOSSpinner size="md" color="amber" variant="travel" />
              </div>
              <span className="text-[11px] font-bold text-slate-500 tracking-wide">
                Locating {branch.city}...
              </span>
            </div>
          )}

          <iframe
            src={mapEmbedUrl}
            title={`${branch.city} Branch Office Location Map`}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full border-0 filter contrast-[1.02] brightness-[0.98] transition-all duration-500 ease-out group-hover:scale-105 pointer-events-none sm:pointer-events-auto ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Map Top Floating Frosted Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg backdrop-blur-md border ${
                isClosest
                  ? "bg-amber-400 text-slate-950 border-amber-200 ring-2 ring-amber-300"
                  : isHQ
                  ? "bg-amber-400/85 text-slate-950 border-amber-200/90"
                  : isIntl
                  ? "bg-cyan-600/85 text-white border-cyan-300/80"
                  : "bg-slate-950/65 text-white border-white/25"
              }`}
            >
              {isClosest ? (
                <>
                  <Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />
                  <span>Closest to You</span>
                </>
              ) : isHQ ? (
                <>
                  <Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />
                  {branch.branch_type}
                </>
              ) : (
                branch.branch_type
              )}
            </span>

            <span className="text-[11px] font-bold text-slate-900 bg-white/75 backdrop-blur-md px-3 py-1 rounded-full shadow-md border border-white/60 flex items-center gap-1.5">
              <span>{isIntl ? "🌍" : "🇮🇳"}</span>
              <span>{isIntl ? branch.country : branch.state}</span>
            </span>
          </div>

          {/* Map Bottom Floating Frosted Quick Navigation Pill */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Google Maps for live GPS turn-by-turn navigation"
            className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 hover:bg-white/95 text-slate-900 text-[11px] font-bold shadow-lg border border-white/60 backdrop-blur-md hover:scale-105 transition-all z-10"
          >
            <Navigation className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Open in Maps</span>
          </a>
        </div>

        {/* 2. CARD CONTENT AREA WITH FROSTED PANELS */}
        <div className="p-6 sm:p-7 space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50/70 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-amber-200/60">
                  {isIntl ? "International Hub" : "Domestic Branch"}
                </span>

                {distanceFormatted && (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-2xs ${
                      isClosest
                        ? "bg-amber-400 text-slate-950 border border-amber-300 ring-2 ring-amber-400/20"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    <Navigation className="w-2.5 h-2.5 fill-current" />
                    <span>{isClosest ? `Closest • ${distanceFormatted}` : distanceFormatted}</span>
                  </span>
                )}
              </div>

              {branch.timing && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50/70 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Open for Visits</span>
                </span>
              )}
            </div>

            <h3 className="text-2xl font-black text-slate-950 tracking-tight group-hover:text-amber-600 transition-colors">
              {branch.city}
            </h3>
          </div>

          {/* Frosted Physical Address Box */}
          <div className="p-4 rounded-2xl bg-slate-50/70 backdrop-blur-sm border border-slate-200/70 shadow-2xs flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed group-hover:bg-white/80 group-hover:border-amber-300/50 transition-colors">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="font-normal">{branch.address}</p>
          </div>

          {/* Frosted Key Details Box */}
          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-xs border border-slate-200/60 shadow-2xs space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <a
                href={`tel:${phoneClean}`}
                className="hover:text-amber-600 font-bold text-slate-800 transition-colors"
              >
                {branch.phone}
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-cyan-600 shrink-0" />
              <a
                href={`mailto:${branch.email}`}
                className="hover:text-amber-600 font-medium transition-colors truncate"
              >
                {branch.email}
              </a>
            </div>

            {branch.timing && (
              <div className="flex items-center gap-2.5 text-slate-500">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{branch.timing}</span>
              </div>
            )}

            {branch.manager_name && (
              <div className="flex items-center gap-2.5 text-slate-500 pt-1.5 border-t border-slate-200/50">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  Branch Head: <strong className="text-slate-800">{branch.manager_name}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. ACTION BUTTONS FOOTER WITH FROSTED ACTION CONTROLS */}
      <div className="p-6 pt-0 space-y-2">
        <div className="flex items-center gap-2">
          {/* Primary WhatsApp Action */}
          <a
            href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(
              `Hi Yellow Ribbon Travels ${branch.city} branch, I would like to consult with a travel expert regarding holiday packages and flights.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-2xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white shrink-0" />
            <span className="truncate">WhatsApp {branch.city.split(" ")[0]}</span>
          </a>

          {/* Direct Phone Call Action (Frosted) */}
          <a
            href={`tel:${phoneClean}`}
            className="py-3 px-3.5 rounded-2xl bg-white/80 hover:bg-white backdrop-blur-md border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center transition-all shadow-xs hover:border-amber-300/60"
            title="Call Office"
            aria-label={`Call ${branch.city} Office`}
          >
            <Phone className="w-4 h-4 text-slate-700" />
          </a>

          {/* Open Google Maps Directions (Frosted Dark) */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md text-white text-xs font-semibold flex items-center justify-center transition-all shadow-xs border border-slate-800"
            title="Get Google Maps GPS Directions"
            aria-label={`Get directions to ${branch.city} branch`}
          >
            <Navigation className="w-4 h-4 text-amber-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
