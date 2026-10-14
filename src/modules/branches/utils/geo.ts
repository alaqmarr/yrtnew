/**
 * Geolocation & Distance Calculation Utilities for Yellow Ribbon Travels Branches
 */

import { Branch } from "../domain/branch.entity";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface UserLocation {
  coords: Coordinates;
  city?: string;
  source: "gps" | "manual";
  timestamp: number;
}

export interface BranchWithDistance extends Branch {
  distanceKm: number;
  distanceFormatted: string;
  estimatedDriveTime?: string;
  isClosest?: boolean;
}

// Known exact coordinates for all Yellow Ribbon Travels branch locations
export const BRANCH_COORDINATES: Record<string, Coordinates> = {
  // By Branch ID
  br_secunderabad: { lat: 17.4399, lng: 78.4983 },
  br_chennai: { lat: 13.0604, lng: 80.2496 },
  br_pune: { lat: 18.5679, lng: 73.9143 },
  br_dahod: { lat: 22.8376, lng: 74.2546 },
  br_patna: { lat: 25.6093, lng: 85.1376 },
  br_dubai: { lat: 25.2048, lng: 55.2708 },
  br_london: { lat: 51.5144, lng: -0.0803 },
  br_singapore: { lat: 1.2798, lng: 103.8546 },

  // Fallbacks by City Name (normalized lowercase)
  secunderabad: { lat: 17.4399, lng: 78.4983 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  chennai: { lat: 13.0604, lng: 80.2496 },
  pune: { lat: 18.5679, lng: 73.9143 },
  dahod: { lat: 22.8376, lng: 74.2546 },
  patna: { lat: 25.6093, lng: 85.1376 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  london: { lat: 51.5144, lng: -0.0803 },
  singapore: { lat: 1.2798, lng: 103.8546 },
};

// Popular reference cities for instant manual selection if GPS is denied or unavailable
export const POPULAR_USER_CITIES: Array<{ label: string; coords: Coordinates; country: string }> = [
  { label: "Hyderabad / Secunderabad", coords: { lat: 17.4399, lng: 78.4983 }, country: "India" },
  { label: "Chennai", coords: { lat: 13.0604, lng: 80.2496 }, country: "India" },
  { label: "Pune", coords: { lat: 18.5679, lng: 73.9143 }, country: "India" },
  { label: "Mumbai", coords: { lat: 19.076, lng: 72.8777 }, country: "India" },
  { label: "Bengaluru", coords: { lat: 12.9716, lng: 77.5946 }, country: "India" },
  { label: "Delhi / NCR", coords: { lat: 28.6139, lng: 77.209 }, country: "India" },
  { label: "Ahmedabad", coords: { lat: 23.0225, lng: 72.5714 }, country: "India" },
  { label: "Dahod", coords: { lat: 22.8376, lng: 74.2546 }, country: "India" },
  { label: "Vadodara", coords: { lat: 22.3072, lng: 73.1812 }, country: "India" },
  { label: "Surat", coords: { lat: 21.1702, lng: 72.8311 }, country: "India" },
  { label: "Patna", coords: { lat: 25.6093, lng: 85.1376 }, country: "India" },
  { label: "Kolkata", coords: { lat: 22.5726, lng: 88.3639 }, country: "India" },
  { label: "Lucknow", coords: { lat: 26.8467, lng: 80.9462 }, country: "India" },
  { label: "Jaipur", coords: { lat: 26.9124, lng: 75.7873 }, country: "India" },
  { label: "Kochi", coords: { lat: 9.9312, lng: 76.2673 }, country: "India" },
  { label: "Visakhapatnam", coords: { lat: 17.6868, lng: 83.2185 }, country: "India" },
  { label: "Vijayawada", coords: { lat: 16.5062, lng: 80.648 }, country: "India" },
  { label: "Dubai", coords: { lat: 25.2048, lng: 55.2708 }, country: "UAE" },
  { label: "Abu Dhabi", coords: { lat: 24.4539, lng: 54.3773 }, country: "UAE" },
  { label: "London", coords: { lat: 51.5144, lng: -0.0803 }, country: "UK" },
  { label: "Manchester", coords: { lat: 53.4808, lng: -2.2426 }, country: "UK" },
  { label: "Singapore", coords: { lat: 1.2798, lng: 103.8546 }, country: "Singapore" },
];

/**
 * Resolve Coordinates for a given Branch object
 */
export function getBranchCoordinates(branch: Branch): Coordinates | null {
  if (BRANCH_COORDINATES[branch.id]) {
    return BRANCH_COORDINATES[branch.id];
  }
  const cityKey = branch.city.toLowerCase().split("(")[0].trim();
  if (BRANCH_COORDINATES[cityKey]) {
    return BRANCH_COORDINATES[cityKey];
  }
  return null;
}

/**
 * Great-circle distance calculation via Haversine Formula
 * Returns distance in Kilometers
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal
}

/**
 * Format distance string nicely (e.g. "850 m away", "14.2 km away")
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m away`;
  }
  if (distanceKm >= 1000) {
    return `${Math.round(distanceKm).toLocaleString()} km away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Rough estimated drive time based on distance
 */
export function getEstimatedDriveTime(distanceKm: number): string {
  if (distanceKm < 2) return "~5 min drive";
  if (distanceKm < 10) return `~${Math.round(distanceKm * 2.5)} min drive`;
  if (distanceKm < 30) return `~${Math.round(distanceKm * 1.8)} min drive`;
  if (distanceKm < 80) return `~${(distanceKm / 45).toFixed(1)} hr drive`;
  if (distanceKm < 300) return `~${(distanceKm / 60).toFixed(1)} hrs travel`;
  if (distanceKm < 800) return `~${Math.round(distanceKm / 70)} hrs road / 1 hr flight`;
  return `Domestic / Intl flight connection`;
}

/**
 * Find the closest branch and return all branches annotated with distance and sorted
 */
export function rankBranchesByProximity(
  userCoords: Coordinates,
  branches: Branch[]
): {
  closestBranch: BranchWithDistance | null;
  rankedBranches: BranchWithDistance[];
} {
  const calculated: BranchWithDistance[] = branches
    .map((branch) => {
      const coords = getBranchCoordinates(branch);
      if (!coords) {
        return {
          ...branch,
          distanceKm: Infinity,
          distanceFormatted: "Unknown",
        };
      }
      const dist = calculateHaversineDistance(
        userCoords.lat,
        userCoords.lng,
        coords.lat,
        coords.lng
      );
      return {
        ...branch,
        distanceKm: dist,
        distanceFormatted: formatDistance(dist),
        estimatedDriveTime: getEstimatedDriveTime(dist),
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  if (calculated.length > 0 && calculated[0].distanceKm !== Infinity) {
    calculated[0].isClosest = true;
  }

  return {
    closestBranch: calculated.length > 0 && calculated[0].distanceKm !== Infinity ? calculated[0] : null,
    rankedBranches: calculated,
  };
}

/**
 * Generate Google Maps turn-by-turn navigation URL starting from user's coordinates
 */
export function getDirectNavigationUrl(
  userCoords: Coordinates,
  destination: { address: string; city: string; country?: string | null }
): string {
  const destQuery = `${destination.city}, ${destination.address}${
    destination.country && destination.country !== "India" ? `, ${destination.country}` : ""
  }`;
  return `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${encodeURIComponent(
    destQuery
  )}&travelmode=driving`;
}
