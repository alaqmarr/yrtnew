import { blogRepository } from "../repository/blog.repository";
import { Blog, CreateBlogDto, UpdateBlogDto } from "../domain/blog.entity";

export class BlogService {
  async getAllBlogs(options?: { featuredOnly?: boolean; tag?: string }): Promise<Blog[]> {
    return blogRepository.findAll(options);
  }

  async getFeaturedBlogs(): Promise<Blog[]> {
    return blogRepository.findAll({ featuredOnly: true });
  }

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    return blogRepository.findBySlug(slug);
  }

  async getBlogById(id: string): Promise<Blog | null> {
    return blogRepository.findById(id);
  }

  async createBlog(data: CreateBlogDto): Promise<Blog> {
    const slug = data.slug
      ? data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-")
      : data.title.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");

    return blogRepository.create({ ...data, slug });
  }

  async updateBlog(data: UpdateBlogDto): Promise<Blog> {
    return blogRepository.update(data);
  }

  async deleteBlog(id: string): Promise<boolean> {
    return blogRepository.delete(id);
  }
}

export const blogService = new BlogService();
