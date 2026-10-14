import { db } from "./client";

export const richGalleryItems = [
  // 1. Kashmir Shikara (Landscape 16:9)
  {
    id: "gal_kashmir_dal",
    title: "Traditional Kashmiri Shikara on Dal Lake",
    category: "Destinations" as const,
    caption: "Peaceful morning waters on Dal Lake surrounded by snow-capped Zabarwan mountains",
    url: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
    tags: JSON.stringify(["Kashmir", "Dal Lake", "India"]),
    is_featured: 1,
  },
  // 2. Burj Khalifa (Tall Portrait 9:16)
  {
    id: "gal_dubai_burj",
    title: "Burj Khalifa Piercing the Clouds at Sunset",
    category: "Destinations" as const,
    caption: "The pinnacle of modern architecture soaring into the golden evening sky above Downtown Dubai",
    url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
    tags: JSON.stringify(["Dubai", "Burj Khalifa", "UAE"]),
    is_featured: 1,
  },
  // 3. Bali Nusa Penida Cliff (Tall Portrait 3:4)
  {
    id: "gal_bali_kelingking",
    title: "Kelingking T-Rex Dinosaur Rock, Nusa Penida",
    category: "Destinations" as const,
    caption: "The iconic cliffhead diving into crystal-clear turquoise waters of the Indian Ocean",
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
    tags: JSON.stringify(["Bali", "Nusa Penida", "Indonesia"]),
    is_featured: 1,
  },
  // 4. Alleppey Houseboat (Wide Landscape 16:9)
  {
    id: "gal_kerala_houseboat",
    title: "Emerald Backwaters of Alleppey by Houseboat",
    category: "Hotels & Stays" as const,
    caption: "Drifting gently through calm palm-fringed canals in God’s Own Country",
    url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    tags: JSON.stringify(["Kerala", "Alleppey", "Houseboat"]),
    is_featured: 1,
  },
  // 5. Swiss Alps Matterhorn (Tall Mountain Portrait 3:4)
  {
    id: "gal_swiss_matterhorn",
    title: "The Legendary Matterhorn Peak in Zermatt",
    category: "Tours" as const,
    caption: "Snow-dusted pyramidal peak towering above alpine chalets and wildflower meadows",
    url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
    tags: JSON.stringify(["Switzerland", "Zermatt", "Alps"]),
    is_featured: 1,
  },
  // 6. Halong Bay Karsts (Wide Landscape 16:9)
  {
    id: "gal_vietnam_halong",
    title: "Halong Bay Limestone Karst Towers at Dawn",
    category: "Destinations" as const,
    caption: "Hundreds of mystical emerald islets rising dramatically from the Gulf of Tonkin",
    url: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    tags: JSON.stringify(["Vietnam", "Halong Bay", "Cruise"]),
    is_featured: 1,
  },
  // 7. Hawa Mahal Jaipur (Tall Architectural Portrait 3:4)
  {
    id: "gal_rajasthan_hawamahal",
    title: "Palace of Winds (Hawa Mahal), Jaipur",
    category: "Destinations" as const,
    caption: "Intricate pink sandstone latticework with 953 honeycomb windows in the Pink City",
    url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80",
    tags: JSON.stringify(["Rajasthan", "Jaipur", "Heritage"]),
    is_featured: 1,
  },
  // 8. Dubai Desert Safari (Landscape 16:9)
  {
    id: "gal_dubai_desert",
    title: "Sunset Dune Bashing in the Arabian Desert",
    category: "Travelers" as const,
    caption: "Golden dunes stretching to the horizon as our 4x4 private safari catches the sunset",
    url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
    tags: JSON.stringify(["Dubai", "Safari", "Desert"]),
    is_featured: 1,
  },
  // 9. Maldives Overwater Villas (Wide Landscape 16:9)
  {
    id: "gal_maldives_resort",
    title: "Private Overwater Villas & Azure Lagoon",
    category: "Hotels & Stays" as const,
    caption: "Direct ocean steps, glass floor view panels, and pristine coral reefs right below your balcony",
    url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
    tags: JSON.stringify(["Maldives", "Luxury Resort", "Villa"]),
    is_featured: 1,
  },
  // 10. Eiffel Tower Paris (Tall Portrait 2:3)
  {
    id: "gal_paris_eiffel",
    title: "Eiffel Tower Piercing the Twilight Sky",
    category: "Tours" as const,
    caption: "The City of Lights seen from the Champ de Mars as the evening beacon illuminates Paris",
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
    tags: JSON.stringify(["Paris", "France", "Europe"]),
    is_featured: 1,
  },
  // 11. Singapore Supertrees (Tall Portrait 3:4)
  {
    id: "gal_singapore_supertrees",
    title: "Futuristic Supertrees at Gardens by the Bay",
    category: "Destinations" as const,
    caption: "Giant vertical gardens glowing with colorful light displays beside Marina Bay Sands",
    url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=80",
    tags: JSON.stringify(["Singapore", "Gardens by the Bay", "Asia"]),
    is_featured: 1,
  },
  // 12. Airplane Wing Above Golden Cloud Bank (Wide 16:9)
  {
    id: "gal_flights_sunrise",
    title: "Cruising at 38,000 Feet Above the Clouds",
    category: "Flights" as const,
    caption: "Sunrise over a sea of clouds on an international sector ticketed by our IATA Flight Desk",
    url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    tags: JSON.stringify(["Flights", "Aviation", "Sunset"]),
    is_featured: 1,
  },
  // 13. Santorini Oia Blue Domes (Tall Portrait 3:4)
  {
    id: "gal_greece_santorini",
    title: "Whitewashed Cliffside & Blue Domes of Oia",
    category: "Destinations" as const,
    caption: "Overlooking the caldera at golden hour as the Aegean Sea glistens below",
    url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
    tags: JSON.stringify(["Greece", "Santorini", "Islands"]),
    is_featured: 1,
  },
  // 14. Taj Mahal Agra (Tall Reflection Portrait 3:4)
  {
    id: "gal_agra_tajmahal",
    title: "The Taj Mahal Mirrored in Central Reflecting Pool",
    category: "Destinations" as const,
    caption: "White marble monument of eternal love glowing in the soft morning mist",
    url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80",
    tags: JSON.stringify(["Agra", "Taj Mahal", "India"]),
    is_featured: 1,
  },
  // 15. Luxury Hotel Rooftop Infinity Pool (Square 1:1)
  {
    id: "gal_luxury_pool",
    title: "Rooftop Infinity Pool Overlooking City Skyline",
    category: "Hotels & Stays" as const,
    caption: "5-star boutique hospitality with sunset cocktails and panoramic vistas",
    url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
    tags: JSON.stringify(["Hotels", "Infinity Pool", "Luxury"]),
    is_featured: 1,
  },
  // 16. Cappadocia Hot Air Balloons (Tall Portrait 2:3)
  {
    id: "gal_turkey_cappadocia",
    title: "Hot Air Balloons Floating Over Fairy Chimneys",
    category: "Tours" as const,
    caption: "Dozens of colorful balloons rising with the sunrise above Cappadocia valleys",
    url: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=900&q=80",
    tags: JSON.stringify(["Turkey", "Cappadocia", "Adventure"]),
    is_featured: 1,
  },
  // 17. Kyoto Fushimi Inari Torii Path (Tall Portrait 9:16)
  {
    id: "gal_japan_kyoto",
    title: "Vibrant Vermilion Torii Gates of Fushimi Inari",
    category: "Destinations" as const,
    caption: "Thousands of sacred gates weaving through the tranquil sacred forest of Mount Inari",
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80",
    tags: JSON.stringify(["Japan", "Kyoto", "Culture"]),
    is_featured: 1,
  },
  // 18. Dubai Marina Luxury Yacht (Wide 16:9)
  {
    id: "gal_dubai_yacht",
    title: "Sunset Yacht Cruise Along Dubai Marina",
    category: "Tours" as const,
    caption: "Cruising past twisting skyscrapers and JBR beach on a private chartered catamaran",
    url: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80",
    tags: JSON.stringify(["Dubai", "Yacht", "Marina"]),
    is_featured: 1,
  },
  // 19. Happy Travelers Family in London (Landscape 3:2)
  {
    id: "gal_travelers_london",
    title: "Our Happy Traveler Family at Westminster Bridge",
    category: "Travelers" as const,
    caption: "Big Ben and the London Eye serving as the backdrop for unforgettable family memories",
    url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    tags: JSON.stringify(["London", "UK", "Travelers"]),
    is_featured: 1,
  },
  // 20. Swiss Glacier Express Panoramic Car (Wide 16:9)
  {
    id: "gal_swiss_train",
    title: "Panoramic Glass Dome Views on Glacier Express",
    category: "Tours" as const,
    caption: "First class rail dining while gliding through the Landwasser Viaduct and snowy gorges",
    url: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1200&q=80",
    tags: JSON.stringify(["Switzerland", "Train", "Luxury"]),
    is_featured: 1,
  },
  // 21. Phi Phi Island Longtail Boat (Tall Portrait 3:4)
  {
    id: "gal_thailand_phiphi",
    title: "Traditional Longtail Boat in Maya Bay, Thailand",
    category: "Destinations" as const,
    caption: "Towering karst walls encircling the world-famous hidden lagoon of Koh Phi Phi Leh",
    url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=900&q=80",
    tags: JSON.stringify(["Thailand", "Phi Phi", "Beaches"]),
    is_featured: 1,
  },
  // 22. Airline First Class Cabin (Wide 16:9)
  {
    id: "gal_flights_cabin",
    title: "Lie-Flat Luxury Airline Suites on Long-Haul Routes",
    category: "Flights" as const,
    caption: "Exclusive airline partnerships enabling discounted premium cabin fares for Yellow Ribbon clients",
    url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
    tags: JSON.stringify(["Flights", "Business Class", "Air Travel"]),
    is_featured: 1,
  },
];

async function main() {
  console.log("Seeding diverse masonry gallery items...");
  for (const item of richGalleryItems) {
    await db.execute({
      sql: `INSERT OR REPLACE INTO gallery_items (id, title, url, category, caption, tags_json, is_featured)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        item.id,
        item.title,
        item.url,
        item.category,
        item.caption,
        item.tags,
        item.is_featured,
      ],
    });
  }
  console.log(`SUCCESS: Seeded ${richGalleryItems.length} diverse gallery items!`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
