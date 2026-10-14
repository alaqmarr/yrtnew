export interface GalleryItem {
  id: string;
  title: string;
  url: string;
  r2_key: string | null;
  category: "Destinations" | "Tours" | "Hotels & Stays" | "Travelers" | "Flights" | "General";
  caption: string | null;
  tags: string[];
  is_featured: boolean;
  created_at: string;
}

export interface CreateGalleryItemDto {
  title: string;
  url: string;
  r2_key?: string | null;
  category?: GalleryItem["category"];
  caption?: string | null;
  tags?: string[];
  is_featured?: boolean;
}
