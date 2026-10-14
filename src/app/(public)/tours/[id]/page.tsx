import { notFound } from "next/navigation";
import { tourService } from "@/modules/tours/service/tour.service";
import TourDetailClient from "@/modules/tours/components/TourDetailClient";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  // Try ID first, then slug
  const tour =
    (await tourService.getTourById(id)) ||
    (await tourService.getTourBySlug(id));

  if (!tour) return { title: "Tour Not Found" };

  return {
    title: `${tour.title} | Yellow Ribbon Travels`,
    description: tour.overview.slice(0, 160),
  };
}

export default async function TourDetailPage({ params }: PageProps) {
  const { id } = await params;
  const tour =
    (await tourService.getTourById(id)) ||
    (await tourService.getTourBySlug(id));

  if (!tour) {
    notFound();
  }

  return <TourDetailClient tour={tour} />;
}
