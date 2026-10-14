import { galleryService } from "@/modules/gallery/service/gallery.service";
import GalleryView from "@/modules/gallery/components/GalleryView";
import Breadcrumbs from "@/shared/components/Breadcrumbs";
import { Camera, Sparkles } from "lucide-react";

export const revalidate = 30; // 30s ISR so new R2 admin uploads reflect promptly

export const metadata = {
  title: "Travel Gallery & Moments | Yellow Ribbon Travels",
  description:
    "Browse real photos and breathtaking destination captures from our travelers and guided tours across the world.",
};

export default async function GalleryPage() {
  const items = await galleryService.getGallery();

  return (
    <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-12 space-y-8 sm:space-y-12">
      <Breadcrumbs items={[{ label: "Photo Gallery" }]} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
          <Camera className="w-3.5 h-3.5" /> Visual Wanderlust
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Capturing Moments Across The World
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Explore authentic vacation snapshots, luxury resorts, mountain peaks, and smiling travelers on Yellow Ribbon journeys.
        </p>
      </div>

      {/* Gallery View Component */}
      <GalleryView initialItems={items} />
    </div>
  );
}
