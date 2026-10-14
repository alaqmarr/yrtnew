/**
 * Utilities for resolving Google Maps Embed URLs and Directions links for branch offices
 */

export function extractEmbedUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (trimmed.startsWith("<iframe")) {
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    return match ? match[1] : null;
  }
  return trimmed;
}

export function getBranchMapEmbedUrl(branch: {
  city: string;
  address: string;
  country?: string | null;
  map_embed_url?: string | null;
}): string {
  const custom = extractEmbedUrl(branch.map_embed_url);
  if (custom && custom.startsWith("http")) {
    return custom;
  }
  const query = `${branch.city}, ${branch.address}${
    branch.country && branch.country !== "India" ? `, ${branch.country}` : ""
  }`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

export function getBranchDirectionsUrl(branch: {
  city: string;
  address: string;
  country?: string | null;
  google_maps_url?: string | null;
}): string {
  if (branch.google_maps_url && branch.google_maps_url.startsWith("http")) {
    return branch.google_maps_url;
  }
  const query = `${branch.city}, ${branch.address}${
    branch.country && branch.country !== "India" ? `, ${branch.country}` : ""
  }`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
