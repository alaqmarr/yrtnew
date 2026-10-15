export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  overnight?: string;
  meals?: string;
  visit_points?: string[];
}

export interface Tour {
  id: string;
  destination_id: string | null;
  destination_name?: string;
  slug: string;
  title: string;
  subtitle: string | null;
  duration_days: number;
  duration_nights: number;
  price: number;
  original_price: number | null;
  featured: boolean;
  category: string;
  tour_type: string;
  overview: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  images: string[];
  departure_dates: string[];
  rating: number;
  review_count: number;
  max_group_size: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTourDto {
  destination_id?: string | null;
  slug: string;
  title: string;
  subtitle?: string;
  duration_days: number;
  duration_nights: number;
  price: number;
  original_price?: number;
  featured?: boolean;
  category?: string;
  tour_type?: string;
  overview: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  images: string[];
  departure_dates?: string[];
  rating?: number;
  review_count?: number;
  max_group_size?: number;
}

export interface UpdateTourDto extends Partial<CreateTourDto> {
  id: string;
}

export interface TourFilterOptions {
  destinationId?: string;
  destinationSlug?: string;
  category?: string;
  featuredOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}
