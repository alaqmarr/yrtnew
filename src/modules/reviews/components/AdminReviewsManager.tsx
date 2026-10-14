"use client";

import { useState } from "react";
import { Review } from "../domain/review.entity";
import { Star, RefreshCw, Trash2, Eye, EyeOff, CheckCircle2 } from "lucide-react";

interface AdminReviewsManagerProps {
  initialReviews: Review[];
}

export default function AdminReviewsManager({ initialReviews }: AdminReviewsManagerProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const reloadReviews = async () => {
    const res = await fetch("/api/reviews?all=true");
    const data = await res.json();
    if (Array.isArray(data)) {
      setReviews(data);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await reloadReviews();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleSyncGoogle = async () => {
    setSyncing(true);
    setSyncMessage("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync-google" }),
      });
      const data = await res.json();
      setSyncMessage(data.message || "Google Places sync completed");
      await reloadReviews();
    } catch (err) {
      setSyncMessage(`Sync failed: ${(err as Error).message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Google Reviews & Traveler Testimonials
          </h1>
          <p className="text-xs text-slate-500">
            Moderate submitted reviews, toggle publication, and synchronize directly with Google Places API.
          </p>
        </div>

        <button
          onClick={handleSyncGoogle}
          disabled={syncing}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
          <span>{syncing ? "Connecting to Google..." : "Sync with Google Reviews"}</span>
        </button>
      </div>

      {syncMessage && (
        <div className="p-3 text-xs bg-blue-50 text-blue-800 rounded-xl border border-blue-200">
          {syncMessage}
        </div>
      )}

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">Traveler</th>
                <th className="py-4 px-6">Rating</th>
                <th className="py-4 px-6">Review Content</th>
                <th className="py-4 px-6">Source</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    <div>{r.author_name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{r.trip_type || r.review_date}</div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <span>{r.rating}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                  </td>

                  <td className="py-4 px-6 max-w-sm">
                    <p className="line-clamp-2 text-slate-600">"{r.comment}"</p>
                  </td>

                  <td className="py-4 px-6">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {r.source}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    {r.is_published ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Published
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        Hidden
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleTogglePublish(r.id, r.is_published)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100"
                        title={r.is_published ? "Hide Review" : "Publish Review"}
                      >
                        {r.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                        title="Delete Review"
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
    </div>
  );
}
