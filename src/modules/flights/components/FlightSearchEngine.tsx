"use client";

import { useState } from "react";
import { Plane, Calendar, Users, ArrowRightLeft, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";

export default function FlightSearchEngine() {
  const [tripType, setTripType] = useState<"roundtrip" | "oneway" | "multicity">("roundtrip");
  const [fromCity, setFromCity] = useState("Hyderabad (HYD)");
  const [toCity, setToCity] = useState("Dubai (DXB)");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengersAdults, setPassengersAdults] = useState(1);
  const [passengersChildren, setPassengersChildren] = useState(0);
  const [cabinClass, setCabinClass] = useState<"Economy" | "Premium Economy" | "Business" | "First Class">("Economy");
  const [preferredAirline, setPreferredAirline] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleFlightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_type: tripType,
          from_city: fromCity,
          to_city: toCity,
          depart_date: departDate,
          return_date: tripType === "roundtrip" ? returnDate : null,
          passengers_adults: passengersAdults,
          passengers_children: passengersChildren,
          passengers_infants: 0,
          cabin_class: cabinClass,
          preferred_airline: preferredAirline || null,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          notes: notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit flight inquiry");
      }

      setSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Trip Type Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        {(["roundtrip", "oneway", "multicity"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setTripType(type)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              tripType === type
                ? "bg-gradient-to-r from-brand-yellow to-amber-500 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {type === "roundtrip" && "Round Trip"}
            {type === "oneway" && "One Way"}
            {type === "multicity" && "Multi-City"}
          </button>
        ))}

        <div className="ml-auto hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>IATA Verified Airline Ticketing Desk</span>
        </div>
      </div>

      {submitted ? (
        <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Flight Request Sent to Our Desk!
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Our ticketing specialists at Yellow Ribbon Travels are pulling live GDS system fares for{" "}
            <strong>{fromCity} ➔ {toCity}</strong>. You will receive customized flight options with luggage details on WhatsApp & Email shortly.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/919100228152?text=Hello%20Yellow%20Ribbon%20Flight%20Desk,%20I%20requested%20flights%20from%20${encodeURIComponent(fromCity)}%20to%20${encodeURIComponent(toCity)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Priority WhatsApp Assistance</span>
            </a>
            <button
              onClick={() => setSubmitted(false)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors"
            >
              Search Another Flight
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFlightSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
              {error}
            </div>
          )}

          {/* Route Grid */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
            {/* From City */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Departure City / Airport
              </label>
              <div className="relative">
                <Plane className="w-4 h-4 text-amber-500 absolute left-3 top-3.5 rotate-45" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad (HYD), Mumbai (BOM)"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <button
                type="button"
                onClick={swapCities}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-amber-50 text-slate-600 hover:text-amber-600 flex items-center justify-center transition-colors shadow-sm"
                title="Swap Origin and Destination"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To City */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Arrival City / Destination
              </label>
              <div className="relative">
                <Plane className="w-4 h-4 text-cyan-600 absolute left-3 top-3.5 rotate-90" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dubai (DXB), Bali (DPS)"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Dates & Passengers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Departure Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="date"
                  required
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Return Date {tripType === "roundtrip" ? "*" : "(Optional)"}
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="date"
                  disabled={tripType === "oneway"}
                  required={tripType === "roundtrip"}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 disabled:bg-slate-100 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Passengers (Adults)
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={passengersAdults}
                  onChange={(e) => setPassengersAdults(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Cabin Class
              </label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business Class</option>
                <option value="First Class">First Class</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
              Where should we send the flight quote?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  WhatsApp Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              ⚡ Guaranteed lowest corporate & group negotiated airfares. No hidden booking fee.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-brand-yellow via-amber-500 to-brand-coral hover:opacity-95 shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Searching Best Fares..." : "Find Best Flight Quotes"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
