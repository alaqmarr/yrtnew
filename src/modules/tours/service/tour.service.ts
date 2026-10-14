import { tourRepository } from "../repository/tour.repository";
import { Tour, CreateTourDto, UpdateTourDto, TourFilterOptions } from "../domain/tour.entity";

export class TourService {
  async getAllTours(options?: TourFilterOptions): Promise<Tour[]> {
    return tourRepository.findAll(options);
  }

  async getFeaturedTours(limit = 6): Promise<Tour[]> {
    return tourRepository.findFeatured(limit);
  }

  async getTourById(id: string): Promise<Tour | null> {
    return tourRepository.findById(id);
  }

  async getTourBySlug(slug: string): Promise<Tour | null> {
    return tourRepository.findBySlug(slug);
  }

  async getToursByDestination(destinationId: string): Promise<Tour[]> {
    return tourRepository.findByDestinationId(destinationId);
  }

  async createTour(data: CreateTourDto): Promise<Tour> {
    const slug = data.slug
      ? data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-")
      : data.title.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");

    return tourRepository.create({ ...data, slug });
  }

  async updateTour(data: UpdateTourDto): Promise<Tour> {
    return tourRepository.update(data);
  }

  async deleteTour(id: string): Promise<boolean> {
    return tourRepository.delete(id);
  }
}

export const tourService = new TourService();
