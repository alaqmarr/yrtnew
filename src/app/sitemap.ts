import type { MetadataRoute } from "next";
import { tourService } from "@/modules/tours/service/tour.service";
import { destinationService } from "@/modules/destinations/service/destination.service";
import { blogService } from "@/modules/blogs/service/blog.service";

export const revalidate = 3600; // Revalidate sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yellowribbontravels.com";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/flight-bookings`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pay`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/branches`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/review`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/our-story`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic tours
  let tourRoutes: MetadataRoute.Sitemap = [];
  try {
    const tours = await tourService.getAllTours();
    tourRoutes = tours.map((tour) => ({
      url: `${baseUrl}/tours/${tour.slug || tour.id}`,
      lastModified: tour.updated_at ? new Date(tour.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));
  } catch (err) {
    console.error("Error generating tour sitemap routes:", err);
  }

  // Dynamic destinations
  let destinationRoutes: MetadataRoute.Sitemap = [];
  try {
    const destinations = await destinationService.getAllDestinations();
    destinationRoutes = destinations.map((dest) => ({
      url: `${baseUrl}/destinations/${dest.slug || dest.id}`,
      lastModified: dest.updated_at ? new Date(dest.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));
  } catch (err) {
    console.error("Error generating destination sitemap routes:", err);
  }

  // Dynamic blogs
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await blogService.getAllBlogs();
    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug || blog.id}`,
      lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    }));
  } catch (err) {
    console.error("Error generating blog sitemap routes:", err);
  }

  return [...staticRoutes, ...tourRoutes, ...destinationRoutes, ...blogRoutes];
}
