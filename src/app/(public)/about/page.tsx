import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { Award, Compass, ShieldCheck, Heart, Users, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About Us | Yellow Ribbon Travels",
  description:
    "Learn about Yellow Ribbon Travels, an accredited travel agency and tour operator dedicated to crafting unforgettable journeys with transparent pricing and human care.",
};

export default function AboutPage() {
  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-12 sm:space-y-16">
      <Breadcrumbs items={[{ label: "About Us" }]} />
      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <Compass className="w-3.5 h-3.5" /> Our Identity & Purpose
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Crafting Travel Experiences That Touch The Heart
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Headquartered in Secunderabad (Hyderabad) with branch offices across India, <strong>Yellow Ribbon Travels</strong> was founded with a clear mission: to make world travel seamless, transparent, and profoundly memorable.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            We believe that vacations are not merely ticket bookings and hotel vouchers. They are milestone family reunions, romantic honeymoon celebrations, and soul-stirring explorations. Our travel architects work side-by-side with you to ensure every moment is effortless.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/our-story"
              className="px-6 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              Read Our Story
            </Link>
            <Link
              href="/team"
              className="px-6 py-3 rounded-full font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Meet Our Team
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"
              alt="Yellow Ribbon Travels Journey"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              loading="lazy"
              className="object-cover"
            />
          </div>
          {/* Floating Emblem */}
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-brand-yellow via-brand-coral to-brand-cyan">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-black text-slate-900 text-sm">
                YR
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">12+ Years</div>
              <div className="text-xs text-slate-500">Excellence in Tourism</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-50/50 to-white rounded-3xl p-8 border border-amber-200/80 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            To provide world-class, personalized travel curation with absolute price transparency, unwavering integrity, and 24/7 dedicated support, ensuring every traveler returns with cherished memories.
          </p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/10 via-cyan-50/50 to-white rounded-3xl p-8 border border-cyan-200/80 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            To be recognized as India's most dependable, customer-first boutique travel agency—celebrated for deep destination expertise, genuine human relationships, and ethical tourism practices.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">
            The Principles We Stand By
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Every quote we issue and every itinerary we finalize reflects our core pillars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-white via-amber-50/45 to-amber-100/25 rounded-3xl p-6 border border-amber-200/70 shadow-sm space-y-2">
            <CheckCircle2 className="w-8 h-8 text-amber-500 mb-2" />
            <h4 className="font-bold text-base text-slate-900">Zero Hidden Costs</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We provide itemized breakdowns. Taxes, entry tickets, and permits are explicitly outlined so there are no surprises abroad.
            </p>
          </div>

          <div className="bg-gradient-to-br from-white via-cyan-50/45 to-cyan-100/25 rounded-3xl p-6 border border-cyan-200/70 shadow-sm space-y-2">
            <CheckCircle2 className="w-8 h-8 text-cyan-500 mb-2" />
            <h4 className="font-bold text-base text-slate-900">Hand-Inspected Stays</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We personally vet our partner resorts and houseboats to guarantee hygienic linens, central safety, and authentic hospitality.
            </p>
          </div>

          <div className="bg-gradient-to-br from-white via-emerald-50/45 to-emerald-100/25 rounded-3xl p-6 border border-emerald-200/70 shadow-sm space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
            <h4 className="font-bold text-base text-slate-900">Always-On Concierge</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              You are never on your own. A dedicated tour coordinator is assigned to your trip group via direct WhatsApp and mobile.
            </p>
          </div>

          <div className="bg-gradient-to-br from-white via-rose-50/45 to-rose-100/25 rounded-3xl p-6 border border-rose-200/70 shadow-sm space-y-2">
            <CheckCircle2 className="w-8 h-8 text-rose-500 mb-2" />
            <h4 className="font-bold text-base text-slate-900">Ethical & Respectful</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We partner with local guides and eco-conscious operators, ensuring our tourism directly enriches local communities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
