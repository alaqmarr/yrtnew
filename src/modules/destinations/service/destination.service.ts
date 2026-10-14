import { destinationRepository } from "../repository/destination.repository";
import { Destination, CreateDestinationDto, UpdateDestinationDto } from "../domain/destination.entity";

export class DestinationService {
  async getAllDestinations(options?: { domesticOnly?: boolean; internationalOnly?: boolean; featuredOnly?: boolean }): Promise<Destination[]> {
    return destinationRepository.findAll(options);
  }

  async getFeaturedDestinations(): Promise<Destination[]> {
    return destinationRepository.findAll({ featuredOnly: true });
  }

  async getDestinationBySlug(slug: string): Promise<Destination | null> {
    return destinationRepository.findBySlug(slug);
  }

  async getDestinationById(id: string): Promise<Destination | null> {
    return destinationRepository.findById(id);
  }

  async createDestination(data: CreateDestinationDto): Promise<Destination> {
    // Generate clean slug if not given
    const slug = data.slug
      ? data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-")
      : data.name.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");

    return destinationRepository.create({ ...data, slug });
  }

  async updateDestination(data: UpdateDestinationDto): Promise<Destination> {
    return destinationRepository.update(data);
  }

  async deleteDestination(id: string): Promise<boolean> {
    return destinationRepository.delete(id);
  }
}

export const destinationService = new DestinationService();
