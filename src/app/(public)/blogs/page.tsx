import { blogService } from "@/modules/blogs/service/blog.service";
import BlogCard from "@/modules/blogs/components/BlogCard";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { BookOpen } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Travel Guides, Visa Tips & Insights | Yellow Ribbon Travels",
  description:
    "Expert travel advice, visa instructions, destination comparisons, and packing guides from the Yellow Ribbon Travels editorial team.",
};

interface BlogsPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const { tag } = await searchParams;
  const blogs = await blogService.getAllBlogs({ tag });

  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-8 sm:space-y-12">
      <Breadcrumbs items={[{ label: "Travel Guides & Blogs" }]} />
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-200">
          <BookOpen className="w-3.5 h-3.5" /> Travel Guides & Journal
        </div>
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-950 tracking-tight">
          Inspiration for Your Next Adventure
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Read insider tips, visa regulations, packing lists, and hidden gems curated by our experienced travel architects.
        </p>
      </div>

      {/* Blogs Grid */}
      {blogs.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 max-w-md mx-auto">
          No articles found for this topic.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 w-full">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
