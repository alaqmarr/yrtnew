"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Crown,
  Star,
  ShieldCheck,
  Calendar,
  CreditCard,
  FileText,
  Receipt,
  Printer,
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Save,
  Tag,
  MessageSquare,
  AlertCircle,
  Users,
} from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import { CustomerActivitySummary, TravelPreferences } from "../domain/contact.entity";

interface Customer360ModalProps {
  contactId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export default function Customer360Modal({
  contactId,
  isOpen,
  onClose,
  onUpdated,
}: Customer360ModalProps) {
  const [data, setData] = useState<CustomerActivitySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "itineraries" | "payments" | "invoices" | "bookings" | "family">("overview");

  // Editable fields
  const [internalNotes, setInternalNotes] = useState("");
  const [preferences, setPreferences] = useState<TravelPreferences>({});
  const [isVip, setIsVip] = useState(false);
  const [tier, setTier] = useState("Standard");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !contactId) return;

    setLoading(true);
    setError("");
    fetch(`/api/contacts/${contactId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load customer profile");
        return res.json();
      })
      .then((summary: CustomerActivitySummary) => {
        setData(summary);
        setInternalNotes(summary.contact.internal_notes || "");
        setPreferences(summary.contact.preferences || {});
        setIsVip(summary.contact.vip_status === 1);
        setTier(summary.contact.tier);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [contactId, isOpen]);

  if (!isOpen) return null;

  const handleSavePreferences = async () => {
    if (!contactId) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internal_notes: internalNotes,
          preferences,
          vip_status: isVip ? 1 : 0,
          tier,
        }),
      });

      if (!res.ok) throw new Error("Failed to save changes");
      const updatedContact = await res.json();
      if (data) {
        setData({ ...data, contact: updatedContact });
      }
      setSavedSuccess(true);
      if (onUpdated) onUpdated();
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const contact = data?.contact;
  const cleanPhone = (contact?.phone || "").replace(/\D/g, "");
  const waUrl = `https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(contact?.name || "Traveler")},%20greetings%20from%20Yellow%20Ribbon%20Travels!`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 rounded-t-3xl border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center text-amber-400 font-black text-xl">
                {contact?.name ? contact.name.slice(0, 2).toUpperCase() : "YR"}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-black tracking-tight text-white">
                  {contact?.name || "Customer Profile"}
                </h2>

                {/* Tier Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    tier === "VIP" || isVip
                      ? "bg-amber-400 text-slate-950 border border-amber-300"
                      : tier === "Platinum"
                      ? "bg-slate-200 text-slate-900"
                      : tier === "Gold"
                      ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                      : tier === "Silver"
                      ? "bg-slate-700 text-slate-200"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {(tier === "VIP" || isVip) && <Crown className="w-3 h-3 fill-slate-950" />}
                  {tier === "Gold" && <Star className="w-3 h-3 fill-yellow-400" />}
                  <span>{tier} Member</span>
                </span>

                {contact && (contact.deals_count > 1 || contact.total_spent > 0) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Repeat Traveler</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 mt-1 flex-wrap">
                {contact?.phone && (
                  <span className="flex items-center gap-1 font-mono text-slate-300">
                    <Phone className="w-3 h-3 text-amber-400" />
                    {contact.phone}
                  </span>
                )}
                {contact?.email && (
                  <span className="flex items-center gap-1 text-slate-300">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {contact.email}
                  </span>
                )}
                {contact?.city && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {contact.city}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {cleanPhone && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shadow-xs"
                title="Open WhatsApp chat with client"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Financial KPI Banner */}
        <div className="bg-slate-900 px-6 py-3.5 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-white">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Lifetime Dealt Value
            </span>
            <span className="text-lg font-black text-amber-400">
              ₹{(contact?.total_spent || 0).toLocaleString("en-IN")}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Deals / Inquiries
            </span>
            <span className="text-lg font-black text-slate-200">
              {contact?.deals_count || 0} Deals
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Quotes Generated
            </span>
            <span className="text-lg font-black text-cyan-400">
              {data?.itineraries.length || 0} Quotes
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Settled Payments
            </span>
            <span className="text-lg font-black text-emerald-400">
              {data?.paymentLinks.filter((p) => p.status === "paid").length || 0} Paid
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 gap-2 shrink-0 overflow-x-auto text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "overview"
                ? "border-amber-500 text-amber-700 bg-white"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Preferences & VIP Notes</span>
          </button>

          <button
            onClick={() => setActiveTab("itineraries")}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "itineraries"
                ? "border-amber-500 text-amber-700 bg-white"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Quotes & Itineraries ({data?.itineraries.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "payments"
                ? "border-amber-500 text-amber-700 bg-white"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payments & Receipts ({data?.paymentLinks.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "invoices"
                ? "border-amber-500 text-amber-700 bg-white"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Invoices ({data?.invoices.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "bookings"
                ? "border-amber-500 text-amber-700 bg-white"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Tour Bookings ({data?.bookings.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("family")}
            className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === "family"
                ? "border-amber-500 text-amber-700 bg-white"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Family & Co-Travelers ({data?.familyMembers?.length || 0})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="py-16 text-center text-slate-400 animate-pulse">
              Loading full Customer 360 intelligence...
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {!loading && data && (
            <>
              {/* TAB 1: OVERVIEW & PREFERENCES */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* VIP & Tier Setting */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-600" />
                        <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">
                          Client VIP Status & Tier Overrides
                        </h4>
                      </div>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        Tier dictates quote priority, loyalty discount allowances, and concierge service levels.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isVip}
                          onChange={(e) => setIsVip(e.target.checked)}
                          className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
                        />
                        <span>VIP Account</span>
                      </label>

                      <select
                        value={tier}
                        onChange={(e) => setTier(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-bold text-slate-900 bg-white"
                      >
                        <option value="Standard">Standard Tier</option>
                        <option value="Silver">Silver Tier (₹25k+)</option>
                        <option value="Gold">Gold Tier (₹75k+)</option>
                        <option value="Platinum">Platinum Tier (₹1.5L+)</option>
                        <option value="VIP">VIP Tier (₹2.5L+)</option>
                      </select>
                    </div>
                  </div>

                  {/* Travel Preferences Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-amber-500" />
                        <span>Stay & Transport Preferences</span>
                      </h4>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Preferred Hotel Standard
                        </label>
                        <select
                          value={preferences.hotel_category || ""}
                          onChange={(e) =>
                            setPreferences({ ...preferences, hotel_category: e.target.value })
                          }
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
                        >
                          <option value="">-- Not specified --</option>
                          <option value="5-Star Luxury & Resorts">5-Star Luxury & Resorts</option>
                          <option value="Private Pool Villas">Private Pool Villas</option>
                          <option value="Boutique & Heritage Stays">Boutique & Heritage Stays</option>
                          <option value="4-Star Deluxe">4-Star Deluxe</option>
                          <option value="3-Star Comfort">3-Star Comfort / Budget</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Preferred Vehicle
                        </label>
                        <select
                          value={preferences.vehicle_preference || ""}
                          onChange={(e) =>
                            setPreferences({ ...preferences, vehicle_preference: e.target.value })
                          }
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
                        >
                          <option value="">-- Not specified --</option>
                          <option value="Toyota Innova Crysta / SUV">Toyota Innova Crysta / SUV</option>
                          <option value="Sedan (Etios / Dzire)">Sedan (Etios / Dzire)</option>
                          <option value="Tempo Traveller (Family / Group)">Tempo Traveller (Family / Group)</option>
                          <option value="Self Drive / Luxury Car">Self Drive / Luxury Car</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                        <span>Dining & Flight Style</span>
                      </h4>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Dietary / Food Preference
                        </label>
                        <select
                          value={preferences.meal_preference || ""}
                          onChange={(e) =>
                            setPreferences({ ...preferences, meal_preference: e.target.value })
                          }
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
                        >
                          <option value="">-- Not specified --</option>
                          <option value="Pure Vegetarian">Pure Vegetarian</option>
                          <option value="Jain Meals">Jain Meals (No onion / garlic)</option>
                          <option value="Non-Vegetarian">Non-Vegetarian</option>
                          <option value="Halal Certified">Halal Certified</option>
                          <option value="Vegan / Gluten Free">Vegan / Gluten Free</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Flight Seat & Airline Style
                        </label>
                        <select
                          value={preferences.flight_seat || ""}
                          onChange={(e) =>
                            setPreferences({ ...preferences, flight_seat: e.target.value })
                          }
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
                        >
                          <option value="">-- Not specified --</option>
                          <option value="Window Seat (Direct Flights Only)">Window Seat (Direct Flights Only)</option>
                          <option value="Aisle Seat">Aisle Seat</option>
                          <option value="Front Rows / Extra Legroom">Front Rows / Extra Legroom</option>
                          <option value="Business Class Preferred">Business Class Preferred</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Staff CRM Notes */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Staff CRM Notes & Service Instructions *
                      </label>
                      <span className="text-[10px] text-slate-400">
                        Visible only to Yellow Ribbon travel desks
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      placeholder="e.g. VIP client; prefers prompt WhatsApp updates. Allow 5% discretion discount on Kashmir & Bali packages. Family of 4 traveling every summer."
                      className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>

                  {/* Save button */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {savedSuccess && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4" /> Preferences Saved!
                      </span>
                    )}
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleSavePreferences}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? "Saving..." : "Save Preferences"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: ITINERARIES / QUOTES */}
              {activeTab === "itineraries" && (
                <div className="space-y-3">
                  {data.itineraries.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      No custom itineraries or quotes created yet for this traveler.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                      {data.itineraries.map((itn) => (
                        <div key={itn.id} className="p-4 bg-white hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black text-amber-600">
                                {itn.reference_no}
                              </span>
                              <span className="text-xs font-bold text-slate-900">
                                {itn.title}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 space-x-2">
                              <span>Destination: <strong>{itn.destination}</strong></span>
                              <span>•</span>
                              <span>{itn.duration_nights}N / {itn.duration_days}D</span>
                              <span>•</span>
                              <span>Created: {new Date(itn.created_at).toLocaleDateString("en-IN")}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            <span className="text-sm font-black text-slate-950">
                              ₹{itn.total_price.toLocaleString("en-IN")}
                            </span>

                            <Link
                              href={`/itinerary/${itn.reference_no}?print=1`}
                              target="_blank"
                              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                              title="Print / View PDF Quote"
                            >
                              <Printer className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PAYMENTS & RECEIPTS */}
              {activeTab === "payments" && (
                <div className="space-y-3">
                  {data.paymentLinks.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      No payment links or transactions on record for this customer.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                      {data.paymentLinks.map((p) => {
                        const isPaid = p.status === "paid" || !!p.razorpay_payment_id;
                        return (
                          <div key={p.id} className="p-4 bg-white hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-slate-800">
                                  {p.link_code}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                    isPaid
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {isPaid ? "Paid" : "Pending"}
                                </span>
                              </div>
                              <div className="text-xs text-slate-700 font-semibold mt-0.5">
                                {p.purpose}
                              </div>
                              {p.paid_at && (
                                <div className="text-[11px] text-slate-400">
                                  Settled: {new Date(p.paid_at).toLocaleString("en-IN")}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-3 self-end sm:self-center">
                              <span className="text-sm font-black text-slate-950">
                                ₹{p.amount.toLocaleString("en-IN")}
                              </span>

                              {isPaid && (
                                <Link
                                  href={`/receipt/${p.link_code}`}
                                  target="_blank"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
                                  title="View Official Tax Receipt"
                                >
                                  <Receipt className="w-3.5 h-3.5" />
                                  <span>Receipt</span>
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: INVOICES */}
              {activeTab === "invoices" && (
                <div className="space-y-3">
                  {data.invoices.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      No invoices issued for this client yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                      {data.invoices.map((inv) => (
                        <div key={inv.id} className="p-4 bg-white hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-900">
                                {inv.invoice_number}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {inv.type}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  inv.status === "Paid"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {inv.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Created: {new Date(inv.created_at).toLocaleDateString("en-IN")}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-slate-950">
                              ₹{inv.total_amount.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: BOOKINGS */}
              {activeTab === "bookings" && (
                <div className="space-y-3">
                  {data.bookings.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      No website bookings recorded for this client.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                      {data.bookings.map((b) => (
                        <div key={b.id} className="p-4 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                          <div>
                            <div className="font-bold text-xs text-slate-900">
                              {b.tour_title}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5 space-x-2">
                              <span>Travel Date: {b.travel_date}</span>
                              <span>•</span>
                              <span>{b.travelers_count} Travelers</span>
                              <span>•</span>
                              <span className="capitalize">{b.status}</span>
                            </div>
                          </div>

                          {b.total_amount && (
                            <span className="text-sm font-black text-slate-950">
                              ₹{b.total_amount.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: FAMILY & CO-TRAVELERS */}
              {activeTab === "family" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">
                        Family Members & Co-Travelers
                      </h4>
                      <p className="text-xs text-slate-500">
                        Travel group profiles, passport details, dietary preferences, and linked sub-accounts.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {data.familyMembers?.length || 0} Members on File
                    </span>
                  </div>

                  {!data.familyMembers || data.familyMembers.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <Users className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-sm font-semibold text-slate-600">No Family Members Registered</p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        The client has not yet added family members or co-travelers in their portal.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.familyMembers.map((m) => (
                        <div
                          key={m.id}
                          className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900">{m.name}</span>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                                  {m.relationship}
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-200 text-slate-700">
                                  {m.age_group}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {m.gender || "Not specified"} {m.date_of_birth ? `• DOB: ${m.date_of_birth}` : ""}
                              </div>
                            </div>

                            {m.member_user_id ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                Sub-Account Active
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[10px] text-slate-400">
                                Profile Only
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 block uppercase">Passport</span>
                              <span className="font-mono font-medium text-slate-800">{m.passport_number || "None"}</span>
                              {m.passport_expiry && (
                                <div className="text-[10px] text-slate-500">Exp: {m.passport_expiry}</div>
                              )}
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 block uppercase">Meal / Diet</span>
                              <span className="font-medium text-slate-800">{m.dietary_preference || "Any"}</span>
                            </div>
                          </div>

                          {(m.email || m.phone) && (
                            <div className="text-xs text-slate-500 flex flex-wrap gap-3 pt-1 border-t border-slate-200/40">
                              {m.email && <span>📧 {m.email}</span>}
                              {m.phone && <span>📞 {m.phone}</span>}
                            </div>
                          )}

                          {m.notes && (
                            <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-xl border border-slate-100">
                              &ldquo;{m.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
