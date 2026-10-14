import { reviewService } from "@/modules/reviews/service/review.service";
import AdminReviewsManager from "@/modules/reviews/components/AdminReviewsManager";

export const revalidate = 0;

export default async function AdminReviewsPage() {
  const reviews = await reviewService.getAllReviews();
  return <AdminReviewsManager initialReviews={reviews} />;
}
