import { Itinerary } from "../domain/itinerary.entity";

/**
 * Encodes an itinerary object into a safe, portable URL query string.
 * Allows sharing and opening custom itineraries without requiring database persistence.
 */
export function encodeItineraryData(data: Partial<Itinerary>): string {
  try {
    const jsonStr = JSON.stringify(data);
    if (typeof Buffer !== "undefined") {
      return Buffer.from(jsonStr).toString("base64url");
    }
    // Browser fallback
    return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
  } catch (e) {
    console.error("Failed to encode itinerary data:", e);
    return "";
  }
}

/**
 * Decodes an itinerary object from a URL query string.
 */
export function decodeItineraryData(encoded: string): Partial<Itinerary> | null {
  if (!encoded || typeof encoded !== "string") return null;

  try {
    let jsonStr = "";
    if (typeof Buffer !== "undefined") {
      jsonStr = Buffer.from(encoded, "base64url").toString("utf-8");
    } else {
      const raw = decodeURIComponent(encoded);
      jsonStr = decodeURIComponent(escape(atob(raw)));
    }
    return JSON.parse(jsonStr);
  } catch (e) {
    try {
      // Fallback: standard base64 or URI component
      const raw = decodeURIComponent(encoded);
      let fallbackStr = "";
      if (typeof Buffer !== "undefined") {
        fallbackStr = Buffer.from(raw, "base64").toString("utf-8");
      } else {
        fallbackStr = atob(raw);
      }
      return JSON.parse(fallbackStr);
    } catch (e2) {
      try {
        // Direct JSON string fallback
        return JSON.parse(decodeURIComponent(encoded));
      } catch {
        return null;
      }
    }
  }
}
