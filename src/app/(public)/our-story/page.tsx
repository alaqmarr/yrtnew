import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { Sparkles, Heart, Compass, MapPin, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Our Story | Yellow Ribbon Travels",
  description:
    "The journey of Yellow Ribbon Travels from Secunderabad to becoming a trusted pan-India travel curator with 5 branch offices.",
};

export default function OurStoryPage() {
  const milestones = [
    {
      year: "The Beginning",
      title: "The First Ribbon Tied in Secunderabad",
      desc: "Founded at Mittal Chambers on M.G. Road, Secunderabad, with a humble two-desk setup and a resolute philosophy: to treat every traveler's journey as if it were our own family vacation.",
    },
    {
      year: "Expansion",
      title: "IATA Accreditation & Flight Desk Launch",
      desc: "Earned international airline ticketing credentials and established direct relationships with major airlines, enabling transparent airfares and zero-commission customer savings.",
    },
    {
      year: "Growth",
      title: "Pan-India Branches Across 5 Cities",
      desc: "In response to word-of-mouth traveler recommendations, we opened regional branches in Chennai, Pune, Dahod, and Patna to serve travelers with local in-person consultations.",
    },
    {
      year: "Today",
      title: "15,000+ Journeys & 4.9 Star Google Legacy",
      desc: "Curating over 50 global destinations across Kashmir, Europe, Dubai, Bali, and Vietnam, backed by more than 480 verified Google reviews.",
    },
  ];

  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-12 sm:space-y-16">
      <Breadcrumbs items={[{ label: "Our Story" }]} />
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> The Story Behind The Name
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Why "Yellow Ribbon"?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Throughout history, the yellow ribbon has symbolized hope, joyous welcome, and a beacon that guides travelers safely back home. That spirit is the beating heart of our company.
        </p>
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 relative">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
              alt="Yellow Ribbon Travels Origins"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
              className="object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            From A Single Office in Secunderabad to Pan-India Trust
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            When we first opened our doors at Shop No. 2, Mittal Chambers on M.G. Road in Secunderabad, the travel agency landscape was fraught with misleading brochures, unlisted hidden taxes, and automated call centers that abandoned travelers the moment flight delays occurred.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            We decided to build something different: an agency where travelers could sit across the desk with a true destination specialist, sip a cup of chai, look at genuine hotel photos, and receive guaranteed 24/7 human support.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            As our guests returned home with glowing praise, their friends and relatives in Tamil Nadu, Maharashtra, Gujarat, and Bihar requested local branches. Today, our 5 offices operate as one united family, upholding the same warm Yellow Ribbon standard.
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gradient-to-br from-amber-50/75 via-white to-rose-50/60 rounded-3xl p-8 sm:p-14 border border-amber-200/70 space-y-10 shadow-xs">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Our Milestones</h2>
          <p className="text-xs text-slate-500">
            A journey of passion, customer obsession, and authentic relationships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-white via-white to-amber-50/45 rounded-2xl p-6 border border-amber-200/60 shadow-sm relative group hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-black uppercase tracking-wider text-amber-600 block mb-2">
                {m.year}
              </span>
              <h4 className="font-bold text-base text-slate-900 mb-2">
                {m.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Callout to Branches */}
      <div className="bg-gradient-to-r from-brand-yellow to-amber-500 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-2xl font-bold text-white">Visit Our Local Branches</h3>
          <p className="text-xs sm:text-sm text-yellow-100 max-w-lg">
            Have a travel dream in mind? Meet our branch managers in Secunderabad, Chennai, Pune, Dahod, or Patna.
          </p>
        </div>

        <Link
          href="/branches"
          className="px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm bg-white text-slate-900 hover:bg-yellow-50 shadow-md transition-colors shrink-0"
        >
          View Branch Directory
        </Link>
      </div>
    </div>
  );
}
