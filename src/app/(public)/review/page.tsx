import { reviewService } from "@/modules/reviews/service/review.service";
import ReviewList from "@/modules/reviews/components/ReviewList";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { Star, ShieldCheck, CheckCircle } from "lucide-react";

export const revalidate = 30; // 30s ISR so new reviews show promptly

export const metadata = {
  title: "Google Traveler Reviews & Testimonials | Yellow Ribbon Travels",
  description:
    "Read 480+ authentic traveler reviews for Yellow Ribbon Travels with a verified 4.9/5 star Google rating. Submit your own vacation review.",
};

export default async function ReviewsPage() {
  const [reviews, stats] = await Promise.all([
    reviewService.getPublishedReviews(),
    reviewService.getReviewStats(),
  ]);

  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-8 sm:space-y-12">
      <Breadcrumbs items={[{ label: "Traveler Reviews" }]} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Google Verified Reviews
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          What Travelers Say About Us
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Real feedback from travelers who explored Kashmir, Bali, Dubai, Kerala, Vietnam, and Switzerland with Yellow Ribbon Travels.
        </p>
      </div>

      {/* Interactive Review List and Google Card */}
      <ReviewList initialReviews={reviews} stats={stats} />
    </div>
  );
}
