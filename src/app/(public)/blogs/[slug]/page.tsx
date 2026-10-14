import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { blogService } from "@/modules/blogs/service/blog.service";
import { Calendar, Clock, User, ChevronRight, ArrowLeft, Tag, Share2, Sparkles } from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import Breadcrumbs from "@/shared/components/Breadcrumbs";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const blog = await blogService.getBlogBySlug(slug);
  if (!blog) return { title: "Blog Not Found" };

  return {
    title: `${blog.title} | Yellow Ribbon Travels`,
    description: blog.excerpt,
    alternates: {
      canonical: `/blogs/${blog.slug || slug}`,
    },
    openGraph: {
      title: `${blog.title} | Yellow Ribbon Travels`,
      description: blog.excerpt,
      images: blog.cover_image ? [{ url: blog.cover_image }] : [],
      type: "article",
      publishedTime: blog.published_at || blog.created_at,
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await blogService.getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": blog.cover_image ? [blog.cover_image] : undefined,
    "datePublished": blog.published_at || blog.created_at,
    "dateModified": blog.updated_at || blog.created_at,
    "author": {
      "@type": "Person",
      "name": blog.author || "Yellow Ribbon Travels",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Yellow Ribbon Travels",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yellowribbontravels.com/logo.png",
      },
    },
  };

  return (
    <article className="w-full max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Breadcrumbs with Schema */}
      <Breadcrumbs
        items={[
          { label: "Travel Guides", href: "/blogs" },
          { label: blog.title },
        ]}
      />

      {/* Header */}
      <div className="space-y-4">
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-y border-slate-100 py-3">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <User className="w-4 h-4 text-slate-400" />
            {blog.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            {new Date(blog.published_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            {blog.read_time}
          </span>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-card bg-slate-100">
        <Image
          src={blog.cover_image}
          alt={blog.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="prose prose-slate max-w-none space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
        {blog.content}
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-brand-yellow via-amber-500 to-brand-coral rounded-3xl p-8 text-white space-y-4 shadow-xl">
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Inspired to Experience This in Person?
        </h3>
        <p className="text-xs sm:text-sm text-yellow-100 leading-relaxed max-w-xl">
          Let our travel architects design an unforgettable vacation package tailored specifically for your group, travel dates, and budget.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/tours"
            className="px-6 py-3 rounded-full text-xs font-bold bg-white text-slate-900 hover:bg-yellow-50 shadow-md transition-colors"
          >
            Explore Related Tours
          </Link>
          <a
            href="https://wa.me/919100228152?text=Hi%20Yellow%20Ribbon%20Travels,%20I%20read%20your%20travel%20guide%20and%20want%20to%20plan%20a%20trip!"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md transition-transform hover:scale-105 flex items-center gap-2"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
          </a>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-full text-xs font-bold bg-black/20 hover:bg-black/30 text-white border border-white/30 transition-colors"
          >
            Talk to a Specialist
          </Link>
        </div>
      </div>
    </article>
  );
}
