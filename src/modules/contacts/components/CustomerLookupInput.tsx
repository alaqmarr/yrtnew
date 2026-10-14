"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  Phone,
  Mail,
  Crown,
  Star,
  CheckCircle2,
  Sparkles,
  Info,
  X,
  Search,
} from "lucide-react";
import { ContactLookupResult } from "../domain/contact.entity";
import Customer360Modal from "./Customer360Modal";

interface CustomerLookupInputProps {
  name: string;
  phone: string;
  email?: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onEmailChange?: (email: string) => void;
  onCustomerSelect?: (customer: ContactLookupResult) => void;
  required?: boolean;
  showEmailField?: boolean;
  nameLabel?: string;
  phoneLabel?: string;
  emailLabel?: string;
}

export default function CustomerLookupInput({
  name,
  phone,
  email = "",
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onCustomerSelect,
  required = true,
  showEmailField = true,
  nameLabel = "Client Full Name *",
  phoneLabel = "WhatsApp Phone *",
  emailLabel = "Client Email",
}: CustomerLookupInputProps) {
  const [query, setQuery] = useState("");
  const [activeInput, setActiveInput] = useState<"name" | "phone" | null>(null);
  const [suggestions, setSuggestions] = useState<ContactLookupResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<ContactLookupResult | null>(null);
  const [profileModalId, setProfileModalId] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounced search on query change
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/contacts/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.results || []);
          setIsOpen((data.results || []).length > 0);
        }
      } catch (err) {
        console.error("Contact lookup error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelect = (customer: ContactLookupResult) => {
    onNameChange(customer.name);
    onPhoneChange(customer.phone);
    if (onEmailChange && customer.email) {
      onEmailChange(customer.email);
    }
    setSelectedCustomer(customer);
    setIsOpen(false);
    if (onCustomerSelect) {
      onCustomerSelect(customer);
    }
  };

  const handleNameInput = (val: string) => {
    onNameChange(val);
    setActiveInput("name");
    setQuery(val);
  };

  const handlePhoneInput = (val: string) => {
    onPhoneChange(val);
    setActiveInput("phone");
    setQuery(val);
  };

  return (
    <div ref={wrapperRef} className="space-y-3 relative">
      {/* 1. INPUT ROW */}
      <div className={`grid grid-cols-1 ${showEmailField ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-3`}>
        {/* Name Input */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>{nameLabel}</span>
            <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
              <Search className="w-2.5 h-2.5" /> Auto-lookup
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              required={required}
              value={name}
              onChange={(e) => handleNameInput(e.target.value)}
              onFocus={() => {
                if (name && name.length >= 2) {
                  setQuery(name);
                  setActiveInput("name");
                }
              }}
              placeholder="e.g. Vikram Malhotra"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 bg-white"
            />
          </div>
        </div>

        {/* WhatsApp Phone Input */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>{phoneLabel}</span>
            <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
              <Phone className="w-2.5 h-2.5" /> Number lookup
            </span>
          </label>
          <div className="relative">
            <input
              type="tel"
              required={required}
              value={phone}
              onChange={(e) => handlePhoneInput(e.target.value)}
              onFocus={() => {
                const digits = phone.replace(/\D/g, "");
                if (digits.length >= 3) {
                  setQuery(digits);
                  setActiveInput("phone");
                }
              }}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 bg-white font-mono"
            />
          </div>
        </div>

        {/* Email Input */}
        {showEmailField && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {emailLabel}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange && onEmailChange(e.target.value)}
              placeholder="client@example.com"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 bg-white"
            />
          </div>
        )}
      </div>

      {/* 2. AUTO-SUGGEST FLOATING DROPDOWN */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2.5 bg-slate-900 text-white text-[11px] font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Matching Contacts ({suggestions.length})</span>
            </span>
            <span className="text-[10px] text-slate-400">
              Click to auto-fill details & view customer intelligence
            </span>
          </div>

          {suggestions.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelect(c)}
              className="w-full text-left p-3 hover:bg-amber-50/70 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-amber-100 flex items-center justify-center font-bold text-xs text-slate-700 group-hover:text-amber-800 shrink-0">
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 group-hover:text-amber-950">
                      {c.name}
                    </span>

                    {/* Tier badge */}
                    <span
                      className={`text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        c.tier === "VIP" || c.vip_status
                          ? "bg-amber-400 text-slate-950"
                          : c.tier === "Gold"
                          ? "bg-yellow-100 text-yellow-800"
                          : c.tier === "Platinum"
                          ? "bg-slate-200 text-slate-900"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {c.tier}
                    </span>

                    {c.is_repeat && (
                      <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Repeat Client
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
                    <span className="font-mono text-slate-700">{c.phone}</span>
                    {c.email && <span>• {c.email}</span>}
                    {c.city && <span>• {c.city}</span>}
                  </div>

                  {/* Preference hint */}
                  {(c.preferences?.hotel_category || c.preferences?.meal_preference) && (
                    <div className="text-[10px] text-slate-400 italic mt-0.5">
                      Prefers: {[c.preferences.hotel_category, c.preferences.meal_preference].filter(Boolean).join(" • ")}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-black text-slate-900">
                  ₹{c.total_spent.toLocaleString("en-IN")}
                </div>
                <div className="text-[10px] text-slate-400">
                  {c.deals_count} {c.deals_count === 1 ? "deal" : "deals"}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 3. REPEAT CUSTOMER INTELLIGENCE BANNER */}
      {selectedCustomer && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50/60 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
              <Crown className="w-4 h-4" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-slate-900">
                  {selectedCustomer.is_repeat ? "⭐ Recognized Repeat Client:" : "Client Record:"}{" "}
                  {selectedCustomer.name}
                </span>

                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {selectedCustomer.tier} Member
                </span>

                <span className="text-[11px] font-bold text-slate-700">
                  • Dealt Value: <strong className="text-slate-950">₹{selectedCustomer.total_spent.toLocaleString("en-IN")}</strong> ({selectedCustomer.deals_count} deals)
                </span>
              </div>

              {/* Preferences and Notes Snippet */}
              <div className="text-[11px] text-slate-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                {selectedCustomer.preferences?.hotel_category && (
                  <span>🏨 <strong>{selectedCustomer.preferences.hotel_category}</strong></span>
                )}
                {selectedCustomer.preferences?.meal_preference && (
                  <span>🍽️ <strong>{selectedCustomer.preferences.meal_preference}</strong></span>
                )}
                {selectedCustomer.preferences?.vehicle_preference && (
                  <span>🚗 <strong>{selectedCustomer.preferences.vehicle_preference}</strong></span>
                )}
                {selectedCustomer.internal_notes && (
                  <span className="text-amber-800 italic">
                    📝 &quot;{selectedCustomer.internal_notes.slice(0, 75)}
                    {selectedCustomer.internal_notes.length > 75 ? "..." : ""}&quot;
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setProfileModalId(selectedCustomer.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-50 border border-amber-300 transition-colors cursor-pointer shadow-xs"
            >
              Analyze 360 Profile
            </button>

            <button
              type="button"
              onClick={() => setSelectedCustomer(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-amber-100/60 transition-colors cursor-pointer"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. CUSTOMER 360 MODAL PREVIEW */}
      {profileModalId && (
        <Customer360Modal
          contactId={profileModalId}
          isOpen={!!profileModalId}
          onClose={() => setProfileModalId(null)}
          onUpdated={() => {
            // refresh data if needed
          }}
        />
      )}
    </div>
  );
}
