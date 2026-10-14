export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: string;
  tagline: string | null;
  description: string;
  hero_image: string;
  is_domestic: boolean;
  is_featured: boolean;
  top_attractions: string[];
  best_time_to_visit: string | null;
  weather_info: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDestinationDto {
  slug: string;
  name: string;
  country: string;
  region: string;
  tagline?: string;
  description: string;
  hero_image: string;
  is_domestic: boolean;
  is_featured: boolean;
  top_attractions: string[];
  best_time_to_visit?: string;
  weather_info?: string;
}

export interface UpdateDestinationDto extends Partial<CreateDestinationDto> {
  id: string;
}
