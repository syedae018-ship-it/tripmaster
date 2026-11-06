const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedPhase5() {
  console.log("Seeding Phase 5: TripMaster Media Vault, Singapore Places & Preset Package...");

  // 1. Seed Media Vault
  const mediaVaultItems = [
    // Singapore Places & Attractions
    {
      title: "Changi Airport Jewel Waterfall",
      url: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "TRANSFER",
      fileSize: "1.2 MB",
    },
    {
      title: "Changi Airport Canopy Park",
      url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "TRANSFER",
      fileSize: "980 KB",
    },
    {
      title: "Gardens by the Bay Supertrees Dusk",
      url: "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "PLACE",
      fileSize: "1.4 MB",
    },
    {
      title: "Cloud Forest Mountain Waterfall",
      url: "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "PLACE",
      fileSize: "1.1 MB",
    },
    {
      title: "Flower Dome Floral Display",
      url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "PLACE",
      fileSize: "1.3 MB",
    },
    {
      title: "Universal Studios Singapore Globe & Gate",
      url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "PLACE",
      fileSize: "1.5 MB",
    },
    {
      title: "Universal Studios Rollercoaster & Thrills",
      url: "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "PLACE",
      fileSize: "1.2 MB",
    },
    {
      title: "Sentosa Cable Car Ride Panoramic",
      url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "PLACE",
      fileSize: "1.3 MB",
    },
    {
      title: "Madame Tussauds Singapore Wax Stars",
      url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "PLACE",
      fileSize: "1.0 MB",
    },
    {
      title: "Wings of Time Fireworks & Water Laser Show",
      url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "PLACE",
      fileSize: "1.6 MB",
    },
    {
      title: "Merlion Park & Marina Bay Sands View",
      url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "PLACE",
      fileSize: "1.4 MB",
    },
    {
      title: "Chinatown & Buddha Tooth Relic Temple",
      url: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "PLACE",
      fileSize: "1.1 MB",
    },
    {
      title: "Singapore Flyer Giant Observation Wheel",
      url: "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "PLACE",
      fileSize: "1.2 MB",
    },
    // Singapore Stays & Hotels
    {
      title: "Hotel Boss / V Hotel Lavender Deluxe Room",
      url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "HOTEL",
      fileSize: "1.3 MB",
    },
    {
      title: "Marina Bay Sands Luxury Skyline View Room",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "HOTEL",
      fileSize: "1.7 MB",
    },
    {
      title: "Grand Copthorne Waterfront Hotel Facade",
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "HOTEL",
      fileSize: "1.4 MB",
    },
    // Moments that matter
    {
      title: "Couple under Supertree Grove Lights",
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "MOMENT",
      fileSize: "1.2 MB",
    },
    {
      title: "Sentosa Siloso Beach Sunset Walk",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "MOMENT",
      fileSize: "1.4 MB",
    },
    {
      title: "Universal Studios Family Smiles",
      url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=85",
      destination: "Singapore",
      category: "MOMENT",
      fileSize: "1.1 MB",
    },
    // Hero Banner
    {
      title: "Singapore Marina Bay Sands Panorama",
      url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=85",
      destination: "Singapore",
      category: "BANNER",
      fileSize: "2.1 MB",
    },
  ];

  for (const item of mediaVaultItems) {
    await prisma.mediaItem.create({
      data: item,
    });
  }
  console.log(`✓ Seeded ${mediaVaultItems.length} media vault assets`);

  // 2. Seed Master Places Library for Singapore
  const masterPlaces = [
    {
      destination: "Singapore",
      placeTitle: "Airport Transfer (Changi Airport to Hotel)",
      locationSubtitle: "Changi Airport, Singapore",
      description:
        "Arrive at the world-renowned Singapore Changi Airport. Meet and greet with our representative and transfer in comfort via a private/shared air-conditioned coach to your city hotel. Check-in and relax.",
      category: "TRANSFER",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
      ]),
      tags: JSON.stringify(["Airport", "Chauffeur", "Arrival"]),
      order: 1,
    },
    {
      destination: "Singapore",
      placeTitle: "Gardens by the Bay",
      locationSubtitle: "18 Marina Gardens Dr, Singapore",
      description:
        "Explore Singapore's iconic futuristic horticultural wonderland. Stroll beneath the soaring Supertree Grove, vertical gardens spanning 25 to 50 meters that spring alive with an ambient evening light and music show.",
      category: "ATTRACTION",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      ]),
      tags: JSON.stringify(["Gardens", "Nature", "Futuristic"]),
      order: 2,
    },
    {
      destination: "Singapore",
      placeTitle: "Cloud Forest",
      locationSubtitle: "Gardens by the Bay, Singapore",
      description:
        "Ascend into a mist-filled mountain conservatory housing one of the world's tallest indoor waterfalls, cascading 35 meters down lush tropical high-elevation vegetation and exotic orchids.",
      category: "ATTRACTION",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&w=800&q=80",
      ]),
      tags: JSON.stringify(["Waterfall", "Cool Mist", "Flora"]),
      order: 3,
    },
    {
      destination: "Singapore",
      placeTitle: "Flower Dome",
      locationSubtitle: "Gardens by the Bay, Singapore",
      description:
        "Enter the Guinness World Record's largest glass greenhouse, replicating cool dry Mediterranean climates with seasonal vibrant floral displays from 5 continents including South Africa, California, and Australia.",
      category: "ATTRACTION",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
      ]),
      tags: JSON.stringify(["Flowers", "Conservatory", "Botany"]),
      order: 4,
    },
    {
      destination: "Singapore",
      placeTitle: "Jurassic World Experience",
      locationSubtitle: "Gardens by the Bay / Sentosa",
      description:
        "Step inside an exhilarating prehistoric journey featuring life-sized animatronic dinosaurs, immersive soundscapes, interactive sensory fossils, and photo opportunities with velociraptors.",
      category: "ATTRACTION",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
      ]),
      tags: JSON.stringify(["Dinosaurs", "Interactive", "Family"]),
      order: 5,
    },
    {
      destination: "Singapore",
      placeTitle: "Universal Studios Singapore",
      locationSubtitle: "8 Sentosa Gateway, Sentosa Island",
      description:
        "Experience Southeast Asia's only Universal Studios theme park. Thrill to state-of-the-art rides, shows, and attractions based on blockbuster movies across 6 themed zones including Sci-Fi City (Battlestar Galactica), Ancient Egypt, and The Lost World.",
      category: "ATTRACTION",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=800&q=80",
      ]),
      tags: JSON.stringify(["Theme Park", "Rollercoaster", "Sentosa"]),
      order: 6,
    },
    {
      destination: "Singapore",
      placeTitle: "Sentosa Island",
      locationSubtitle: "Sentosa Island, Singapore",
      description:
        "A premier sunny island resort destination famous for golden sandy beaches, world-class entertainment hubs, pristine beachfront restaurants, and tropical coastal greenery.",
      category: "ATTRACTION",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      ]),
      tags: JSON.stringify(["Island", "Beach", "Resort"]),
      order: 7,
    },
    {
      destination: "Singapore",
      placeTitle: "Sentosa Cable Car Ride",
      locationSubtitle: "Mount Faber Line & Sentosa Line",
      description:
        "Soar across Singapore Harbour on the iconic 360-degree glass cabin cable car. Enjoy breathtaking aerial panoramas of Mount Faber, luxury yachts, Sentosa coastline, and the sparkling Singapore skyline.",
      category: "ATTRACTION",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
      ]),
      tags: JSON.stringify(["Cable Car", "Aerial View", "Harbour"]),
      order: 8,
    },
    {
      destination: "Singapore",
      placeTitle: "Madame Tussauds Singapore",
      locationSubtitle: "Sentosa Imbiah Lookout",
      description:
        "Rub shoulders with life-like wax figures of global celebrities, Hollywood royalty, Bollywood icons, sports superstars, and historical legends, complete with the Spirit of Singapore boat ride and Marvel 4D experience.",
      category: "ATTRACTION",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
      ]),
      tags: JSON.stringify(["Wax Museum", "Celebrities", "Marvel 4D"]),
      order: 9,
    },
    {
      destination: "Singapore",
      placeTitle: "Wings of Time Light & Sound Show",
      locationSubtitle: "Siloso Beach, Sentosa",
      description:
        "A multi-sensory outdoor night spectacular staged against the open sea. Featuring dazzling water fountain projections, laser effects, dramatic bursts of fire, and an inspiring musical soundtrack.",
      category: "SHOW",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
      ]),
      tags: JSON.stringify(["Laser Show", "Beach", "Night"]),
      order: 10,
    },
    {
      destination: "Singapore",
      placeTitle: "Singapore City Tour & Merlion Park",
      locationSubtitle: "One Fullerton, Singapore",
      description:
        "Embark on a guided half-day exploration of Singapore. Stop at Merlion Park, Singapore's iconic half-lion half-fish national emblem overlooking Marina Bay Sands, the Padang, and colonial civic monuments.",
      category: "ATTRACTION",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
      ]),
      tags: JSON.stringify(["City Tour", "Merlion", "Heritage"]),
      order: 11,
    },
    {
      destination: "Singapore",
      placeTitle: "Chinatown & Buddha Tooth Relic Temple",
      locationSubtitle: "288 South Bridge Rd, Chinatown",
      description:
        "Discover Singapore's vibrant heritage quarter. Visit the grand Tang-dynasty styled Buddha Tooth Relic Temple and Museum, bustling traditional shophouses, and spice markets.",
      category: "ATTRACTION",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
      ]),
      tags: JSON.stringify(["Temple", "Heritage", "Chinatown"]),
      order: 12,
    },
    {
      destination: "Singapore",
      placeTitle: "Singapore Flyer & Airport Drop-off",
      locationSubtitle: "30 Raffles Ave & Changi Airport",
      description:
        "Photo stop at the giant 165-meter tall Singapore Flyer observation wheel. Later, bid farewell to the Lion City as our transfer whisks you to Changi Airport for your homeward journey.",
      category: "TRANSFER",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80",
      ]),
      tags: JSON.stringify(["Departure", "Flyer", "Airport"]),
      order: 13,
    },
  ];

  for (const p of masterPlaces) {
    await prisma.masterPlace.create({
      data: p,
    });
  }
  console.log(`✓ Seeded ${masterPlaces.length} reusable master places`);

  // 3. Upsert Singapore Explorer Preset Package in Package Table
  const sinPkg = await prisma.package.upsert({
    where: { slug: "singapore-explorer-3n4d" },
    update: {},
    create: {
      title: "Singapore Explorer (3 Nights, 4 Days)",
      slug: "singapore-explorer-3n4d",
      destination: "Singapore",
      durationDays: 4,
      durationNights: 3,
      basePrice: 38750,
      discountedPrice: 38750,
      featuredImage:
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1000&q=80",
      ]),
      overview:
        "Discover Singapore with our curated 3 Nights / 4 Days luxury itinerary. From the futuristic Supertrees and mist-drenched waterfalls of Gardens by the Bay to the non-stop movie magic of Universal Studios and Sentosa Island, enjoy seamless transfers, 4-star stays, and curated sights.",
      mapCoordinates: JSON.stringify([
        { name: "Changi Airport", lat: 1.3644, lng: 103.9915 },
        { name: "Gardens by the Bay", lat: 1.2816, lng: 103.8636 },
        { name: "Sentosa Island", lat: 1.2494, lng: 103.8303 },
        { name: "Universal Studios", lat: 1.254, lng: 103.8238 },
        { name: "Merlion Park", lat: 1.2868, lng: 103.8545 },
      ]),
      inclusions: JSON.stringify([
        "3 Nights Accommodation in Singapore (4-Star Hotel)",
        "Daily International Buffet Breakfast",
        "Return Airport Transfers in AC Coach",
        "Gardens by the Bay Tickets (Cloud Forest + Flower Dome)",
        "Universal Studios Singapore Full Day Admission Ticket",
        "Sentosa Island Tour with Cable Car Ride",
        "Madame Tussauds + Marvel 4D Ticket",
        "Wings of Time Light & Sound Show (Standard Seat)",
        "Half-Day Singapore City Tour with Merlion Park & Chinatown",
        "All applicable taxes and 24/7 dedicated local assistance",
      ]),
      exclusions: JSON.stringify([
        "Airfare & Visa Fees (Available on request)",
        "Personal expenses (Laundry, Telephone, Mini-bar)",
        "Lunch and Dinner not mentioned in the plan",
        "Travel Insurance & Peak Season Surcharges",
      ]),
      paymentPolicy:
        "INR 15,000 per person advance token to confirm slot. Balance payment 15 days prior to travel date. 100% refund on cancellation up to 21 days before departure.",
      cancellationPolicy:
        "Free cancellation up to 21 days before departure. 50% refund between 14-20 days. Non-refundable within 14 days of travel.",
      isFeatured: true,
      isPublished: true,
    },
  });

  // Seed Day-wise Itinerary for Singapore Explorer
  const dayDetails = [
    {
      dayNumber: 1,
      title: "Arrival in Singapore & Gardens by the Bay",
      description:
        "Arrive at Singapore Changi Airport and transfer to your hotel. Later in the evening, visit Gardens by the Bay to witness the spectacular Cloud Forest, Flower Dome, and Jurassic World experience.",
      mealsIncluded: JSON.stringify(["Breakfast"]),
      activityPhotos: JSON.stringify([
        "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&w=800&q=80",
      ]),
      accommodationName: "Hotel Boss Singapore / Similar 4-Star",
      accommodationPhoto:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      accommodationRating: 4.5,
      accommodationCategory: "4-Star City Hotel",
      accommodationDetails: "Superior City View Room with modern amenities and pool access.",
    },
    {
      dayNumber: 2,
      title: "Universal Studios Singapore Full Day Adventure",
      description:
        "Spend a thrilling full day at Universal Studios Singapore on Sentosa Island. Enjoy cutting-edge rides, shows, and Hollywood-themed attractions across 6 vibrant zones.",
      mealsIncluded: JSON.stringify(["Breakfast"]),
      activityPhotos: JSON.stringify([
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=800&q=80",
      ]),
      accommodationName: "Hotel Boss Singapore / Similar 4-Star",
      accommodationPhoto:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      accommodationRating: 4.5,
      accommodationCategory: "4-Star City Hotel",
      accommodationDetails: "Superior City View Room with modern amenities and pool access.",
    },
    {
      dayNumber: 3,
      title: "Sentosa Island, Cable Car, Madame Tussauds & Wings of Time",
      description:
        "Take a scenic cable car ride to Sentosa Island. Meet wax celebrities at Madame Tussauds with Marvel 4D, explore the beachfront, and end with the magical Wings of Time ocean show.",
      mealsIncluded: JSON.stringify(["Breakfast"]),
      activityPhotos: JSON.stringify([
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
      ]),
      accommodationName: "Hotel Boss Singapore / Similar 4-Star",
      accommodationPhoto:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      accommodationRating: 4.5,
      accommodationCategory: "4-Star City Hotel",
      accommodationDetails: "Superior City View Room with modern amenities and pool access.",
    },
    {
      dayNumber: 4,
      title: "City Tour, Merlion Park, Chinatown & Departure",
      description:
        "Enjoy a guided city tour covering Merlion Park, Chinatown, Buddha Tooth Relic Temple, Suntec City, and Singapore Flyer photo stop. Later, transfer to Changi Airport for your flight back home.",
      mealsIncluded: JSON.stringify(["Breakfast"]),
      activityPhotos: JSON.stringify([
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
      ]),
      accommodationName: null,
      accommodationPhoto: null,
      accommodationRating: null,
      accommodationCategory: null,
      accommodationDetails: null,
    },
  ];

  for (const d of dayDetails) {
    await prisma.itineraryDay.upsert({
      where: {
        packageId_dayNumber: {
          packageId: sinPkg.id,
          dayNumber: d.dayNumber,
        },
      },
      update: {},
      create: {
        packageId: sinPkg.id,
        ...d,
      },
    });
  }
  console.log("✓ Seeded Singapore Explorer itinerary days");

  // 4. Seed the Reference Mobile Quotation (1:1 Exact Replica of Singapore Explorer PDF)
  const fullSingaporeQuotationContent = {
    heroImage:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
    title: "Singapore Explorer",
    subtitle: "Curated 3 Nights / 4 Days Itinerary Plan",
    mapIntro:
      "Singapore, an island city-state off southern Malaysia, is a global financial center with a tropical climate and multicultural population. Its colonial core centers on the Padang, a cricket field since the 1830s and now flanked by grand buildings such as City Hall, with its 18 Corinthian columns. In Singapore's circa-1820 Chinatown stands the red-and-gold Buddha Tooth Relic Temple, said to house one of Buddha's teeth.",
    mapStops: [
      { name: "Changi Airport", label: "Arrival / Drop-off" },
      { name: "Gardens by the Bay", label: "Cloud Forest & Flower Dome" },
      { name: "Sentosa Island", label: "Cable Car & Beach" },
      { name: "Universal Studios", label: "Full Day Adventure" },
      { name: "Merlion Park", label: "Marina Bay Landmark" },
      { name: "Chinatown", label: "Cultural Heritage" },
    ],
    summary: {
      duration: "3 Nights, 4 Days",
      destination: "Singapore",
      pricePerPersonFormatted: "INR 38,750 per person",
      pricePerPerson: 38750,
      paxCount: 2,
      totalCostFormatted: "INR 77,500 for 2 Travellers",
    },
    costBreakdown: [
      { category: "Accommodations (4-Star Hotel)", cost: "INR 16,500" },
      { category: "Universal Studios & Attractions", cost: "INR 12,250" },
      { category: "Transfers & Transport", cost: "INR 6,000" },
      { category: "Taxes & Local Concierge", cost: "INR 4,000" },
    ],
    staySummary: {
      city: "Singapore",
      hotelName: "Hotel Boss / V Hotel (4-Star)",
      roomType: "Superior Room with Breakfast",
      rating: 4.5,
      photo:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    },
    mealsBanner: {
      title: "Meals Included Throughout Your Journey",
      description: "Daily breakfast included at hotel. Lunch & Dinner at leisure or recommended dining spots.",
      tags: ["Breakfast Included (Daily)", "Lunch At Leisure", "Dinner Recommendations"],
    },
    quickDayWiseSummary: [
      { day: "Day 1", summary: "Arrival in Singapore & Gardens by the Bay" },
      { day: "Day 2", summary: "Universal Studios Singapore (Sentosa Island)" },
      { day: "Day 3", summary: "Sentosa Cable Car, Madame Tussauds & Wings of Time" },
      { day: "Day 4", summary: "Singapore City Tour, Merlion Park & Departure" },
    ],
    days: [
      {
        dayNumber: 1,
        dayTitle: "Day 1 - Singapore",
        dateLabel: "Arrival & Gardens by the Bay",
        places: [
          {
            title: "Airport Transfer",
            subtitle: "Changi Airport, Singapore",
            category: "TRANSFER",
            photos: [
              "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80",
            ],
            description:
              "Meet and greet at Singapore Changi Airport. Transfer comfortably in an air-conditioned coach to your city hotel. Check-in and relax before your evening excursion.",
          },
          {
            title: "Gardens by the Bay",
            subtitle: "18 Marina Gardens Dr, Singapore",
            category: "ATTRACTION",
            photos: [
              "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=800&q=80",
            ],
            description:
              "The Gardens by the Bay is a nature park spanning 101 hectares in the Central Region of Singapore. Walk beneath the majestic illuminated Supertrees that tower up to 50 meters into the twilight sky.",
          },
          {
            title: "Cloud Forest",
            subtitle: "Gardens by the Bay, Singapore",
            category: "ATTRACTION",
            photos: [
              "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&w=800&q=80",
            ],
            description:
              "Cloud Forest is a 0.8-hectare greenhouse featuring a 35-meter tall mist mountain covered in rare tropical vegetation, pitcher plants, and one of the world's most photogenic indoor waterfalls.",
          },
          {
            title: "Flower Dome",
            subtitle: "Gardens by the Bay, Singapore",
            category: "ATTRACTION",
            photos: [
              "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
            ],
            description:
              "The Flower Dome holds the Guinness World Record for the largest greenhouse, replicating Mediterranean climates with thousands of colorful seasonal flowers from 5 continents.",
          },
          {
            title: "Jurassic World Experience",
            subtitle: "Gardens by the Bay / Sentosa",
            category: "ATTRACTION",
            photos: [
              "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
            ],
            description:
              "Encounter life-sized roaring dinosaurs in an unforgettable interactive walkthrough experience that delights wanderers of all ages.",
          },
        ],
        hotel: {
          name: "Hotel Boss Singapore / Similar 4-Star",
          photo:
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
          rating: 4.5,
          roomType: "Superior City View Room",
          description:
            "Relax in modern comfort with plush bedding, high-speed Wi-Fi, swimming pool with sky lounge, and centrally located near subway connections.",
        },
      },
      {
        dayNumber: 2,
        dayTitle: "Day 2 - Singapore",
        dateLabel: "Universal Studios Singapore (Sentosa)",
        places: [
          {
            title: "Universal Studios Singapore",
            subtitle: "8 Sentosa Gateway, Sentosa Island",
            category: "ATTRACTION",
            photos: [
              "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=800&q=80",
            ],
            description:
              "Universal Studios Singapore is a theme park located within Resorts World Sentosa on Sentosa Island. It features 28 rides, shows, and attractions in seven themed zones. Ride the world-famous Battlestar Galactica duelling roller coasters and step into Jurassic Park Rapids Adventure.",
          },
        ],
        hotel: {
          name: "Hotel Boss Singapore / Similar 4-Star",
          photo:
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
          rating: 4.5,
          roomType: "Superior City View Room",
          description: "Comfortable overnight stay with international buffet breakfast included.",
        },
      },
      {
        dayNumber: 3,
        dayTitle: "Day 3 - Singapore",
        dateLabel: "Sentosa Island, Cable Car, Madame Tussauds & Wings of Time",
        places: [
          {
            title: "Sentosa Island",
            subtitle: "Sentosa Island, Singapore",
            category: "ATTRACTION",
            photos: [
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            ],
            description:
              "Sentosa is a sunny island resort off Singapore's southern coast, connected by road, cable car, pedestrian boardwalk, and monorail.",
          },
          {
            title: "Sentosa Cable Car Ride",
            subtitle: "Mount Faber Line & Sentosa Line",
            category: "ATTRACTION",
            photos: [
              "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
            ],
            description:
              "Enjoy panoramic 360-degree aerial views of Singapore's sparkling skyline, lush rainforests, and harbour waters as you glide across to Sentosa Island.",
          },
          {
            title: "Madame Tussauds Singapore",
            subtitle: "Sentosa Imbiah Lookout",
            category: "ATTRACTION",
            photos: [
              "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
            ],
            description:
              "Madame Tussauds Singapore is a wax museum and tourist attraction featuring world-famous lifelike wax replicas, the Spirit of Singapore boat ride, and Marvel Universe 4D.",
          },
          {
            title: "Wings of Time Light & Sound Show",
            subtitle: "Siloso Beach, Sentosa",
            category: "SHOW",
            photos: [
              "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
            ],
            description:
              "An award-winning multi-sensory outdoor night show set against the open sea. Be spellbound by water fountain projections, lasers, fire effects, and theatrical storytelling.",
          },
        ],
        hotel: {
          name: "Hotel Boss Singapore / Similar 4-Star",
          photo:
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
          rating: 4.5,
          roomType: "Superior City View Room",
          description: "Comfortable overnight stay with international buffet breakfast included.",
        },
      },
      {
        dayNumber: 4,
        dayTitle: "Day 4 - Singapore",
        dateLabel: "Singapore City Tour, Merlion Park & Departure",
        places: [
          {
            title: "Singapore City Tour",
            subtitle: "Civic District & Orchard Road",
            category: "ATTRACTION",
            photos: [
              "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
            ],
            description:
              "Drive through the historic Civic District, past the Padang, Cricket Club, historic Parliament House, and National Gallery.",
          },
          {
            title: "Merlion Park",
            subtitle: "One Fullerton, Singapore",
            category: "ATTRACTION",
            photos: [
              "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
            ],
            description:
              "Merlion Park is a famous Singapore landmark and a major tourist attraction, located near One Fullerton. The iconic statue spouts water into Marina Bay with panoramic skyline views.",
          },
          {
            title: "Chinatown & Buddha Tooth Relic Temple",
            subtitle: "288 South Bridge Rd, Chinatown",
            category: "ATTRACTION",
            photos: [
              "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
            ],
            description:
              "Immerse yourself in Singapore's rich ethnic quarter with historic Buddhist and Hindu temples, traditional tea shops, and handcrafted souvenirs.",
          },
          {
            title: "Singapore Flyer & Airport Transfer",
            subtitle: "Changi Airport, Singapore",
            category: "TRANSFER",
            photos: [
              "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80",
            ],
            description:
              "Enjoy a photo stop at the Singapore Flyer. Transfer to Changi Airport for your return flight with memories to cherish forever.",
          },
        ],
        hotel: null,
      },
    ],
    momentsThatMatter: [
      {
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        caption: "Supertrees Glow at Dusk",
      },
      {
        url: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
        caption: "Universal Studios Magic",
      },
      {
        url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
        caption: "Harbour Cable Car Glide",
      },
      {
        url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
        caption: "Wings of Time Fireworks",
      },
    ],
    inclusions: [
      "3 Nights Accommodation in Singapore (4-Star Hotel)",
      "Daily International Buffet Breakfast",
      "Return Airport Transfers in AC Coach",
      "Gardens by the Bay Tickets (Cloud Forest + Flower Dome)",
      "Universal Studios Singapore Full Day Admission Ticket",
      "Sentosa Island Tour with Cable Car Ride",
      "Madame Tussauds + Marvel 4D Ticket",
      "Wings of Time Light & Sound Show (Standard Seat)",
      "Half-Day Singapore City Tour with Merlion Park & Chinatown",
      "All applicable taxes and 24/7 dedicated local assistance",
    ],
    exclusions: [
      "Airfare & Visa Fees (Available on request)",
      "Personal expenses (Laundry, Telephone, Mini-bar)",
      "Lunch and Dinner not mentioned in the plan",
      "Travel Insurance & Peak Season Surcharges",
    ],
    paymentPolicy: [
      "INR 15,000 per person advance token to confirm slot.",
      "Balance payment 15 days prior to travel date.",
      "100% refund on cancellation up to 21 days before departure.",
      "50% refund between 14-20 days before departure.",
      "Non-refundable within 14 days of travel.",
    ],
    reviews: [
      {
        customerName: "Jainam Mehta",
        tripDestination: "Singapore Explorer",
        rating: 5,
        reviewText:
          "Trip Master made our Singapore family holiday effortless. The hotel was superb, and Universal Studios tickets and transfers were ready with zero queues.",
      },
      {
        customerName: "Dr Sajeev Nair",
        tripDestination: "Singapore Explorer",
        rating: 5,
        reviewText:
          "Flawless planning! Gardens by the Bay and the Sentosa Cable Car were spectacular. Our holiday advisor was available on WhatsApp 24/7.",
      },
      {
        customerName: "Dinesh Gandhi",
        tripDestination: "Singapore Explorer",
        rating: 5,
        reviewText:
          "Very transparent pricing and excellent 4-star property. Every place mentioned in the dossier was delivered with top quality.",
      },
    ],
    advisor: {
      name: "Master Concierge Desk",
      phone: "+91 98765 43210",
      whatsappNumber: "+91 98765 43210",
      email: "concierge@tripmaster.in",
      offices: "SINGAPORE AND INDIA",
      companyName: "Trip Master",
    },
  };

  const sampleQuotation = await prisma.quotation.upsert({
    where: { quotationNumber: "QT-SIN-2026-001" },
    update: {
      content: JSON.stringify(fullSingaporeQuotationContent),
    },
    create: {
      quotationNumber: "QT-SIN-2026-001",
      packageId: sinPkg.id,
      title: "Singapore Explorer (3 Nights, 4 Days)",
      destination: "Singapore",
      durationDays: 4,
      durationNights: 3,
      pricePerPerson: 38750,
      totalAmount: 77500,
      paxCount: 2,
      adultsCount: 2,
      childrenCount: 0,
      status: "SENT",
      content: JSON.stringify(fullSingaporeQuotationContent),
      shareSlug: "singapore-explorer-3n4d-quote",
    },
  });

  console.log(`✓ Seeded Reference Quotation: ${sampleQuotation.quotationNumber} (Slug: ${sampleQuotation.shareSlug})`);
}

seedPhase5()
  .catch((err) => {
    console.error("Phase 5 seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
