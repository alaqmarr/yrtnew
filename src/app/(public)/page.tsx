import Link from "next/link";
import Image from "next/image";
import { tourService } from "@/modules/tours/service/tour.service";
import { destinationService } from "@/modules/destinations/service/destination.service";
import { reviewService } from "@/modules/reviews/service/review.service";
import { blogService } from "@/modules/blogs/service/blog.service";
import { branchService } from "@/modules/branches/service/branch.service";
import { siteSettingService } from "@/modules/site-settings/service/site-setting.service";
import TourCard from "@/modules/tours/components/TourCard";
import DestinationCard from "@/modules/destinations/components/DestinationCard";
import BranchCard from "@/modules/branches/components/BranchCard";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import HeroVideoBackground from "@/shared/components/HeroVideoBackground";
import FlightBookingPopup from "@/modules/flights/components/FlightBookingPopup";
import {
  Sparkles,
  Plane,
  ShieldCheck,
  Star,
  Users,
  Compass,
  ArrowRight,
  MapPin,
  Clock,
  PhoneCall,
  Award,
  HeartHandshake,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export const revalidate = 60; // ISR cache revalidation every 60 seconds

const DEFAULT_HERO_VIDEOS = [
  "https://videos.pexels.com/video-files/31733343/13520588_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/4010511/4010511-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/4010941/4010941-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/37999130/16126233_2560_1440_30fps.mp4",
  "https://videos.pexels.com/video-files/29045884/12556561_2560_1440_60fps.mp4",
];

export default async function HomePage() {
  const [featuredTours, featuredDestinations, reviews, blogs, branches, settings] = await Promise.all([
    tourService.getFeaturedTours(8),
    destinationService.getFeaturedDestinations(),
    reviewService.getPublishedReviews(6),
    blogService.getFeaturedBlogs(),
    branchService.getActiveBranches(),
    siteSettingService.getSettingsMap(),
  ]);

  const configuredHeroVideos = [
    settings.hero_video_1,
    settings.hero_video_2,
    settings.hero_video_3,
    settings.hero_video_4,
    settings.hero_video_5,
  ]
    .map((u) => (u || "").trim())
    .filter(Boolean);

  const heroVideos =
    configuredHeroVideos.length > 0
      ? configuredHeroVideos
      : DEFAULT_HERO_VIDEOS;

  return (
    <div className="w-full overflow-x-hidden">
      {/* 1. CINEMATIC FULL-BLEED HERO WITH CENTERED CURSIVE BRANDING */}
      <section className="relative isolate w-full min-h-[88vh] lg:min-h-[92vh] pt-16 sm:pt-20 flex items-center justify-center overflow-hidden m-0 bg-amber-950">
        {/* Cinematic Multi-Video Background (Up to 5 Videos) */}
        <HeroVideoBackground videos={heroVideos} />

        {/* Subtle Warm Golden-Yellow Brand Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/35 via-amber-400/15 to-amber-950/45 z-[1] pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-amber-300/10 via-amber-900/20 to-stone-950/45 z-[1] pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 pt-12 sm:pt-20 pb-8 sm:pb-14 flex flex-col items-center justify-center text-center space-y-5 sm:space-y-8">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-amber-300 text-[11px] sm:text-sm font-bold shadow-lg max-w-[95vw] sm:max-w-none text-center">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0 animate-spin [animation-duration:8s]" />
            <span className="truncate">Bespoke Holidays • Wholesale Flights • Global Branches</span>
          </div>

          {/* Centered Grand Cursive Brand Title */}
          <div className="space-y-3 sm:space-y-4 max-w-5xl mx-auto px-2">
            <h1 className="font-cursive text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-amber-300 font-normal tracking-wide drop-shadow-[0_12px_32px_rgba(0,0,0,0.9)] leading-tight select-none">
              Yellow Ribbon Travels
            </h1>
            <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              Curating Extraordinary Journeys Around The World
            </p>
          </div>

          {/* CTA Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-1 sm:pt-2 w-full max-w-md sm:max-w-2xl lg:max-w-5xl mx-auto px-2">
            <Link
              href="/tours"
              className="w-full h-12 sm:h-[52px] px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-br from-white/20 via-white/15 to-amber-400/10 hover:from-white/30 hover:to-amber-400/20 backdrop-blur-md border border-amber-200/35 shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center gap-2 whitespace-nowrap transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
              <span>Explore Tour Packages</span>
              <ArrowRight className="w-4 h-4 text-amber-200 shrink-0" />
            </Link>

            <Link
              href="/flight-bookings"
              className="w-full h-12 sm:h-[52px] px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-br from-white/20 via-white/15 to-sky-400/10 hover:from-white/30 hover:to-sky-400/20 backdrop-blur-md border border-sky-200/35 shadow-lg shadow-sky-500/10 transition-all flex items-center justify-center gap-2 whitespace-nowrap transform hover:-translate-y-0.5"
            >
              <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-sky-300 rotate-45 shrink-0" />
              <span>Flight Desk</span>
            </Link>

            <Link
              href="/pay"
              className="w-full h-12 sm:h-[52px] px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-br from-white/20 via-white/15 to-cyan-400/10 hover:from-white/30 hover:to-cyan-400/20 backdrop-blur-md border border-cyan-200/35 shadow-lg shadow-cyan-500/10 transition-all flex items-center justify-center gap-2 whitespace-nowrap transform hover:-translate-y-0.5"
            >
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300 shrink-0" />
              <span>Pay Online</span>
            </Link>

            <a
              href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels,%20I%20would%20like%20to%20plan%20a%20holiday%20trip!"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 sm:h-[52px] px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-br from-white/20 via-white/15 to-emerald-400/10 hover:from-white/30 hover:to-emerald-400/20 backdrop-blur-md border border-emerald-200/35 shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 whitespace-nowrap transform hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-emerald-300 shrink-0" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. FULL-WIDTH LIVE METRICS TICKER (Branded Logo Light Palette) - CONNECTS DIRECTLY FLUSH TO HERO */}
      <section className="w-full bg-gradient-to-r from-amber-50/90 via-white via-cyan-50/70 to-rose-50/80 py-8 sm:py-10 border-b border-amber-200/80 shadow-xs relative overflow-hidden m-0">
        {/* Subtle Brand Ribbon Highlight Bar Top */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-yellow via-brand-green via-brand-cyan to-brand-coral opacity-90" />

        <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-3 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 text-center">
          <div className="space-y-1 p-2.5 sm:p-3 rounded-2xl bg-white/70 sm:bg-transparent border sm:border-0 border-amber-200/50 shadow-xs sm:shadow-none">
            <div className="text-2xl sm:text-3xl xl:text-4xl font-black text-amber-600 tracking-tight">15,000+</div>
            <div className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider">Happy Travelers</div>
            <div className="text-[9px] sm:text-[10px] font-semibold text-amber-700/80">★ Verified Journeys</div>
          </div>

          <div className="space-y-1 p-2.5 sm:p-3 rounded-2xl bg-white/70 sm:bg-transparent border sm:border-0 border-cyan-200/50 shadow-xs sm:shadow-none sm:border-l sm:border-amber-200/60">
            <div className="text-2xl sm:text-3xl xl:text-4xl font-black text-cyan-600 tracking-tight">50+</div>
            <div className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider">Destinations</div>
            <div className="text-[9px] sm:text-[10px] font-semibold text-cyan-700/80">Domestic & Global</div>
          </div>

          <div className="space-y-1 p-2.5 sm:p-3 rounded-2xl bg-white/70 sm:bg-transparent border sm:border-0 border-amber-200/50 shadow-xs sm:shadow-none sm:border-l sm:border-amber-200/60">
            <div className="text-2xl sm:text-3xl xl:text-4xl font-black text-amber-500 tracking-tight">4.9 ★</div>
            <div className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider">Google Rating</div>
            <div className="text-[9px] sm:text-[10px] font-semibold text-amber-700/80">480+ Real Reviews</div>
          </div>

          <div className="space-y-1 p-2.5 sm:p-3 rounded-2xl bg-white/70 sm:bg-transparent border sm:border-0 border-rose-200/50 shadow-xs sm:shadow-none sm:border-l sm:border-amber-200/60">
            <div className="text-2xl sm:text-3xl xl:text-4xl font-black text-rose-600 tracking-tight">8+</div>
            <div className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider">Global Offices</div>
            <div className="text-[9px] sm:text-[10px] font-semibold text-rose-700/80">India, UAE, UK, SG</div>
          </div>

          <div className="space-y-1 p-2.5 sm:p-3 rounded-2xl bg-white/70 sm:bg-transparent border sm:border-0 border-emerald-200/50 shadow-xs sm:shadow-none sm:border-l sm:border-amber-200/60">
            <div className="text-2xl sm:text-3xl xl:text-4xl font-black text-emerald-600 tracking-tight">100%</div>
            <div className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider">Custom Tours</div>
            <div className="text-[9px] sm:text-[10px] font-semibold text-emerald-700/80">Tailor-Made Holidays</div>
          </div>

          <div className="space-y-1 p-2.5 sm:p-3 rounded-2xl bg-white/70 sm:bg-transparent border sm:border-0 border-cyan-200/50 shadow-xs sm:shadow-none sm:border-l sm:border-amber-200/60">
            <div className="text-2xl sm:text-3xl xl:text-4xl font-black text-cyan-700 tracking-tight">24 / 7</div>
            <div className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider">Concierge</div>
            <div className="text-[9px] sm:text-[10px] font-semibold text-cyan-800/80">WhatsApp Assistance</div>
          </div>
        </div>

        {/* Subtle Brand Ribbon Highlight Bar Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-brand-coral via-brand-cyan via-brand-green to-brand-yellow opacity-90" />
      </section>

      {/* 3. FULL-WIDTH FEATURED DESTINATIONS BENTO */}
      <section className="relative w-full bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 py-16 lg:py-20 border-b border-amber-200/50 m-0 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-300/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-rose-300/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-gradient-to-r from-amber-100/80 to-orange-50 px-3 py-1 rounded-full border border-amber-200/80">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Iconic Getaways
              </div>
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-slate-950 tracking-tight">
                Trending Destinations This Season
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
                Explore handpicked domestic wonders and international paradises backed by direct local transport, top-tier accommodations, and sightseeing passes.
              </p>
            </div>

            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors shrink-0"
            >
              <span>View All Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-6 w-full">
            {featuredDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. FULL-WIDTH HANDPICKED TOUR PACKAGES */}
      <section className="relative w-full bg-gradient-to-tr from-cyan-50/75 via-sky-50/35 to-amber-50/60 py-16 lg:py-20 border-b border-cyan-200/50 m-0 overflow-hidden">
        <div className="pointer-events-none absolute top-12 left-1/4 w-96 h-96 rounded-full bg-cyan-300/12 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 w-96 h-96 rounded-full bg-amber-300/12 blur-3xl" />

        <div className="relative z-10 w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-800 bg-gradient-to-r from-cyan-100/80 to-sky-50 px-3 py-1 rounded-full border border-cyan-200/80">
                <Compass className="w-3.5 h-3.5 text-cyan-600" /> Handpicked Holidays
              </div>
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-slate-950 tracking-tight">
                Best-Selling Tour Packages
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
                Transparent, all-inclusive pricing with daily breakfast, private chauffeur cab, deluxe hotels, and comprehensive sightseeing.
              </p>
            </div>

            <Link
              href="/tours"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all shrink-0 shadow-md shadow-amber-500/20"
            >
              <span>Browse All {featuredTours.length}+ Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Multi-column Full-width Package Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 w-full">
            {featuredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. FULL-WIDTH "WHY YELLOW RIBBON" LUXURY FEATURE SECTION */}
      <section className="relative w-full bg-gradient-to-b from-amber-50/60 via-white to-rose-50/45 py-16 lg:py-20 border-b border-amber-200/50 m-0 overflow-hidden">
        <div className="pointer-events-none absolute -top-20 left-1/3 w-96 h-96 rounded-full bg-amber-200/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 w-96 h-96 rounded-full bg-emerald-200/15 blur-3xl" />

        <div className="relative z-10 w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-100 to-orange-100/80 text-amber-900 border border-amber-300">
              <Award className="w-4 h-4 text-amber-600" /> The Yellow Ribbon Promise
            </div>
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-slate-950">
              Why Discerning Travelers Choose Us
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We combine the personal care of physical neighborhood branch offices with accredited global airline ticketing and direct destination contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {/* 1: Yellow Ribbon */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white via-amber-50/50 to-amber-100/35 border-2 border-amber-200/80 hover:border-amber-400 hover:shadow-card transition-all space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200/80 text-amber-700 flex items-center justify-center shadow-xs">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">8+ Domestic & Global Offices</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Meet our senior travel architects in person across Secunderabad HQ, Chennai, Pune, Dahod, Patna, Dubai (UAE), London (UK), and Singapore.
              </p>
            </div>

            {/* 2: Cyan Ribbon */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white via-cyan-50/50 to-cyan-100/35 border-2 border-cyan-200/80 hover:border-cyan-400 hover:shadow-card transition-all space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-200/80 text-cyan-700 flex items-center justify-center shadow-xs">
                <Plane className="w-7 h-7 rotate-45" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">IATA Verified Flight Desk</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Direct airline GDS access allows us to hold seats, secure special baggage allocations, and offer wholesale international flight fares.
              </p>
            </div>

            {/* 3: Coral Ribbon */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white via-rose-50/50 to-rose-100/35 border-2 border-rose-200/80 hover:border-rose-400 hover:shadow-card transition-all space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200/80 text-rose-700 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">100% Private Chauffeured</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No rigid big-bus schedules or unwanted vendor stops. Travel in private, sanitized AC vehicles at your own family pace.
              </p>
            </div>

            {/* 4: Emerald Ribbon */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white via-emerald-50/50 to-emerald-100/35 border-2 border-emerald-200/80 hover:border-emerald-400 hover:shadow-card transition-all space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200/80 text-emerald-700 flex items-center justify-center shadow-xs">
                <WhatsAppIcon className="w-7 h-7 fill-[#25D366]" />
              </div>
              <h3 className="text-xl font-bold text-slate-950">24/7 WhatsApp Concierge</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                A dedicated tour manager is connected with you on WhatsApp from airport departure until your safe return home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FULL-WIDTH GOOGLE REVIEWS SHOWCASE */}
      <section className="relative w-full bg-gradient-to-br from-amber-50/80 via-yellow-50/35 to-cyan-50/60 py-16 lg:py-20 border-b border-amber-200/50 m-0 overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-1/4 w-96 h-96 rounded-full bg-amber-300/12 blur-3xl" />

        <div className="relative z-10 w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-gradient-to-r from-amber-100/90 to-yellow-50 px-3 py-1 rounded-full border border-amber-200/80">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Traveler Experiences
              </div>
              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-slate-950 tracking-tight">
                Loved by 15,000+ Happy Explorers
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
                Authentic reviews from families, couples, and corporate travelers who embarked on unforgettable vacations with Yellow Ribbon Travels.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-white to-amber-50/70 rounded-xl shadow-xs border border-amber-200/80 text-slate-900 font-black text-sm">
                <span>Google 4.9 ★</span>
              </div>
              <Link
                href="/review"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm transition-all"
              >
                All Reviews ({reviews.length}+)
              </Link>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-6 w-full">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-gradient-to-br from-white via-white to-amber-50/45 rounded-3xl p-6 sm:p-8 border border-amber-200/60 shadow-card hover:shadow-card-hover transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {r.trip_type || "Verified Traveler"}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{r.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-100/80 flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                    <Image
                      src={r.author_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(r.author_name)}`}
                      alt={r.author_name}
                      fill
                      sizes="40px"
                      loading="lazy"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{r.author_name}</div>
                    <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Google Review
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FULL-WIDTH GLOBAL & DOMESTIC BRANCH NETWORK */}
      <section className="relative w-full bg-gradient-to-tr from-rose-50/50 via-amber-50/35 to-cyan-50/50 py-16 lg:py-20 border-b border-amber-200/50 m-0 overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 rounded-full bg-rose-300/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-cyan-300/12 blur-3xl" />

        <div className="relative z-10 w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-rose-50 to-amber-50 text-rose-700 border border-rose-200">
              <MapPin className="w-3.5 h-3.5" /> Physical Presence
            </div>
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-slate-950 tracking-tight">
              Our Domestic & Global Branch Network
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Meet our consultants in person across Secunderabad HQ, Chennai, Pune, Dahod, and Patna, or our overseas offices in Dubai, London, and Singapore for personal itinerary consultations and flight bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7 sm:gap-8 w-full">
            {branches.map((b) => (
              <BranchCard key={b.id} branch={b} />
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/branches"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 bg-gradient-to-r from-white via-amber-50/40 to-white border border-amber-200/80 hover:border-amber-400 hover:shadow-card shadow-sm transition-all"
            >
              <span>Explore All Global & Domestic Offices (India, UAE, UK, Singapore)</span>
              <ChevronRight className="w-4 h-4 text-amber-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FULL-WIDTH FLIGHT DESK & CUSTOM VACATION CTA */}
      <section className="w-full bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-cyan-50/60 py-16 lg:py-20 m-0">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
          <div className="w-full bg-gradient-to-r from-brand-yellow via-amber-500 to-brand-coral rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md">
                <Plane className="w-3.5 h-3.5 rotate-45" /> Ready for Your Next Flight or Holiday?
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Let's Plan Your Dream Trip Together
              </h2>
              <p className="text-sm sm:text-base text-yellow-100 leading-relaxed font-normal">
                Speak with a dedicated travel specialist today. We offer custom itinerary quotes, special group fares, visa assistance, and flexible payment arrangements.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-2xl text-sm sm:text-base font-bold bg-white text-slate-900 hover:bg-yellow-50 shadow-lg shadow-black/10 transition-transform hover:scale-105"
              >
                Get a Free Custom Quote
              </Link>
              <a
                href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels,%20I%20would%20like%20to%20plan%20a%20holiday%20trip!"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-2xl text-sm sm:text-base font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href="tel:+919100228152"
                className="px-6 py-4 rounded-2xl text-sm sm:text-base font-bold bg-black/25 hover:bg-black/35 text-white border border-white/30 backdrop-blur-sm transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-yellow-300" />
                <span>Call Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Flight Booking Session Popup: Strictly mounted on the root '/' route */}
      <FlightBookingPopup
        enabled={settings.flight_popup_enabled !== "false"}
        delayMs={Number(settings.flight_popup_delay_sec || 2.5) * 1000}
        heading={settings.flight_popup_heading || "Planning Your Next Flight?"}
        subheading={settings.flight_popup_subheading || "Exclusive domestic & international fares with instant WhatsApp quotations from our IATA Flight Desk."}
        whatsappNumber={settings.whatsapp_number || settings.phone_primary || "919100228152"}
      />
    </div>
  );
}
