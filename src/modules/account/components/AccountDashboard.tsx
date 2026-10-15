"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Calendar,
  Clock,
  Compass,
  CreditCard,
  Heart,
  LifeBuoy,
  MapPin,
  Phone,
  Plane,
  Plus,
  ShieldCheck,
  Sparkles,
  Ticket,
  User,
  Users,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  MessageSquare,
  Printer,
} from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import { ClientDashboardData } from "../domain/account.entity";
import { SupportTicket } from "../domain/ticket.entity";
import NewTicketModal from "./NewTicketModal";
import FamilyHub from "@/modules/family/components/FamilyHub";

interface AccountDashboardProps {
  initialData: ClientDashboardData;
}

function AccountDashboardInner({ initialData }: AccountDashboardProps) {
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab");

  const [data, setData] = useState<ClientDashboardData>(initialData);
  const [activeTab, setActiveTab] = useState<
    "overview" | "itineraries" | "bookings" | "payments" | "tickets" | "favorites" | "family" | "profile"
  >("overview");
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [bookingFamilyFilter, setBookingFamilyFilter] = useState<string>("all");

  useEffect(() => {
    if (!urlTab) return;
    const lower = urlTab.toLowerCase();
    if (lower === "family") setActiveTab("family");
    else if (lower === "bookings" || lower === "booking" || lower === "trips") setActiveTab("bookings");
    else if (lower === "itineraries" || lower === "itinerary") setActiveTab("itineraries");
    else if (lower === "payments" || lower === "payment" || lower === "invoices") setActiveTab("payments");
    else if (lower === "tickets" || lower === "ticket" || lower === "support") setActiveTab("tickets");
    else if (lower === "favorites" || lower === "favorite") setActiveTab("favorites");
    else if (lower === "profile") setActiveTab("profile");
    else if (lower === "overview") setActiveTab("overview");
  }, [urlTab]);

  const { profile, bookings, flights, paymentLinks, itineraries, invoices, tickets, favorites, stats } = data;

  const displayedBookings = bookings.filter((b) => {
    if (bookingFamilyFilter === "all") return true;
    if (bookingFamilyFilter === profile.email) {
      return (
        b.customer_email?.toLowerCase() === profile.email.toLowerCase() ||
        (!b.customer_email && !b.family_member_id)
      );
    }
    const member = data.familyMembers?.find(
      (m) => m.email === bookingFamilyFilter || m.id === bookingFamilyFilter
    );
    if (member) {
      return (
        (member.email && b.customer_email?.toLowerCase() === member.email.toLowerCase()) ||
        b.family_member_id === member.id
      );
    }
    return true;
  });

  const displayedFlights = flights.filter((f) => {
    if (bookingFamilyFilter === "all") return true;
    if (bookingFamilyFilter === profile.email) {
      return f.customer_email?.toLowerCase() === profile.email.toLowerCase();
    }
    const member = data.familyMembers?.find(
      (m) => m.email === bookingFamilyFilter || m.id === bookingFamilyFilter
    );
    if (member) {
      return (
        (member.email && f.customer_email?.toLowerCase() === member.email.toLowerCase()) ||
        f.family_member_id === member.id
      );
    }
    return true;
  });

  const handleTicketCreated = (newTicket: SupportTicket) => {
    setData((prev) => ({
      ...prev,
      tickets: [newTicket, ...prev.tickets],
      stats: {
        ...prev.stats,
        openTickets: prev.stats.openTickets + 1,
      },
    }));
    setActiveTab("tickets");
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* 1. TOP CLIENT HEADER CARD */}
      <div className="rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/70 text-white shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Subtle Decorative Background Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Avatar Pill */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-xl shadow-amber-500/20 shrink-0">
              {profile.name.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                  Namaste, {profile.name}
                </h1>
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-slate-950" />
                  Privilege Traveler
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 font-medium">
                <span>{profile.email}</span>
                {profile.phone && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      {profile.phone}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Raise Ticket</span>
            </button>

            <a
              href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Concierge,%20I%20am%20a%20registered%20client%20requesting%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Concierge Desk</span>
            </a>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 border border-white/15"
              title="Sign Out of Portal"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        <button
          onClick={() => setActiveTab("itineraries")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
            activeTab === "itineraries"
              ? "bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-500/25 scale-[1.02]"
              : "bg-white/95 backdrop-blur-md border-slate-200/90 hover:border-amber-400 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <FileText className={`w-5 h-5 ${activeTab === "itineraries" ? "text-white" : "text-amber-500"}`} />
            <span className="text-2xl font-black">{itineraries.length}</span>
          </div>
          <div className={`text-xs font-bold ${activeTab === "itineraries" ? "text-white/90" : "text-slate-600"}`}>
            Quotes & Itineraries
          </div>
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
            activeTab === "bookings"
              ? "bg-amber-600 text-white border-amber-700 shadow-lg shadow-amber-600/25 scale-[1.02]"
              : "bg-white/95 backdrop-blur-md border-slate-200/90 hover:border-amber-400 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Compass className={`w-5 h-5 ${activeTab === "bookings" ? "text-white" : "text-amber-600"}`} />
            <span className="text-2xl font-black">{stats.totalBookings}</span>
          </div>
          <div className={`text-xs font-bold ${activeTab === "bookings" ? "text-white/90" : "text-slate-600"}`}>
            Tour Bookings
          </div>
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
            activeTab === "bookings"
              ? "bg-cyan-600 text-white border-cyan-700 shadow-lg shadow-cyan-600/25 scale-[1.02]"
              : "bg-white/95 backdrop-blur-md border-slate-200/90 hover:border-cyan-400 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Plane className={`w-5 h-5 ${activeTab === "bookings" ? "text-white" : "text-cyan-500"}`} />
            <span className="text-2xl font-black">{flights.length}</span>
          </div>
          <div className={`text-xs font-bold ${activeTab === "bookings" ? "text-white/90" : "text-slate-600"}`}>
            Flight Inquiries
          </div>
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
            activeTab === "payments"
              ? "bg-emerald-600 text-white border-emerald-700 shadow-lg shadow-emerald-600/25 scale-[1.02]"
              : "bg-white/95 backdrop-blur-md border-slate-200/90 hover:border-emerald-400 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <CreditCard className={`w-5 h-5 ${activeTab === "payments" ? "text-white" : "text-emerald-500"}`} />
            <span className="text-2xl font-black">{paymentLinks.length + invoices.length}</span>
          </div>
          <div className={`text-xs font-bold ${activeTab === "payments" ? "text-white/90" : "text-slate-600"}`}>
            Payments & Invoices
          </div>
        </button>

        <button
          onClick={() => setActiveTab("tickets")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
            activeTab === "tickets"
              ? "bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-600/25 scale-[1.02]"
              : "bg-white/95 backdrop-blur-md border-slate-200/90 hover:border-indigo-400 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Ticket className={`w-5 h-5 ${activeTab === "tickets" ? "text-white" : "text-indigo-500"}`} />
            <span className="text-2xl font-black">{stats.openTickets}</span>
          </div>
          <div className={`text-xs font-bold ${activeTab === "tickets" ? "text-white/90" : "text-slate-600"}`}>
            Open Tickets
          </div>
        </button>

        <button
          onClick={() => setActiveTab("favorites")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
            activeTab === "favorites"
              ? "bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-500/25 scale-[1.02]"
              : "bg-white/95 backdrop-blur-md border-slate-200/90 hover:border-rose-400 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Heart className={`w-5 h-5 ${activeTab === "favorites" ? "text-white fill-white" : "text-rose-500 fill-rose-500"}`} />
            <span className="text-2xl font-black">{stats.savedFavorites}</span>
          </div>
          <div className={`text-xs font-bold ${activeTab === "favorites" ? "text-white/90" : "text-slate-600"}`}>
            Liked Moments
          </div>
        </button>

        <button
          onClick={() => setActiveTab("family")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all ${
            activeTab === "family"
              ? "bg-purple-600 text-white border-purple-700 shadow-lg shadow-purple-600/25 scale-[1.02]"
              : "bg-white/95 backdrop-blur-md border-slate-200/90 hover:border-purple-400 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Users className={`w-5 h-5 ${activeTab === "family" ? "text-white" : "text-purple-600"}`} />
            <span className="text-2xl font-black">
              {data.isFamilyHead ? (data.familyMembers?.length || 0) + 1 : 1}
            </span>
          </div>
          <div className={`text-xs font-bold ${activeTab === "family" ? "text-white/90" : "text-slate-600"}`}>
            {data.isFamilyHead ? "Family Group" : "Family Member"}
          </div>
        </button>
      </div>

      {/* 3. NAVIGATION TAB BAR */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === "overview"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          🌟 Portal Overview
        </button>

        <button
          onClick={() => setActiveTab("itineraries")}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === "itineraries"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          📜 Holiday Quotes ({itineraries.length})
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === "bookings"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          🧳 Bookings & Flights ({bookings.length + flights.length})
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === "payments"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          💳 Payments & Invoices ({paymentLinks.length + invoices.length})
        </button>

        <button
          onClick={() => setActiveTab("tickets")}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === "tickets"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          🎫 Support Tickets ({tickets.length})
        </button>

        <button
          onClick={() => setActiveTab("family")}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === "family"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          👨‍👩‍👧‍👦 Family & Co-Travelers ({data.isFamilyHead ? (data.familyMembers?.length || 0) + 1 : 1})
        </button>

        <button
          onClick={() => setActiveTab("favorites")}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === "favorites"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          💖 Saved Favorites ({favorites.length})
        </button>
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Quick Concierge Support Card */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300/40 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-800 border border-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Dedicated Travel Concierge
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Need customized changes or quick answers for your upcoming trip?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Your assigned relationship architect is available 24/7 for hotel upgrades, flight rebooking, emergency assistance, and personalized itineraries.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsTicketModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Submit Request</span>
              </button>
              <a
                href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Concierge,%20I%20need%20assistance%20with%20my%20travel%20account."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>

          {/* Recent Quotations & Luxury Itineraries */}
          {itineraries.length > 0 && (
            <div className="bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black shadow-xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-base sm:text-lg text-slate-900">
                      Your Customized Holiday Quotations & Itineraries
                    </h4>
                    <p className="text-xs text-slate-500">
                      Official travel proposals and printable day-by-day PDF itineraries prepared for you
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("itineraries")}
                  className="text-xs font-bold text-amber-700 hover:underline shrink-0"
                >
                  View All ({itineraries.length})
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itineraries.slice(0, 2).map((itn) => (
                  <div
                    key={itn.id}
                    className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                          {itn.reference_no}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {itn.status}
                        </span>
                      </div>
                      <h5 className="font-black text-base text-slate-900 line-clamp-1">
                        {itn.title}
                      </h5>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          {itn.destination}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          {itn.duration_nights}N / {itn.duration_days}D
                        </span>
                        {itn.start_date && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-amber-500" />
                              {itn.start_date}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Total Price</div>
                        <div className="text-base font-black text-slate-900">
                          ₹{itn.total_price.toLocaleString("en-IN")}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/itinerary/${itn.reference_no}`}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Quote</span>
                        </Link>
                        <a
                          href={`/itinerary/${itn.reference_no}?print=1`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all shadow-xs"
                          title="Print / Save Official PDF"
                        >
                          <Printer className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Bookings & Inquiries Snippet */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Active Bookings */}
            <div className="bg-white/95 rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-500" />
                  <span>Recent Tour Bookings</span>
                </h4>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="text-xs font-bold text-amber-600 hover:underline"
                >
                  View All ({bookings.length})
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <p className="text-xs">No active tour packages booked yet under this email.</p>
                  <Link
                    href="/tours"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:underline"
                  >
                    <span>Browse Handcrafted Packages</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 3).map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                          {b.tour_title || "Custom Private Tour"}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Travel: {b.travel_date}</span>
                          <span>•</span>
                          <span>{b.travelers_count} Travelers</span>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                          b.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Open Tickets & Inquiries */}
            <div className="bg-white/95 rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-indigo-500" />
                  <span>Support Tickets & Requests</span>
                </h4>
                <button
                  onClick={() => setActiveTab("tickets")}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  View All ({tickets.length})
                </button>
              </div>

              {tickets.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <p className="text-xs">You have no open support tickets.</p>
                  <button
                    onClick={() => setIsTicketModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
                  >
                    <span>+ Raise a New Ticket</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                            {t.ticket_number}
                          </span>
                          <span className="font-bold text-xs text-slate-900 line-clamp-1">
                            {t.subject}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          {t.message}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                          t.status === "resolved"
                            ? "bg-emerald-100 text-emerald-800"
                            : t.status === "in_progress"
                            ? "bg-cyan-100 text-cyan-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {t.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: QUOTATIONS & LUXURY ITINERARIES */}
      {activeTab === "itineraries" && (
        <div className="space-y-8">
          <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Custom Quotations & Official PDF Itineraries
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Tailored vacation proposals prepared exclusively for you by Yellow Ribbon Travels, complete with handpicked hotels, transfers, sightseeing, and transparent pricing.
                </p>
              </div>

              <a
                href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Concierge,%20I%20would%20like%20to%20request%20a%20new%20customized%20holiday%20quotation."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-yellow to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Request Custom Quote</span>
              </a>
            </div>

            {itineraries.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-3xl border border-slate-200/60 space-y-3">
                <FileText className="w-12 h-12 mx-auto text-slate-300" />
                <p className="text-base font-bold text-slate-700">No Quotations Found</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  When our holiday architects design a tailored vacation itinerary for you, it will automatically appear here with a complete day-by-day plan, hotel vouchers, and printable official PDF.
                </p>
                <a
                  href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Concierge,%20please%20plan%20a%20custom%20holiday%20for%20me."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Chat with Travel Concierge</span>
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {itineraries.map((itn) => (
                  <div
                    key={itn.id}
                    className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white hover:border-amber-300 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-5"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                          {itn.reference_no}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            itn.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : itn.status === "Active"
                              ? "bg-cyan-100 text-cyan-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {itn.status}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="font-black text-lg sm:text-xl text-slate-900 leading-snug">
                        {itn.title}
                      </h4>

                      {/* Key Trip Meta Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">Destination: <strong className="text-slate-900">{itn.destination}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>Duration: <strong className="text-slate-900">{itn.duration_nights}N / {itn.duration_days}D</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">Date: <strong className="text-slate-900">{itn.start_date || "Upon Confirmation"}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>Travelers: <strong className="text-slate-900">{itn.pax_label || `${itn.travelers_count || 2} Adults`}</strong></span>
                        </div>
                      </div>

                      {itn.vehicle && (
                        <div className="mt-2.5 text-xs text-slate-500 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/60 border border-amber-100 text-amber-900">
                          <span className="font-semibold">Transport:</span>
                          <span>{itn.vehicle}</span>
                        </div>
                      )}
                    </div>

                    {/* Pricing & Action Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Quote</div>
                        <div className="text-2xl font-black text-slate-900">
                          ₹{itn.total_price.toLocaleString("en-IN")}
                        </div>
                        {itn.price_per_person && itn.price_per_person > 0 ? (
                          <div className="text-xs text-slate-500 font-medium">
                            ₹{itn.price_per_person.toLocaleString("en-IN")} per person
                          </div>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/itinerary/${itn.reference_no}`}
                          className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-2 transition-all shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Quote</span>
                        </Link>
                        <a
                          href={`/itinerary/${itn.reference_no}?print=1`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm"
                          title="Print / Save Official A4 PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print PDF</span>
                        </a>
                        <a
                          href={`https://wa.me/919100228152?text=${encodeURIComponent(
                            `Hi Yellow Ribbon Concierge, I am reviewing my holiday quote ${itn.reference_no} for ${itn.destination} (₹${itn.total_price.toLocaleString("en-IN")}) and would like to discuss next steps.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all shadow-sm"
                          title="Discuss on WhatsApp"
                        >
                          <WhatsAppIcon className="w-4 h-4 fill-white" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: BOOKINGS & FLIGHTS */}
      {activeTab === "bookings" && (
        <div className="space-y-8">
          {/* Family Scope Banner / Filter for Family Head */}
          {data.isFamilyHead && data.familyMembers?.length > 0 && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-50/50 to-transparent border border-amber-300/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Consolidated Family Travel View
                  </h4>
                  <p className="text-xs text-slate-500">
                    As the Family Head, you see all tour bookings and flight inquiries across your family group.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <label htmlFor="family-booking-filter" className="text-xs font-semibold text-slate-700">Filter:</label>
                <select
                  id="family-booking-filter"
                  value={bookingFamilyFilter}
                  onChange={(e) => setBookingFamilyFilter(e.target.value)}
                  className="text-xs font-bold rounded-xl border border-amber-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
                >
                  <option value="all">All Family Members ({bookings.length + flights.length} items)</option>
                  <option value={profile.email}>{profile.name} (Primary Account)</option>
                  {data.familyMembers.map((m) => (
                    <option key={m.id} value={m.email || m.id}>
                      {m.name} ({m.relationship})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {!data.isFamilyHead && (
            <div className="p-4 rounded-3xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-between text-xs text-indigo-950">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>
                  <strong>Personal Data Isolation:</strong> You are viewing only your own bookings & flight requests.
                </span>
              </div>
              {data.familyHead && (
                <span className="text-[11px] text-indigo-600 font-semibold hidden sm:inline">
                  Linked to {data.familyHead.name}&apos;s Family Group
                </span>
              )}
            </div>
          )}

          {/* Tours Section */}
          <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">Guided Tour Packages</h3>
                <p className="text-xs text-slate-500">Confirmed and pending holiday packages booked with Yellow Ribbon</p>
              </div>
              <Link
                href="/tours"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs"
              >
                + Book New Tour
              </Link>
            </div>

            {displayedBookings.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/60">
                <Compass className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">No Tour Bookings Found</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {bookingFamilyFilter !== "all"
                    ? "No tour packages found under the selected family member filter."
                    : "Ready for your next getaway? Explore our best-selling all-inclusive packages across Kashmir, Bali, Dubai, Kerala, and Europe."}
                </p>
                <Link
                  href="/tours"
                  className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Explore Packages
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedBookings.map((b) => {
                  const bookedForMember = data.familyMembers?.find(
                    (m) =>
                      (m.email && m.email.toLowerCase() === b.customer_email?.toLowerCase()) ||
                      m.id === b.family_member_id
                  );

                  return (
                    <div key={b.id} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-black text-base text-slate-900 leading-snug">
                              {b.tour_title || "Tailored Custom Vacation"}
                            </h4>
                            {data.isFamilyHead && bookedForMember && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                Traveler: {bookedForMember.name} ({bookedForMember.relationship})
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            <span>Travel Date: <strong>{b.travel_date}</strong></span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
                          {b.status}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                        <span>Travelers: <strong>{b.travelers_count} Guests</strong></span>
                        {b.total_amount && (
                          <span>Total: <strong className="text-slate-900 text-sm">₹{b.total_amount.toLocaleString("en-IN")}</strong></span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Flights Section */}
          <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">Flight Bookings & Inquiries</h3>
                <p className="text-xs text-slate-500">IATA negotiated wholesale flight tickets and route inquiries</p>
              </div>
              <Link
                href="/flight-bookings"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-xs"
              >
                + Flight Desk Inquiry
              </Link>
            </div>

            {displayedFlights.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/60">
                <Plane className="w-8 h-8 mx-auto text-slate-300 mb-2 rotate-45" />
                <p className="text-sm font-bold text-slate-700">No Flight Inquiries</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {bookingFamilyFilter !== "all"
                    ? "No flight inquiries found under the selected family member filter."
                    : "Save 15-30% on domestic & international flights through our offline group reservation desk."}
                </p>
                <Link
                  href="/flight-bookings"
                  className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs"
                >
                  Request Flight Quote
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedFlights.map((f) => {
                  const flightForMember = data.familyMembers?.find(
                    (m) =>
                      (m.email && m.email.toLowerCase() === f.customer_email?.toLowerCase()) ||
                      m.id === f.family_member_id
                  );

                  return (
                    <div key={f.id} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-black text-sm text-slate-900 flex items-center gap-2">
                            <span>{f.from_city}</span>
                            <ArrowRight className="w-4 h-4 text-cyan-600" />
                            <span>{f.to_city}</span>
                          </div>
                          {data.isFamilyHead && flightForMember && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-100 text-cyan-900 border border-cyan-200">
                              Passenger: {flightForMember.name} ({flightForMember.relationship})
                            </span>
                          )}
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-200">
                          {f.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                        <div>Departure: <strong>{f.depart_date}</strong></div>
                        {f.return_date && <div>Return: <strong>{f.return_date}</strong></div>}
                        <div>Cabin: <strong>{f.cabin_class}</strong></div>
                        <div>Passengers: <strong>{f.passengers_adults} Adults</strong></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: PAYMENTS & INVOICES */}
      {activeTab === "payments" && (
        <div className="space-y-8">
          {/* Payment Links */}
          <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900">Direct Payment Links</h3>
              <p className="text-xs text-slate-500">Secure Razorpay payment links generated for your travel bookings</p>
            </div>

            {paymentLinks.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/60">
                <CreditCard className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-700">No Payment Links Found</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  When our travel concierge generates custom quotes or invoices, your secure payment links will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentLinks.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-slate-900">{p.purpose}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            p.status === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                        <span>Code: <code>{p.link_code}</code></span>
                        {p.paid_at && <span>Paid on: {new Date(p.paid_at).toLocaleDateString()}</span>}
                        {p.razorpay_payment_id && <span>Razorpay Ref: {p.razorpay_payment_id}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-xl font-black text-slate-900">
                          ₹{p.amount.toLocaleString("en-IN")}
                        </div>
                      </div>

                      {p.status === "pending" ? (
                        <Link
                          href={`/pay/${p.link_code}`}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-105 transition-all"
                        >
                          Pay Now
                        </Link>
                      ) : (
                        <span className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Paid & Verified</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Invoices List */}
          {invoices.length > 0 && (
            <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">Tax Invoices & Billing Statements</h3>
                <p className="text-xs text-slate-500">Official GST-compliant receipts and itemized invoices</p>
              </div>

              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span>{inv.invoice_number}</span>
                        <span className="text-xs text-slate-400">({inv.type})</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Due Date: {inv.due_date || "Immediate"} • Status: <strong>{inv.status}</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-slate-900">
                        ₹{inv.total_amount.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: SUPPORT TICKETS */}
      {activeTab === "tickets" && (
        <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900">Support Tickets & Service Requests</h3>
              <p className="text-xs text-slate-500">Track inquiries, special requests, and emergency travel support</p>
            </div>
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Raise Ticket</span>
            </button>
          </div>

          {tickets.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-3">
              <LifeBuoy className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-base font-bold text-slate-700">No Support Tickets Found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Need help with booking modifications, visa letters, payment receipts, or travel tips? Raise a ticket and our team will get right on it.
              </p>
              <button
                onClick={() => setIsTicketModalOpen(true)}
                className="mt-2 inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                + Raise Your First Ticket
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                        {t.ticket_number}
                      </span>
                      <h4 className="font-black text-base text-slate-900">{t.subject}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
                        {t.category}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          t.status === "resolved"
                            ? "bg-emerald-100 text-emerald-800"
                            : t.status === "in_progress"
                            ? "bg-cyan-100 text-cyan-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {t.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {t.message}
                  </p>

                  {/* Admin notes if present */}
                  {t.admin_notes && (
                    <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200/80 text-xs text-indigo-900 flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Concierge Desk Response:</strong> {t.admin_notes}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Created: {new Date(t.created_at).toLocaleDateString()}</span>
                    <span>Priority: <strong className="uppercase">{t.priority}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: SAVED FAVORITES */}
      {activeTab === "favorites" && (
        <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900">Saved Travel Moments</h3>
              <p className="text-xs text-slate-500">Destination photos you liked and saved to your travel wishlist</p>
            </div>
            <Link
              href="/gallery"
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs"
            >
              Browse Gallery
            </Link>
          </div>

          {favorites.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-3">
              <Heart className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-base font-bold text-slate-700">No Liked Moments Yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our travel gallery and hit the heart icon on any photo to save it directly to your bucket list.
              </p>
              <Link
                href="/gallery"
                className="mt-2 inline-block px-5 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs"
              >
                Visit Photo Gallery
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((fav) => (
                <div key={fav.id} className="rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-xs space-y-2">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={fav.url}
                      alt={fav.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-rose-500 text-white shadow-md">
                      <Heart className="w-3.5 h-3.5 fill-white" />
                    </div>
                  </div>
                  <div className="p-3.5 space-y-1">
                    <h5 className="font-bold text-sm text-slate-900 line-clamp-1">{fav.title}</h5>
                    <p className="text-xs text-slate-500 line-clamp-1">{fav.caption}</p>
                    <a
                      href={`https://wa.me/919100228152?text=${encodeURIComponent(
                        `Hi Yellow Ribbon Travels, I saved this photo in my portal: "${fav.title}" and want to plan a vacation like this!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:underline pt-1"
                    >
                      <span>Inquire About Trip</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: FAMILY & TRAVEL GROUP */}
      {activeTab === "family" && (
        <FamilyHub
          isFamilyHead={data.isFamilyHead}
          familyHead={data.familyHead}
          familyMembers={data.familyMembers || []}
          profile={data.profile}
          onFamilyUpdated={(newMembers) => {
            setData((prev) => ({
              ...prev,
              familyMembers: newMembers,
              stats: {
                ...prev.stats,
                totalFamilyMembers: newMembers.length,
              },
            }));
          }}
        />
      )}

      {/* NEW TICKET MODAL */}
      <NewTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSuccess={handleTicketCreated}
        defaultName={profile.name}
        defaultEmail={profile.email}
        defaultPhone={profile.phone}
      />
    </div>
  );
}

export default function AccountDashboard(props: AccountDashboardProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full py-16 text-center text-slate-400 text-sm">
          Loading Client Portal...
        </div>
      }
    >
      <AccountDashboardInner {...props} />
    </Suspense>
  );
}

