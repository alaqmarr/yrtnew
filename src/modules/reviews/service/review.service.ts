import { reviewRepository } from "../repository/review.repository";
import { Review, CreateReviewDto, ReviewStats } from "../domain/review.entity";

export class ReviewService {
  async getPublishedReviews(minRating?: number): Promise<Review[]> {
    return reviewRepository.findAll({ publishedOnly: true, minRating });
  }

  async getAllReviews(): Promise<Review[]> {
    return reviewRepository.findAll();
  }

  async getReviewStats(): Promise<ReviewStats> {
    return reviewRepository.getStats();
  }

  async submitReview(data: CreateReviewDto): Promise<Review> {
    if (!data.author_name || !data.comment) {
      throw new Error("Author name and comment are required");
    }
    if (data.rating < 1 || data.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    return reviewRepository.create(data);
  }

  async togglePublish(id: string, isPublished: boolean): Promise<Review> {
    return reviewRepository.togglePublish(id, isPublished);
  }

  async deleteReview(id: string): Promise<boolean> {
    return reviewRepository.delete(id);
  }

  /**
   * Sync reviews from Google Places API if credentials are provided
   */
  async syncGoogleReviews(): Promise<{ synced: number; message: string }> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      return { synced: 0, message: "Google Places API key or Place ID not configured in environment" };
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.result?.reviews) {
        const existingReviews = await reviewRepository.findAll();
        let count = 0;
        for (const gr of data.result.reviews) {
          if (!gr.text || !gr.author_name) continue;
          const isDuplicate = existingReviews.some(
            (r) =>
              r.source === "Google" &&
              r.author_name.toLowerCase() === gr.author_name.toLowerCase() &&
              r.comment.trim() === gr.text.trim()
          );
          if (isDuplicate) continue;

          await reviewRepository.create({
            author_name: gr.author_name,
            author_avatar: gr.profile_photo_url,
            rating: gr.rating,
            comment: gr.text,
            source: "Google",
            trip_type: "Google Verified Traveler",
          });
          count++;
        }
        return {
          synced: count,
          message:
            count > 0
              ? `Successfully synced ${count} new reviews from Google Places`
              : "All Google Places reviews are already synced and up to date.",
        };
      }
      return { synced: 0, message: "No new reviews returned from Google Places API" };
    } catch (err) {
      return { synced: 0, message: `Failed to fetch from Google Places: ${(err as Error).message}` };
    }
  }
}

export const reviewService = new ReviewService();
