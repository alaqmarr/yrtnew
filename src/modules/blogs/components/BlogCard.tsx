import Link from "next/link";
import Image from "next/image";
import { Blog } from "../domain/blog.entity";
import { Clock, Calendar, ArrowRight } from "lucide-react";

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col h-full">
      <Link href={`/blogs/${blog.slug}`} className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Image
          src={blog.cover_image}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {blog.tags && blog.tags.length > 0 && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-slate-800 backdrop-blur-md shadow-sm">
              {blog.tags[0]}
            </span>
          </div>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(blog.published_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {blog.read_time}
          </span>
        </div>

        <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-2 leading-snug">
          <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
        </h3>

        <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {blog.excerpt}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500">By {blog.author}</span>
          <Link
            href={`/blogs/${blog.slug}`}
            className="inline-flex items-center gap-1 font-bold text-amber-600 group-hover:text-amber-700"
          >
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
