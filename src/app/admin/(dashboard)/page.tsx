import Link from "next/link";
import { tourService } from "@/modules/tours/service/tour.service";
import { destinationService } from "@/modules/destinations/service/destination.service";
import { bookingService } from "@/modules/bookings/service/booking.service";
import { flightInquiryService } from "@/modules/flights/service/flight-inquiry.service";
import { reviewService } from "@/modules/reviews/service/review.service";
import { galleryService } from "@/modules/gallery/service/gallery.service";
import { paymentService } from "@/modules/payments/service/payment.service";
import { itineraryService } from "@/modules/itineraries/service/itinerary.service";
import { invoiceService } from "@/modules/invoices/service/invoice.service";
import { ticketRepository } from "@/modules/account/repository/ticket.repository";
import {
  Compass,
  MapPin,
  CalendarCheck,
  Plane,
  Star,
  Camera,
  ArrowRight,
  PlusCircle,
  Clock,
  Sparkles,
  Phone,
  CheckCircle2,
  CreditCard,
  FileText,
  Receipt,
  LifeBuoy,
  Server,
} from "lucide-react";

export const revalidate = 0; // Always fresh in admin

export default async function AdminDashboardPage() {
  const [tours, destinations, bookings, flights, reviews, gallery, paymentLinks, itineraries, invoices, tickets] =
    await Promise.all([
      tourService.getAllTours(),
      destinationService.getAllDestinations(),
      bookingService.getAllBookings(),
      flightInquiryService.getAllInquiries(),
      reviewService.getAllReviews(),
      galleryService.getGallery(),
      paymentService.getAllPaymentLinks(),
      itineraryService.getAllItineraries(),
      invoiceService.getAllInvoices(),
      ticketRepository.findAll(),
    ]);

  const kpis = [
    {
      label: "Support Tickets",
      count: tickets.filter((t) => t.status === "open" || t.status === "in_progress").length,
      icon: LifeBuoy,
      color: "text-purple-600",
      bg: "bg-purple-100",
      href: "/admin/tickets",
    },
    {
      label: "Razorpay Links",
      count: paymentLinks.length,
      icon: CreditCard,
      color: "text-amber-600",
      bg: "bg-amber-100",
      href: "/admin/payments",
    },
    {
      label: "Client Itineraries",
      count: itineraries.length,
      icon: FileText,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
      href: "/admin/itineraries",
    },
    {
      label: "Invoices & Quotes",
      count: invoices.length,
      icon: Receipt,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      href: "/admin/invoices",
    },
    {
      label: "Tour Bookings",
      count: bookings.length,
      icon: CalendarCheck,
      color: "text-blue-600",
      bg: "bg-blue-100",
      href: "/admin/bookings",
    },
    {
      label: "Active Tours",
      count: tours.length,
      icon: Compass,
      color: "text-rose-600",
      bg: "bg-rose-100",
      href: "/admin/tours",
    },
    {
      label: "Flight Inquiries",
      count: flights.length,
      icon: Plane,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      href: "/admin/flight-inquiries",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Title & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time status of Yellow Ribbon Travels operations, inquiries & database assets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/rsl-server"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-blue-900 bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            <Server className="w-4 h-4 text-blue-700" />
            <span>RSL Server</span>
          </Link>

          <Link
            href="/admin/tours"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Manage Tours</span>
          </Link>

          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span>Upload Media</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={idx}
              href={kpi.href}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{kpi.count}</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5 truncate">{kpi.label}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Bookings & Flight Inquiries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tour Bookings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-slate-900">
                Recent Tour Booking Inquiries
              </h3>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              View All ➔
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No tour inquiries recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map((b: any) => (
                <div key={b.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{b.customer_name}</div>
                    <div className="text-slate-500 text-[11px] truncate max-w-[200px]">
                      {b.tour_title || "Custom Package"} • {b.travelers_count} travelers
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        b.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : b.status === "contacted"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {b.status}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{b.travel_date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Flight Inquiries */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-cyan-600" />
              <h3 className="font-bold text-base text-slate-900">
                Recent Flight Booking Leads
              </h3>
            </div>
            <Link
              href="/admin/flight-inquiries"
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-700"
            >
              View All ➔
            </Link>
          </div>

          {flights.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No flight inquiries recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {flights.slice(0, 5).map((f: any) => (
                <div key={f.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{f.customer_name}</div>
                    <div className="text-slate-500 text-[11px]">
                      {f.from_city} ➔ {f.to_city} ({f.trip_type})
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-slate-700 block">
                      {f.cabin_class}
                    </span>
                    <div className="text-[10px] text-slate-400">{f.depart_date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
