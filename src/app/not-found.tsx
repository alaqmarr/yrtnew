import Link from "next/link";
import { Compass, Home, Plane, Map, PhoneCall, ArrowLeft } from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-amber-50/40 via-white to-sky-50/30">
      <div className="max-w-2xl w-full text-center space-y-8 bg-white/80 backdrop-blur-sm p-8 sm:p-12 rounded-3xl border border-amber-200/60 shadow-xl shadow-amber-500/5">
        {/* Animated Compass Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-400 to-cyan-400 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
              <Compass className="w-12 h-12 text-amber-500 animate-spin [animation-duration:12s]" />
            </div>
          </div>
          <span className="absolute -top-2 -right-3 text-xs font-black px-2.5 py-0.5 rounded-full bg-rose-500 text-white shadow-sm">
            404
          </span>
        </div>

        {/* Heading & Explanation */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest font-black text-amber-600 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200">
            Off The Beaten Path
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Lost Your Destination?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            The page you are looking for may have embarked on a new itinerary, had its name updated, or is temporarily unavailable. Let us help you navigate back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/tours"
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all flex items-center gap-2"
          >
            <Map className="w-4 h-4 text-amber-700" />
            <span>Explore Tour Packages</span>
          </Link>

          <Link
            href="/flight-bookings"
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-800 bg-cyan-100 hover:bg-cyan-200 border border-cyan-300 transition-all flex items-center gap-2"
          >
            <Plane className="w-4 h-4 text-cyan-700" />
            <span>Flight Desk</span>
          </Link>
        </div>

        {/* 24/7 Helpline */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-500">
          <span>Need immediate assistance from a travel concierge?</span>
          <a
            href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels,%20I%20hit%20a%20404%20error%20page%20and%20need%20help."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-[#25D366] hover:underline"
          >
            <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
            <span>WhatsApp +91 91002 28152</span>
          </a>
        </div>
      </div>
    </div>
  );
}
