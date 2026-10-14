"use client";

import { useState } from "react";
import Image from "next/image";
import { Review, ReviewStats } from "../domain/review.entity";
import WriteReviewModal from "./WriteReviewModal";
import { Star, CheckCircle, ThumbsUp, PenLine, Sparkles } from "lucide-react";

interface ReviewListProps {
  initialReviews: Review[];
  stats: ReviewStats;
}

export default function ReviewList({ initialReviews, stats }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  const reloadReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-10">
      {/* Top Google Score Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Big Score Block */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 mb-2">
              <CheckCircle className="w-3.5 h-3.5" /> 100% Verified Google Reviews
            </div>

            <div className="flex items-baseline gap-3 my-1">
              <span className="text-5xl font-black text-slate-900 tracking-tight">
                {stats.averageRating}
              </span>
              <span className="text-xl font-bold text-slate-400">/ 5.0</span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Based on <strong>480+ authentic traveler experiences</strong> across India & worldwide.
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-brand-yellow via-amber-500 to-brand-coral hover:opacity-95 shadow-md shadow-amber-500/20 transition-all"
            >
              <PenLine className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Rating Breakdown Bar Chart */}
          <div className="lg:col-span-8 space-y-2.5">
            {[5, 4, 3, 2, 1].map((ratingVal) => {
              const count = stats.ratingDistribution[ratingVal as keyof typeof stats.ratingDistribution] || 0;
              const percentage = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : ratingVal === 5 ? 95 : 5;

              return (
                <div key={ratingVal} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-16 shrink-0 font-semibold text-slate-700">
                    <span>{ratingVal}</span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>

                  <div className="flex-grow h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ratingVal >= 4 ? "bg-amber-400" : "bg-slate-300"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-12 text-right font-medium text-slate-500 shrink-0">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterRating(null)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              filterRating === null
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setFilterRating(5)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ${
              filterRating === 5
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>5 Stars</span>
          </button>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
        >
          <PenLine className="w-3.5 h-3.5" />
          <span>Leave Feedback</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 w-full">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-card-hover border border-slate-200/80 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-100 shrink-0 relative">
                    {review.author_avatar ? (
                      <Image
                        src={review.author_avatar}
                        alt={review.author_name}
                        fill
                        sizes="40px"
                        loading="lazy"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-amber-700 text-sm">
                        {review.author_name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">
                      {review.author_name}
                    </h4>
                    {review.trip_type && (
                      <span className="text-[11px] font-medium text-slate-400">
                        {review.trip_type}
                      </span>
                    )}
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/50">
                  <span className="font-bold">G</span> {review.source}
                </span>
              </div>

              {/* Stars & Date */}
              <div className="flex items-center justify-between my-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <Star
                      key={st}
                      className={`w-4 h-4 ${
                        st <= review.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400">{review.review_date}</span>
              </div>

              {/* Comment */}
              <p className="text-xs text-slate-600 leading-relaxed mt-3">
                "{review.comment}"
              </p>
            </div>

            {/* Bottom verified badge */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-600 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Verified Traveler
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" /> Helpful
              </span>
            </div>
          </div>
        ))}
      </div>

      <WriteReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitted={reloadReviews}
      />
    </div>
  );
}
