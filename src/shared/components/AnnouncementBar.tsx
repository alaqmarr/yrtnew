"use client";

import Link from "next/link";
import { Phone, MapPin, Sparkles } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

interface AnnouncementBarProps {
  bannerText?: string;
  phone?: string;
}

export default function AnnouncementBar({
  bannerText = "✈️ Summer Holiday Sale: Up to ₹8,000 off on International Packages! Limited spots.",
  phone = "+91 91002 28152",
}: AnnouncementBarProps) {
  return (
    <div className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm py-2 sm:py-2.5 border-b border-slate-800 relative z-50 overflow-hidden">
      <div className="w-full px-3 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 flex flex-col sm:flex-row justify-between items-center gap-1.5 sm:gap-2">
        <div className="flex items-center gap-2 font-medium max-w-full overflow-hidden">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
            <Sparkles className="w-3 h-3 mr-1 text-amber-400 animate-pulse" /> Offer
          </span>
          <span className="truncate text-[11px] sm:text-xs text-slate-200">{bannerText}</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold">
          <Link
            href="/branches"
            className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>8+ Global & Domestic Branches</span>
          </Link>
          <span className="hidden md:inline text-slate-700">|</span>
          <a
            href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-2.5 py-1 rounded-full"
            title="Instant WhatsApp Support"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
            <span>WhatsApp Support</span>
          </a>
          <span className="hidden lg:inline text-slate-700">|</span>
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs"
          >
            <Phone className="w-3 h-3" />
            <span>24/7 Helpline: {phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
