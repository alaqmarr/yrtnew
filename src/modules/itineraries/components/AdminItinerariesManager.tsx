"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Itinerary, ItineraryDay, ItineraryAccommodation, CostBreakdownItem } from "../domain/itinerary.entity";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import CustomerLookupInput from "@/modules/contacts/components/CustomerLookupInput";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Printer,
  Calendar,
  MapPin,
  X,
  PlusCircle,
  MinusCircle,
  Search,
  CheckCircle2,
  Clock,
  Users,
  Car,
  Hotel,
  Share2,
  Copy,
  Check,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
}

function AutoResizeTextarea({
  value,
  onChange,
  className = "",
  minRows = 2,
  ...props
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, minRows * 22)}px`;
  };

  useEffect(() => {
    adjustHeight();
    const frame = requestAnimationFrame(adjustHeight);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      rows={minRows}
      value={value}
      onChange={(e) => {
        onChange?.(e);
        adjustHeight();
      }}
      className={`resize-none overflow-hidden transition-[height] duration-75 ${className}`}
      {...props}
    />
  );
}

interface AdminItinerariesManagerProps {
  initialItineraries: Itinerary[];
}

export default function AdminItinerariesManager({
  initialItineraries,
}: AdminItinerariesManagerProps) {
  const [itineraries, setItineraries] = useState<Itinerary[]>(initialItineraries);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "Active" | "Confirmed" | "Draft">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Blank Form Defaults
  const initialBlankForm = {
    client_name: "",
    client_phone: "+91 ",
    client_email: "",
    destination: "",
    title: "",
    start_date: "",
    duration_days: 4,
    duration_nights: 3,
    travelers_count: 2,
    vehicle: "",
    pax_label: "2 Adults",
    price_per_person: 0,
    total_price: 0,
    currency: "INR",
    status: "Active" as Itinerary["status"],
    hotel_details: "",
    accommodations: [] as ItineraryAccommodation[],
    days: [
      {
        day: 1,
        title: "DAY 01 | ARRIVAL & LEISURE",
        description: "",
        overnight: "",
        meals: "Breakfast",
        visit_points: [] as string[],
      },
    ] as ItineraryDay[],
    highlights_text: "",
    notes_text:
      "Note: Lunch & dinner are not included, allowing guests to explore local restaurants according to their preference.\n\nOptional activities and entry tickets not specifically mentioned are payable additionally.",
    cost_breakdown: [] as CostBreakdownItem[],
  };

  // Form State
  const [formData, setFormData] = useState(initialBlankForm);
  const [focusedDayIndex, setFocusedDayIndex] = useState<number | null>(0);

  const reloadItineraries = async () => {
    try {
      const res = await fetch("/api/itineraries");
      const data = await res.json();
      if (Array.isArray(data)) setItineraries(data);
    } catch (e) {
      console.error(e);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialBlankForm);
    setFocusedDayIndex(0);
    setError("");
    setIsModalOpen(true);
  };

  const handleResetForm = () => {
    setFormData(initialBlankForm);
    setFocusedDayIndex(0);
  };

  const openEditModal = (itn: Itinerary) => {
    setEditingId(itn.id);

    let parsedDays: ItineraryDay[] = [];
    try {
      parsedDays = JSON.parse(itn.days_json || "[]");
    } catch {
      parsedDays = [];
    }

    let parsedAcc: ItineraryAccommodation[] = [];
    try {
      parsedAcc = JSON.parse(itn.accommodations_json || "[]");
    } catch {
      parsedAcc = [];
    }

    let parsedHighlights: string[] = [];
    try {
      parsedHighlights = JSON.parse(itn.package_highlights_json || "[]");
    } catch {
      parsedHighlights = [];
    }

    let parsedNotes: string[] = [];
    try {
      parsedNotes = JSON.parse(itn.important_notes_json || "[]");
    } catch {
      parsedNotes = [];
    }

    let parsedCostBreakdown: CostBreakdownItem[] = [];
    try {
      parsedCostBreakdown = JSON.parse(itn.cost_breakdown_json || "[]");
    } catch {
      parsedCostBreakdown = [];
    }

    setFormData({
      client_name: itn.client_name,
      client_phone: itn.client_phone,
      client_email: itn.client_email || "",
      destination: itn.destination,
      title: itn.title,
      start_date: itn.start_date || "",
      duration_days: itn.duration_days,
      duration_nights: itn.duration_nights,
      travelers_count: itn.travelers_count,
      vehicle: itn.vehicle || "Toyota Etios",
      pax_label: itn.pax_label || `${itn.travelers_count} Adults`,
      price_per_person: itn.price_per_person || 0,
      total_price: itn.total_price,
      currency: itn.currency,
      status: itn.status,
      hotel_details: itn.hotel_details || "",
      accommodations:
        parsedAcc.length > 0
          ? parsedAcc
          : [
              {
                nights: `${itn.duration_nights} Nights`,
                city: itn.destination,
                hotel_name: itn.hotel_details || "Luxury Stays",
                meal_plan: "Breakfast (CP)",
                room_type: "Classic Room",
                occupancy: itn.pax_label || `${itn.travelers_count} Adults`,
              },
            ],
      days: parsedDays,
      highlights_text: parsedHighlights.join("\n"),
      notes_text: parsedNotes.join("\n\n") || (itn.notes || ""),
      cost_breakdown: parsedCostBreakdown,
    });
    setFocusedDayIndex(0);
    setError("");
    setIsModalOpen(true);
  };

  const handleAddAccommodation = () => {
    setFormData((prev) => ({
      ...prev,
      accommodations: [
        ...prev.accommodations,
        {
          nights: "1 Night",
          city: prev.destination,
          hotel_name: "Deluxe Resort",
          meal_plan: "Breakfast (CP)",
          room_type: "Classic Room",
          occupancy: prev.pax_label || "2 Adults",
        },
      ],
    }));
  };

  const handleRemoveAccommodation = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      accommodations: prev.accommodations.filter((_, i) => i !== idx),
    }));
  };

  const handleAccommodationChange = (
    idx: number,
    field: keyof ItineraryAccommodation,
    value: string
  ) => {
    setFormData((prev) => {
      const copy = [...prev.accommodations];
      copy[idx] = { ...copy[idx], [field]: value };
      return { ...prev, accommodations: copy };
    });
  };

  const handleAddDay = () => {
    const nextIdx = formData.days.length;
    setFormData((prev) => ({
      ...prev,
      days: [
        ...prev.days,
        {
          day: prev.days.length + 1,
          title: `DAY ${String(prev.days.length + 1).padStart(2, "0")} | SIGHTSEEING`,
          description: "Full day leisure and sightseeing tour.",
          overnight: prev.destination || "",
          meals: "Breakfast",
          visit_points: [],
        },
      ],
    }));
    // Collapse all other days and keep only the newly added day in focus
    setFocusedDayIndex(nextIdx);
  };

  const handleRemoveDay = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.filter((_, i) => i !== idx),
    }));
    setFocusedDayIndex((prev) => {
      if (prev === null) return null;
      if (prev === idx) {
        const remaining = formData.days.length - 1;
        return remaining > 0 ? Math.min(idx, remaining - 1) : null;
      }
      if (prev > idx) return prev - 1;
      return prev;
    });
  };

  const handleDayChange = (idx: number, field: keyof ItineraryDay, value: any) => {
    setFormData((prev) => {
      const copy = [...prev.days];
      copy[idx] = { ...copy[idx], [field]: value };
      return { ...prev, days: copy };
    });
  };

  const saveQuotationToDb = async (shouldPrintAfterSave: boolean) => {
    setLoading(true);
    setError("");

    try {
      if (!formData.client_name.trim()) {
        throw new Error("Please enter client name");
      }
      if (!formData.destination.trim()) {
        throw new Error("Please enter destination");
      }

      const highlightsArray = formData.highlights_text
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const notesArray = formData.notes_text
        .split("\n\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const computedTotal =
        Number(formData.total_price) > 0
          ? Number(formData.total_price)
          : (Number(formData.price_per_person) || 0) *
            (Number(formData.travelers_count) || 1);

      const payload = {
        client_name: formData.client_name.trim(),
        client_phone: formData.client_phone.trim(),
        client_email: formData.client_email?.trim() || null,
        destination: formData.destination.trim(),
        title: formData.title.trim() || `${formData.destination.trim()} Tour Quotation`,
        start_date: formData.start_date?.trim() || null,
        duration_days: Number(formData.duration_days) || 1,
        duration_nights: Number(formData.duration_nights) || 1,
        travelers_count: Number(formData.travelers_count) || 2,
        vehicle: formData.vehicle || null,
        pax_label: formData.pax_label || `${formData.travelers_count || 2} Adults`,
        price_per_person: Number(formData.price_per_person) || null,
        total_price: computedTotal,
        currency: formData.currency || "INR",
        status: formData.status || "Active",
        hotel_details: formData.hotel_details || null,
        accommodations_json: JSON.stringify(formData.accommodations),
        days_json: JSON.stringify(formData.days),
        package_highlights_json: JSON.stringify(highlightsArray),
        important_notes_json: JSON.stringify(notesArray),
        cost_breakdown_json: JSON.stringify(formData.cost_breakdown || []),
      };

      const url = editingId ? `/api/itineraries/${editingId}` : "/api/itineraries";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save quotation");
      }

      const savedItn = await res.json();
      await reloadItineraries();
      setIsModalOpen(false);

      if (shouldPrintAfterSave) {
        const refOrId = savedItn?.reference_no || savedItn?.id || editingId;
        if (refOrId) {
          window.open(`/itinerary/${refOrId}?print=1`, "_blank");
        }
      }
    } catch (err) {
      setError((err as Error).message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndPrint = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveQuotationToDb(true);
  };

  const handleSaveOnly = async (e: React.MouseEvent) => {
    e.preventDefault();
    await saveQuotationToDb(false);
  };

  const handleDelete = async (id: string, refNo: string) => {
    if (!confirm(`Are you sure you want to delete quotation ${refNo}?`)) return;

    try {
      const res = await fetch(`/api/itineraries/${id}`, { method: "DELETE" });
      if (res.ok) {
        await reloadItineraries();
      } else {
        alert("Failed to delete quotation");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting quotation");
    }
  };

  const handleCopyLink = (refOrId: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/itinerary/${refOrId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(refOrId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filtered = itineraries.filter((itn) => {
    const matchSearch =
      itn.client_name.toLowerCase().includes(search.toLowerCase()) ||
      itn.reference_no.toLowerCase().includes(search.toLowerCase()) ||
      itn.destination.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || itn.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Client Quotations & Custom Itineraries
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, manage, and share official Yellow Ribbon Travels luxury holiday quotes and A4 PDF itineraries.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-yellow to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-102 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Quote / Itinerary</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client, reference no, or destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 text-xs font-semibold">
          {(["all", "Active", "Confirmed", "Draft"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer capitalize ${
                filter === st
                  ? "bg-slate-900 text-white font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Itineraries List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Quotations Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first official travel quotation with custom client details, hotel stays, day-by-day plans, and itemized cost breakdown.
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Quote</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((itn) => {
              const waMessage = `Dear ${itn.client_name},\n\nWe have prepared your personalized holiday quote for ${itn.destination} (${itn.reference_no})!\n\nView and download your official PDF quote here:\n${origin}/itinerary/${itn.id}\n\nWarm regards,\nYellow Ribbon Travels`;

              return (
                <div
                  key={itn.id}
                  className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Left: Trip & Client Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                        {itn.reference_no}
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-800 border border-amber-300/40">
                        {itn.destination}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          itn.status === "Confirmed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : itn.status === "Active"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {itn.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-950">
                      {itn.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">
                        Client: {itn.client_name}
                      </span>
                      <span>•</span>
                      <span>{itn.client_phone}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {itn.duration_nights}N / {itn.duration_days}D
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        {itn.vehicle || "Toyota Etios"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {itn.pax_label || `${itn.travelers_count} Pax`}
                      </span>
                    </div>
                  </div>

                  {/* Right: Pricing & Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="text-left sm:text-right pr-2">
                      <div className="text-base font-black text-slate-950">
                        ₹
                        {itn.price_per_person && itn.price_per_person > 0
                          ? `${itn.price_per_person.toLocaleString("en-IN")} /-`
                          : `${itn.total_price.toLocaleString("en-IN")}`}
                      </div>
                      <div className="text-[11px] text-slate-500 italic">
                        {itn.price_per_person && itn.price_per_person > 0
                          ? "per person"
                          : "total price"}
                      </div>
                    </div>

                    {/* View & Print Official PDF */}
                    <Link
                      href={`/itinerary/${itn.reference_no || itn.id}?print=1`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-brand-yellow to-amber-400 hover:from-amber-400 hover:to-amber-500 transition-all shadow-xs"
                      title="Open & Print Official Quotation PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print PDF</span>
                    </Link>

                    {/* Copy Link */}
                    <button
                      onClick={() => handleCopyLink(itn.id)}
                      className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                      title="Copy Public Link"
                    >
                      {copiedId === itn.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {/* WhatsApp Direct Share */}
                    <a
                      href={`https://wa.me/${itn.client_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        waMessage
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-white bg-[#25D366] hover:bg-[#20bd5a] transition-colors"
                      title="Share Quotation Link on WhatsApp"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-white" />
                    </a>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(itn)}
                      className="p-2 rounded-xl text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 transition-colors cursor-pointer"
                      title="Edit Quotation"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(itn.id, itn.reference_no)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Quotation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quotation Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Fixed Modal Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-slate-100 shrink-0 bg-white z-10 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingId ? "Edit Travel Quotation" : "Create Official Quotation"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Renders into a perfect multi-page A4 PDF matching Yellow Ribbon Travels standards.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  title="Clear all fields"
                >
                  <span>🧹 Clear Form</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAndPrint} className="flex flex-col flex-1 overflow-hidden min-h-0">
              {/* Scrollable Content Container */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                    {error}
                  </div>
                )}

                {/* SECTION 1: Client & Trip Overview */}
                <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <span>1. Client & Destination Overview</span>
                </h4>

                <CustomerLookupInput
                  name={formData.client_name}
                  phone={formData.client_phone}
                  email={formData.client_email}
                  onNameChange={(val) => setFormData((prev) => ({ ...prev, client_name: val }))}
                  onPhoneChange={(val) => setFormData((prev) => ({ ...prev, client_phone: val }))}
                  onEmailChange={(val) => setFormData((prev) => ({ ...prev, client_email: val }))}
                  onCustomerSelect={(cust) => {
                    if (cust.preferences?.vehicle_preference && !formData.vehicle) {
                      setFormData((prev) => ({
                        ...prev,
                        vehicle: cust.preferences.vehicle_preference || prev.vehicle,
                      }));
                    }
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Destination * (Highlighted in yellow on PDF)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.destination}
                      onChange={(e) =>
                        setFormData({ ...formData, destination: e.target.value })
                      }
                      placeholder="e.g. Meghalaya"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      placeholder="e.g. 26th NOVEMBER 2026"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Vehicle Allotted
                    </label>
                    <input
                      type="text"
                      value={formData.vehicle}
                      onChange={(e) =>
                        setFormData({ ...formData, vehicle: e.target.value })
                      }
                      placeholder="e.g. Toyota Etios / Innova Crysta"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Duration (Nights & Days)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min={1}
                        value={formData.duration_nights}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            duration_nights: Number(e.target.value),
                          })
                        }
                        placeholder="Nights"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                      />
                      <input
                        type="number"
                        min={1}
                        value={formData.duration_days}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            duration_days: Number(e.target.value),
                          })
                        }
                        placeholder="Days"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pax Label
                    </label>
                    <input
                      type="text"
                      value={formData.pax_label}
                      onChange={(e) =>
                        setFormData({ ...formData, pax_label: e.target.value })
                      }
                      placeholder="e.g. 3 Adults"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Quote Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="e.g. Meghalaya Luxury Tour: Shillong, Cherrapunji & Dawki"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Accommodation Table (Page 2 on PDF) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    2. Accommodation Stays (Rendered on Page 2)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddAccommodation}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Hotel Stay</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.accommodations.map((acc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Nights
                        </label>
                        <input
                          type="text"
                          value={acc.nights}
                          onChange={(e) =>
                            handleAccommodationChange(idx, "nights", e.target.value)
                          }
                          placeholder="e.g. 26th Nov to 28th Nov"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          City
                        </label>
                        <input
                          type="text"
                          value={acc.city}
                          onChange={(e) =>
                            handleAccommodationChange(idx, "city", e.target.value)
                          }
                          placeholder="e.g. Shillong"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 font-bold"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Hotel Name
                        </label>
                        <input
                          type="text"
                          value={acc.hotel_name}
                          onChange={(e) =>
                            handleAccommodationChange(idx, "hotel_name", e.target.value)
                          }
                          placeholder="e.g. Super Collection O SRS Residency"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900 font-semibold"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Meal Plan
                        </label>
                        <input
                          type="text"
                          value={acc.meal_plan}
                          onChange={(e) =>
                            handleAccommodationChange(idx, "meal_plan", e.target.value)
                          }
                          placeholder="Breakfast (CP)"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">
                          Room Type & Pax
                        </label>
                        <input
                          type="text"
                          value={acc.room_type}
                          onChange={(e) =>
                            handleAccommodationChange(idx, "room_type", e.target.value)
                          }
                          placeholder="Classic Room"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-900"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveAccommodation(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete Stay"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: Pricing & Status */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                  3. Pricing & Status
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Price Per Person (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.price_per_person}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price_per_person: Number(e.target.value),
                        })
                      }
                      placeholder="16200"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Total Package Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.total_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          total_price: Number(e.target.value),
                        })
                      }
                      placeholder="48600"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Currency
                    </label>
                    <input
                      type="text"
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Quotation Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as Itinerary["status"],
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                {/* Cost Breakdown Line Items (Optional / Auto-generates standard if empty) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Commercial Cost Breakdown (Shown in PDF Proposal)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {formData.cost_breakdown.length === 0
                          ? "Using standard transparent breakdown (Hotels, Cab, Tolls, 5% GST & Concierge)."
                          : `${formData.cost_breakdown.length} custom line items configured.`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            cost_breakdown: [
                              {
                                item: "Hotel Stays & Daily Breakfast (CP)",
                                description: `${formData.duration_nights} Nights verified handpicked stays`,
                                amount: null,
                                is_included: true,
                              },
                              {
                                item: "Dedicated Private Vehicle & Sightseeing",
                                description: `${formData.vehicle || "Private AC Vehicle"} throughout entire tour`,
                                amount: null,
                                is_included: true,
                              },
                              {
                                item: "Driver Allowance, Tolls, Fuel & Parking",
                                description: "100% covered · No hidden on-trip fees",
                                amount: null,
                                is_included: true,
                              },
                              {
                                item: "Government Taxes & 5% GST",
                                description: "All statutory tour operator taxes covered",
                                amount: null,
                                is_included: true,
                              },
                              {
                                item: "24/7 Dedicated Concierge Support",
                                description: "Direct access to your assigned travel architect",
                                amount: null,
                                is_included: true,
                              },
                            ],
                          });
                        }}
                        className="text-[11px] font-bold text-amber-900 hover:text-amber-950 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        ⚡ Populate Standard Inclusions
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            cost_breakdown: [
                              ...formData.cost_breakdown,
                              { item: "", description: "", amount: null, is_included: true },
                            ],
                          });
                        }}
                        className="text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Item</span>
                      </button>
                    </div>
                  </div>

                  {formData.cost_breakdown.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {formData.cost_breakdown.map((item, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-xl border border-slate-200 text-xs"
                        >
                          <div className="col-span-12 sm:col-span-4">
                            <input
                              type="text"
                              placeholder="Component / Service name"
                              value={item.item}
                              onChange={(e) => {
                                const next = [...formData.cost_breakdown];
                                next[idx] = { ...next[idx], item: e.target.value };
                                setFormData({ ...formData, cost_breakdown: next });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div className="col-span-12 sm:col-span-4">
                            <input
                              type="text"
                              placeholder="Coverage / Details"
                              value={item.description || ""}
                              onChange={(e) => {
                                const next = [...formData.cost_breakdown];
                                next[idx] = { ...next[idx], description: e.target.value };
                                setFormData({ ...formData, cost_breakdown: next });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600"
                            />
                          </div>
                          <div className="col-span-10 sm:col-span-3 flex items-center gap-2">
                            <select
                              value={item.is_included ? "included" : "amount"}
                              onChange={(e) => {
                                const next = [...formData.cost_breakdown];
                                const isInc = e.target.value === "included";
                                next[idx] = {
                                  ...next[idx],
                                  is_included: isInc,
                                  amount: isInc ? null : next[idx].amount || 0,
                                };
                                setFormData({ ...formData, cost_breakdown: next });
                              }}
                              className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-medium bg-white"
                            >
                              <option value="included">Included</option>
                              <option value="amount">Custom ₹</option>
                            </select>
                            {!item.is_included && (
                              <input
                                type="number"
                                placeholder="Amount"
                                value={item.amount || 0}
                                onChange={(e) => {
                                  const next = [...formData.cost_breakdown];
                                  next[idx] = { ...next[idx], amount: Number(e.target.value) };
                                  setFormData({ ...formData, cost_breakdown: next });
                                }}
                                className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                              />
                            )}
                          </div>
                          <div className="col-span-2 sm:col-span-1 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const next = formData.cost_breakdown.filter((_, i) => i !== idx);
                                setFormData({ ...formData, cost_breakdown: next });
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4: Day-by-Day Itinerary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      4. Day-by-Day Itinerary
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {formData.days.length} Day{formData.days.length === 1 ? "" : "s"} planned · Click any day to edit · Only one open at a time
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-100/80 hover:bg-amber-200 px-3.5 py-1.5 rounded-xl border border-amber-300 shadow-xs cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Day</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {formData.days.map((d, idx) => {
                    const isFocused = focusedDayIndex === idx;

                    if (!isFocused) {
                      return (
                        <div
                          key={idx}
                          onClick={() => setFocusedDayIndex(idx)}
                          className="group p-3 rounded-xl bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs"
                          title="Click to expand & edit this day"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <span className="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-900 text-brand-yellow">
                              DAY {String(d.day || idx + 1).padStart(2, "0")}
                            </span>
                            <div className="min-w-0 flex-1 flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800 truncate group-hover:text-amber-950">
                                {d.title || `Day ${idx + 1}`}
                              </span>
                              {d.overnight && (
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                                  <MapPin className="w-3 h-3 text-amber-600" />
                                  {d.overnight}
                                </span>
                              )}
                              {d.meals && (
                                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                                  🍽️ {d.meals}
                                </span>
                              )}
                              {Boolean(d.visit_points && d.visit_points.length > 0) && (
                                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                                  📍 {d.visit_points?.length} spots
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveDay(idx);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Day"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="p-1 text-slate-400 group-hover:text-amber-700 transition-colors">
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-amber-50/20 border-2 border-amber-300 shadow-sm space-y-3.5 transition-all"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-900 text-brand-yellow">
                              DAY {String(d.day || idx + 1).padStart(2, "0")}
                            </span>
                            <input
                              type="text"
                              value={d.title}
                              onChange={(e) =>
                                handleDayChange(idx, "title", e.target.value)
                              }
                              placeholder="DAY 01 | GUWAHATI – SHILLONG"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-black text-slate-950 bg-white focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setFocusedDayIndex(null)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-amber-100/60 transition-colors cursor-pointer"
                              title="Collapse day"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveDay(idx)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete day"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Day Narrative / Itinerary Details
                          </label>
                          <AutoResizeTextarea
                            minRows={2}
                            value={d.description}
                            onChange={(e) =>
                              handleDayChange(idx, "description", e.target.value)
                            }
                            placeholder="Day narrative description..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white leading-relaxed focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Visit / Sightseeing Points (One per line)
                            </label>
                            <AutoResizeTextarea
                              minRows={3}
                              value={(d.visit_points || []).join("\n")}
                              onChange={(e) =>
                                handleDayChange(
                                  idx,
                                  "visit_points",
                                  e.target.value
                                    .split("\n")
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                                )
                              }
                              placeholder="Laitlum Canyons&#10;Shillong Peak&#10;Elephant Falls"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:border-amber-400 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                Overnight Stay Location
                              </label>
                              <input
                                type="text"
                                value={d.overnight || ""}
                                onChange={(e) =>
                                  handleDayChange(idx, "overnight", e.target.value)
                                }
                                placeholder="e.g. Shillong"
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:border-amber-400 focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                Meals Included
                              </label>
                              <input
                                type="text"
                                value={d.meals || ""}
                                onChange={(e) =>
                                  handleDayChange(idx, "meals", e.target.value)
                                }
                                placeholder="e.g. Breakfast"
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:border-amber-400 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 5: Package Highlights & Important Notes */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                  5. Package Highlights & Important Notes (Rendered on Page 5)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Package Highlights (One item per line)
                    </label>
                    <AutoResizeTextarea
                      minRows={5}
                      value={formData.highlights_text}
                      onChange={(e) =>
                        setFormData({ ...formData, highlights_text: e.target.value })
                      }
                      placeholder="Laitlum Canyon&#10;Mawlynnong Village&#10;Living Root Bridge..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium leading-relaxed focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Important Notes & Inclusions Policy
                    </label>
                    <AutoResizeTextarea
                      minRows={5}
                      value={formData.notes_text}
                      onChange={(e) =>
                        setFormData({ ...formData, notes_text: e.target.value })
                      }
                      placeholder="Note: Lunch & dinner are not included..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 leading-relaxed focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              </div>

              {/* Fixed Modal Action Footer */}
              <div className="px-6 sm:px-8 py-3.5 border-t border-slate-200/90 bg-white/95 backdrop-blur-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 rounded-b-3xl z-10 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    🧹 Reset / Clear
                  </button>
                </div>

                <div className="flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveOnly}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loading
                      ? "Saving..."
                      : editingId
                      ? "Update in DB"
                      : "Save to Database"}
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-brand-yellow to-amber-400 hover:from-amber-400 hover:to-amber-500 shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                    title="Saves quotation to database and opens official print / PDF dialog"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{loading ? "Saving..." : "Save & Print PDF"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
