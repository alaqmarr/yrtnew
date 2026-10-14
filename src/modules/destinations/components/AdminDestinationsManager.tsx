"use client";

import { useState } from "react";
import Image from "next/image";
import { Destination } from "../domain/destination.entity";
import { Plus, Pencil, Trash2, MapPin, X, ExternalLink } from "lucide-react";

interface AdminDestinationsManagerProps {
  initialDestinations: Destination[];
}

export default function AdminDestinationsManager({
  initialDestinations,
}: AdminDestinationsManagerProps) {
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    country: "India",
    region: "North India",
    tagline: "",
    description: "",
    hero_image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
    is_domestic: true,
    is_featured: false,
    topAttractionsText: "Scenic Lakes\nLocal Heritage\nCultural Walks",
    best_time_to_visit: "October to March",
    weather_info: "Pleasant 15°C to 25°C",
  });

  const openCreateModal = () => {
    setEditingDest(null);
    setFormData({
      name: "",
      country: "India",
      region: "North India",
      tagline: "",
      description: "",
      hero_image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
      is_domestic: true,
      is_featured: false,
      topAttractionsText: "Scenic Lakes\nLocal Heritage\nCultural Walks",
      best_time_to_visit: "October to March",
      weather_info: "Pleasant 15°C to 25°C",
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (dest: Destination) => {
    setEditingDest(dest);
    setFormData({
      name: dest.name,
      country: dest.country,
      region: dest.region,
      tagline: dest.tagline || "",
      description: dest.description,
      hero_image: dest.hero_image,
      is_domestic: dest.is_domestic,
      is_featured: dest.is_featured,
      topAttractionsText: dest.top_attractions.join("\n"),
      best_time_to_visit: dest.best_time_to_visit || "",
      weather_info: dest.weather_info || "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const reloadDestinations = async () => {
    const res = await fetch("/api/destinations");
    const data = await res.json();
    setDestinations(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: formData.name,
      country: formData.country,
      region: formData.region,
      tagline: formData.tagline || null,
      description: formData.description,
      hero_image: formData.hero_image,
      is_domestic: formData.is_domestic,
      is_featured: formData.is_featured,
      top_attractions: formData.topAttractionsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      best_time_to_visit: formData.best_time_to_visit || null,
      weather_info: formData.weather_info || null,
    };

    try {
      const url = editingDest ? `/api/destinations/${editingDest.id}` : "/api/destinations";
      const method = editingDest ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Operation failed");
      }

      await reloadDestinations();
      setIsModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete destination "${name}"? Any mapped tours will be unlinked.`)) return;

    try {
      const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete destination");
      await reloadDestinations();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Destinations Management
          </h1>
          <p className="text-xs text-slate-500">
            Create and maintain destination showcases, best seasons, and weather guidelines.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-cyan to-blue-600 hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Destination</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">Destination</th>
                <th className="py-4 px-6">Country / Region</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Best Season</th>
                <th className="py-4 px-6">Featured</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {destinations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <Image
                          src={d.hero_image}
                          alt={d.name}
                          fill
                          sizes="48px"
                          loading="lazy"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{d.name}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">
                          {d.tagline || d.description.slice(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-medium text-slate-700">
                    {d.country} • {d.region}
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        d.is_domestic
                          ? "bg-amber-100 text-amber-800"
                          : "bg-cyan-100 text-cyan-800"
                      }`}
                    >
                      {d.is_domestic ? "Domestic" : "International"}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-slate-600">{d.best_time_to_visit || "—"}</td>

                  <td className="py-4 px-6">
                    {d.is_featured ? (
                      <span className="text-emerald-600 font-bold text-[11px]">Yes</span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">No</span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/destinations/${d.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-slate-100"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => openEditModal(d)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100"
                        title="Edit Destination"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(d.id, d.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                        title="Delete Destination"
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

      {/* Destination Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 px-6 bg-slate-900 text-white flex items-center justify-between shrink-0 rounded-t-3xl">
              <div>
                <h3 className="text-lg font-bold">
                  {editingDest ? "Edit Destination" : "Create New Destination"}
                </h3>
                <p className="text-xs text-slate-400">Manage destination details</p>
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
                  Destination Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kashmir, India or Bali, Indonesia"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Region *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Paradise on Earth with snow-capped peaks"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hero Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.hero_image}
                  onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Top Attractions (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.topAttractionsText}
                  onChange={(e) => setFormData({ ...formData, topAttractionsText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Best Time to Visit
                  </label>
                  <input
                    type="text"
                    value={formData.best_time_to_visit}
                    onChange={(e) => setFormData({ ...formData, best_time_to_visit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Weather Info
                  </label>
                  <input
                    type="text"
                    value={formData.weather_info}
                    onChange={(e) => setFormData({ ...formData, weather_info: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_domestic"
                    checked={formData.is_domestic}
                    onChange={(e) => setFormData({ ...formData, is_domestic: e.target.checked })}
                    className="w-4 h-4 text-cyan-600 rounded"
                  />
                  <label htmlFor="is_domestic" className="text-xs font-semibold text-slate-700">
                    Domestic India Destination
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-cyan-600 rounded"
                  />
                  <label htmlFor="is_featured" className="text-xs font-semibold text-slate-700">
                    Feature on Home Page
                  </label>
                </div>
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
                {loading ? "Saving..." : editingDest ? "Update Destination" : "Create Destination"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  );
}
