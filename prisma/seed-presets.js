const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedMasterPresets() {
  console.log("Seeding Master Presets (Countries, Places, Hotels, Taxis)...");

  // 1. Singapore
  const singapore = await prisma.masterCountry.upsert({
    where: { slug: "singapore" },
    update: {
      name: "Singapore",
      bannerImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=85",
      overview: "Singapore, an island city-state off southern Malaysia, is a global financial center with a tropical climate and multicultural population. From the futuristic Supertrees and mist-drenched waterfalls of Gardens by the Bay to the thrills of Universal Studios, Sentosa Island, and Michelin dining, Singapore delivers unmatched luxury and family wonder.",
      inclusions: JSON.stringify([
        "3 Nights Accommodation in vetted 4-Star / 5-Star City Hotel",
        "Daily Gourmet Buffet Breakfast at Hotel Restaurant",
        "Changi Airport Private Chauffeur Transfers (Arrival & Departure)",
        "Universal Studios Singapore One-Day VIP Dated Admission Ticket",
        "Gardens by the Bay Double Conservatories (Flower Dome + Cloud Forest)",
        "Sentosa Cable Car Sky Pass (Mount Faber & Sentosa Line Round-Trip)",
        "Wings of Time Night Multi-Sensory Water & Laser Spectacular",
        "English-speaking professional on-ground concierge assistance",
        "All Singapore Goods & Services Tax (GST) and hotel service fees",
      ]),
      exclusions: JSON.stringify([
        "International round-trip flight tickets and airline fuel surcharges",
        "Singapore Tourist Visa processing fees (unless selected as add-on)",
        "Lunches & Dinners other than specified in hotel meal inclusions",
        "Personal travel insurance and medical coverage expenses",
        "Early check-in and late checkout fees at hotels",
        "Discretionary driver tips and porterage charges",
      ]),
      paymentTerms: JSON.stringify([
        "25% Advance deposit required at the time of quotation acceptance to block hotels",
        "Remaining 75% balance payable 15 days prior to arrival in Singapore",
        "100% Full Refund available if cancelled up to 21 days before departure",
        "All payments are processed securely with Instant Tax Invoice generation",
      ]),
      mapCoordinates: JSON.stringify([
        { name: "Changi Airport", lat: 1.3644, lng: 103.9915 },
        { name: "Gardens by the Bay", lat: 1.2816, lng: 103.8636 },
        { name: "Sentosa Island", lat: 1.2494, lng: 103.8303 },
        { name: "Universal Studios", lat: 1.254, lng: 103.8238 },
        { name: "Merlion Park", lat: 1.2868, lng: 103.8545 },
      ]),
      order: 1,
    },
    create: {
      name: "Singapore",
      slug: "singapore",
      bannerImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=85",
      overview: "Singapore, an island city-state off southern Malaysia, is a global financial center with a tropical climate and multicultural population. From the futuristic Supertrees and mist-drenched waterfalls of Gardens by the Bay to the thrills of Universal Studios, Sentosa Island, and Michelin dining, Singapore delivers unmatched luxury and family wonder.",
      inclusions: JSON.stringify([
        "3 Nights Accommodation in vetted 4-Star / 5-Star City Hotel",
        "Daily Gourmet Buffet Breakfast at Hotel Restaurant",
        "Changi Airport Private Chauffeur Transfers (Arrival & Departure)",
        "Universal Studios Singapore One-Day VIP Dated Admission Ticket",
        "Gardens by the Bay Double Conservatories (Flower Dome + Cloud Forest)",
        "Sentosa Cable Car Sky Pass (Mount Faber & Sentosa Line Round-Trip)",
        "Wings of Time Night Multi-Sensory Water & Laser Spectacular",
        "English-speaking professional on-ground concierge assistance",
        "All Singapore Goods & Services Tax (GST) and hotel service fees",
      ]),
      exclusions: JSON.stringify([
        "International round-trip flight tickets and airline fuel surcharges",
        "Singapore Tourist Visa processing fees (unless selected as add-on)",
        "Lunches & Dinners other than specified in hotel meal inclusions",
        "Personal travel insurance and medical coverage expenses",
        "Early check-in and late checkout fees at hotels",
        "Discretionary driver tips and porterage charges",
      ]),
      paymentTerms: JSON.stringify([
        "25% Advance deposit required at the time of quotation acceptance to block hotels",
        "Remaining 75% balance payable 15 days prior to arrival in Singapore",
        "100% Full Refund available if cancelled up to 21 days before departure",
        "All payments are processed securely with Instant Tax Invoice generation",
      ]),
      order: 1,
    },
  });

  // Singapore Places
  const singaporePlaces = [
    {
      countryId: singapore.id,
      name: "Changi Airport & Jewel Waterfall",
      locationSubtitle: "Changi Airport, Singapore",
      durationDay: 1,
      category: "TRANSFER",
      description: "Arrive in Singapore and witness the world's tallest indoor waterfall at Jewel Changi, surrounded by lush four-story indoor rainforest terracing and scenic walking bridges.",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 1,
    },
    {
      countryId: singapore.id,
      name: "Gardens by the Bay (Supertree Grove)",
      locationSubtitle: "18 Marina Gardens Dr, Singapore",
      durationDay: 1,
      category: "ATTRACTION",
      description: "Iconic futuristic horticultural wonderland spanning 101 hectares. Walk beneath the vertical Supertrees soaring up to 50 meters, illuminated in a synchronised musical light show.",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 2,
    },
    {
      countryId: singapore.id,
      name: "Cloud Forest & Flower Dome",
      locationSubtitle: "Gardens by the Bay, Singapore",
      durationDay: 1,
      category: "ATTRACTION",
      description: "Ascend a 35-meter indoor mist mountain with cascading waterfalls, rare orchids, and enter the Guinness World Record's largest glass greenhouse showcasing Mediterranean blooms.",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 3,
    },
    {
      countryId: singapore.id,
      name: "Universal Studios Singapore",
      locationSubtitle: "Resorts World Sentosa, Singapore",
      durationDay: 2,
      category: "ATTRACTION",
      description: "Southeast Asia's premier theme park featuring 28 rides, blockbuster movie zones, Battlestar Galactica duelling roller coasters, Jurassic Park Rapids, and live shows.",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 4,
    },
    {
      countryId: singapore.id,
      name: "Sentosa Cable Car Ride & Siloso Beach",
      locationSubtitle: "Mount Faber & Sentosa Island",
      durationDay: 3,
      category: "ATTRACTION",
      description: "Soar above Singapore harbour on a 360-degree glass cabin cable car. Explore Sentosa's golden beaches, ocean boardwalk, and tropical coastline.",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 5,
    },
    {
      countryId: singapore.id,
      name: "Madame Tussauds Singapore & Wings of Time",
      locationSubtitle: "Sentosa Imbiah Lookout & Beach",
      durationDay: 3,
      category: "SHOW",
      description: "Meet lifelike wax figures with Marvel 4D experience, followed by the magical Wings of Time outdoor sea spectacle with laser projections, fountains, and fireworks.",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 6,
    },
    {
      countryId: singapore.id,
      name: "Singapore City Tour & Merlion Park",
      locationSubtitle: "Civic District & One Fullerton",
      durationDay: 4,
      category: "ATTRACTION",
      description: "City orientation covering the historical Padang, Parliament House, Chinatown, Buddha Tooth Relic Temple, and Merlion Park overlooking Marina Bay.",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 7,
    },
  ];

  for (const p of singaporePlaces) {
    await prisma.masterPlaceItem.create({ data: p });
  }

  // Singapore Hotels
  const singaporeHotels = [
    {
      countryId: singapore.id,
      placeName: "Singapore City Center",
      name: "Hotel Boss / V Hotel Lavender",
      starRating: 4.0,
      roomCategory: "Superior City View Room",
      description: "Modern 4-star city hotel featuring private ensuite rooms, outdoor swimming pool, sky garden, and walking access to Lavender MRT.",
      mealPlans: JSON.stringify(["Breakfast Included"]),
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 1,
    },
    {
      countryId: singapore.id,
      placeName: "Marina Bay",
      name: "Marina Bay Sands Singapore",
      starRating: 5.0,
      roomCategory: "Premier Skyline View Suite",
      description: "World-famous integrated luxury resort with the iconic rooftop infinity pool, celebrity chef dining, and breathtaking city skyline panoramas.",
      mealPlans: JSON.stringify(["Breakfast Included", "Club Lounge Access"]),
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 2,
    },
    {
      countryId: singapore.id,
      placeName: "Robertson Quay / River",
      name: "Grand Copthorne Waterfront Hotel",
      starRating: 4.5,
      roomCategory: "Deluxe Waterfront Room",
      description: "Serene luxury retreat along the historic Singapore River with riverside alfresco dining, marble bathrooms, and bespoke concierge.",
      mealPlans: JSON.stringify(["Breakfast Included", "Half Board (MAP)"]),
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 3,
    },
  ];

  for (const h of singaporeHotels) {
    await prisma.masterHotel.create({ data: h });
  }

  // Singapore Transfers
  const singaporeTransfers = [
    {
      countryId: singapore.id,
      title: "Changi Airport Arrival & Hotel Transfer",
      vehicleType: "Private Executive AC Coach / Van",
      description: "Punctual meet & greet with placard at Changi Airport arrivals, baggage assistance, and comfortable direct transfer to your hotel.",
      photo: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80",
      order: 1,
    },
    {
      countryId: singapore.id,
      title: "Sentosa Island & Universal Studios VIP Coach",
      vehicleType: "Air-Conditioned Tourism Coach",
      description: "Roundtrip door-to-door transportation from your hotel lobby to Resorts World Sentosa and theme park entrance.",
      photo: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
      order: 2,
    },
    {
      countryId: singapore.id,
      title: "Hotel to Changi Airport Departure Transfer",
      vehicleType: "Private Executive AC Coach / Van",
      description: "Scheduled pickup from your hotel lobby 3.5 hours prior to flight departure with direct drop-off at your flight terminal.",
      photo: "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80",
      order: 3,
    },
  ];

  for (const t of singaporeTransfers) {
    await prisma.masterTransfer.create({ data: t });
  }

  // 2. Africa (Kenya & Tanzania)
  const africa = await prisma.masterCountry.upsert({
    where: { slug: "africa-safari" },
    update: {
      name: "Africa (Kenya & Tanzania)",
      bannerImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85",
      overview: "Experience the ultimate African wilderness safari across the endless golden savannahs of Kenya's Masai Mara and Tanzania's Serengeti. Encounter the Big Five in their natural habitats, witness the majestic Great Migration, stay in luxury tented lodges, and enjoy private 4x4 game drives with experienced naturalist guides.",
      inclusions: JSON.stringify([
        "Luxury Safari Tented Camp & Lodge Accommodation throughout",
        "Full Board Meals (Breakfast, Bush Picnic Lunch, Multi-Course Dinner)",
        "Custom 4x4 Land Cruiser Safari Vehicle with Pop-Up Game Viewing Roof",
        "All National Reserve and National Park Entry Conservation Fees",
        "Unlimited Daily Sunrise & Sunset Wildlife Game Drives with Naturalist Ranger",
        "Complimentary High-Magnification Binoculars and Bottled Water in Safari Vehicle",
        "Flying Doctors Emergency Air Evacuation Insurance Coverage",
        "Airport and Bush Airstrip Meet & Greet Chauffeur Transfers",
      ]),
      exclusions: JSON.stringify([
        "International roundtrip flights to Nairobi / Kilimanjaro",
        "Kenya & Tanzania Electronic Travel Authorization (eTA/Visas)",
        "Optional Masai Mara Sunrise Hot Air Balloon Safari with Champagne Breakfast",
        "Alcoholic beverages and premium spirits at luxury safari lodges",
        "Gratuities for safari field guides and camp hospitality staff",
        "Personal laundry services and safari souvenir boutique purchases",
      ]),
      paymentTerms: JSON.stringify([
        "30% Non-refundable booking deposit required to secure wilderness lodge permits",
        "Remaining 70% balance due 45 days prior to arrival in East Africa",
        "Comprehensive safari travel and cancellation insurance strongly recommended",
      ]),
      mapCoordinates: JSON.stringify([
        { name: "Nairobi", lat: -1.2921, lng: 36.8219 },
        { name: "Masai Mara", lat: -1.4883, lng: 35.1438 },
        { name: "Amboseli", lat: -2.6527, lng: 37.2606 },
        { name: "Serengeti", lat: -2.3333, lng: 34.8333 },
      ]),
      order: 2,
    },
    create: {
      name: "Africa (Kenya & Tanzania)",
      slug: "africa-safari",
      bannerImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85",
      overview: "Experience the ultimate African wilderness safari across the endless golden savannahs of Kenya's Masai Mara and Tanzania's Serengeti. Encounter the Big Five in their natural habitats, witness the majestic Great Migration, stay in luxury tented lodges, and enjoy private 4x4 game drives with experienced naturalist guides.",
      inclusions: JSON.stringify([
        "Luxury Safari Tented Camp & Lodge Accommodation throughout",
        "Full Board Meals (Breakfast, Bush Picnic Lunch, Multi-Course Dinner)",
        "Custom 4x4 Land Cruiser Safari Vehicle with Pop-Up Game Viewing Roof",
        "All National Reserve and National Park Entry Conservation Fees",
        "Unlimited Daily Sunrise & Sunset Wildlife Game Drives with Naturalist Ranger",
        "Complimentary High-Magnification Binoculars and Bottled Water in Safari Vehicle",
        "Flying Doctors Emergency Air Evacuation Insurance Coverage",
        "Airport and Bush Airstrip Meet & Greet Chauffeur Transfers",
      ]),
      exclusions: JSON.stringify([
        "International roundtrip flights to Nairobi / Kilimanjaro",
        "Kenya & Tanzania Electronic Travel Authorization (eTA/Visas)",
        "Optional Masai Mara Sunrise Hot Air Balloon Safari with Champagne Breakfast",
        "Alcoholic beverages and premium spirits at luxury safari lodges",
        "Gratuities for safari field guides and camp hospitality staff",
        "Personal laundry services and safari souvenir boutique purchases",
      ]),
      paymentTerms: JSON.stringify([
        "30% Non-refundable booking deposit required to secure wilderness lodge permits",
        "Remaining 70% balance due 45 days prior to arrival in East Africa",
        "Comprehensive safari travel and cancellation insurance strongly recommended",
      ]),
      mapCoordinates: JSON.stringify([
        { name: "Nairobi", lat: -1.2921, lng: 36.8219 },
        { name: "Masai Mara", lat: -1.4883, lng: 35.1438 },
        { name: "Amboseli", lat: -2.6527, lng: 37.2606 },
        { name: "Serengeti", lat: -2.3333, lng: 34.8333 },
      ]),
      order: 2,
    },
  });

  // Africa Places
  const africaPlaces = [
    {
      countryId: africa.id,
      name: "Masai Mara National Reserve",
      locationSubtitle: "Narok County, Kenya",
      durationDay: 1,
      category: "ATTRACTION",
      description: "World's most famous wildlife sanctuary renowned for exceptional populations of lions, leopards, cheetahs, and the world-famous Great Wildebeest Migration across the Mara River.",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 1,
    },
    {
      countryId: africa.id,
      name: "Serengeti National Park",
      locationSubtitle: "Mara & Simiyu Regions, Tanzania",
      durationDay: 2,
      category: "ATTRACTION",
      description: "Sprawling UNESCO World Heritage grassland savannah featuring over 1.5 million wildebeest, zebras, gazelles, and dramatic predator hunts across kopjes rock formations.",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 2,
    },
    {
      countryId: africa.id,
      name: "Amboseli National Park (Kilimanjaro View)",
      locationSubtitle: "Kajiado County, Kenya",
      durationDay: 3,
      category: "ATTRACTION",
      description: "Famous for close encounters with free-ranging elephant herds set against the snow-capped peak of Mount Kilimanjaro, observation hill vistas, and rich birdlife.",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1581852017103-68ac6550407b?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 3,
    },
    {
      countryId: africa.id,
      name: "Nairobi Giraffe Centre & Karen Blixen Sanctuary",
      locationSubtitle: "Nairobi, Kenya",
      durationDay: 4,
      category: "ATTRACTION",
      description: "Hand-feed endangered Rothschild giraffes from elevated wooden viewing platforms and discover the colonial estate and history of Out of Africa author Karen Blixen.",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 4,
    },
  ];

  for (const p of africaPlaces) {
    await prisma.masterPlaceItem.create({ data: p });
  }

  // Africa Hotels
  const africaHotels = [
    {
      countryId: africa.id,
      placeName: "Masai Mara",
      name: "Mara Serena Safari Lodge",
      starRating: 5.0,
      roomCategory: "Luxury Safari Tent with Mara Valley View",
      description: "Perched high on a bush-cloaked ridge with panoramic views over the Mara plains. Includes private game drives, sundowners, and full board gourmet meals.",
      mealPlans: JSON.stringify(["All Meals (AP) Included", "Bush Dinners"]),
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 1,
    },
    {
      countryId: africa.id,
      placeName: "Serengeti",
      name: "Four Seasons Safari Lodge Serengeti",
      starRating: 5.0,
      roomCategory: "Waterhole View Safari Villa",
      description: "Deep in the heart of Serengeti with an elevated infinity pool overlooking an active elephant waterhole, luxury spa, and open-air boma dining.",
      mealPlans: JSON.stringify(["All Meals (AP) Included", "Game Drives Included"]),
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      ]),
      order: 2,
    },
  ];

  for (const h of africaHotels) {
    await prisma.masterHotel.create({ data: h });
  }

  // Africa Transfers
  const africaTransfers = [
    {
      countryId: africa.id,
      title: "Custom 4x4 Safari Land Cruiser (Pop-up Roof)",
      vehicleType: "4x4 Safari Land Cruiser",
      description: "Specialized safari vehicle with 360-degree pop-up roof hatch for wildlife photography, VHF radio, inverter power sockets, cooler box, and professional naturalist driver-guide.",
      photo: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80",
      order: 1,
    },
    {
      countryId: africa.id,
      title: "Jomo Kenyatta Airport to Hotel Private Transfer",
      vehicleType: "Executive AC Minivan",
      description: "Chauffeured arrival transfer from Nairobi airport to your hotel or domestic Wilson airport.",
      photo: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80",
      order: 2,
    },
  ];

  for (const t of africaTransfers) {
    await prisma.masterTransfer.create({ data: t });
  }

  console.log("✓ Successfully seeded Singapore & Africa Master Presets!");
}

seedMasterPresets()
  .catch((e) => {
    console.error("Preset seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

