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
 * Validate latitude and longitude bounds
 */
function isValidLatLng(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(lat === 0 && lng === 0)
  );
}

/**
 * Extract (trim) Latitude & Longitude from any Google Maps Embed <iframe>,
 * pb= embed string, Google Maps Place/Share link (@lat,lng or !3dlat!4dlng),
 * query parameter (?q=lat,lng / ?ll=lat,lng / ?destination=lat,lng), or raw "lat, lng" string.
 */
export function extractCoordinatesFromMapUrl(input?: string | null): Coordinates | null {
  if (!input || typeof input !== "string") return null;

  let raw = input.trim();
  if (!raw) return null;

  // 1. If full <iframe> HTML was pasted, extract the src="..." attribute first
  const iframeSrcMatch = raw.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch && iframeSrcMatch[1]) {
    raw = iframeSrcMatch[1].trim();
  }

  // Decode URL-encoded characters (!2d, !3d, commas, etc.) safely
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }

  // 2. Priority A: Exact place pin in Google Maps URLs/Embeds -> !3d<lat>!4d<lng>
  // (Find the last occurrence in case of route/viewport prefixes)
  const pin3d4dMatches = [...decoded.matchAll(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/g)];
  if (pin3d4dMatches.length > 0) {
    const lastMatch = pin3d4dMatches[pin3d4dMatches.length - 1];
    const lat = parseFloat(lastMatch[1]);
    const lng = parseFloat(lastMatch[2]);
    if (isValidLatLng(lat, lng)) {
      return { lat, lng };
    }
  }

  // 3. Priority B: Standard Google Maps Embed pb= parameter -> !2d<lng>!3d<lat>
  const embed2d3dMatches = [...decoded.matchAll(/!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/g)];
  if (embed2d3dMatches.length > 0) {
    const lastMatch = embed2d3dMatches[embed2d3dMatches.length - 1];
    const lng = parseFloat(lastMatch[1]);
    const lat = parseFloat(lastMatch[2]);
    if (isValidLatLng(lat, lng)) {
      return { lat, lng };
    }
  }

  // 4. Priority C: Google Maps URL path @<lat>,<lng> (e.g. /maps/place/.../@17.4399,78.4983,17z)
  const atCoordMatch = decoded.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/);
  if (atCoordMatch) {
    const lat = parseFloat(atCoordMatch[1]);
    const lng = parseFloat(atCoordMatch[2]);
    if (isValidLatLng(lat, lng)) {
      return { lat, lng };
    }
  }

  // 5. Priority D: URL Query / Direction parameters (?q=, ?query=, ?ll=, ?sll=, ?center=, ?destination=, ?daddr=, /dir//)
  const queryCoordMatch = decoded.match(
    /(?:[?&](?:q|query|ll|sll|center|destination|daddr|viewpoint)=(?:loc:)?|\/dir\/[^/]*\/)(-?\d+(?:\.\d+)?)[,+\s]+(-?\d+(?:\.\d+)?)/i
  );
  if (queryCoordMatch) {
    const lat = parseFloat(queryCoordMatch[1]);
    const lng = parseFloat(queryCoordMatch[2]);
    if (isValidLatLng(lat, lng)) {
      return { lat, lng };
    }
  }

  // 6. Priority E: Raw "lat, lng" coordinate string
  const rawPairMatch = decoded.match(/^\s*(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);
  if (rawPairMatch) {
    const lat = parseFloat(rawPairMatch[1]);
    const lng = parseFloat(rawPairMatch[2]);
    if (isValidLatLng(lat, lng)) {
      return { lat, lng };
    }
  }

  return null;
}

/**
 * Resolve Coordinates for a given Branch object:
 * 1. First trims/extracts lat & lng from branch.map_embed_url
 * 2. Next trims/extracts lat & lng from branch.google_maps_url
 * 3. Falls back to known branch ID / city coordinates if no map link coordinates are present
 */
export function getBranchCoordinates(branch: Branch): Coordinates | null {
  const fromEmbed = extractCoordinatesFromMapUrl(branch.map_embed_url);
  if (fromEmbed) {
    return fromEmbed;
  }

  const fromMapsUrl = extractCoordinatesFromMapUrl(branch.google_maps_url);
  if (fromMapsUrl) {
    return fromMapsUrl;
  }

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
  destination: {
    address: string;
    city: string;
    country?: string | null;
    map_embed_url?: string | null;
    google_maps_url?: string | null;
  }
): string {
  const exactCoords =
    extractCoordinatesFromMapUrl(destination.map_embed_url) ||
    extractCoordinatesFromMapUrl(destination.google_maps_url);

  if (exactCoords) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${exactCoords.lat},${exactCoords.lng}&travelmode=driving`;
  }

  const destQuery = `${destination.city}, ${destination.address}${
    destination.country && destination.country !== "India" ? `, ${destination.country}` : ""
  }`;
  return `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${encodeURIComponent(
    destQuery
  )}&travelmode=driving`;
}
