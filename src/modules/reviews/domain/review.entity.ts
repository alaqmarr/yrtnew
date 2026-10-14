export interface Review {
  id: string;
  author_name: string;
  author_avatar: string | null;
  rating: number;
  review_date: string;
  comment: string;
  source: "Google" | "Direct";
  verified: boolean;
  is_published: boolean;
  trip_type: string | null;
  helpful_count: number;
  created_at: string;
}

export interface CreateReviewDto {
  author_name: string;
  author_avatar?: string | null;
  rating: number;
  comment: string;
  trip_type?: string | null;
  source?: "Google" | "Direct";
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
