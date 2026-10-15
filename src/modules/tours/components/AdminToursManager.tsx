"use client";

import { useState } from "react";
import Image from "next/image";
import { Tour, ItineraryDay } from "../domain/tour.entity";
import { Destination } from "@/modules/destinations/domain/destination.entity";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Clock,
  MapPin,
  X,
  CheckCircle,
  ExternalLink,
  Calendar,
} from "lucide-react";

interface AdminToursManagerProps {
  initialTours: Tour[];
  destinations: Destination[];
}

const DEFAULT_ITINERARY_DAYS: ItineraryDay[] = [
  { day: 1, title: "Arrival & Hotel Check-in", description: "Arrive at destination, receive warm welcome and private transfer to your hotel." },
  { day: 2, title: "Iconic Sights & Cultural Tour", description: "Full-day guided exploration of major monuments, historic landmarks and local markets." },
  { day: 3, title: "Scenic Countryside Excursion", description: "Scenic drive through picturesque valleys, nature walks and photo stops." },
  { day: 4, title: "Leisure & Adventure Activities", description: "Free day for optional adventure sports, shopping and leisure." },
  { day: 5, title: "Departure with Sweet Memories", description: "Breakfast, checkout, and on-time private transfer to airport for departure." },
];

export default function AdminToursManager({
  initialTours,
  destinations,
}: AdminToursManagerProps) {
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    destination_id: destinations[0]?.id || "",
    category: "Holidays",
    tour_type: "Customized Tour",
    duration_days: 5,
    duration_nights: 4,
    price: 25000,
    original_price: 30000,
    featured: false,
    overview: "",
    highlightsText: "1 Night Luxury Houseboat\nPrivate Sanitzed AC Cab\nDaily Breakfast & Dinner",
    inclusionsText: "Hotel Accommodations\nDaily Breakfast & Dinner\nAll Transfers",
    exclusionsText: "Flight tickets\nPersonal expenses\nTips",
    imagesText: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80",
    itinerary: DEFAULT_ITINERARY_DAYS,
  });

  const openCreateModal = () => {
    setEditingTour(null);
    setFormData({
      title: "",
      subtitle: "",
      destination_id: destinations[0]?.id || "",
      category: "Holidays",
      tour_type: "Customized Tour",
      duration_days: 5,
      duration_nights: 4,
      price: 25000,
      original_price: 30000,
      featured: false,
      overview: "",
      highlightsText: "1 Night Luxury Houseboat\nPrivate Sanitzed AC Cab\nDaily Breakfast & Dinner",
      inclusionsText: "Hotel Accommodations\nDaily Breakfast & Dinner\nAll Transfers",
      exclusionsText: "Flight tickets\nPersonal expenses\nTips",
      imagesText: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80",
      itinerary: DEFAULT_ITINERARY_DAYS,
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (tour: Tour) => {
    setEditingTour(tour);
    const existingItinerary =
      tour.itinerary && tour.itinerary.length > 0
        ? tour.itinerary
        : Array.from({ length: tour.duration_days || 1 }, (_, i) => ({
            day: i + 1,
            title: `Day ${i + 1}`,
            description: "",
          }));

    setFormData({
      title: tour.title,
      subtitle: tour.subtitle || "",
      destination_id: tour.destination_id || "",
      category: tour.category,
      tour_type: tour.tour_type,
      duration_days: tour.duration_days,
      duration_nights: tour.duration_nights,
      price: tour.price,
      original_price: tour.original_price || tour.price,
      featured: tour.featured,
      overview: tour.overview,
      highlightsText: tour.highlights.join("\n"),
      inclusionsText: tour.inclusions.join("\n"),
      exclusionsText: tour.exclusions.join("\n"),
      imagesText: tour.images.join("\n"),
      itinerary: existingItinerary,
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleAddDay = () => {
    const nextDay = formData.itinerary.length + 1;
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: nextDay, title: `Day ${nextDay}`, description: "" },
      ],
      duration_days: Math.max(prev.duration_days, nextDay),
      duration_nights: Math.max(prev.duration_nights, nextDay - 1),
    }));
  };

  const handleRemoveDay = (index: number) => {
    setFormData((prev) => {
      const updated = prev.itinerary
        .filter((_, i) => i !== index)
        .map((item, idx) => ({ ...item, day: idx + 1 }));
      return {
        ...prev,
        itinerary: updated,
        duration_days: Math.max(1, updated.length),
        duration_nights: Math.max(0, updated.length - 1),
      };
    });
  };

  const handleUpdateDay = (index: number, field: "title" | "description", value: string) => {
    setFormData((prev) => {
      const updated = [...prev.itinerary];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, itinerary: updated };
    });
  };

  const reloadTours = async () => {
    const res = await fetch("/api/tours");
    const data = await res.json();
    setTours(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title: formData.title,
      subtitle: formData.subtitle,
      destination_id: formData.destination_id || null,
      category: formData.category,
      tour_type: formData.tour_type,
      duration_days: Number(formData.duration_days),
      duration_nights: Number(formData.duration_nights),
      price: Number(formData.price),
      original_price: Number(formData.original_price) || null,
      featured: formData.featured,
      overview: formData.overview,
      itinerary: formData.itinerary,
      highlights: formData.highlightsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      inclusions: formData.inclusionsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      exclusions: formData.exclusionsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      images: formData.imagesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = editingTour ? `/api/tours/${editingTour.id}` : "/api/tours";
      const method = editingTour ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Operation failed");
      }

      await reloadTours();
      setIsModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/tours/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete tour");
      await reloadTours();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Tours & Packages Management
          </h1>
          <p className="text-xs text-slate-500">
            Control packages, pricing, durations, inclusions, and destination linkages.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-yellow to-amber-500 hover:opacity-95 shadow-md shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Tours Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">Tour Package</th>
                <th className="py-4 px-6">Destination</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tours.map((tour) => (
                <tr key={tour.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        {tour.images[0] && (
                          <Image
                            src={tour.images[0]}
                            alt={tour.title}
                            fill
                            sizes="48px"
                            loading="lazy"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="max-w-xs">
                        <div className="font-bold text-sm text-slate-900 truncate">
                          {tour.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {tour.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-medium text-slate-700">
                    {tour.destination_name || "—"}
                  </td>

                  <td className="py-4 px-6">
                    {tour.duration_days}D / {tour.duration_nights}N
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-extrabold text-slate-900">
                      ₹{tour.price.toLocaleString("en-IN")}
                    </div>
                    {tour.original_price && (
                      <div className="text-[10px] text-slate-400 line-through">
                        ₹{tour.original_price.toLocaleString("en-IN")}
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    {tour.featured ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Featured
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                        Standard
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/tours/${tour.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-slate-100"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => openEditModal(tour)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100"
                        title="Edit Tour"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tour.id, tour.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                        title="Delete Tour"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 px-6 bg-slate-900 text-white flex items-center justify-between shrink-0 rounded-t-3xl">
              <div>
                <h3 className="text-lg font-bold">
                  {editingTour ? "Edit Tour Package" : "Create New Tour Package"}
                </h3>
                <p className="text-xs text-slate-400">
                  Fill in the details below to update the live database
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {error && (
                  <div className="p-3 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                    {error}
                  </div>
                )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tour Package Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Enchanting Kashmir & Dal Lake Houseboat"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subtitle / Quick Hook
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Shikara rides, snow peaks of Gulmarg, and saffron gardens"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Map to Destination
                  </label>
                  <select
                    value={formData.destination_id}
                    onChange={(e) => setFormData({ ...formData, destination_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="">None (Independent)</option>
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. International Holidays"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tour Type
                  </label>
                  <input
                    type="text"
                    value={formData.tour_type}
                    onChange={(e) => setFormData({ ...formData, tour_type: e.target.value })}
                    placeholder="e.g. Private Guided Package"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Days *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nights *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.duration_nights}
                    onChange={(e) => setFormData({ ...formData, duration_nights: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tour Overview Narrative *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  placeholder="Describe the entire experience..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Day-by-Day Itinerary Builder */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Day-by-Day Tour Itinerary ({formData.itinerary.length} Days)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Day</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 [scrollbar-width:thin]">
                  {formData.itinerary.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] shrink-0">
                          Day {item.day}
                        </span>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateDay(index, "title", e.target.value)}
                          placeholder="Day Title (e.g. Arrival in Srinagar & Shikara Ride)"
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-1 focus:ring-amber-500"
                        />
                        {formData.itinerary.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDay(index)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                            title="Remove Day"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => handleUpdateDay(index, "description", e.target.value)}
                        placeholder="Day highlights, travel activities and sightseeing description..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Highlights (One per line)
                </label>
                <textarea
                  rows={2}
                  value={formData.highlightsText}
                  onChange={(e) => setFormData({ ...formData, highlightsText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Inclusions (One per line)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.inclusionsText}
                    onChange={(e) => setFormData({ ...formData, inclusionsText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Exclusions (One per line)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.exclusionsText}
                    onChange={(e) => setFormData({ ...formData, exclusionsText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Image URLs (One per line, e.g. Unsplash or R2)
                </label>
                <textarea
                  rows={2}
                  value={formData.imagesText}
                  onChange={(e) => setFormData({ ...formData, imagesText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                />
                <label htmlFor="featured" className="text-xs font-bold text-slate-800">
                  Feature this tour on Home Page showcase
                </label>
              </div>
            </div>

            <div className="p-4 px-6 border-t border-slate-100 bg-white/95 backdrop-blur-xs flex items-center justify-end gap-3 shrink-0 rounded-b-3xl shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Saving..." : editingTour ? "Update Tour" : "Create Tour"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  );
}
