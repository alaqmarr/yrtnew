import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  Star,
  ArrowRight,
  Heart,
  Lock,
  Plane,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-slate-900 via-slate-950 to-[#060a14] text-slate-300 pt-16 pb-12 border-t border-slate-800/80 relative overflow-hidden">
      {/* Subtle Ambient Glow Orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl" />

      {/* Brand Ribbon Line Top */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-yellow via-brand-coral via-brand-cyan to-brand-green opacity-80" />

      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 space-y-12">
        {/* Top Feature Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">4.9 / 5 Rating</div>
              <div className="text-xs text-slate-400">480+ Google Reviews</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">IATA Certified</div>
              <div className="text-xs text-slate-400">Accredited Global Ticketing</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">24/7 Trip Support</div>
              <div className="text-xs text-slate-400">Dedicated tour concierge</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Domestic & Global</div>
              <div className="text-xs text-slate-400">8+ Offices in India & Abroad</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xs sm:col-span-2 lg:col-span-1">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Razorpay Protected</div>
              <div className="text-xs text-slate-400">100% 256-Bit SSL Gateway</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-4">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-brand-yellow via-brand-coral to-brand-cyan">
                <div className="w-full h-full bg-white rounded-full p-1 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Yellow Ribbon Travels Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  YELLOW RIBBON
                </span>
                <span className="block text-[10px] tracking-widest uppercase font-semibold text-amber-400">
                  TRAVELS & TOURS
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Handcrafted domestic and international vacations, wholesale flight ticketing, and luxury itineraries. Trusted by 15,000+ happy travelers across India and abroad.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Head Office:</strong> 2-2-51, Shop No. 2, Mittal Chambers, Opp. Raj Classic Inn, M.G. Road, Secunderabad, Telangana - 500003
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919100228152" className="hover:text-amber-400 transition-colors">
                  +91 91002 28152 / +91 98401 54321
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <WhatsAppIcon className="w-4 h-4 fill-[#25D366] shrink-0" />
                <a
                  href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline font-semibold"
                >
                  WhatsApp: +91 91002 28152 (24/7 Desk)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:yellowribbontravels@gmail.com" className="hover:text-amber-400 transition-colors">
                  yellowribbontravels@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mon - Sat: 9:30 AM - 7:30 PM (IST)</span>
              </div>
            </div>
          </div>

          {/* Tour Packages (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4 text-amber-400">
              Popular Tours
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/tours" className="hover:text-white transition-colors">
                  Enchanting Kashmir
                </Link>
              </li>
              <li>
                <Link href="/tours" className="hover:text-white transition-colors">
                  Exotic Bali & Nusa Penida
                </Link>
              </li>
              <li>
                <Link href="/tours" className="hover:text-white transition-colors">
                  Dazzling Dubai Luxury
                </Link>
              </li>
              <li>
                <Link href="/tours" className="hover:text-white transition-colors">
                  Serene Kerala Backwaters
                </Link>
              </li>
              <li>
                <Link href="/tours" className="hover:text-white transition-colors">
                  Vietnam & Halong Bay
                </Link>
              </li>
              <li>
                <Link href="/tours" className="hover:text-white transition-colors">
                  Switzerland Alpine Highlights
                </Link>
              </li>
              <li>
                <Link href="/tours" className="hover:text-white transition-colors">
                  Thailand & Phuket Beach Escape
                </Link>
              </li>
              <li>
                <Link href="/tours" className="hover:text-white transition-colors">
                  Andaman Island Honeymoon
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Services (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4 text-cyan-400">
              Explore & Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/destinations" className="hover:text-white transition-colors">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link href="/flight-bookings" className="hover:text-white transition-colors">
                  Flight Bookings Desk
                </Link>
              </li>
              <li>
                <Link href="/pay" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Pay Online (Razorpay)</span>
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Photo & Video Gallery
                </Link>
              </li>
              <li>
                <Link href="/review" className="hover:text-white transition-colors">
                  Google Traveler Reviews
                </Link>
              </li>
              <li>
                <Link href="/branches" className="hover:text-white transition-colors">
                  Our Branch Offices
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors">
                  Travel Tips & Visa Guides
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Yellow Ribbon
                </Link>
              </li>
            </ul>
          </div>

          {/* Branches (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4 text-rose-400">
              Our Branches
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/branches" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Secunderabad</span>
                  <span className="text-[10px] text-amber-400 border border-amber-400/30 px-1 py-0.2 rounded">HQ</span>
                </Link>
              </li>
              <li>
                <Link href="/branches" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Dubai, UAE</span>
                  <span className="text-[10px] text-cyan-400 border border-cyan-400/30 px-1 py-0.2 rounded">Global</span>
                </Link>
              </li>
              <li>
                <Link href="/branches" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>London, UK</span>
                  <span className="text-[10px] text-cyan-400 border border-cyan-400/30 px-1 py-0.2 rounded">Global</span>
                </Link>
              </li>
              <li>
                <Link href="/branches" className="hover:text-white transition-colors flex items-center justify-between">
                  <span>Singapore</span>
                  <span className="text-[10px] text-cyan-400 border border-cyan-400/30 px-1 py-0.2 rounded">Global</span>
                </Link>
              </li>
              <li>
                <Link href="/branches" className="hover:text-white transition-colors">
                  Chennai, Tamil Nadu
                </Link>
              </li>
              <li>
                <Link href="/branches" className="hover:text-white transition-colors">
                  Pune, Maharashtra
                </Link>
              </li>
              <li>
                <Link href="/branches" className="hover:text-white transition-colors">
                  Dahod, Gujarat
                </Link>
              </li>
              <li>
                <Link href="/branches" className="hover:text-white transition-colors">
                  Patna, Bihar
                </Link>
              </li>
              <li className="pt-1.5">
                <Link
                  href="/branches"
                  className="inline-flex items-center text-xs font-semibold text-amber-400 hover:text-amber-300 gap-1"
                >
                  <span>View All Offices on Map</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick VIP Assistance Card (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3.5">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Inquiry</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect directly with a certified travel designer for custom holiday quotes and flight bookings.
              </p>
              <div className="space-y-2 pt-1">
                <a
                  href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels,%20I%20would%20like%20to%20plan%20a%20holiday!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-sm transition-transform hover:scale-102"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp Us</span>
                </a>
                <a
                  href="tel:+919100228152"
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span>Call: +91 91002 28152</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Prominent RapidShift Labs Attribution */}
        <div className="pt-8 border-t border-slate-850 flex flex-col xl:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Yellow Ribbon Travels. All rights reserved. Registered Indian Tour Operator.
          </div>

          {/* Centered Prominent RapidShift Labs Credit */}
          <div className="flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-xs">
            <span className="text-slate-400">The website is powered, created, maintained and managed by</span>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              RapidShift Labs
            </span>
          </div>

          {/* Legal & Portal Links */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-amber-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/refund-policy" className="hover:text-amber-400 transition-colors">
              Refund & Cancellation
            </Link>
            <Link href="/contact" className="hover:text-slate-200 transition-colors">
              Contact
            </Link>
            <Link
              href="/beta"
              className="inline-flex items-center gap-1 text-amber-400/90 hover:text-amber-300 transition-colors bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[11px] font-semibold"
            >
              <span>🧪 Beta QA Lab</span>
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
