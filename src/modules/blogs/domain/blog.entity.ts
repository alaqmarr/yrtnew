export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  read_time: string;
  tags: string[];
  published_at: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogDto {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author?: string;
  read_time?: string;
  tags?: string[];
  is_featured?: boolean;
}

export interface UpdateBlogDto extends Partial<CreateBlogDto> {
  id: string;
}
