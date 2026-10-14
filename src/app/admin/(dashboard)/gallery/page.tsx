import { galleryService } from "@/modules/gallery/service/gallery.service";
import AdminGalleryManager from "@/modules/gallery/components/AdminGalleryManager";

export const revalidate = 0;

export default async function AdminGalleryPage() {
  const items = await galleryService.getGallery();
  return <AdminGalleryManager initialItems={items} />;
}
