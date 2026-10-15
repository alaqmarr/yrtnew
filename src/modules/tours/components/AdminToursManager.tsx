"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Tour, ItineraryDay } from "../domain/tour.entity";
import { Destination } from "@/modules/destinations/domain/destination.entity";
import {
  Plus,
  Pencil,
  Trash2,
  MapPin,
  X,
  ExternalLink,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Utensils,
  BedDouble,
  Compass,
  RefreshCw,
} from "lucide-react";

interface AdminToursManagerProps {
  initialTours: Tour[];
  destinations: Destination[];
}

const DEFAULT_ITINERARY_DAYS: ItineraryDay[] = [
  {
    day: 1,
    title: "Arrival & Hotel Check-in",
    description:
      "Arrive at destination, receive warm welcome and private transfer to your hotel.",
    overnight: "",
    meals: "Dinner",
    visit_points: ["Airport / Station Pickup", "Evening Leisure Walk"],
  },
  {
    day: 2,
    title: "Iconic Sights & Cultural Tour",
    description:
      "Full-day guided exploration of major monuments, historic landmarks and local markets.",
    overnight: "",
    meals: "Breakfast & Dinner",
    visit_points: ["Heritage Landmarks", "Local Craft Market"],
  },
  {
    day: 3,
    title: "Scenic Countryside Excursion",
    description:
      "Scenic drive through picturesque valleys, nature walks and photo stops.",
    overnight: "",
    meals: "Breakfast & Dinner",
    visit_points: ["Panoramic Viewpoint", "Valley Excursion"],
  },
  {
    day: 4,
    title: "Leisure & Adventure Activities",
    description:
      "Free day for optional adventure sports, shopping and curated local experiences.",
    overnight: "",
    meals: "Breakfast & Dinner",
    visit_points: ["Adventure Point", "Local Cafe Trail"],
  },
  {
    day: 5,
    title: "Departure with Sweet Memories",
    description:
      "Breakfast, checkout, and on-time private transfer to airport/station for departure.",
    overnight: "Departure",
    meals: "Breakfast",
    visit_points: ["Souvenir Shopping", "Airport / Station Drop"],
  },
];

