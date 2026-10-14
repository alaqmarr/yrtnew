"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  RefreshCw,
  Crown,
  Star,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Trash2,
  X,
  Filter,
  ArrowUpDown,
  Compass,
} from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import { Contact, CustomerTier } from "../domain/contact.entity";
import Customer360Modal from "./Customer360Modal";

interface AdminContactsManagerProps {
  initialContacts?: Contact[];
  initialTotal?: number;
}

export default function AdminContactsManager({
  initialContacts = [],
  initialTotal = 0,
}: AdminContactsManagerProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [onlyRepeat, setOnlyRepeat] = useState(false);
  const [sortBy, setSortBy] = useState<"spent" | "recent" | "deals" | "name">("spent");

  // Modals
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    phone: "+91 ",
    email: "",
    city: "",
    tier: "Standard" as CustomerTier,
    vip_status: 0,
    hotel_category: "5-Star Luxury & Resorts",
    meal_preference: "Pure Vegetarian",
    vehicle_preference: "Toyota Innova Crysta / SUV",
    internal_notes: "",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (tierFilter && tierFilter !== "all") params.set("tier", tierFilter);
      if (onlyRepeat) params.set("onlyRepeat", "true");
      params.set("sortBy", sortBy);

      const res = await fetch(`/api/contacts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, tierFilter, onlyRepeat, sortBy]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/contacts/sync", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        alert(`Successfully synced ${data.syncedCount || 0} historical contacts across quotes, payments, invoices, and bookings!`);
        await fetchContacts();
      }
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name,
          phone: createForm.phone,
          email: createForm.email || undefined,
          city: createForm.city || undefined,
          tier: createForm.tier,
          vip_status: createForm.vip_status,
          preferences: {
            hotel_category: createForm.hotel_category,
            meal_preference: createForm.meal_preference,
            vehicle_preference: createForm.vehicle_preference,
          },
          internal_notes: createForm.internal_notes,
          source: "Admin Manual Entry",
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to create contact");
      }

      setIsCreateOpen(false);
      setCreateForm({
        name: "",
        phone: "+91 ",
        email: "",
        city: "",
        tier: "Standard",
        vip_status: 0,
        hotel_category: "5-Star Luxury & Resorts",
        meal_preference: "Pure Vegetarian",
        vehicle_preference: "Toyota Innova Crysta / SUV",
        internal_notes: "",
      });
      await fetchContacts();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from contacts?`)) return;
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setContacts(contacts.filter((c) => c.id !== id));
        setTotal((prev) => Math.max(0, prev - 1));
      }
    } catch (e) {
      alert((e as Error).message);
    }
  };

  // High-level metrics
  const repeatCount = contacts.filter((c) => c.deals_count > 1 || c.total_spent > 0).length;
  const vipCount = contacts.filter((c) => c.tier === "VIP" || c.vip_status === 1 || c.tier === "Platinum").length;
  const totalLifetimeValue = contacts.reduce((sum, c) => sum + (c.total_spent || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-amber-500" />
            <span>Customer Base & CRM</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Central customer directory with automatic number lookups, repeat customer intelligence, lifetime deal values, and tailored travel preferences.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Scan and calculate lifetime values across all past quotes, invoices, and payments"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-amber-500" : ""}`} />
            <span>{syncing ? "Syncing..." : "Sync All Deals"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add New Contact</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Travelers</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{total}</div>
          <span className="text-[11px] text-slate-500 font-medium">In CRM Database</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Repeat Clients</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{repeatCount}</div>
          <span className="text-[11px] text-slate-500 font-medium">
            {total > 0 ? Math.round((repeatCount / total) * 100) : 0}% Repeat Customer Rate
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">VIP & High-Value</span>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{vipCount}</div>
          <span className="text-[11px] text-slate-500 font-medium">VIP & Platinum Members</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700">Pipeline Dealt Value</span>
            <TrendingUp className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{totalLifetimeValue.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Lifetime Settled & Quoted</span>
        </div>
      </div>

      {/* 3. SEARCH & FILTER CONTROLS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, mobile number, city..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Repeat Only Toggle */}
          <button
            type="button"
            onClick={() => setOnlyRepeat(!onlyRepeat)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              onlyRepeat
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${onlyRepeat ? "text-emerald-600" : "text-slate-400"}`} />
            <span>Repeat Clients Only</span>
          </button>

          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">All Member Tiers</option>
            <option value="VIP">VIP Tier</option>
            <option value="Platinum">Platinum Tier</option>
            <option value="Gold">Gold Tier</option>
            <option value="Silver">Silver Tier</option>
            <option value="Standard">Standard Tier</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "spent" | "recent" | "deals" | "name")}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="spent">Sort: Highest Dealt Value</option>
            <option value="recent">Sort: Most Recently Active</option>
            <option value="deals">Sort: Most Deals / Quotes</option>
            <option value="name">Sort: Client Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* 4. CONTACTS DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Client / Traveler</th>
                <th className="py-3.5 px-4">Tier & Status</th>
                <th className="py-3.5 px-4">Dealt Value (LTV)</th>
                <th className="py-3.5 px-4">Preferences & Notes</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 animate-pulse">
                    Loading contacts...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No contacts found. Click &quot;Sync All Deals&quot; or &quot;Add New Contact&quot; to build your CRM.
                  </td>
                </tr>
              ) : (
                contacts.map((c) => {
                  const cleanPhone = (c.phone || "").replace(/\D/g, "");
                  const isRepeat = c.deals_count > 1 || c.total_spent > 0;
                  const waUrl = `https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(c.name)},%20greetings%20from%20Yellow%20Ribbon%20Travels!`;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                            {c.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => setSelectedContactId(c.id)}
                              className="font-bold text-slate-950 text-xs hover:text-amber-600 transition-colors text-left cursor-pointer"
                            >
                              {c.name}
                            </button>
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                              <span>{c.phone}</span>
                              {c.email && <span className="text-slate-400">• {c.email}</span>}
                            </div>
                            {c.city && (
                              <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-2.5 h-2.5" />
                                <span>{c.city}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Tier & Repeat Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              c.tier === "VIP" || c.vip_status === 1
                                ? "bg-amber-400 text-slate-950 border border-amber-300"
                                : c.tier === "Platinum"
                                ? "bg-slate-200 text-slate-900"
                                : c.tier === "Gold"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                : c.tier === "Silver"
                                ? "bg-slate-100 text-slate-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {(c.tier === "VIP" || c.vip_status === 1) && <Crown className="w-3 h-3 fill-slate-950" />}
                            {c.tier === "Gold" && <Star className="w-3 h-3 fill-yellow-500" />}
                            <span>{c.tier}</span>
                          </span>

                          {isRepeat && (
                            <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{c.deals_count} Previous Trips / Deals</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Dealt Value */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-950 text-sm">
                          ₹{c.total_spent.toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {c.deals_count} total interactions
                        </div>
                      </td>

                      {/* Preferences & CRM Notes */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          {(c.preferences?.hotel_category || c.preferences?.meal_preference) ? (
                            <div className="text-[11px] text-slate-700 font-medium">
                              🏨 {[c.preferences.hotel_category, c.preferences.meal_preference].filter(Boolean).join(" • ")}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No stay preferences set</span>
                          )}

                          {c.internal_notes && (
                            <div className="text-[10px] text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/60 line-clamp-1">
                              📝 {c.internal_notes}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Last Activity */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-slate-500 block">
                          {c.last_interaction_at
                            ? new Date(c.last_interaction_at).toLocaleDateString("en-IN")
                            : "New record"}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">
                          via {c.source || "System"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Analyze 360 Profile */}
                          <button
                            type="button"
                            onClick={() => setSelectedContactId(c.id)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 transition-colors cursor-pointer"
                            title="Analyze full 360 customer profile & deals"
                          >
                            Analyze 360
                          </button>

                          {/* WhatsApp */}
                          {cleanPhone && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
                            </a>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(c.id, c.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete contact"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. CREATE CONTACT MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 px-6 bg-slate-900 text-white flex items-center justify-between shrink-0 rounded-t-3xl">
              <div>
                <h3 className="text-lg font-bold">Add Customer to CRM Base</h3>
                <p className="text-xs text-slate-400">Stores client profile, preferences & VIP status</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl border border-rose-100">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="e.g. Ananya Roy"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={createForm.phone}
                      onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                      placeholder="+91 98200 54321"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      placeholder="client@gmail.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={createForm.city}
                      onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                      placeholder="e.g. Hyderabad / Secunderabad"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Customer Tier
                    </label>
                    <select
                      value={createForm.tier}
                      onChange={(e) => setCreateForm({ ...createForm, tier: e.target.value as CustomerTier })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                </div>

                {/* Preferences */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Travel & Service Preferences
                  </span>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Hotel Preference
                      </label>
                      <select
                        value={createForm.hotel_category}
                        onChange={(e) => setCreateForm({ ...createForm, hotel_category: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                      >
                        <option value="5-Star Luxury & Resorts">5-Star Luxury</option>
                        <option value="Private Pool Villas">Pool Villas</option>
                        <option value="4-Star Deluxe">4-Star Deluxe</option>
                        <option value="3-Star Comfort">3-Star Comfort</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Dietary Preference
                      </label>
                      <select
                        value={createForm.meal_preference}
                        onChange={(e) => setCreateForm({ ...createForm, meal_preference: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-white"
                      >
                        <option value="Pure Vegetarian">Pure Veg</option>
                        <option value="Jain Meals">Jain Meals</option>
                        <option value="Non-Vegetarian">Non-Veg</option>
                        <option value="Halal Certified">Halal</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Staff Guidance Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Internal Staff CRM Notes
                  </label>
                  <textarea
                    rows={2}
                    value={createForm.internal_notes}
                    onChange={(e) => setCreateForm({ ...createForm, internal_notes: e.target.value })}
                    placeholder="e.g. VIP client; prefers prompt WhatsApp updates. Allow 5% discretion discount."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="p-4 px-6 border-t border-slate-100 bg-white/95 flex items-center justify-end gap-3 shrink-0 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {creating ? "Saving..." : "Add to Contact Base"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. CUSTOMER 360 MODAL */}
      {selectedContactId && (
        <Customer360Modal
          contactId={selectedContactId}
          isOpen={!!selectedContactId}
          onClose={() => setSelectedContactId(null)}
          onUpdated={fetchContacts}
        />
      )}
    </div>
  );
}
