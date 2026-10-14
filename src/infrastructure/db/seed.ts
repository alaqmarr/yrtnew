import bcrypt from "bcryptjs";
import { db } from "./client";
import { SCHEMA_SQL } from "./schema";

export async function runMigrationsAndSeed() {
  console.log("--> Executing SQLite WAL migrations...");

  // Execute schema
  const statements = SCHEMA_SQL.split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    try {
      await db.execute(statement);
    } catch (err) {
      console.error("Migration statement error:", statement.slice(0, 50), err);
    }
  }

  // Check if admin user already exists
  const existingUsers = await db.execute("SELECT COUNT(*) as count FROM users WHERE role IN ('admin', 'superadmin')");
  const userCount = Number(existingUsers.rows[0]?.count || 0);

  if (userCount === 0 && process.env.SEED_DEFAULT_ADMIN === "true") {
    console.log("--> Seeding default Admin user via SEED_DEFAULT_ADMIN...");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("adminpassword123", salt);

    await db.execute({
      sql: `INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)`,
      args: ["usr_admin_1", "admin@yellowribbontravels.com", passwordHash, "Yellow Ribbon Admin", "superadmin"],
    });
  } else if (userCount === 0) {
    console.log("--> No administrator exists yet. Complete initial onboarding at /setup");
  }

  // Check if destinations exist
  const existingDest = await db.execute("SELECT COUNT(*) as count FROM destinations");
  if (Number(existingDest.rows[0]?.count || 0) === 0) {
    console.log("--> Seeding Destinations...");
    const destinations = [
      {
        id: "dest_kashmir",
        slug: "kashmir",
        name: "Kashmir, India",
        country: "India",
        region: "North India",
        tagline: "Paradise on Earth with snow-capped peaks and serene Dal Lake",
        description: "Known as 'Paradise on Earth', Kashmir mesmerizes travelers with picturesque valleys, pristine alpine lakes, houseboats floating on the Dal Lake in Srinagar, and the ski wonderland of Gulmarg.",
        hero_image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1600&q=80",
        is_domestic: 1,
        is_featured: 1,
        top_attractions_json: JSON.stringify(["Dal Lake Shikara", "Gulmarg Gondola", "Pahalgam Betaab Valley", "Sonmarg Thajiwas Glacier", "Mughal Gardens"]),
        best_time_to_visit: "April to October (Pleasant blooms) & Dec to Feb (Snow lovers)",
        weather_info: "Summer 15°C to 28°C | Winter -2°C to 8°C",
      },
      {
        id: "dest_kerala",
        slug: "kerala",
        name: "Kerala, India",
        country: "India",
        region: "South India",
        tagline: "God's Own Country, lush tea estates and tranquil backwaters",
        description: "Experience the calming palm-fringed lagoons of Alleppey aboard a luxury houseboat, the emerald misty tea plantations of Munnar, wildlife in Periyar, and authentic Ayurvedic rejuvenation.",
        hero_image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80",
        is_domestic: 1,
        is_featured: 1,
        top_attractions_json: JSON.stringify(["Alleppey Houseboat", "Munnar Tea Gardens", "Periyar National Park", "Kovalam Beach", "Athirappilly Falls"]),
        best_time_to_visit: "September to March",
        weather_info: "Tropical 22°C to 32°C year-round",
      },
      {
        id: "dest_rajasthan",
        slug: "rajasthan",
        name: "Rajasthan, India",
        country: "India",
        region: "North West India",
        tagline: "Land of Maharajas, historic forts and vibrant golden deserts",
        description: "Walk the footsteps of royalty across Jaipur's Amber Fort, Udaipur's romantic Lake Pichola, and the desert dunes of Jaisalmer with sunset camel safaris and folk dances under starry skies.",
        hero_image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80",
        is_domestic: 1,
        is_featured: 1,
        top_attractions_json: JSON.stringify(["Amber Fort Jaipur", "City Palace Udaipur", "Jaisalmer Desert Dunes", "Hawa Mahal", "Mehrangarh Fort Jodhpur"]),
        best_time_to_visit: "October to March",
        weather_info: "Winter 10°C to 25°C",
      },
      {
        id: "dest_bali",
        slug: "bali",
        name: "Bali, Indonesia",
        country: "Indonesia",
        region: "Southeast Asia",
        tagline: "Island of Gods, sacred temples, emerald terraces & turquoise waters",
        description: "From the mystical rainforests and yoga sanctuaries of Ubud to the cliffside Uluwatu temple sunsets and pristine waters of Nusa Penida, Bali offers unforgettable tropical romance.",
        hero_image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80",
        is_domestic: 0,
        is_featured: 1,
        top_attractions_json: JSON.stringify(["Nusa Penida Kelingking Beach", "Ubud Monkey Forest", "Uluwatu Sunset Temple", "Tegalalang Rice Terraces", "Seminyak Beach Clubs"]),
        best_time_to_visit: "April to October (Dry season)",
        weather_info: "Tropical Warm 26°C to 31°C",
      },
      {
        id: "dest_dubai",
        slug: "dubai",
        name: "Dubai, United Arab Emirates",
        country: "UAE",
        region: "Middle East",
        tagline: "Ultra-modern architecture, golden desert dunes and luxury shopping",
        description: "Ascend the iconic Burj Khalifa, feel the thrill of a red dunes desert safari with Arabian BBQ dinners, stroll through Dubai Marina and experience futuristic wonders at the Museum of the Future.",
        hero_image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
        is_domestic: 0,
        is_featured: 1,
        top_attractions_json: JSON.stringify(["Burj Khalifa 124th Floor", "Desert Safari & BBQ", "Dubai Marina Yacht Cruise", "Museum of the Future", "Dubai Mall & Dancing Fountains"]),
        best_time_to_visit: "November to March",
        weather_info: "Pleasant Winter 18°C to 28°C",
      },
      {
        id: "dest_switzerland",
        slug: "switzerland",
        name: "Switzerland",
        country: "Switzerland",
        region: "Europe",
        tagline: "Alpine panoramas, glittering lakes and legendary scenic railways",
        description: "Glide on the Glacier Express past majestic alpine peaks, cruise on Lake Lucerne, visit Interlaken at the foot of the Jungfrau Top of Europe, and savor artisan Swiss chocolates and cheeses.",
        hero_image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=80",
        is_domestic: 0,
        is_featured: 1,
        top_attractions_json: JSON.stringify(["Jungfraujoch Top of Europe", "Mount Titlis Rotair Cableway", "Lake Lucerne Cruise", "Interlaken Promenade", "Zermatt Matterhorn"]),
        best_time_to_visit: "May to September (Green meadows) & Dec to March (Skiing)",
        weather_info: "Summer 18°C to 26°C | Winter -3°C to 5°C",
      },
      {
        id: "dest_vietnam",
        slug: "vietnam",
        name: "Vietnam",
        country: "Vietnam",
        region: "Southeast Asia",
        tagline: "Halong Bay limestone karsts, lantern-lit alleys and culinary richness",
        description: "Marvel at the emerald waters and emerald peaks of Halong Bay on an overnight luxury cruise, walk through Hanoi's vibrant French quarters, and immerse yourself in the illuminated magic of Hoi An ancient town.",
        hero_image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80",
        is_domestic: 0,
        is_featured: 1,
        top_attractions_json: JSON.stringify(["Halong Bay Overnight Cruise", "Hanoi Old Quarter Street Food", "Hoi An Ancient Town Lanterns", "Da Nang Golden Bridge", "Cu Chi Tunnels"]),
        best_time_to_visit: "October to April",
        weather_info: "Temperate 20°C to 29°C",
      },
      {
        id: "dest_thailand",
        slug: "thailand",
        name: "Thailand",
        country: "Thailand",
        region: "Southeast Asia",
        tagline: "Gilded temples, lively street markets and turquoise Andaman beaches",
        description: "From the grand palaces and floating markets of Bangkok to the coral reefs of Phi Phi Islands and thrilling water adventures in Phuket, Thailand is the ultimate holiday paradise.",
        hero_image: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=1600&q=80",
        is_domestic: 0,
        is_featured: 0,
        top_attractions_json: JSON.stringify(["Phi Phi Island Speedboat", "Grand Palace Bangkok", "Phuket Big Buddha", "James Bond Island", "Chao Phraya Dinner Cruise"]),
        best_time_to_visit: "November to April",
        weather_info: "Tropical 24°C to 33°C",
      },
    ];

    for (const d of destinations) {
      await db.execute({
        sql: `INSERT INTO destinations (id, slug, name, country, region, tagline, description, hero_image, is_domestic, is_featured, top_attractions_json, best_time_to_visit, weather_info)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          d.id,
          d.slug,
          d.name,
          d.country,
          d.region,
          d.tagline,
          d.description,
          d.hero_image,
          d.is_domestic,
          d.is_featured,
          d.top_attractions_json,
          d.best_time_to_visit,
          d.weather_info,
        ],
      });
    }
  }

  // Check if tours exist
  const existingTours = await db.execute("SELECT COUNT(*) as count FROM tours");
  if (Number(existingTours.rows[0]?.count || 0) === 0) {
    console.log("--> Seeding Tours...");
    const tours = [
      {
        id: "tour_kashmir_paradise",
        destination_id: "dest_kashmir",
        slug: "enchanting-kashmir-houseboat-gulmarg",
        title: "Enchanting Kashmir: Dal Lake Houseboat & Snowy Gulmarg",
        subtitle: "Experience Srinagar shikara rides, snow peaks of Gulmarg, and saffron valleys of Pahalgam",
        duration_days: 6,
        duration_nights: 5,
        price: 24999,
        original_price: 32000,
        featured: 1,
        category: "Honeymoon & Family",
        tour_type: "Private Guided Package",
        overview: "Discover why Kashmir is universally celebrated as heaven on Earth. Float on tranquil waters in a traditional handcrafted cedarwood houseboat on Dal Lake, take the high-altitude Gulmarg Gondola cable car ride over snowy peaks, and wander along the gushing Lidder River in Pahalgam.",
        highlights_json: JSON.stringify([
          "1 Night stay in Premium Royal Houseboat on Dal Lake with Shikara ride",
          "Gulmarg Gondola Phase 1 & 2 Cable Car excursion",
          "Pahalgam Betaab Valley & Aru Valley sightseeing",
          "Sonmarg Thajiwas Glacier pony ride and photography",
          "Visit historic Shalimar and Nishat Mughal Gardens",
          "Private dedicated chauffer-driven sanitized cab throughout",
        ]),
        inclusions_json: JSON.stringify([
          "5 Nights Deluxe/Premium hotel & houseboat accommodation",
          "Daily Breakfast & Dinners (Pure Veg & Non-Veg options)",
          "All transfers and inter-city sightseeing by private cab",
          "1 Hour scenic Shikara ride on Dal Lake at sunset",
          "Toll taxes, parking charges, and driver allowances",
          "24/7 on-tour emergency customer concierge assistance",
        ]),
        exclusions_json: JSON.stringify([
          "Airfare / Train tickets (Available on request via our Flight Desk)",
          "Pony / Horse rides and personal winter equipment hire",
          "Monument entry fees and camera tickets",
          "Travel insurance (can be added optionally)",
        ]),
        itinerary_json: JSON.stringify([
          {
            day: 1,
            title: "Arrival in Srinagar & Dal Lake Sunset Shikara",
            description: "Warm welcome at Srinagar Airport by Yellow Ribbon Travels representative. Transfer to luxury houseboat. Evening relaxing Shikara ride across the lotus gardens and floating flower markets of Dal Lake. Traditional Kashmiri welcome dinner.",
          },
          {
            day: 2,
            title: "Srinagar to Gulmarg Day Adventure",
            description: "Drive through picturesque pine forests to Gulmarg (Meadow of Flowers). Board the world's second-highest cable car - Gulmarg Gondola - up to Kongdoori and Apharwat Peak. Enjoy snow sports and return to Srinagar for dinner.",
          },
          {
            day: 3,
            title: "Srinagar to Pahalgam (Valley of Shepherds)",
            description: "Scenic drive through saffron fields of Pampore and walnut orchards. Check-in to riverfront hotel in Pahalgam. Explore the famous Betaab Valley, named after the Bollywood movie, and peaceful Aru Valley.",
          },
          {
            day: 4,
            title: "Pahalgam Nature Leisure & Drive to Srinagar",
            description: "Morning stroll along the roaring Lidder River. Visit local saffron and dry fruit markets. Drive back to Srinagar in the afternoon and check-in to city resort hotel.",
          },
          {
            day: 5,
            title: "Excursion to Golden Sonmarg",
            description: "Full day excursion to Sonmarg (Meadow of Gold). Marvel at the majestic Thajiwas Glacier where snow remains year-round. Evening shopping for Pashmina shawls, walnut wood crafts, and Kashmiri spices.",
          },
          {
            day: 6,
            title: "Mughal Gardens Tour & Airport Departure",
            description: "Visit the splendid Nishat Bagh and Shalimar Bagh landscaped by Emperor Jahangir. Timely drop at Srinagar International Airport with sweet memories of Kashmir.",
          },
        ]),
        images_json: JSON.stringify([
          "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80",
        ]),
        departure_dates_json: JSON.stringify(["Every Saturday", "Custom Dates on Request"]),
        rating: 4.9,
        review_count: 34,
        max_group_size: 12,
      },
      {
        id: "tour_bali_bliss",
        destination_id: "dest_bali",
        slug: "exotic-bali-nusa-penida-island-retreat",
        title: "Exotic Bali: Nusa Penida Island, Ubud Culture & Uluwatu Sunset",
        subtitle: "Tropical luxury getaway featuring iconic cliffs, rice terraces, water sports and romantic dinner",
        duration_days: 6,
        duration_nights: 5,
        price: 38500,
        original_price: 49000,
        featured: 1,
        category: "International Holidays",
        tour_type: "Private Island Holiday",
        overview: "Experience the magic of Bali, Indonesia. From the lush spiritual core of Ubud and cascading Tegenungan waterfalls to the jaw-dropping T-Rex cliff at Kelingking Beach on Nusa Penida island, this handpicked itinerary is curated for unforgettable memories.",
        highlights_json: JSON.stringify([
          "Full Day Nusa Penida West Island Tour by fast boat with private cab",
          "Visit Kelingking T-Rex cliff, Angel's Billabong & Broken Beach",
          "Ubud Sacred Monkey Forest and Bali Jungle Swing with dress rental",
          "Sunset Kecak Dance performance at Uluwatu Cliff Temple",
          "Candlelight beachside seafood dinner at Jimbaran Bay",
          "Watersports package at Tanjung Benoa (Banana Boat & Jet Ski)",
        ]),
        inclusions_json: JSON.stringify([
          "5 Nights 4-Star Resort stay (2 Nights Ubud Villa + 3 Nights Kuta/Seminyak Resort)",
          "Daily Buffet Breakfast & 2 Lunches during excursions",
          "1 Romantic 3-Course Candlelight Dinner at Jimbaran Beach",
          "Fast boat return transfers to Nusa Penida with island touring",
          "Airport meet-and-greet with private air-conditioned transport",
          "Sim card with high-speed 4G data for your trip",
        ]),
        exclusions_json: JSON.stringify([
          "International Flight tickets (can be booked seamlessly through our Flight Desk)",
          "Indonesia Tourist Visa on Arrival (approx $35 payable at airport or eVisa)",
          "Bali Tourism Tax (approx $10)",
          "Personal expenses and spa treatments",
        ]),
        itinerary_json: JSON.stringify([
          {
            day: 1,
            title: "Arrival in Denpasar Bali & Ubud Transfer",
            description: "Welcome by Yellow Ribbon Travels tour coordinator at Ngurah Rai Airport. Private transfer to Ubud nature resort. Relax by the infinity pool overlooking lush rainforests.",
          },
          {
            day: 2,
            title: "Ubud Culture, Jungle Swing & Waterfall Tour",
            description: "Visit Tegalalang Emerald Rice Terraces, fly high on the famous Bali Jungle Swing, explore the holy Tirta Empul spring water temple and stop by Tegenungan Waterfall.",
          },
          {
            day: 3,
            title: "Full Day Nusa Penida Island Speedboat Expedition",
            description: "Early morning transfer to Sanur Harbor. Board fast boat to Nusa Penida. Visit legendary Kelingking Secret Point, the natural infinity pool of Angel's Billabong, and Broken Beach.",
          },
          {
            day: 4,
            title: "Tanjung Benoa Watersports & Uluwatu Sunset Kecak Dance",
            description: "Thrill yourself with water sports at Benoa beach. Afternoon drive to Uluwatu Temple perched on a 70-meter cliff. Watch the dramatic sunset accompanied by traditional Kecak fire dance. Jimbaran seafood dinner.",
          },
          {
            day: 5,
            title: "Seminyak Beach Clubs & Artisan Souvenir Shopping",
            description: "Leisure day to explore beach clubs like Potato Head or Cafe Del Mar, visit Tanah Lot sea temple, and shop for handmade rattan bags, batik, and aromatic coffee.",
          },
          {
            day: 6,
            title: "Relaxing Balinese Massage & Flight Home",
            description: "Complimentary 60-minute authentic Balinese herbal spa massage. Timely VIP airport transfer for your departure flight.",
          },
        ]),
        images_json: JSON.stringify([
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80",
        ]),
        departure_dates_json: JSON.stringify(["Daily Departures Available"]),
        rating: 4.95,
        review_count: 42,
        max_group_size: 16,
      },
      {
        id: "tour_dubai_luxury",
        destination_id: "dest_dubai",
        slug: "dazzling-dubai-desert-safari-burj-khalifa",
        title: "Dazzling Dubai: Burj Khalifa, Luxury Desert Safari & Marina Yacht",
        subtitle: "5 Days of futuristic glamor, desert thrills, world-class entertainment, and luxury shopping",
        duration_days: 5,
        duration_nights: 4,
        price: 42999,
        original_price: 54000,
        featured: 1,
        category: "Luxury & Family",
        tour_type: "Signature Holiday",
        overview: "Explore the glamorous city of superlatives! Stand atop the world's tallest building Burj Khalifa, conquer the undulating red dunes on an exhilarating 4x4 Land Cruiser safari, dine under starlit desert skies, and cruise along the billionaire yachts of Dubai Marina.",
        highlights_json: JSON.stringify([
          "Burj Khalifa At The Top 124th/125th Floor Observation Deck",
          "Premium Red Dunes Desert Safari with Dune Bashing, Camel Ride & Tanoura show",
          "Lavish Arabian BBQ Buffet Dinner in 5-star style desert camp",
          "2-Hour Dubai Marina Luxury Dhow Cruise with live music and buffet dinner",
          "Half-Day Dubai City Tour covering Dubai Frame, Palm Jumeirah & Gold Souk",
          "Future Museum photo stop and Dubai Mall fountain spectacle",
        ]),
        inclusions_json: JSON.stringify([
          "4 Nights stay in 4-Star City Center Hotel (Bur Dubai / Deira / Downtown)",
          "Daily international breakfast buffet",
          "All tours and transfers on sharing/private basis as per itinerary",
          "All entry tickets mentioned in inclusions",
          "UAE Tourist Visa with COVID Medical Insurance assistance",
          "VAT and Tourism Dirham taxes included",
        ]),
        exclusions_json: JSON.stringify([
          "Airfare tickets (our flight desk provides competitive discounted fares)",
          "Meals other than specified",
          "Optional Abu Dhabi Ferrari World or Warner Bros upgrade",
        ]),
        itinerary_json: JSON.stringify([
          {
            day: 1,
            title: "Arrival in Dubai & Marina Dhow Cruise",
            description: "Warm welcome at Dubai International Airport. Transfer to your 4-star hotel. Evening boarding of luxury wooden Dhow cruise at Dubai Marina. Enjoy magnificent illuminated skyline views and international buffet.",
          },
          {
            day: 2,
            title: "Dubai City Tour & Burj Khalifa 124th Floor",
            description: "Explore old and new Dubai: Dubai Frame, Jumeirah Mosque, Burj Al Arab photo point, Atlantis The Palm. Afternoon visit to Dubai Mall and ascend to the 124th floor of Burj Khalifa. Evening Dubai Fountain show.",
          },
          {
            day: 3,
            title: "Leisure Morning & Thrilling Red Dunes Desert Safari",
            description: "Morning free for shopping at Meena Bazaar or Mall of Emirates. At 3 PM, 4x4 Land Cruisers pick you up for adrenaline-fueled dune bashing. Enjoy sandboarding, camel rides, henna painting, belly dance show and lavish BBQ dinner.",
          },
          {
            day: 4,
            title: "Museum of the Future & Miracle Garden (Seasonal)",
            description: "Visit the awe-inspiring architectural wonder Museum of the Future. Explore the world's largest natural flower garden, Dubai Miracle Garden, with over 150 million blooming flowers.",
          },
          {
            day: 5,
            title: "Gold & Spice Souk Shopping & Airport Departure",
            description: "Explore the dazzling traditional Gold Souk and aromatic spice lanes. Last-minute duty free shopping before private airport drop-off.",
          },
        ]),
        images_json: JSON.stringify([
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1000&q=80",
        ]),
        departure_dates_json: JSON.stringify(["Every Wednesday & Saturday"]),
        rating: 4.88,
        review_count: 51,
        max_group_size: 20,
      },
      {
        id: "tour_kerala_backwaters",
        destination_id: "dest_kerala",
        slug: "serene-kerala-munnar-tea-hills-alleppey-houseboat",
        title: "Serene Kerala: Munnar Misty Hills & Alleppey Luxury Houseboat",
        subtitle: "Rejuvenating tropical paradise through aromatic spice gardens, tea hills, and quiet canals",
        duration_days: 7,
        duration_nights: 6,
        price: 27500,
        original_price: 36000,
        featured: 1,
        category: "Domestic Holidays",
        tour_type: "Private Chauffeured Package",
        overview: "Immerse in God's Own Country. Breathe the crisp mountain air in Munnar's sprawling tea hills, watch rare mountain goats at Eravikulam National Park, cruise the calm backwaters of Alleppey in a private thatched houseboat, and unwind by the Arabian Sea at Kovalam.",
        highlights_json: JSON.stringify([
          "2 Nights in Munnar with visits to Mattupetty Dam & Tea Museum",
          "1 Night in Thekkady with Periyar Lake boat safari",
          "1 Night exclusive private Air-Conditioned Alleppey Houseboat with full meals",
          "2 Nights in Kovalam beach resort with sunset views",
          "Traditional Kathakali cultural dance and Kalaripayattu martial arts show",
          "Authentic Kerala Ayurvedic body rejuvenation therapy",
        ]),
        inclusions_json: JSON.stringify([
          "6 Nights deluxe accommodations including 1 night private houseboat",
          "Houseboat with all 3 authentic Kerala meals (Lunch, Evening Tea/Snacks, Dinner, Breakfast)",
          "Daily hotel breakfast",
          "Dedicated sanitized AC Sedan / Innova throughout the tour",
          "Driver charges, tolls, parking and sightseeing permits",
        ]),
        exclusions_json: JSON.stringify([
          "Flights or Train tickets to Cochin / Trivandrum",
          "Boating charges at Periyar National Park",
          "Personal laundry and gratuities",
        ]),
        itinerary_json: JSON.stringify([
          {
            day: 1,
            title: "Cochin Arrival & Scenic Drive to Munnar",
            description: "Pick-up from Cochin Airport / Ernakulam Railway Station. Drive past Cheeyappara and Valara waterfalls to Munnar (4,500 ft). Check-in to plantation resort.",
          },
          {
            day: 2,
            title: "Munnar Tea Plantations & Eravikulam Wildlife",
            description: "Visit Eravikulam National Park, home of the endangered Nilgiri Tahr. Explore Mattupetty Dam, Echo Point, Kundala Lake and Tata Tea Processing Museum.",
          },
          {
            day: 3,
            title: "Munnar to Thekkady Spice Sanctuaries",
            description: "Drive through cardamom hills to Thekkady. Spice plantation walking tour. Evening boat cruise on Periyar Lake to spot wild elephants, bison, and exotic birds.",
          },
          {
            day: 4,
            title: "Thekkady to Alleppey Houseboat Boarding",
            description: "Arrive in Alleppey by 12 noon. Board your traditional motorized houseboat (Kettuvallam). Glide through narrow palm-lined canals, paddy fields, and rural village life. Traditional Kerala Karimeen fish lunch.",
          },
          {
            day: 5,
            title: "Alleppey to Kovalam Beach Haven",
            description: "Disembark after morning breakfast. Drive south along the coastal highway to Kovalam. Check in to seaside resort and relax on Lighthouse Beach.",
          },
          {
            day: 6,
            title: "Kanyakumari Day Trip (Optional) or Trivandrum Tour",
            description: "Visit Padmanabhaswamy Temple (the wealthiest temple in the world) in Trivandrum, Napier Museum, and enjoy Ayurvedic massages at the beach.",
          },
          {
            day: 7,
            title: "Trivandrum Airport Departure",
            description: "Morning dip in the ocean, breakfast, and timely drop-off at Trivandrum International Airport.",
          },
        ]),
        images_json: JSON.stringify([
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80",
        ]),
        departure_dates_json: JSON.stringify(["Every Monday & Friday"]),
        rating: 4.92,
        review_count: 38,
        max_group_size: 14,
      },
      {
        id: "tour_vietnam_wonders",
        destination_id: "dest_vietnam",
        slug: "vietnam-heritage-halong-bay-overnight-cruise-hanoi-danang",
        title: "Vietnam Wonders: Halong Bay Luxury Cruise & Hoi An Lanterns",
        subtitle: "7 Days across Hanoi, Halong Bay 5-Star Cruise, Bana Hills Golden Bridge & Hoi An",
        duration_days: 7,
        duration_nights: 6,
        price: 54999,
        original_price: 68000,
        featured: 1,
        category: "International Holidays",
        tour_type: "Boutique Small Group",
        overview: "From Hanoi's thousand-year-old historic temples and street food to emerald waters of Halong Bay aboard a 5-star cruise, and the giant stone hands holding the Golden Bridge at Ba Na Hills, Vietnam is this year's hottest travel destination.",
        highlights_json: JSON.stringify([
          "2 Days / 1 Night Halong Bay 5-Star Luxury Cruise with all meals & kayaking",
          "Ba Na Hills cable car and photo walk on the famous Golden Bridge",
          "Hoi An Ancient Lantern Town walking tour & basket boat coconut forest ride",
          "Hanoi French Quarter, Train Street & Ho Chi Minh Mausoleum",
          "Authentic Vietnamese Phở and egg coffee tastings",
        ]),
        inclusions_json: JSON.stringify([
          "6 Nights deluxe 4 & 5 star accommodation including luxury Halong Bay cruise",
          "Daily breakfast, 4 gourmet lunches, and 3 dinners",
          "All airport transfers and scenic highway limousine coaches",
          "English-speaking professional local guides",
          "Vietnam eVisa processing assistance",
        ]),
        exclusions_json: JSON.stringify([
          "International Flights (exclusive rates available through our desk)",
          "Personal shopping, tips, and alcoholic drinks",
        ]),
        itinerary_json: JSON.stringify([
          {
            day: 1,
            title: "Arrival in Hanoi - Capital of Vietnam",
            description: "Meet your guide at Noi Bai Airport. Transfer to boutique hotel in Hanoi French Quarter. Evening walk around Hoan Kiem Lake and taste authentic Vietnamese egg coffee.",
          },
          {
            day: 2,
            title: "Hanoi to Halong Bay 5-Star Cruise Check-in",
            description: "Scenic transfer via expressway to Tuan Chau marina. Board luxury cruise ship. Enjoy welcome drink and buffet lunch cruising through thousands of limestone karst pillars. Kayak inside hidden sea lagoons.",
          },
          {
            day: 3,
            title: "Halong Bay Sunrise Tai Chi & Flight to Da Nang",
            description: "Sunrise Tai Chi on the sundeck. Visit Surprise Cave (Hang Sung Sot). Brunch while cruising back to dock. Transfer to airport for short domestic flight to coastal Da Nang.",
          },
          {
            day: 4,
            title: "Ba Na Hills & Golden Bridge in the Clouds",
            description: "Ride the world's longest single-cable car up to Ba Na Hills. Walk across the iconic Golden Giant Hands Bridge towering 1,400m above sea level. Visit French village and fantasy park.",
          },
          {
            day: 5,
            title: "Coconut Basket Boat & Lantern Town Hoi An",
            description: "Experience the spinning bamboo basket boats through the Cam Thanh water coconut jungle. Afternoon walking tour of UNESCO Hoi An ancient streets. Release floating paper lanterns on Hoai River.",
          },
          {
            day: 6,
            title: "My Khe Beach Relaxation & Da Nang Dragon Bridge",
            description: "Leisure morning on the white sands of My Khe Beach. Evening witness the famous Dragon Bridge breathe fire and water in Da Nang.",
          },
          {
            day: 7,
            title: "Departure from Da Nang",
            description: "Breakfast at hotel and timely private transfer to Da Nang International Airport.",
          },
        ]),
        images_json: JSON.stringify([
          "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1000&q=80",
        ]),
        departure_dates_json: JSON.stringify(["Every Saturday"]),
        rating: 4.96,
        review_count: 29,
        max_group_size: 15,
      },
      {
        id: "tour_switzerland_romance",
        destination_id: "dest_switzerland",
        slug: "magical-switzerland-paris-alpine-romance",
        title: "Magical Switzerland & Paris: Alps, Jungfraujoch & Eiffel Tower",
        subtitle: "8 Days of pure European grandeur, Swiss mountain peaks, Glacier trains and Parisian charm",
        duration_days: 8,
        duration_nights: 7,
        price: 135000,
        original_price: 165000,
        featured: 1,
        category: "Luxury & Honeymoon",
        tour_type: "European Explorer",
        overview: "The quintessential dream European journey! Stand on the Top of Europe at Jungfraujoch surrounded by snow-covered glaciers, ride the rotating cable car to Mount Titlis, cruise the Seine River in Paris, and behold the glittering Eiffel Tower at night.",
        highlights_json: JSON.stringify([
          "Jungfraujoch Top of Europe cogwheel mountain excursion",
          "Mount Titlis Rotair revolving cable car with Cliff Walk suspension bridge",
          "Scenic Lake Lucerne cruise & Chapel Bridge walking tour",
          "Paris Eiffel Tower 2nd Floor access & 1-hour Seine River illuminations cruise",
          "Comprehensive guided Paris City tour (Louvre, Arc de Triomphe, Champs-Élysées)",
          "High-speed TGV train from Paris to Zurich/Lucerne",
        ]),
        inclusions_json: JSON.stringify([
          "7 Nights in top-rated 4-Star hotels (3 Nights Paris + 4 Nights Central Switzerland)",
          "Daily European buffet breakfast",
          "High-Speed TGV Train tickets (Paris to Switzerland)",
          "Swiss Travel Pass for unlimited mountain trains, buses & lake boats",
          "Schengen Visa appointment assistance & documentation support",
        ]),
        exclusions_json: JSON.stringify([
          "International Flights (exclusive negotiated airfares through our Flight Desk)",
          "Schengen Visa fee and travel insurance",
          "Lunches and dinners not explicitly specified",
        ]),
        itinerary_json: JSON.stringify([
          {
            day: 1,
            title: "Bonjour Paris - City of Lights",
            description: "Arrival at Paris Charles de Gaulle Airport. Private Mercedes transfer to your central Paris hotel. Evening Seine River cruise as monuments illuminate.",
          },
          {
            day: 2,
            title: "Eiffel Tower 2nd Level & Parisian Landmarks",
            description: "Ascend to the 2nd level of Eiffel Tower for panoramic city vistas. Guided drive along Champs-Élysées, Arc de Triomphe, Place de la Concorde, and exterior Louvre pyramid.",
          },
          {
            day: 3,
            title: "Day at Leisure in Paris / Optional Disneyland Paris",
            description: "Spend the day shopping at Galeries Lafayette, exploring Montmartre and Sacré-Cœur, or taking an optional day pass to Disneyland Paris.",
          },
          {
            day: 4,
            title: "High-Speed TGV Train to Switzerland (Zurich/Lucerne)",
            description: "Board the high-speed TGV train crossing the French countryside into Switzerland. Arrive in scenic Lucerne nestled beside Lake Lucerne and Mount Pilatus.",
          },
          {
            day: 5,
            title: "Mount Titlis Rotair & Glacier Cave",
            description: "Ascend to 10,000 feet on the world's first revolving cable car. Walk inside the Glacier Cave, cross Europe's highest suspension bridge, and enjoy snow activities.",
          },
          {
            day: 6,
            title: "Jungfraujoch - Top of Europe Mountain Rail",
            description: "Travel to Interlaken and board the Eiger Express tricable gondola to Jungfraujoch at 3,454m. Marvel at the Aletsch Glacier and the sparkling Ice Palace.",
          },
          {
            day: 7,
            title: "Lake Lucerne Cruise & Swiss Chocolate Shopping",
            description: "Relaxing paddle steamer boat cruise on Lake Lucerne. Stroll across the 14th-century wooden Chapel Bridge and shop for authentic Swiss chocolates and watches.",
          },
          {
            day: 8,
            title: "Zurich Departure",
            description: "Scenic train to Zurich Airport for your international return flight home.",
          },
        ]),
        images_json: JSON.stringify([
          "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1000&q=80",
        ]),
        departure_dates_json: JSON.stringify(["Every Sunday"]),
        rating: 4.98,
        review_count: 22,
        max_group_size: 18,
      },
    ];

    for (const t of tours) {
      await db.execute({
        sql: `INSERT INTO tours (id, destination_id, slug, title, subtitle, duration_days, duration_nights, price, original_price, featured, category, tour_type, overview, highlights_json, inclusions_json, exclusions_json, itinerary_json, images_json, departure_dates_json, rating, review_count, max_group_size)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          t.id,
          t.destination_id,
          t.slug,
          t.title,
          t.subtitle,
          t.duration_days,
          t.duration_nights,
          t.price,
          t.original_price,
          t.featured,
          t.category,
          t.tour_type,
          t.overview,
          t.highlights_json,
          t.inclusions_json,
          t.exclusions_json,
          t.itinerary_json,
          t.images_json,
          t.departure_dates_json,
          t.rating,
          t.review_count,
          t.max_group_size,
        ],
      });
    }
  }

  // Check if branches exist
  const existingBranches = await db.execute("SELECT COUNT(*) as count FROM branches");
  if (Number(existingBranches.rows[0]?.count || 0) === 0) {
    console.log("--> Seeding Branches...");
    const branches = [
      {
        id: "br_secunderabad",
        city: "Secunderabad (Hyderabad)",
        state: "Telangana",
        branch_type: "Head Office",
        address: "2-2-51, Shop No. 2, Mittal Chambers (Opposite Raj Classic Inn), M.G. Road, Secunderabad - 500003, Telangana, India",
        phone: "+91 91002 28152",
        email: "yellowribbontravels@gmail.com",
        google_maps_url: "https://maps.google.com/?q=Mittal+Chambers+MG+Road+Secunderabad",
        manager_name: "Rajesh Sharma",
        manager_phone: "+91 91002 28152",
        timing: "Mon - Sat: 9:30 AM - 7:30 PM | Sun: By Appointment",
        is_active: 1,
      },
      {
        id: "br_chennai",
        city: "Chennai",
        state: "Tamil Nadu",
        branch_type: "Regional Office",
        address: "No. 42/1, Anna Salai, Thousand Lights, Near Spencer Plaza, Chennai - 600006, Tamil Nadu, India",
        phone: "+91 98401 54321",
        email: "chennai@yellowribbontravels.com",
        google_maps_url: "https://maps.google.com/?q=Anna+Salai+Chennai",
        manager_name: "Karthik Subramanian",
        manager_phone: "+91 98401 54321",
        timing: "Mon - Sat: 10:00 AM - 7:00 PM",
        is_active: 1,
      },
      {
        id: "br_pune",
        city: "Pune",
        state: "Maharashtra",
        branch_type: "Branch Office",
        address: "Office 304, Marvel Alura, Near Phoenix Marketcity, Viman Nagar, Pune - 411014, Maharashtra, India",
        phone: "+91 97654 32190",
        email: "pune@yellowribbontravels.com",
        google_maps_url: "https://maps.google.com/?q=Viman+Nagar+Pune",
        manager_name: "Pooja Kulkarni",
        manager_phone: "+91 97654 32190",
        timing: "Mon - Sat: 10:00 AM - 7:00 PM",
        is_active: 1,
      },
      {
        id: "br_dahod",
        city: "Dahod",
        state: "Gujarat",
        branch_type: "Branch Office",
        address: "1st Floor, Royal Arcade, Station Road, Dahod - 389151, Gujarat, India",
        phone: "+91 94270 88912",
        email: "dahod@yellowribbontravels.com",
        google_maps_url: "https://maps.google.com/?q=Station+Road+Dahod",
        manager_name: "Bhavin Patel",
        manager_phone: "+91 94270 88912",
        timing: "Mon - Sat: 9:30 AM - 6:30 PM",
        is_active: 1,
      },
      {
        id: "br_patna",
        city: "Patna",
        state: "Bihar",
        branch_type: "Branch Office",
        address: "Suite 208, Maurya Lok Complex, Dak Bungalow Road, Patna - 800001, Bihar, India",
        phone: "+91 93341 67890",
        email: "patna@yellowribbontravels.com",
        google_maps_url: "https://maps.google.com/?q=Maurya+Lok+Complex+Patna",
        manager_name: "Amit Kumar Roy",
        manager_phone: "+91 93341 67890",
        timing: "Mon - Sat: 10:00 AM - 6:30 PM",
        is_active: 1,
      },
    ];

    for (const b of branches) {
      await db.execute({
        sql: `INSERT INTO branches (id, city, state, branch_type, address, phone, email, google_maps_url, manager_name, manager_phone, timing, is_active)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          b.id,
          b.city,
          b.state,
          b.branch_type,
          b.address,
          b.phone,
          b.email,
          b.google_maps_url,
          b.manager_name,
          b.manager_phone,
          b.timing,
          b.is_active,
        ],
      });
    }
  }

  // Check if reviews exist
  const existingReviews = await db.execute("SELECT COUNT(*) as count FROM reviews");
  if (Number(existingReviews.rows[0]?.count || 0) === 0) {
    console.log("--> Seeding Google Reviews...");
    const reviews = [
      {
        id: "rev_1",
        author_name: "Dr. Anirudh Rao",
        author_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        review_date: "2026-09-18",
        comment: "Booked our family vacation to Bali with Yellow Ribbon Travels. Every single detail from airport meet-and-greet in Denpasar, Nusa Penida fast boat, and Jimbaran beach dinner was seamlessly arranged. 24/7 WhatsApp response was reassuring!",
        source: "Google",
        verified: 1,
        trip_type: "Family Vacation",
        helpful_count: 24,
      },
      {
        id: "rev_2",
        author_name: "Sneha Reddy & Vikram",
        author_avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        review_date: "2026-09-02",
        comment: "We planned our honeymoon to Kashmir through the Secunderabad office. Staying in the luxury houseboat on Dal Lake was a dream come true. The driver was polite and Gulmarg Gondola tickets were arranged prior to our arrival so no standing in queues!",
        source: "Google",
        verified: 1,
        trip_type: "Honeymoon",
        helpful_count: 19,
      },
      {
        id: "rev_3",
        author_name: "Manoj Agarwal",
        author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        review_date: "2026-08-14",
        comment: "Top notch flight booking and corporate travel service. Yellow Ribbon Travels helped us rebook our international connection when a European airline had a sudden schedule change. Super reliable agency!",
        source: "Google",
        verified: 1,
        trip_type: "Corporate Travel",
        helpful_count: 15,
      },
      {
        id: "rev_4",
        author_name: "Farah Naaz",
        author_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        review_date: "2026-07-29",
        comment: "Our Dubai tour was fantastic! Desert safari dune bashing was exciting and the Burj Khalifa 124th floor view at sunset was spectacular. Great prices and completely transparent with no hidden surprises.",
        source: "Google",
        verified: 1,
        trip_type: "Friends Trip",
        helpful_count: 11,
      },
      {
        id: "rev_5",
        author_name: "Capt. Ravinder Singh",
        author_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        review_date: "2026-06-11",
        comment: "Yellow Ribbon Travels handled our group of 14 people to Vietnam including Halong Bay overnight cruise. Excellent coaches, professional English speaking guides, and delicious Indian meals arranged when requested. 5 stars all the way.",
        source: "Google",
        verified: 1,
        trip_type: "Group Tour",
        helpful_count: 32,
      },
      {
        id: "rev_6",
        author_name: "Pooja & Rohan Joshi",
        author_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        review_date: "2026-05-20",
        comment: "The Pune branch team guided us through Switzerland travel pass and Paris TGV booking. Everything ran like clockwork. Thank you Yellow Ribbon for turning our Europe dream into reality!",
        source: "Google",
        verified: 1,
        trip_type: "Couple Vacation",
        helpful_count: 18,
      },
    ];

    for (const r of reviews) {
      await db.execute({
        sql: `INSERT INTO reviews (id, author_name, author_avatar, rating, review_date, comment, source, verified, is_published, trip_type, helpful_count)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          r.id,
          r.author_name,
          r.author_avatar,
          r.rating,
          r.review_date,
          r.comment,
          r.source,
          r.verified,
          1,
          r.trip_type,
          r.helpful_count,
        ],
      });
    }
  }

  // Check if gallery items exist
  const existingGallery = await db.execute("SELECT COUNT(*) as count FROM gallery_items");
  if (Number(existingGallery.rows[0]?.count || 0) === 0) {
    console.log("--> Seeding Gallery items...");
    const galleryItems = [
      {
        id: "gal_1",
        title: "Traditional Kashmiri Shikara on Dal Lake",
        url: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
        category: "Destinations",
        caption: "Peaceful morning waters on Dal Lake surrounded by Zabarwan mountains",
        tags_json: JSON.stringify(["Kashmir", "Dal Lake", "India", "Domestic"]),
        is_featured: 1,
      },
      {
        id: "gal_2",
        title: "Kelingking Beach T-Rex Cliff, Nusa Penida",
        url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
        category: "Destinations",
        caption: "The majestic cliff formation towering over azure waters in Bali",
        tags_json: JSON.stringify(["Bali", "Nusa Penida", "Beaches", "International"]),
        is_featured: 1,
      },
      {
        id: "gal_3",
        title: "Burj Khalifa Towering Over Dubai",
        url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
        category: "Tours",
        caption: "Sunset lighting over the futuristic Dubai skyline and Downtown fountains",
        tags_json: JSON.stringify(["Dubai", "Luxury", "Architecture"]),
        is_featured: 1,
      },
      {
        id: "gal_4",
        title: "Emerald Alleppey Houseboat Canals",
        url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
        category: "Hotels & Stays",
        caption: "Luxury thatched houseboat gliding smoothly through coconut-fringed backwaters",
        tags_json: JSON.stringify(["Kerala", "Alleppey", "Houseboat"]),
        is_featured: 1,
      },
      {
        id: "gal_5",
        title: "Halong Bay Limestone Karsts",
        url: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
        category: "Destinations",
        caption: "5-star luxury cruise passing through UNESCO limestone towers",
        tags_json: JSON.stringify(["Vietnam", "Halong Bay", "Cruise"]),
        is_featured: 1,
      },
      {
        id: "gal_6",
        title: "Swiss Alpine Glacier Express Route",
        url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
        category: "Tours",
        caption: "Panoramic mountain railway winding through pristine snow-clad Swiss Alps",
        tags_json: JSON.stringify(["Switzerland", "Alps", "Europe"]),
        is_featured: 1,
      },
      {
        id: "gal_7",
        title: "Desert Safari Sunset Dune Bashing",
        url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
        category: "Travelers",
        caption: "Our happy traveler group enjoying golden hour in Dubai desert dunes",
        tags_json: JSON.stringify(["Dubai", "Desert", "Adventure"]),
        is_featured: 1,
      },
      {
        id: "gal_8",
        title: "High Altitude Flight Above the Clouds",
        url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
        category: "Flights",
        caption: "Wing view on departure flight booked via Yellow Ribbon Travels flight desk",
        tags_json: JSON.stringify(["Flights", "Aviation", "Sky"]),
        is_featured: 1,
      },
    ];

    for (const g of galleryItems) {
      await db.execute({
        sql: `INSERT INTO gallery_items (id, title, url, category, caption, tags_json, is_featured)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [g.id, g.title, g.url, g.category, g.caption, g.tags_json, g.is_featured],
      });
    }
  }

  // Check if team members exist
  const existingTeam = await db.execute("SELECT COUNT(*) as count FROM team_members");
  if (Number(existingTeam.rows[0]?.count || 0) === 0) {
    console.log("--> Seeding Team members...");
    const team = [
      {
        id: "tm_1",
        name: "Sanjay Singhania",
        designation: "Founder & Managing Director",
        department: "Executive Leadership",
        bio: "With over 18 years of travel industry leadership, Sanjay established Yellow Ribbon Travels with a singular passion: delivering transparent, bespoke, and heartfelt travel journeys across the globe.",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
        phone: "+91 91002 28152",
        email: "sanjay@yellowribbontravels.com",
        linkedin: "https://linkedin.com",
        order_index: 1,
      },
      {
        id: "tm_2",
        name: "Meera Krishnan",
        designation: "Director - International Operations",
        department: "International Tours",
        bio: "Meera curates our signature Europe and Southeast Asia itineraries, managing direct contracts with 5-star properties, yacht operators, and accredited English-speaking destination guides.",
        image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
        phone: "+91 91002 28153",
        email: "meera@yellowribbontravels.com",
        linkedin: "https://linkedin.com",
        order_index: 2,
      },
      {
        id: "tm_3",
        name: "Syed Rehan",
        designation: "Head of Flight Desk & Ticketing",
        department: "Aviation & Ticketing",
        bio: "IATA certified ticketing maven with 12+ years optimizing flight connections, complex multi-city routes, and securing special corporate & group airfare rates.",
        image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
        phone: "+91 91002 28154",
        email: "flights@yellowribbontravels.com",
        linkedin: "https://linkedin.com",
        order_index: 3,
      },
      {
        id: "tm_4",
        name: "Ananya Deshmukh",
        designation: "Senior Custom Holiday Architect",
        department: "Custom Tours",
        bio: "Specializing in luxury honeymoons and milestone family getaways to Kashmir, Bali, Dubai, and Switzerland with attention to personalized amenities and surprise celebrations.",
        image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
        phone: "+91 91002 28155",
        email: "ananya@yellowribbontravels.com",
        linkedin: "https://linkedin.com",
        order_index: 4,
      },
    ];

    for (const t of team) {
      await db.execute({
        sql: `INSERT INTO team_members (id, name, designation, department, bio, image_url, phone, email, linkedin, order_index)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [t.id, t.name, t.designation, t.department, t.bio, t.image_url, t.phone, t.email, t.linkedin, t.order_index],
      });
    }
  }

  // Check if blogs exist
  const existingBlogs = await db.execute("SELECT COUNT(*) as count FROM blogs");
  if (Number(existingBlogs.rows[0]?.count || 0) === 0) {
    console.log("--> Seeding Blogs...");
    const blogs = [
      {
        id: "blog_1",
        slug: "ultimate-first-time-international-travel-guide-from-india",
        title: "The Ultimate Guide to Planning Your First International Trip from India",
        excerpt: "Everything you need to know about passport validity, visas on arrival, forex cards, sim cards, and smart flight booking tips.",
        content: `### Stepping Into The World: Your First International Journey
Planning your maiden international vacation is an electrifying milestone. However, between deciphering visa protocols, currency conversion, baggage allowances, and flight layovers, it is easy to feel overwhelmed. Here is our expert guide from Yellow Ribbon Travels to ensure a buttery-smooth voyage.

#### 1. Passport First: The 6-Month Rule
Before daydreaming about the Eiffel Tower or Bali's cliffs, inspect your passport's expiration date. Nearly all foreign countries require at least 6 months of validity remaining from your planned date of departure. Also ensure you have at least 3 blank pages for immigration stamps.

#### 2. Hassle-Free Visa on Arrival & eVisa Destinations
For first-timers, countries offering free or low-friction Visas on Arrival or quick eVisas are the sweetest starting point:
- **Thailand:** Tourist visa exemptions / quick e-visas
- **Indonesia (Bali):** Fast 30-day Visa on Arrival (VoA) or eVisa
- **Dubai / UAE:** Fast 48-hour online visa issuance through our agency
- **Vietnam:** Simple 3-day online eVisa

#### 3. Smart Flight Ticketing Hacks
Always book through an accredited travel desk that monitors schedule updates. Layovers under 90 minutes in vast international hubs can lead to missed connections, while layovers exceeding 8 hours can be exhausting. Our flight desk curates the ideal transit times and baggage interlining.

#### 4. Managing Money Abroad
Avoid exchanging large sums of cash at airport counters which carry hefty 8-12% commission markups. Instead:
- Carry a multi-currency zero-forex debit or credit card
- Keep 20-30% of your budget in local physical currency for street food, tuk-tuks, and tip gratuities
- Always inform your issuing bank prior to international card swipes to avoid fraud blocks

#### 5. Stay Connected With Local eSIMs
Instead of paying exorbitant roaming packs, grab a local 4G/5G physical SIM or digital eSIM on arrival. Yellow Ribbon Travels provides pre-activated data SIM options in all our holiday packages so you can video call family the moment you touch down.`,
        cover_image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
        author: "Yellow Ribbon Editorial",
        read_time: "6 min read",
        tags_json: JSON.stringify(["Travel Tips", "International", "Visa Guide", "First Time Flyers"]),
        is_featured: 1,
      },
      {
        id: "blog_2",
        slug: "kashmir-hidden-gems-beyond-standard-itineraries",
        title: "7 Enchanting Hidden Gems in Kashmir You Won't Find in Routine Packages",
        excerpt: "From the untouched meadows of Doodhpathri to the secret springs of Verinag and walnut groves of Bungus Valley.",
        content: `### Kashmir Beyond The Postcards
While everyone flocks to Dal Lake and Gulmarg Gondola, Kashmir harbors secret valleys untouched by commercial bustle. Here are 7 sublime locations our custom tour designers love to incorporate for discerning travelers.

#### 1. Doodhpathri — The Valley of Milk
Located just 42 km from Srinagar in Budgam district, Doodhpathri is a rolling green carpet of meadows intersected by the frothing white waters of the Shaliganga River. It earned the name 'Valley of Milk' because cattle grazing here produce extraordinarily rich milk.

#### 2. Sinthan Top
At an elevation of 12,000 feet, Sinthan Top connects the Kashmir Valley with the Jammu region via Anantnag. It offers a 360-degree panoramic sight of both provinces and remains covered with snow almost 365 days a year.

#### 3. Bungus Valley in Kupwara
A pristine ecological sanctuary encircled by Shamsbari mountain ranges. Bungus features vast sub-alpine meadows carpeted with wild gentians and primulas, where shepherds graze sheep undisturbed by tourist vehicles.

#### 4. Verinag — The Cradle of River Jhelum
Built by Mughal Emperor Jahangir in 1620, the deep blue circular spring at Verinag is the origin point of the sacred Jhelum River. The stone colonnades and chinar groves here are a tranquil meditation retreat.

#### 5. Chatpal — Off the Grid in South Kashmir
If you want to disconnect from WhatsApp and reconnect with pine scent, Chatpal is your haven. No commercial hotels, just cozy forest department lodges and crystal clear trout streams.`,
        cover_image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
        author: "Ananya Deshmukh",
        read_time: "5 min read",
        tags_json: JSON.stringify(["Kashmir", "Hidden Gems", "Offbeat India", "Honeymoon"]),
        is_featured: 1,
      },
      {
        id: "blog_3",
        slug: "bali-vs-vietnam-budget-and-experience-comparison",
        title: "Bali vs Vietnam: Which Southeast Asian Gem Fits Your Holiday Style?",
        excerpt: "A transparent comparison of flight costs, hotel luxury, culinary landscapes, and activities between two tropical favorites.",
        content: `### The Great Southeast Asian Dilemma
Two of our most frequently requested international destinations at Yellow Ribbon Travels are Bali (Indonesia) and Vietnam. Both promise exotic adventures, warm hospitality, and unforgettable memories—but each caters to distinct travel rhythms.

#### Cost of Flights
Direct and 1-stop flights from Hyderabad, Chennai, Bangalore, and Delhi:
- **Vietnam:** Flights to Hanoi or Ho Chi Minh City are typically 15-25% more affordable and have shorter flight times (approx 4.5 hours direct).
- **Bali:** Flight durations are slightly longer (approx 7 to 9 hours with a stopover in Kuala Lumpur or Singapore).

#### Accommodations & Luxury Stays
- **Bali:** King of private pool villas. For ₹5,000 to ₹9,000 per night, you can stay in a breathtaking private villa with a floating breakfast pool in Ubud or Seminyak.
- **Vietnam:** Outstanding value in 5-star French colonial heritage hotels and overnight luxury cruises in Halong Bay.

#### Food & Culinary Wonders
- **Bali:** Huge variety of trendy organic cafes, smoothie bowls, Indonesian Satay, and Indian restaurants in Kuta, Seminyak, and Ubud.
- **Vietnam:** Street food heaven! Steaming bowls of beef Phở, crispy Bánh mì baguettes, fresh spring rolls, and the unforgettable egg coffee.

#### The Verdict
- Choose **Bali** if you want romantic beaches, cliff sunsets, surf vibes, private pool relaxation, and wellness retreats.
- Choose **Vietnam** if you crave deep history, UNESCO cruise landscapes, rich coffee culture, and lively street life.

Can't decide? Contact our travel architects at Yellow Ribbon Travels to craft a custom multi-destination combo!`,
        cover_image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
        author: "Meera Krishnan",
        read_time: "7 min read",
        tags_json: JSON.stringify(["Bali", "Vietnam", "Comparison", "Budget Travel"]),
        is_featured: 0,
      },
    ];

    for (const b of blogs) {
      await db.execute({
        sql: `INSERT INTO blogs (id, slug, title, excerpt, content, cover_image, author, read_time, tags_json, is_featured)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [b.id, b.slug, b.title, b.excerpt, b.content, b.cover_image, b.author, b.read_time, b.tags_json, b.is_featured],
      });
    }
  }

  // Check if site settings exist
  const existingSettings = await db.execute("SELECT COUNT(*) as count FROM site_settings");
  if (Number(existingSettings.rows[0]?.count || 0) === 0) {
    console.log("--> Seeding Site Settings...");
    const settings = [
      { key: "company_name", value: "Yellow Ribbon Travels", group_name: "general" },
      { key: "company_tagline", value: "Curating Memorable Journeys Across the Globe", group_name: "general" },
      { key: "phone_primary", value: "+91 91002 28152", group_name: "contact" },
      { key: "email_primary", value: "yellowribbontravels@gmail.com", group_name: "contact" },
      { key: "whatsapp_number", value: "+919100228152", group_name: "contact" },
      { key: "head_office_address", value: "2-2-51, Shop No. 2, Mittal Chambers, M.G. Road, Secunderabad, Hyderabad, Telangana - 500003", group_name: "contact" },
      { key: "google_rating", value: "4.9", group_name: "social_proof" },
      { key: "total_reviews_count", value: "480+", group_name: "social_proof" },
      { key: "happy_travelers_count", value: "15,000+", group_name: "social_proof" },
      { key: "destinations_count", value: "50+", group_name: "social_proof" },
      { key: "years_experience", value: "12+", group_name: "social_proof" },
      { key: "announcement_banner_text", value: "✈️ Summer Holiday Sale: Get up to ₹8,000 off on International Packages! Enquire today.", group_name: "marketing" },
      { key: "announcement_banner_active", value: "true", group_name: "marketing" },
    ];

    for (const s of settings) {
      await db.execute({
        sql: `INSERT INTO site_settings (key, value, group_name) VALUES (?, ?, ?)`,
        args: [s.key, s.value, s.group_name],
      });
    }
    // Ensure Razorpay settings exist (both Live and Test credentials)
    const razorpaySettings = [
      { key: "razorpay_mode", value: "test", group_name: "payment" },
      { key: "razorpay_key_id_live", value: process.env.RAZORPAY_KEY_ID_LIVE || "", group_name: "payment" },
      { key: "razorpay_key_secret_live", value: process.env.RAZORPAY_KEY_SECRET_LIVE || "", group_name: "payment" },
      { key: "razorpay_key_id_test", value: process.env.RAZORPAY_KEY_ID_TEST || process.env.RAZORPAY_KEY_ID || "rzp_test_YellowRibbonTravels", group_name: "payment" },
      { key: "razorpay_key_secret_test", value: process.env.RAZORPAY_KEY_SECRET_TEST || process.env.RAZORPAY_KEY_SECRET || "rzp_sec_TravelsYRT910022", group_name: "payment" },
      { key: "razorpay_key_id", value: process.env.RAZORPAY_KEY_ID || "rzp_test_YellowRibbonTravels", group_name: "payment" },
      { key: "razorpay_key_secret", value: process.env.RAZORPAY_KEY_SECRET || "rzp_sec_TravelsYRT910022", group_name: "payment" },
      { key: "razorpay_enabled", value: "true", group_name: "payment" },
      { key: "razorpay_currency", value: "INR", group_name: "payment" },
    ];
    for (const rz of razorpaySettings) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO site_settings (key, value, group_name) VALUES (?, ?, ?)`,
        args: [rz.key, rz.value, rz.group_name],
      });
    }
  }

  // Also ensure outside the if block that razorpay settings exist in already seeded databases
  const standaloneRazorpaySettings = [
    { key: "razorpay_mode", value: "test", group_name: "payment" },
    { key: "razorpay_key_id_live", value: process.env.RAZORPAY_KEY_ID_LIVE || "", group_name: "payment" },
    { key: "razorpay_key_secret_live", value: process.env.RAZORPAY_KEY_SECRET_LIVE || "", group_name: "payment" },
    { key: "razorpay_key_id_test", value: process.env.RAZORPAY_KEY_ID_TEST || process.env.RAZORPAY_KEY_ID || "rzp_test_YellowRibbonTravels", group_name: "payment" },
    { key: "razorpay_key_secret_test", value: process.env.RAZORPAY_KEY_SECRET_TEST || process.env.RAZORPAY_KEY_SECRET || "rzp_sec_TravelsYRT910022", group_name: "payment" },
    { key: "razorpay_enabled", value: "true", group_name: "payment" },
    { key: "razorpay_currency", value: "INR", group_name: "payment" },
    { key: "flight_popup_enabled", value: "true", group_name: "marketing" },
    { key: "flight_popup_delay_sec", value: "2.5", group_name: "marketing" },
    { key: "flight_popup_heading", value: "Planning Your Next Flight?", group_name: "marketing" },
    { key: "flight_popup_subheading", value: "Exclusive domestic & international fares with instant WhatsApp quotations from our IATA Flight Desk.", group_name: "marketing" },
    { key: "google_analytics_id", value: process.env.NEXT_PUBLIC_GA_ID || "G-YRTRAVELS01", group_name: "seo" },
    { key: "google_site_verification", value: process.env.GOOGLE_SITE_VERIFICATION || "", group_name: "seo" },
    { key: "bing_site_verification", value: "", group_name: "seo" },
  ];
  for (const rz of standaloneRazorpaySettings) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO site_settings (key, value, group_name) VALUES (?, ?, ?)`,
      args: [rz.key, rz.value, rz.group_name],
    });
  }

  // Ensure branches schema columns exist (for existing database)
  try {
    await db.execute("ALTER TABLE branches ADD COLUMN country TEXT NOT NULL DEFAULT 'India'");
  } catch {
    // Column already exists
  }
  try {
    await db.execute("ALTER TABLE branches ADD COLUMN is_international INTEGER NOT NULL DEFAULT 0");
  } catch {
    // Column already exists
  }
  try {
    await db.execute("ALTER TABLE branches ADD COLUMN map_embed_url TEXT");
  } catch {
    // Column already exists
  }

  // Check if international branches exist
  const existingIntlBranches = await db.execute(
    "SELECT COUNT(*) as count FROM branches WHERE is_international = 1"
  );
  if (Number(existingIntlBranches.rows[0]?.count || 0) === 0) {
    console.log("--> Seeding International Branches...");
    const intlBranches = [
      {
        id: "br_dubai",
        city: "Dubai",
        state: "Dubai Emirate",
        country: "United Arab Emirates",
        is_international: 1,
        branch_type: "International Branch",
        address: "Suite 1402, Al Saaha Tower, Old Town Island, Downtown Dubai, United Arab Emirates",
        phone: "+971 4 390 1284",
        email: "dubai@yellowribbontravels.com",
        google_maps_url: "https://maps.google.com/?q=Downtown+Dubai",
        manager_name: "Tariq Mansoor",
        manager_phone: "+971 50 892 4115",
        timing: "Mon - Sat: 10:00 AM - 7:00 PM GST",
        is_active: 1,
      },
      {
        id: "br_london",
        city: "London",
        state: "Greater London",
        country: "United Kingdom",
        is_international: 1,
        branch_type: "International Branch",
        address: "Suite 4B, 18-20 Russell Street, Covent Garden, London WC2B 5HP, United Kingdom",
        phone: "+44 20 7946 0912",
        email: "london@yellowribbontravels.com",
        google_maps_url: "https://maps.google.com/?q=Russell+Street+Covent+Garden+London",
        manager_name: "Edward Sterling",
        manager_phone: "+44 7700 900341",
        timing: "Mon - Fri: 9:00 AM - 6:00 PM GMT",
        is_active: 1,
      },
      {
        id: "br_singapore",
        city: "Singapore",
        state: "Singapore",
        country: "Singapore",
        is_international: 1,
        branch_type: "International Representative",
        address: "Level 28, Marina Bay Financial Centre Tower 1, 8 Marina Blvd, Singapore 018981",
        phone: "+65 6712 8840",
        email: "singapore@yellowribbontravels.com",
        google_maps_url: "https://maps.google.com/?q=Marina+Bay+Financial+Centre+Singapore",
        manager_name: "Lin Wei Chen",
        manager_phone: "+65 9123 4567",
        timing: "Mon - Sat: 9:30 AM - 6:30 PM SGT",
        is_active: 1,
      },
    ];

    for (const b of intlBranches) {
      await db.execute({
        sql: `INSERT OR REPLACE INTO branches (id, city, state, country, is_international, branch_type, address, phone, email, google_maps_url, manager_name, manager_phone, timing, is_active)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          b.id,
          b.city,
          b.state,
          b.country,
          b.is_international,
          b.branch_type,
          b.address,
          b.phone,
          b.email,
          b.google_maps_url,
          b.manager_name,
          b.manager_phone,
          b.timing,
          b.is_active,
        ],
      });
    }
  }

  // Seed sample Payment Links if none exist
  const existingPayLinks = await db.execute("SELECT COUNT(*) as count FROM payment_links");
  if (Number(existingPayLinks.rows[0]?.count || 0) === 0) {
    console.log("--> Seeding Sample Payment Links...");
    await db.execute({
      sql: `INSERT INTO payment_links (id, link_code, customer_name, customer_email, customer_phone, amount, currency, purpose, description, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "pl_demo_1",
        "PAY-KASHMIR-9421",
        "Vikram Malhotra",
        "vikram.malhotra@gmail.com",
        "+91 98450 12345",
        45000,
        "INR",
        "Advance deposit for Kashmir 6D5N Holiday",
        "Includes Dal Lake houseboat stay, Gulmarg Gondola phase 1 & 2 tickets, and private Innova transfers.",
        "pending",
      ],
    });
    await db.execute({
      sql: `INSERT INTO payment_links (id, link_code, customer_name, customer_email, customer_phone, amount, currency, purpose, description, status, paid_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "pl_demo_2",
        "PAY-BALI-8832",
        "Ananya Roy",
        "ananya.roy@gmail.com",
        "+91 98200 54321",
        68000,
        "INR",
        "Bali Luxury Honeymoon Package Balance Payment",
        "Private pool villa stay in Ubud and Seminyak with floating breakfast and Jimbaran candlelight dinner.",
        "paid",
        new Date().toISOString(),
      ],
    });
  }

  // Seed sample Itineraries if none exist
  const existingItin = await db.execute("SELECT COUNT(*) as count FROM itineraries");
  if (Number(existingItin.rows[0]?.count || 0) === 0) {
    console.log("--> Seeding Sample Client Itineraries...");
    const swissDays = [
      {
        day: 1,
        title: "Arrival in Zurich & Scenic Train to Lucerne",
        description: "Welcome to Switzerland! Land at Zurich Airport (ZRH) where our executive airport assistant will meet you and escort you to the Swiss rail platform. Board the picturesque 45-minute direct train to Lucerne along lakes Zurich and Zug. Check into 5-star Hotel Schweizerhof Lucerne. Evening leisurely stroll across the world-famous 14th-century wooden Chapel Bridge (Kapellbrücke) and savor a Swiss fondue dinner beside the Reuss River.",
        meals: "Welcome Dinner",
        hotel: "Hotel Schweizerhof Lucerne (5-Star)",
      },
      {
        day: 2,
        title: "Mount Titlis Rotair Cableway & Lucerne Lake Cruise",
        description: "After an artisan buffet breakfast, take the scenic train to Engelberg. Board the world's first revolving cable car, 'Titlis Rotair', ascending to 10,000 feet. Walk through the mystical Glacier Cave, dare the Titlis Cliff Walk—Europe's highest suspension bridge—and enjoy snow sledding at Glacier Park. Afternoon scenic 1-hour cruise on Lake Lucerne with alpine panoramic views.",
        meals: "Breakfast & Alpine Lunch",
        hotel: "Hotel Schweizerhof Lucerne",
      },
      {
        day: 3,
        title: "GoldenPass Panoramic Train: Lucerne to Interlaken",
        description: "Board the GoldenPass Express panoramic train through the Brünig Pass, passing turquoise alpine lakes and cascading waterfalls. Check into Victoria-Jungfrau Grand Hotel & Spa in Interlaken. Afternoon horse carriage tour of Interlaken promenade with unobstructed views of the mighty Jungfrau peak.",
        meals: "Breakfast",
        hotel: "Victoria-Jungfrau Grand Hotel Interlaken",
      },
      {
        day: 4,
        title: "Jungfraujoch - Top of Europe (3,454m)",
        description: "Ascend via the futuristic Eiger Express 3S-cableway from Grindelwald Terminal, followed by the cogwheel railway to Europe's highest railway station (3,454m). Visit the Sphinx Observatory, the Ice Palace with intricate hand-carved ice sculptures, and gaze out at the Aletsch Glacier—the longest glacier in the Alps.",
        meals: "Breakfast & Glacier Restaurant Lunch",
        hotel: "Victoria-Jungfrau Grand Hotel Interlaken",
      },
      {
        day: 5,
        title: "High-Speed TGV Lyria to Paris - City of Lights",
        description: "Morning checkout and train to Basel, then board the high-speed TGV Lyria train directly to Paris Gare de Lyon (3 hrs). Check into Hôtel San Régis near Champs-Élysées. Evening private 1-hour Seine River Champagne illuminations cruise admiring Notre Dame, Musée d'Orsay, and the sparkling Eiffel Tower.",
        meals: "Breakfast",
        hotel: "Hôtel San Régis Paris (Luxury Boutique)",
      },
      {
        day: 6,
        title: "Eiffel Tower Summit, Louvre & Historic Montmartre",
        description: "Priority skip-the-line summit tickets to the Eiffel Tower for commanding vistas over Paris. Guided walking tour of Montmartre and Sacré-Cœur Basilica, followed by private tour of the Louvre Museum highlights including the Mona Lisa and Venus de Milo.",
        meals: "Breakfast",
        hotel: "Hôtel San Régis Paris",
      },
      {
        day: 7,
        title: "Palace of Versailles & Luxury Shopping at Galeries Lafayette",
        description: "Morning chauffeur-driven excursion to the Grand Palace of Versailles and its world-renowned Hall of Mirrors and manicured musical gardens. Afternoon VIP personal shopping session and rooftop skyline views at Galeries Lafayette Haussmann.",
        meals: "Breakfast & Farewell Dinner",
        hotel: "Hôtel San Régis Paris",
      },
      {
        day: 8,
        title: "Departure from Paris Charles de Gaulle (CDG)",
        description: "Enjoy a relaxed breakfast and fresh Parisian croissants. Private Mercedes Benz airport chauffeur transfer to CDG Airport for your return flight home with unforgettable memories.",
        meals: "Breakfast",
        hotel: "Departure",
      },
    ];

    await db.execute({
      sql: `INSERT INTO itineraries (
        id, reference_no, client_name, client_email, client_phone, destination, title,
        start_date, duration_days, duration_nights, travelers_count, hotel_details,
        flights_json, days_json, inclusions_json, exclusions_json, total_price, currency, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "itin_demo_1",
        "YRT-ITN-2026-001",
        "Rohit & Neha Verma",
        "rohit.verma@gmail.com",
        "+91 99887 66554",
        "Switzerland & Paris",
        "Grand European Honeymoon: Swiss Alps & Paris Romance",
        "2026-11-10",
        8,
        7,
        2,
        "5-Star Luxury: Hotel Schweizerhof Lucerne, Victoria-Jungfrau Interlaken, Hôtel San Régis Paris",
        JSON.stringify([
          { flight_no: "EK 525", from: "HYD (Hyderabad)", to: "DXB (Dubai)", depart: "09:40", arrive: "12:15" },
          { flight_no: "EK 87", from: "DXB (Dubai)", to: "ZRH (Zurich)", depart: "14:50", arrive: "19:25" },
          { flight_no: "AF 198", from: "CDG (Paris)", to: "BOM (Mumbai)", depart: "11:20", arrive: "23:45" },
        ]),
        JSON.stringify(swissDays),
        JSON.stringify([
          "7 Nights 5-star luxury boutique accommodation with daily champagne breakfasts",
          "Swiss Travel Pass 1st Class with unlimited trains, panoramic boats, and mountain discounts",
          "Eiger Express & Jungfraujoch Top of Europe cogwheel railway tickets",
          "Mount Titlis Rotair revolving cableway & Cliff Walk suspension pass",
          "High-speed TGV Lyria 1st Class ticket from Switzerland to Paris",
          "Private Seine River Champagne Cruise & Eiffel Tower Summit access",
          "Private airport luxury Mercedes transfers in Zurich and Paris",
          "24/7 dedicated Yellow Ribbon Travels concierge support on WhatsApp",
        ]),
        JSON.stringify([
          "Personal expenses, shopping, laundry, and minibar",
          "Lunch and dinner meals not specified in the itinerary",
          "Schengen visa processing fees (handled with our documentation desk)",
        ]),
        270000,
        "INR",
        "Confirmed",
        "Client requested pure vegetarian Indian restaurant recommendations for Paris and Lucerne. All included in concierge welcome pack.",
      ],
    });
  }

  // Seed sample Invoices if none exist
  const existingInvoices = await db.execute("SELECT COUNT(*) as count FROM invoices");
  if (Number(existingInvoices.rows[0]?.count || 0) === 0) {
    console.log("--> Seeding Sample Invoices...");
    const invoiceItems = [
      {
        description: "Grand European Honeymoon: Switzerland & Paris (2 Adults, 8 Days / 7 Nights)",
        quantity: 2,
        rate: 115000,
        amount: 230000,
      },
      {
        description: "Swiss Travel Pass 1st Class (8 Days Consecutive)",
        quantity: 2,
        rate: 13500,
        amount: 27000,
      },
      {
        description: "Schengen Visa Documentation & Appointment Slot Concierge",
        quantity: 2,
        rate: 2500,
        amount: 5000,
      },
    ];

    const subtotal = 262000;
    const taxPercent = 5;
    const taxAmount = (subtotal * taxPercent) / 100; // 13100
    const discount = 5100;
    const total = subtotal + taxAmount - discount; // 270000

    await db.execute({
      sql: `INSERT INTO invoices (
        id, invoice_number, type, client_name, client_email, client_phone, client_address,
        items_json, subtotal, tax_percent, tax_amount, discount_amount, total_amount,
        currency, status, due_date, notes, terms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "inv_demo_1",
        "INV-2026-0841",
        "Invoice",
        "Rohit Verma",
        "rohit.verma@gmail.com",
        "+91 99887 66554",
        "B-402, Banjara Hills Road No. 12, Hyderabad - 500034",
        JSON.stringify(invoiceItems),
        subtotal,
        taxPercent,
        taxAmount,
        discount,
        total,
        "INR",
        "Sent",
        "2026-10-25",
        "Includes luxury stay, Swiss travel passes, and Paris excursions as per itinerary YRT-ITN-2026-001.",
        "Payment is due within 7 days. All bookings are non-refundable 14 days prior to departure. GSTIN: 36AAECY9102K1Z5.",
      ],
    });

    // Sample Custom Quote
    const quoteItems = [
      {
        description: "Vietnam Wonders: Halong Bay Luxury Cruise & Hoi An Lanterns (2 Adults)",
        quantity: 2,
        rate: 54999,
        amount: 109998,
      },
      {
        description: "Vietnam Fast-Track eVisa Processing (Single Entry)",
        quantity: 2,
        rate: 2500,
        amount: 5000,
      },
    ];
    const quoteSub = 114998;
    const quoteTax = (quoteSub * 5) / 100;
    const quoteTotal = quoteSub + quoteTax;

    await db.execute({
      sql: `INSERT INTO invoices (
        id, invoice_number, type, client_name, client_email, client_phone, client_address,
        items_json, subtotal, tax_percent, tax_amount, discount_amount, total_amount,
        currency, status, due_date, notes, terms
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "inv_demo_2",
        "QTE-2026-0193",
        "Quote",
        "Aditi Sen",
        "aditi.sen@gmail.com",
        "+91 98711 22334",
        "Flat 301, Koregaon Park, Pune - 411001",
        JSON.stringify(quoteItems),
        quoteSub,
        5,
        quoteTax,
        0,
        quoteTotal,
        "INR",
        "Draft",
        "2026-10-30",
        "Custom quotation with 5-star Halong Bay Cruise and Da Nang Golden Bridge cable car access.",
        "Quote valid for 10 days from issuance date. Rates subject to flight airfare fluctuations.",
      ],
    });
  }

  console.log("--> Migrations & Seeding completed successfully!");
}