const MEAL_PRESETS = [
  "Breakfast",
  "Breakfast & Dinner",
  "All Meals (B/L/D)",
  "Dinner",
  "No Meals",
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
  const [expandedDays, setExpandedDays] = useState<number[]>([0, 1, 2, 3, 4]);

  const overviewSectionRef = useRef<HTMLDivElement>(null);
  const itinerarySectionRef = useRef<HTMLDivElement>(null);
  const inclusionsSectionRef = useRef<HTMLDivElement>(null);

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
    highlightsText:
      "1 Night Luxury Houseboat\nPrivate Sanitized AC Cab\nDaily Breakfast & Dinner",
    inclusionsText:
      "Hotel Accommodations\nDaily Breakfast & Dinner\nAll Transfers",
    exclusionsText: "Flight tickets\nPersonal expenses\nTips",
    imagesText:
      "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80",
    itinerary: DEFAULT_ITINERARY_DAYS,
  });

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openCreateModal = (scrollToItinerary = false) => {
    setEditingTour(null);
    const defaultDays = DEFAULT_ITINERARY_DAYS.map((d) => ({
      ...d,
      visit_points: [...(d.visit_points || [])],
    }));
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
      highlightsText:
        "1 Night Luxury Houseboat\nPrivate Sanitized AC Cab\nDaily Breakfast & Dinner",
      inclusionsText:
        "Hotel Accommodations\nDaily Breakfast & Dinner\nAll Transfers",
      exclusionsText: "Flight tickets\nPersonal expenses\nTips",
      imagesText:
        "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80",
      itinerary: defaultDays,
    });
    setExpandedDays(defaultDays.map((_, i) => i));
    setError("");
    setIsModalOpen(true);

    if (scrollToItinerary) {
      setTimeout(() => scrollToSection(itinerarySectionRef), 120);
    }
  };

  const openEditModal = (tour: Tour, scrollToItinerary = false) => {
    setEditingTour(tour);
    const existingItinerary: ItineraryDay[] =
      tour.itinerary && tour.itinerary.length > 0
        ? tour.itinerary.map((d, i) => ({
            day: d.day || i + 1,
            title: d.title || `Day ${i + 1}`,
            description: d.description || "",
            overnight: d.overnight || "",
            meals: d.meals || "",
            visit_points: Array.isArray(d.visit_points) ? d.visit_points : [],
          }))
        : Array.from({ length: tour.duration_days || 1 }, (_, i) => ({
            day: i + 1,
            title: `Day ${i + 1}`,
            description: "",
            overnight: "",
            meals: "Breakfast",
            visit_points: [],
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
    setExpandedDays(existingItinerary.map((_, i) => i));
    setError("");
    setIsModalOpen(true);

    if (scrollToItinerary) {
      setTimeout(() => scrollToSection(itinerarySectionRef), 120);
    }
  };

  const handleDurationDaysChange = (newDaysVal: number) => {
    const safeDays = Math.max(1, Math.min(30, newDaysVal || 1));
    setFormData((prev) => {
      const currentList = [...prev.itinerary];
      if (safeDays > currentList.length) {
        for (let i = currentList.length; i < safeDays; i++) {
          currentList.push({
            day: i + 1,
            title: `Day ${i + 1} Sightseeing & Experiences`,
            description: "",
            overnight: "",
            meals: "Breakfast",
            visit_points: [],
          });
        }
        setExpandedDays((prevExp) => [
          ...prevExp,
          ...Array.from(
            { length: safeDays - prev.itinerary.length },
            (_, idx) => prev.itinerary.length + idx
          ),
        ]);
      }
      return {
        ...prev,
        duration_days: safeDays,
        duration_nights: Math.max(0, safeDays - 1),
        itinerary: currentList,
      };
    });
  };

  const handleSyncDaysWithDuration = () => {
    const targetDays = Math.max(1, Math.min(30, formData.duration_days || 1));
    setFormData((prev) => {
      const nextList: ItineraryDay[] = Array.from(
        { length: targetDays },
        (_, i) => {
          const existing = prev.itinerary[i];
          if (existing) {
            return { ...existing, day: i + 1 };
          }
          return {
            day: i + 1,
            title: `Day ${i + 1} Sightseeing & Experiences`,
            description: "",
            overnight: "",
            meals: "Breakfast",
            visit_points: [],
          };
        }
      );
      setExpandedDays(nextList.map((_, i) => i));
      return {
        ...prev,
        itinerary: nextList,
      };
    });
  };

  const handleAddDay = (insertAfterIndex?: number) => {
    setFormData((prev) => {
      const nextList = [...prev.itinerary];
      const newDayObj: ItineraryDay = {
        day: nextList.length + 1,
        title: `Day ${nextList.length + 1} Sightseeing & Activities`,
        description: "",
        overnight: "",
        meals: "Breakfast",
        visit_points: [],
      };

      let insertedIndex = nextList.length;
      if (
        typeof insertAfterIndex === "number" &&
        insertAfterIndex >= 0 &&
        insertAfterIndex < nextList.length
      ) {
        insertedIndex = insertAfterIndex + 1;
        nextList.splice(insertedIndex, 0, newDayObj);
      } else {
        nextList.push(newDayObj);
      }

      const renumbered = nextList.map((item, idx) => ({
        ...item,
        day: idx + 1,
      }));

      setExpandedDays((prevExp) =>
        prevExp.includes(insertedIndex)
          ? prevExp
          : [...prevExp, insertedIndex]
      );

      return {
        ...prev,
        itinerary: renumbered,
        duration_days: renumbered.length,
        duration_nights: Math.max(0, renumbered.length - 1),
      };
    });
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

  const handleMoveDay = (index: number, direction: "up" | "down") => {
    setFormData((prev) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.itinerary.length) return prev;
      const copy = [...prev.itinerary];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      const renumbered = copy.map((item, idx) => ({
        ...item,
        day: idx + 1,
      }));
      return { ...prev, itinerary: renumbered };
    });
  };

  const handleUpdateDay = <K extends keyof ItineraryDay>(
    index: number,
    field: K,
    value: ItineraryDay[K]
  ) => {
    setFormData((prev) => {
      const updated = [...prev.itinerary];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, itinerary: updated };
    });
  };

  const toggleDayExpand = (index: number) => {
    setExpandedDays((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
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
      itinerary: formData.itinerary.map((item, idx) => ({
        day: idx + 1,
        title: item.title.trim() || `Day ${idx + 1}`,
        description: item.description.trim(),
        overnight: item.overnight?.trim() || undefined,
        meals: item.meals?.trim() || undefined,
        visit_points:
          item.visit_points && item.visit_points.length > 0
            ? item.visit_points.map((v) => v.trim()).filter(Boolean)
            : undefined,
      })),
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
            Control packages, day-wise itineraries, pricing, durations, inclusions, and destination linkages.
          </p>
        </div>

        <button
          onClick={() => openCreateModal(false)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-yellow to-amber-500 hover:opacity-95 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
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
                <th className="py-4 px-6">Day-Wise Itinerary</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tours.map((tour) => {
                const dayCount = tour.itinerary?.length || 0;
                return (
                  <tr
                    key={tour.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
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
                      <span className="font-semibold text-slate-800">
                        {tour.duration_days}D / {tour.duration_nights}N
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <button
                        type="button"
                        onClick={() => openEditModal(tour, true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-colors cursor-pointer"
                        title="Click to edit Day-Wise Itinerary for this package"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>
                          {dayCount > 0
                            ? `${dayCount} Days Configured`
                            : "Add Day-Wise Plan"}
                        </span>
                      </button>
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
                          onClick={() => openEditModal(tour, false)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 cursor-pointer"
                          title="Edit Tour & Day-Wise Itinerary"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tour.id, tour.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 cursor-pointer"
                          title="Delete Tour"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 px-6 bg-slate-900 text-white flex items-center justify-between shrink-0 rounded-t-3xl">
              <div>
                <h3 className="text-lg font-bold">
                  {editingTour
                    ? "Edit Tour Package & Day-Wise Itinerary"
                    : "Create New Tour Package"}
                </h3>
                <p className="text-xs text-slate-400">
                  Configure package pricing, day-by-day itinerary schedule, overnight stays, meals, and inclusions
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Section Jump Bar */}
            <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => scrollToSection(overviewSectionRef)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200/80 transition-colors shrink-0 cursor-pointer"
              >
                1. Package Overview & Pricing
              </button>
              <button
                type="button"
                onClick={() => scrollToSection(itinerarySectionRef)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  2. Day-Wise Itinerary Builder ({formData.itinerary.length}{" "}
                  Days)
                </span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection(inclusionsSectionRef)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200/80 transition-colors shrink-0 cursor-pointer"
              >
                3. Highlights, Inclusions & Photos
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 overflow-hidden min-h-0"
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {error && (
                  <div className="p-3 text-xs bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                    {error}
                  </div>
                )}

                {/* SECTION 1: Package Overview & Pricing */}
                <div ref={overviewSectionRef} className="space-y-4">
                  <div className="border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      1. Package Overview, Duration & Pricing
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tour Package Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
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
                        onChange={(e) =>
                          setFormData({ ...formData, subtitle: e.target.value })
                        }
                        placeholder="e.g. Shikara rides, snow peaks of Gulmarg, and saffron gardens"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Map to Destination
                      </label>
                      <select
                        value={formData.destination_id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            destination_id: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tour_type: e.target.value,
                          })
                        }
                        placeholder="e.g. Private Guided Package"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Days * (Auto-adds itinerary days)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        required
                        value={formData.duration_days}
                        onChange={(e) =>
                          handleDurationDaysChange(Number(e.target.value))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            duration_nights: Number(e.target.value),
                          })
                        }
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: Number(e.target.value),
                          })
                        }
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            original_price: Number(e.target.value),
                          })
                        }
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
                      onChange={(e) =>
                        setFormData({ ...formData, overview: e.target.value })
                      }
                      placeholder="Describe the entire experience..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* SECTION 2: Day-by-Day Itinerary Builder */}
                <div
                  ref={itinerarySectionRef}
                  className="p-5 rounded-3xl bg-amber-50/40 border-2 border-amber-200/80 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/70 pb-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span>
                          2. Day-Wise Tour Itinerary Builder (
                          {formData.itinerary.length} Days)
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Add day-by-day titles, detailed schedules, overnight hotel/city, meals included, and sightseeing spots.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedDays(formData.itinerary.map((_, i) => i))
                        }
                        className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                      >
                        Expand All
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedDays([])}
                        className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                      >
                        Collapse All
                      </button>

                      {formData.itinerary.length !== formData.duration_days && (
                        <button
                          type="button"
                          onClick={handleSyncDaysWithDuration}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold text-cyan-900 bg-cyan-100 hover:bg-cyan-200 border border-cyan-300 transition-colors cursor-pointer"
                          title="Match number of itinerary days to package duration"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Sync to {formData.duration_days} Days</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleAddDay()}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Day {formData.itinerary.length + 1}</span>
                      </button>
                    </div>
                  </div>

                  {/* Day Cards List */}
                  <div className="space-y-3">
                    {formData.itinerary.map((item, index) => {
                      const isExpanded = expandedDays.includes(index);
                      return (
                        <div
                          key={index}
                          className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all"
                        >
                          {/* Day Header Bar */}
                          <div className="p-3 sm:px-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <span className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-slate-900 text-amber-400">
                                Day {String(item.day).padStart(2, "0")}
                              </span>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) =>
                                  handleUpdateDay(
                                    index,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder={`Day ${item.day} Title (e.g. Arrival in Srinagar & Shikara Ride)`}
                                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                              />
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveDay(index, "up")}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 disabled:opacity-30 cursor-pointer"
                                title="Move Day Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={
                                  index === formData.itinerary.length - 1
                                }
                                onClick={() => handleMoveDay(index, "down")}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 disabled:opacity-30 cursor-pointer"
                                title="Move Day Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleDayExpand(index)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 cursor-pointer"
                                title={
                                  isExpanded
                                    ? "Collapse Day Details"
                                    : "Expand Day Details"
                                }
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                              {formData.itinerary.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDay(index)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete Day"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Collapsed Summary Pills */}
                          {!isExpanded && (
                            <div
                              onClick={() => toggleDayExpand(index)}
                              className="px-4 py-2 text-[11px] text-slate-500 flex flex-wrap items-center gap-3 cursor-pointer hover:bg-amber-50/30"
                            >
                              <span className="truncate max-w-md">
                                {item.description ||
                                  "No description added yet — click to expand"}
                              </span>
                              {item.overnight && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-medium border border-amber-200/60">
                                  <BedDouble className="w-3 h-3 text-amber-600" />
                                  {item.overnight}
                                </span>
                              )}
                              {item.meals && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 font-medium border border-emerald-200/60">
                                  <Utensils className="w-3 h-3 text-emerald-600" />
                                  {item.meals}
                                </span>
                              )}
                              {item.visit_points &&
                                item.visit_points.length > 0 && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                                    <MapPin className="w-3 h-3 text-amber-600" />
                                    {item.visit_points.length} sightseeing spots
                                  </span>
                                )}
                            </div>
                          )}

                          {/* Expanded Day Fields */}
                          {isExpanded && (
                            <div className="p-4 space-y-3 bg-white">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  Day {item.day} Detailed Schedule & Activities
                                </label>
                                <textarea
                                  rows={3}
                                  value={item.description}
                                  onChange={(e) =>
                                    handleUpdateDay(
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Describe the day's schedule, transfers, sightseeing experiences, and evening leisure..."
                                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 leading-relaxed"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Overnight Stay & Meals */}
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                                      <BedDouble className="w-3.5 h-3.5 text-amber-600" />
                                      <span>
                                        Overnight Stay (City / Hotel / Resort)
                                      </span>
                                    </label>
                                    <input
                                      type="text"
                                      value={item.overnight || ""}
                                      onChange={(e) =>
                                        handleUpdateDay(
                                          index,
                                          "overnight",
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g. Srinagar Luxury Houseboat / Gulmarg"
                                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                                      <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Meals Included</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={item.meals || ""}
                                      onChange={(e) =>
                                        handleUpdateDay(
                                          index,
                                          "meals",
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g. Breakfast & Dinner"
                                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    />
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                      {MEAL_PRESETS.map((preset) => (
                                        <button
                                          key={preset}
                                          type="button"
                                          onClick={() =>
                                            handleUpdateDay(
                                              index,
                                              "meals",
                                              preset
                                            )
                                          }
                                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                                            item.meals === preset
                                              ? "bg-emerald-600 text-white"
                                              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                                          }`}
                                        >
                                          {preset}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Key Sightseeing / Visit Points */}
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                                    <span>
                                      Key Sightseeing / Attractions (One per
                                      line)
                                    </span>
                                  </label>
                                  <textarea
                                    rows={4}
                                    value={(item.visit_points || []).join("\n")}
                                    onChange={(e) =>
                                      handleUpdateDay(
                                        index,
                                        "visit_points",
                                        e.target.value.split("\n")
                                      )
                                    }
                                    placeholder={
                                      "Dal Lake Shikara Ride\nMughal Gardens (Nishat & Shalimar)\nPari Mahal Viewpoint"
                                    }
                                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleAddDay(index)}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Insert New Day Below Day {item.day}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Add Day Button */}
                  <button
                    type="button"
                    onClick={() => handleAddDay()}
                    className="w-full py-3 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-400 bg-white/80 hover:bg-amber-50 text-xs font-bold text-amber-900 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-amber-600" />
                    <span>
                      + Add Day {formData.itinerary.length + 1} to Package
                      Itinerary
                    </span>
                  </button>
                </div>

                {/* SECTION 3: Highlights, Inclusions & Photos */}
                <div ref={inclusionsSectionRef} className="space-y-4">
                  <div className="border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      3. Package Highlights, Inclusions, Exclusions & Gallery
                    </h4>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Trip Highlights (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.highlightsText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          highlightsText: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Inclusions (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.inclusionsText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            inclusionsText: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Exclusions (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.exclusionsText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            exclusionsText: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Image URLs (One per line, e.g. Unsplash or R2)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.imagesText}
                      onChange={(e) =>
                        setFormData({ ...formData, imagesText: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                    />
                    <label
                      htmlFor="featured"
                      className="text-xs font-bold text-slate-800"
                    >
                      Feature this tour on Home Page showcase
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-4 px-6 border-t border-slate-100 bg-white/95 backdrop-blur-xs flex items-center justify-between gap-3 shrink-0 rounded-b-3xl shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
                <div className="text-xs text-slate-500 font-medium">
                  <span className="font-bold text-slate-800">
                    {formData.itinerary.length} Days
                  </span>{" "}
                  configured in Day-Wise Itinerary
                </div>
                <div className="flex items-center gap-3">
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
                    {loading
                      ? "Saving..."
                      : editingTour
                        ? "Update Tour & Itinerary"
                        : "Create Tour Package"}
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
