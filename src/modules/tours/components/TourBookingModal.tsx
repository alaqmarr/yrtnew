"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Tour } from "../domain/tour.entity";
import { X, Calendar, Users, Phone, Mail, User, CheckCircle2, Sparkles, UserCheck } from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";

interface TourBookingModalProps {
  tour: Tour;
  isOpen: boolean;
  onClose: () => void;
}

export default function TourBookingModal({ tour, isOpen, onClose }: TourBookingModalProps) {
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    travel_date: "",
    travelers_count: 2,
    special_requests: "",
    family_member_id: null as string | null,
  });
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("self");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill user details if logged in & fetch family members
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        customer_name: prev.customer_name || session.user.name || "",
        customer_email: prev.customer_email || session.user.email || "",
        customer_phone: prev.customer_phone || session.user.phone || "",
      }));

      // Fetch family members if logged in
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
      setFormData((prev) => ({
        ...prev,
        customer_name: session?.user?.name || "",
        customer_email: session?.user?.email || "",
        customer_phone: session?.user?.phone || "",
        family_member_id: null,
      }));
    } else {
      const member = familyMembers.find((m) => m.id === choice);
      if (member) {
        setFormData((prev) => ({
          ...prev,
          customer_name: member.name,
          customer_email: member.email || session?.user?.email || "",
          customer_phone: member.phone || session?.user?.phone || "",
          family_member_id: member.id,
          special_requests:
            member.dietary_preference && member.dietary_preference !== "Any / No Restrictions"
              ? `Meal preference: ${member.dietary_preference}`
              : prev.special_requests,
        }));
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tour_id: tour.id,
          total_amount: tour.price * Number(formData.travelers_count),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit booking");
      }

      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const calculatedTotal = tour.price * Number(formData.travelers_count);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-yellow via-amber-500 to-brand-coral p-4 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-yellow-100">
            <Sparkles className="w-3.5 h-3.5" /> Fast Inquiry & Quote
          </div>
          <h3 className="text-lg sm:text-xl font-bold mt-1 text-white leading-snug pr-8">
            {tour.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-white/90 mt-1">
            {tour.duration_days} Days / {tour.duration_nights} Nights • Starting at ₹{tour.price.toLocaleString("en-IN")}/person
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overscroll-contain p-4 sm:p-6 flex-1">
          {success ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                Inquiry Received!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                Thank you, <strong>{formData.customer_name}</strong>. Our dedicated destination specialist will review your itinerary and contact you within 2 business hours.
              </p>

              <div className="pt-4 flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels,%20I%20just%20submitted%20an%20inquiry%20for%20${encodeURIComponent(tour.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Connect on WhatsApp Instantly</span>
                </a>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-medium transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <div className="p-2.5 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                  {error}
                </div>
              )}

              {/* Logged in auto-fill pill */}
              {session?.user && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      Signed in as <strong>{session.user.name}</strong>
                    </span>
                  </div>

                  {familyMembers.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Book For:
                      </label>
                      <select
                        value={selectedMemberId}
                        onChange={(e) => handleSelectTraveler(e.target.value)}
                        className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
                    <input
                      type="email"
                      required
                      placeholder="rajesh@example.com"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Preferred Travel Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
                    <input
                      type="date"
                      required
                      value={formData.travel_date}
                      onChange={(e) => setFormData({ ...formData, travel_date: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Travelers Count *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 sm:top-3" />
                    <input
                      type="number"
                      min={1}
                      max={50}
                      required
                      value={formData.travelers_count}
                      onChange={(e) => setFormData({ ...formData, travelers_count: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Customization Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Need flight assistance, specific hotel tier, vegetarian meals, etc."
                  value={formData.special_requests}
                  onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Estimated Pricing Summary */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Estimated Total ({formData.travelers_count} Travelers):</span>
                  <div className="text-base font-extrabold text-amber-700">
                    ₹{calculatedTotal.toLocaleString("en-IN")}*
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 italic">*Excludes flight or custom add-ons</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-105 active:scale-[0.99] shadow-md shadow-amber-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Submitting Inquiry..." : "Submit Booking Inquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
