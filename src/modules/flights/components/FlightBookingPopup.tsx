"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Plane,
  X,
  Calendar,
  Users,
  ArrowRightLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Send,
  Loader2,
  UserCheck,
} from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";

interface FlightBookingPopupProps {
  enabled?: boolean;
  delayMs?: number;
  heading?: string;
  subheading?: string;
  whatsappNumber?: string;
}

export default function FlightBookingPopup({
  enabled = true,
  delayMs = 2500,
  heading = "Quick Flight Fare Quotation",
  subheading = "Exclusive offline airline fares delivered directly to your WhatsApp by our IATA flight desk.",
  whatsappNumber = "919100228152",
}: FlightBookingPopupProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip");
  const [fromCity, setFromCity] = useState("Hyderabad (HYD)");
  const [toCity, setToCity] = useState("Dubai (DXB)");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState<"Economy" | "Premium Economy" | "Business">("Economy");
  
  // User contact fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+91 ");
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("self");
  const [familyMemberId, setFamilyMemberId] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const SESSION_STORAGE_KEY = "yrt_flight_popup_dismissed_session";

  // Pre-fill user details if logged in
  useEffect(() => {
    if (session?.user) {
      setCustomerName((prev) => prev || session.user.name || "");
      setCustomerEmail((prev) => prev || session.user.email || "");
      setCustomerPhone((prev) => (!prev || prev === "+91 " ? session.user.phone || "+91 " : prev));

      // Fetch family members
      fetch("/api/account/family")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!data) return;
          const membersList = Array.isArray(data) ? data : Array.isArray(data.members) ? data.members : [];
          setFamilyMembers(membersList);
        })
        .catch(() => {});
    }
  }, [session]);

  const handleSelectTraveler = (choice: string) => {
    setSelectedMemberId(choice);
    if (choice === "self") {
      setCustomerName(session?.user?.name || "");
      setCustomerEmail(session?.user?.email || "");
      setCustomerPhone(session?.user?.phone || "+91 ");
      setFamilyMemberId(null);
    } else {
      const member = familyMembers.find((m) => m.id === choice);
      if (member) {
        setCustomerName(member.name);
        setCustomerEmail(member.email || session?.user?.email || "");
        setCustomerPhone(member.phone || session?.user?.phone || "+91 ");
        setFamilyMemberId(member.id);
      }
    }
  };

  // Auto-close if user navigates away from the root '/' route
  useEffect(() => {
    if (pathname !== "/") {
      setIsOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    // Strictly execute ONLY on the root '/' route
    if (!enabled || pathname !== "/") return;

    // Check if user already dismissed or interacted with popup during THIS session
    const isDismissed = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!isDismissed) {
      const timer = setTimeout(() => {
        if (!sessionStorage.getItem(SESSION_STORAGE_KEY) && window.location.pathname === "/") {
          setIsOpen(true);
        }
      }, delayMs);

      return () => clearTimeout(timer);
    }
  }, [enabled, delayMs, pathname]);

  // Global event listener to open flight popup on demand from any link or button
  useEffect(() => {
    const handleOpen = () => {
      setSubmitted(false);
      setIsOpen(true);
    };

    window.addEventListener("open-flight-popup", handleOpen);
    return () => window.removeEventListener("open-flight-popup", handleOpen);
  }, []);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
  };

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || customerPhone.trim() === "+91") {
      setError("Please provide your WhatsApp phone number so we can message your fare quotation.");
      return;
    }

    setLoading(true);
    setError("");

    const effectiveEmail =
      customerEmail.trim() ||
      session?.user?.email ||
      `${customerPhone.replace(/\D/g, "")}@inquiry.yellowribbontravels.com`;

    try {
      const res = await fetch("/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_type: tripType,
          from_city: fromCity,
          to_city: toCity,
          depart_date: departDate || new Date().toISOString().split("T")[0],
          return_date: tripType === "roundtrip" ? returnDate : null,
          passengers_adults: passengers,
          passengers_children: 0,
          passengers_infants: 0,
          cabin_class: cabinClass,
          customer_name: customerName || "Valued Traveler",
          customer_email: effectiveEmail,
          customer_phone: customerPhone,
          family_member_id: familyMemberId,
          notes: "Quick Flight Popup Inquiry",
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to send inquiry. Please try WhatsApp directly.");
      }

      setSubmitted(true);
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppDirectUrl = () => {
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "") || "919100228152";
    const msg = encodeURIComponent(
      `Hi Yellow Ribbon Travels, I would like flight quotes:\n` +
      `• Route: ${fromCity} ➔ ${toCity}\n` +
      `• Trip: ${tripType === "roundtrip" ? "Round Trip" : "One Way"}\n` +
      `• Depart: ${departDate || "Flexible"}\n` +
      (tripType === "roundtrip" && returnDate ? `• Return: ${returnDate}\n` : "") +
      `• Travelers: ${passengers} (${cabinClass})\n` +
      `• Contact: ${customerName || "Traveler"} (${customerPhone})`
    );
    return `https://wa.me/${cleanPhone}?text=${msg}`;
  };

  if (!isOpen || pathname !== "/") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleDismiss}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white px-5 py-4 sm:px-6 sm:py-5 relative shrink-0">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            aria-label="Close flight popup"
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-1 relative z-10 pr-7">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Plane className="w-3 h-3 rotate-45 text-amber-400" />
              <span>IATA Flight Concierge</span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
              {heading}
            </h2>

            <p className="text-[11px] sm:text-xs text-slate-300 leading-snug max-w-md">
              {subheading}
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto overscroll-contain p-4 sm:p-5 flex-1">
          {submitted ? (
            /* Success State */
            <div className="py-6 text-center space-y-5 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Fare Request Submitted
                </span>
                <h3 className="text-xl font-black text-slate-900 pt-1">
                  Thank You, {customerName || "Traveler"}!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Our flight desk is matching the lowest offline GDS airline fares for{" "}
                  <strong>
                    {fromCity} ➔ {toCity}
                  </strong>
                  . We will message your quote on WhatsApp shortly!
                </p>
              </div>

              {/* Action Buttons in Success */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <a
                  href={getWhatsAppDirectUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp Directly</span>
                </a>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            /* Main Flight Form */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Logged in auto-fill pill */}
              {session?.user && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Auto-filled for <strong>{session.user.name}</strong> • Linked to your client account
                  </span>
                </div>
              )}

              {/* Trip Type Selector */}
              <div className="flex items-center justify-center gap-1.5 bg-slate-100 p-1 rounded-xl max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => setTripType("roundtrip")}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    tripType === "roundtrip"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Round Trip
                </button>
                <button
                  type="button"
                  onClick={() => setTripType("oneway")}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    tripType === "oneway"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  One Way
                </button>
              </div>

              {/* Origin & Destination with Swap Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    From (Origin)
                  </label>
                  <input
                    type="text"
                    required
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="e.g. Hyderabad (HYD)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                {/* Swap Icon */}
                <button
                  type="button"
                  onClick={swapCities}
                  title="Swap Origin and Destination"
                  className="hidden sm:flex absolute left-1/2 top-[28px] -translate-x-1/2 w-6 h-6 rounded-full bg-white border border-slate-300 shadow-xs items-center justify-center text-slate-500 hover:text-amber-600 hover:border-amber-400 transition-all z-10 active:scale-95"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                </button>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    To (Destination)
                  </label>
                  <input
                    type="text"
                    required
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    placeholder="e.g. Dubai (DXB)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Travel Dates */}
              <div className={`grid ${tripType === "roundtrip" ? "grid-cols-2" : "grid-cols-1"} gap-2`}>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    required
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white font-medium"
                  />
                </div>

                {tripType === "roundtrip" && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Return Date
                    </label>
                    <input
                      type="date"
                      required
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Passengers & Class */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Passengers
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
                  >
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Adults</option>
                    <option value={4}>4+ Adults</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Cabin Class
                  </label>
                  <select
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business Class</option>
                  </select>
                </div>
              </div>

              {/* Contact Info (Name, WhatsApp Phone, Email) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {session?.user && familyMembers.length > 0 && (
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Inquire For Passenger:
                    </label>
                    <select
                      value={selectedMemberId}
                      onChange={(e) => handleSelectTraveler(e.target.value)}
                      className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800"
                    >
                      <option value="self">Myself ({session.user.name})</option>
                      {familyMembers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.relationship} • {m.age_group})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="For flight tickets & invoice receipt"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-xs sm:text-sm font-extrabold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/25 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Matching Lowest Airline Fares...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>Get Instant Fare Quotation</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href={getWhatsAppDirectUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
                    <span>Inquire via WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
