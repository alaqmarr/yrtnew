import { galleryRepository } from "../repository/gallery.repository";
import { GalleryItem, CreateGalleryItemDto } from "../domain/gallery.entity";
import { deleteMedia } from "@/infrastructure/storage/r2";

export class GalleryService {
  async getGallery(category?: string): Promise<GalleryItem[]> {
    return galleryRepository.findAll(category);
  }

  async getFeaturedMedia(): Promise<GalleryItem[]> {
    const all = await galleryRepository.findAll();
    return all.filter((i) => i.is_featured);
  }

  async addItem(data: CreateGalleryItemDto): Promise<GalleryItem> {
    return galleryRepository.create(data);
  }

  async removeItem(id: string): Promise<boolean> {
    const item = await galleryRepository.findById(id);
    if (item && item.r2_key) {
      await deleteMedia(item.r2_key, item.url.startsWith("/uploads") ? "local" : "r2");
    }
    return galleryRepository.delete(id);
  }
}

export const galleryService = new GalleryService();
