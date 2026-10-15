import FlightSearchEngine from "@/modules/flights/components/FlightSearchEngine";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { Plane, ShieldCheck, Clock, Award, PhoneCall, CheckCircle, HelpCircle } from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";

export const metadata = {
  title: "Flight Bookings & Tickets | Yellow Ribbon Travels",
  description:
    "Book domestic and international flights with Yellow Ribbon Travels. Access negotiated corporate fares, instant ticketing, 24/7 web check-in, and zero hidden fees.",
};

export default function FlightBookingsPage() {
  const faqs = [
    {
      q: "Can Yellow Ribbon Travels hold airline seats before full payment?",
      a: "Yes! As an accredited ticketing partner with direct GDS access, we can often hold provisional flight reservations on major airlines for 24 to 72 hours while you finalize visa paperwork and travel plans.",
    },
    {
      q: "Do you arrange extra luggage allowances for international flights?",
      a: "Absolutely. Many of our negotiated international student and holiday fare brackets include extra baggage allowances (up to 40 kg or 2 pieces). We clearly declare baggage quotas on your booking quote.",
    },
    {
      q: "What happens if an airline delays or cancels my connection?",
      a: "Unlike online ticket aggregators with unresponsive automated bots, Yellow Ribbon Travels assigns a human ticketing specialist who immediately coordinates alternate airline re-routing and hotel layover claims.",
    },
    {
      q: "Can I book complex multi-city or open-jaw tickets?",
      a: "Yes! Multi-city journeys (such as landing in Paris and flying out from Zurich) are our forte. Our ticketing architects optimize connections to save transit hours and reduce fare taxes.",
    },
  ];

  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-12 sm:space-y-16">
      <Breadcrumbs items={[{ label: "Flight Bookings Desk" }]} />
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-200">
          <Plane className="w-3.5 h-3.5 rotate-45" /> IATA Verified Aviation Desk
        </div>
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-950 tracking-tight">
          Seamless Domestic & International Flights
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Skip hidden online convenience surcharges. Enjoy personalized flight routing, special baggage allowances, and direct human ticketing assistance for every departure.
        </p>
      </div>

      {/* Flight Search Engine Form */}
      <div className="w-full max-w-6xl 2xl:max-w-7xl mx-auto">
        <FlightSearchEngine />
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-white via-amber-50/40 to-amber-100/25 rounded-3xl p-6 border border-amber-200/70 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">
            Negotiated Airline Fares
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Direct airline corporate contracts allow us to offer competitive rates on Emirates, Qatar Airways, Singapore Airlines, Air India, IndiGo and all major global carriers.
          </p>
        </div>

        <div className="bg-gradient-to-br from-white via-cyan-50/40 to-cyan-100/25 rounded-3xl p-6 border border-cyan-200/70 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">
            24/7 Check-in & Seat Selection
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our flight desk automatically handles web check-in, selects preferred seats, and requests special dietary meals (Hindu Veg, Jain, Halal, Child meal) ahead of time.
          </p>
        </div>

        <div className="bg-gradient-to-br from-white via-emerald-50/40 to-emerald-100/25 rounded-3xl p-6 border border-emerald-200/70 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">
            Hassle-Free Rescheduling
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Life happens. Whenever flight schedules shift or visas get delayed, our Secunderabad ticketing team coordinates date changes and airline refunds swiftly.
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-gradient-to-br from-amber-50/70 via-white to-cyan-50/60 rounded-3xl p-8 sm:p-12 border border-amber-200/60 max-w-4xl mx-auto space-y-6 shadow-xs">
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Frequently Asked Questions on Flights
          </h2>
          <p className="text-xs text-slate-500">
            Clear answers to common air travel questions.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-r from-white via-white to-cyan-50/35 rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-2"
            >
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Hotline Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Urgent Same-Day Flight Need?
          </div>
          <div className="text-lg font-bold text-white">
            Speak directly with our Chief Aviation Specialist
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels,%20I%20need%20urgent%20flight%20ticketing%20assistance."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full font-bold text-xs sm:text-sm bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md flex items-center gap-2 transition-transform hover:scale-105"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>WhatsApp Aviation Desk</span>
          </a>
          <a
            href="tel:+919100228152"
            className="px-6 py-3 rounded-full font-bold text-xs sm:text-sm bg-gradient-to-r from-brand-yellow to-amber-500 text-white hover:opacity-95 shadow-md flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Desk: +91 91002 28152</span>
          </a>
        </div>
      </div>
    </div>
  );
}
