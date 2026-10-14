import { blogService } from "@/modules/blogs/service/blog.service";
import AdminBlogsManager from "@/modules/blogs/components/AdminBlogsManager";

export const revalidate = 0;

export default async function AdminBlogsPage() {
  const blogs = await blogService.getAllBlogs();
  return <AdminBlogsManager initialBlogs={blogs} />;
}
