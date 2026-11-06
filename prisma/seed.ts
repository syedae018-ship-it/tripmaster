import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function generatePasswordHash(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Seeding Trip Master database...");

  // 0. Seed Default Admin User
  const adminPasswordHash = generatePasswordHash("admin123");
  await prisma.adminUser.upsert({
    where: { email: "admin@tripmaster.in" },
    update: {
      passwordHash: adminPasswordHash,
    },
    create: {
      email: "admin@tripmaster.in",
      name: "Master Concierge Admin",
      passwordHash: adminPasswordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log("Admin seeded: admin@tripmaster.in / admin123");

  // 1. SiteSettings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      companyName: "Trip Master",
      tagline: "Curating Bespoke Luxury Journeys Across India & Beyond",
      aboutText:
        "Trip Master is an artisanal travel concierge dedicated to discerning wanderers. We hand-craft immersive, ultra-luxury itineraries with handpicked 5-star heritage retreats, private chartered transfers, and 24/7 dedicated travel concierges. Every moment of your journey is orchestrated with precision, intimacy, and unmatched elegance.",
      heroTitle: "Bespoke Luxury Escapes For The Discerning Traveller",
      heroSubtitle:
        "Experience private houseboats, snow-clad mountain sanctuaries, and royal palaces with Trip Master's end-to-end bespoke concierge.",
      heroImage:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85",
      email: "concierge@tripmaster.in",
      phone: "+91 98765 43210",
      whatsappNumber: "+91 98765 43210",
      address: "The Oberoi Grand Arc, Level 4, MG Road, Bengaluru, Karnataka 560001",
      socialLinks: JSON.stringify({
        instagram: "https://instagram.com/tripmasterluxury",
        facebook: "https://facebook.com/tripmastertravel",
        twitter: "https://x.com/tripmaster",
        linkedin: "https://linkedin.com/company/tripmaster",
      }),
      stats: JSON.stringify([
        {
          label: "Satisfied Travellers",
          value: "14,500+",
          icon: "Users",
          description: "High-net-worth travellers & luxury connoisseurs",
        },
        {
          label: "Curated Destinations",
          value: "45+",
          icon: "Compass",
          description: "Handpicked private sanctuaries worldwide",
        },
        {
          label: "Verified 5-Star Stays",
          value: "320+",
          icon: "ShieldCheck",
          description: "Strictly vetted boutique hotels & heritage villas",
        },
        {
          label: "Guest Support Rating",
          value: "4.98 / 5",
          icon: "Sparkles",
          description: "Personal 24/7 on-trip concierge assistance",
        },
      ]),
      features: JSON.stringify([
        {
          title: "Bespoke Personalization",
          description:
            "Every itinerary is tailored from scratch around your culinary preferences, pace, and private celebrations.",
          icon: "Sparkles",
        },
        {
          title: "Vetted Heritage & 5-Star Stays",
          description:
            "Direct partnerships with Oberoi, Taj, Khyber, and secluded luxury estate owners with complimentary room upgrades.",
          icon: "Building",
        },
        {
          title: "Private Chauffeured Fleet",
          description:
            "Sanitized premium luxury sedans and SUVs with vetted English-fluent chauffeur captains and bottled artisanal water.",
          icon: "Car",
        },
        {
          title: "24/7 Dedicated Trip Concierge",
          description:
            "A personal concierge assigned to your booking via direct WhatsApp hotline before, during, and after your expedition.",
          icon: "Headphones",
        },
      ]),
    },
  });

  // 2. Packages with Itineraries
  // Clear existing data cleanly
  await prisma.customerDocument.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.itineraryDay.deleteMany();
  await prisma.package.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.fAQ.deleteMany();

  // Package 1: Kashmir
  const kashmir = await prisma.package.create({
    data: {
      title: "Kashmir Celestial Serenade: Gulmarg Gondola & Dal Royal Houseboat",
      slug: "kashmir-celestial-serenade",
      destination: "Kashmir, India",
      durationDays: 6,
      durationNights: 5,
      basePrice: 125000,
      discountedPrice: 98000,
      featuredImage:
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1600&q=85",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
      ]),
      overview:
        "Surrender to the crown of the Himalayas. Glide through the lotus-dappled waters of Dal Lake on a private Shikara, sleep under hand-carved cedar ceilings in a luxury heritage houseboat, soar to 14,000 feet on the Gulmarg Gondola Phase II, and stroll through the saffron plains and pine pine-scented meadows of Pahalgam.",
      mapCoordinates: JSON.stringify([
        { name: "Srinagar (Dal Lake)", lat: 34.0837, lng: 74.7973 },
        { name: "Gulmarg Meadows", lat: 34.0484, lng: 74.3805 },
        { name: "Pahalgam Valley of Shepherds", lat: 34.0163, lng: 75.315 },
        { name: "Aru Valley Sanctuary", lat: 34.0921, lng: 75.2638 },
      ]),
      inclusions: JSON.stringify([
        "5 Nights accommodation in 5-star luxury resorts & premium lake-facing houseboat",
        "Daily gourmet breakfast & 4-course royal Kashmiri Wazwan dinner experience",
        "Private chauffeur-driven luxury SUV (Innova Crysta / Toyota Fortuner) throughout",
        "VIP Priority tickets for Gulmarg Gondola Phase 1 & Phase 2",
        "Sunset 2-hour private Shikara cruise on Dal Lake with hot Kashmiri Kahwa",
        "All toll taxes, parking, driver allowances, and 24/7 dedicated trip manager",
      ]),
      exclusions: JSON.stringify([
        "Domestic or International flights to/from Srinagar International Airport (SXR)",
        "Pony rides and private sledging in Gulmarg & Pahalgam (can be pre-booked upon request)",
        "Personal expenses, laundry, telephone calls, and alcoholic beverages",
        "Travel and medical insurance (available as an optional add-on)",
      ]),
      paymentPolicy:
        "30% advance deposit required at time of confirmation. Balance 70% payable 15 days prior to arrival. Razorpay Credit/Debit cards, UPI, and Bank Transfers accepted.",
      cancellationPolicy:
        "Free cancellation up to 21 days before travel date with 100% refund. 50% refund between 20 to 10 days. Non-refundable within 9 days of travel.",
      isFeatured: true,
      isPublished: true,
      viewsCount: 1420,
      itinerary: {
        create: [
          {
            dayNumber: 1,
            title: "Royal Arrival in Srinagar & Sunset Shikara on Dal Lake",
            description:
              "Arrive at Srinagar International Airport where your private Trip Master chauffeur welcomes you with traditional saffron Kahwa. Transfer to your luxury heritage houseboat stationed on Dal Lake. In the evening, embark on a serene 2-hour Shikara ride observing floating flower gardens and Char Chinar island against the twilight Pir Panjal peaks.",
            mealsIncluded: JSON.stringify(["Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Sukoon Luxury Dal Lake Houseboat",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 5.0,
            accommodationDetails:
              "Eco-luxury hand-carved pinewood suite with heated cedar bathrooms and private sundeck looking into the Zabarwan mountain range.",
          },
          {
            dayNumber: 2,
            title: "Mughal Gardens Heritage Walk & Old Srinagar Artisan Bazaars",
            description:
              "Visit Nishat Bagh (Garden of Bliss) and Shalimar Bagh (Abode of Love) built by Emperor Jahangir. Afternoon private visit to master Pashmina weavers and walnut woodcarvers in the historic downtown Srinagar. Savor authentic multi-course Wazwan delicacies prepared by master Wazas.",
            mealsIncluded: JSON.stringify(["Breakfast", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "The Lalit Grand Palace Srinagar",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 4.9,
            accommodationDetails:
              "Historic palace built in 1910 by Maharaja Pratap Singh surrounded by sprawling Chinar groves.",
          },
          {
            dayNumber: 3,
            title: "Ascent to Gulmarg: Meadow of Flowers & Phase II Gondola",
            description:
              "Scenic drive through apple orchards to Gulmarg. Check into the renowned Khyber Himalayan Resort. Board the Gulmarg Gondola Phase 1 (Kongdoori) and Phase 2 soaring to Apharwat Peak at 13,780 feet for panoramic vistas of Nanga Parbat. Evening relaxation by the heated indoor infinity pool.",
            mealsIncluded: JSON.stringify(["Breakfast", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "The Khyber Himalayan Resort & Spa",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 5.0,
            accommodationDetails:
              "World-renowned alpine luxury resort offering floor-to-ceiling mountain views and L'Occitane Spa.",
          },
          {
            dayNumber: 4,
            title: "Journey to Pahalgam: Valley of Shepherds & Lidder River",
            description:
              "Drive through the saffron fields of Pampore and walnut forests along the roaring turquoise Lidder River to Pahalgam. Check in at your riverside cottage retreat. Afternoon at leisure breathing pristine Himalayan cedar air, with an optional private horse trail into Baisaran Meadow.",
            mealsIncluded: JSON.stringify(["Breakfast", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Pahalgam Hotel & River Cottages",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 4.8,
            accommodationDetails:
              "Luxury wooden suites located directly on the embankment of the sparkling Lidder river.",
          },
          {
            dayNumber: 5,
            title: "Hidden Valleys of Aru & Betaab & Riverside High Tea",
            description:
              "Explore Betaab Valley with its lush meadows framed by snow-dusted crags, followed by the pastoral village of Aru Valley. Enjoy an exclusive curated riverside High Tea set up by our team featuring Kashmiri walnut cookies, fresh orchard fruits, and piping Kahwa.",
            mealsIncluded: JSON.stringify(["Breakfast", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Pahalgam Hotel & River Cottages",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 4.8,
            accommodationDetails:
              "Private evening bonfire under the clear Himalayan night sky.",
          },
          {
            dayNumber: 6,
            title: "Farewell to Paradise: Scenic Return to Srinagar Airport",
            description:
              "Relish a lazy champagne breakfast overlooking the Lidder River. Chauffeur transfer back to Srinagar Airport for your scheduled departure, carrying timeless memories of the Valley of the Gods.",
            mealsIncluded: JSON.stringify(["Breakfast"]),
            activityPhotos: JSON.stringify([]),
            accommodationName: "Departure / Return Flight",
            accommodationPhoto: null,
            accommodationRating: 5.0,
            accommodationDetails: "VIP airport drop-off with assisted baggage transfer.",
          },
        ],
      },
    },
  });

  // Package 2: Kerala
  const kerala = await prisma.package.create({
    data: {
      title: "Kerala Sovereign Backwaters, Tea Sanctuaries & Marari Sands",
      slug: "kerala-sovereign-backwaters",
      destination: "Kerala, India",
      durationDays: 6,
      durationNights: 5,
      basePrice: 110000,
      discountedPrice: 89000,
      featuredImage:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=85",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
      ]),
      overview:
        "Unwind in God's Own Country. From the mist-draped tea carpet hills of Munnar to private luxury houseboats cruising through secret palm-canopied canals of Kumarakom, capped off with barefoot luxury villas overlooking the Arabian Sea in Marari.",
      mapCoordinates: JSON.stringify([
        { name: "Cochin International Airport", lat: 10.1556, lng: 76.3916 },
        { name: "Munnar Tea Plantations", lat: 10.0889, lng: 77.0595 },
        { name: "Kumarakom Lake Canals", lat: 9.6175, lng: 76.4301 },
        { name: "Marari Secluded Beach", lat: 9.6006, lng: 76.2999 },
      ]),
      inclusions: JSON.stringify([
        "5 Nights in luxury heritage pool villas & private 1-bedroom air-conditioned Kettuvallam houseboat",
        "All meals on the private houseboat freshly prepared by dedicated on-board chef",
        "Daily lavish gourmet buffet breakfast at all luxury resorts",
        "Private chauffeur-driven premium air-conditioned luxury vehicle throughout the tour",
        "Curated spice plantation tour and private tea tasting session in Munnar",
        "Complimentary 60-minute Ayurvedic rejuvenation couple massage at Kumarakom",
      ]),
      exclusions: JSON.stringify([
        "Airfares to/from Cochin International Airport (COK)",
        "Optional water sports at Marari Beach",
        "Personal expenses, gratuities, and alcoholic beverages",
      ]),
      paymentPolicy:
        "25% advance to block luxury pool villas and houseboat. Balance 75% payable 10 days before departure.",
      cancellationPolicy:
        "100% refund up to 14 days prior to travel. 50% refund within 7 to 13 days.",
      isFeatured: true,
      isPublished: true,
      viewsCount: 2180,
      itinerary: {
        create: [
          {
            dayNumber: 1,
            title: "Cochin to the Cloud-Kissed Tea Estates of Munnar",
            description:
              "Arrive in Cochin and journey up the Western Ghats past Cheeyappara waterfalls to Munnar. Check into your mountain villa nestled amidst emerald tea estates. Enjoy evening high tea on your terrace overlooking rolling mist.",
            mealsIncluded: JSON.stringify(["Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Fragrant Nature Munnar (Luxury Highlands)",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 4.9,
            accommodationDetails:
              "Trophy-winning colonial hill resort with private fireplace and panoramic views of tea hills.",
          },
          {
            dayNumber: 2,
            title: "Private Tea Factory Tour & Eravikulam Nilgiri Tahr Encounter",
            description:
              "Morning guided walk with a certified botanist through century-old tea gardens and a private artisanal factory to craft your custom tea blend. Afternoon visit to Eravikulam National Park, home of the endangered Nilgiri Tahr.",
            mealsIncluded: JSON.stringify(["Breakfast", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Fragrant Nature Munnar",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 4.9,
            accommodationDetails: "Private candlelight dinner in the tea gardens.",
          },
          {
            dayNumber: 3,
            title: "Descent to Kumarakom: Vembanad Lake & Luxury Backwater Resort",
            description:
              "Descend from the hills to the tranquil banks of Vembanad Lake in Kumarakom. Check into Kumarakom Lake Resort. Afternoon traditional Ayurvedic rejuvenation therapy and private sunset cruise with classical flute recitals.",
            mealsIncluded: JSON.stringify(["Breakfast", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Kumarakom Lake Resort (Heritage Pool Villa)",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 5.0,
            accommodationDetails:
              "16th-century reconstructed traditional Kerala courtyard villas with private plunge pool.",
          },
          {
            dayNumber: 4,
            title: "Private Houseboat Odyssey: Canals, Karimeen & Starlit Waters",
            description:
              "Board your private, fully crewed air-conditioned luxury Kettuvallam houseboat. Cruise through the narrow palm-fringed canals of Alleppey. Your private chef serves freshly caught Pearl Spot (Karimeen Pollichathu) and Kerala coconut curries.",
            mealsIncluded: JSON.stringify(["Breakfast", "Lunch", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Spice Coast Signature Private Houseboat",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 4.9,
            accommodationDetails:
              "Ultra-exclusive single-bedroom luxury houseboat anchored in quiet secluded backwater bays under the stars.",
          },
          {
            dayNumber: 5,
            title: "Marari Beach Coastal Sanctuary & Fresh Seafood Barbecue",
            description:
              "Disembark after morning tea on the water and transfer to the powdery sands of Marari. Spend the day walking barefoot along tranquil fishing hamlets or relaxing in hammocks. Evening beach bonfire with gourmet seafood barbecue.",
            mealsIncluded: JSON.stringify(["Breakfast", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Marari Beach Resort - CGH Earth",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 4.8,
            accommodationDetails:
              "Eco-luxury thatched cottage suites surrounded by organic butterfly gardens and coconut groves.",
          },
          {
            dayNumber: 6,
            title: "Cochin Heritage Stroll & Departure",
            description:
              "Morning transfer to historic Fort Kochi to witness the iconic 14th-century Chinese Fishing Nets and Jew Town spice warehouses before your chauffeur drops you at Cochin International Airport.",
            mealsIncluded: JSON.stringify(["Breakfast"]),
            activityPhotos: JSON.stringify([]),
            accommodationName: "Airport Transfer",
            accommodationPhoto: null,
            accommodationRating: 5.0,
            accommodationDetails: "Seamless airport transfer with express check-in guidance.",
          },
        ],
      },
    },
  });

  // Package 3: Andaman
  const andaman = await prisma.package.create({
    data: {
      title: "Andaman Sovereign Islands: Havelock Turquoise & Neil Coral Eden",
      slug: "andaman-sovereign-islands",
      destination: "Andaman Islands, India",
      durationDays: 6,
      durationNights: 5,
      basePrice: 135000,
      discountedPrice: 105000,
      featuredImage:
        "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1600&q=85",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1510414842594-a61752af3337?auto=format&fit=crop&w=1200&q=85",
      ]),
      overview:
        "Indulge in India's most pristine tropical paradise. Pure azure waters, white powder sand voted Asia's best at Radhanagar Beach, private luxury catamarans, and untouched coral reefs in Havelock and Neil Island with private beach villa stays.",
      mapCoordinates: JSON.stringify([
        { name: "Port Blair Capital", lat: 11.6234, lng: 92.7265 },
        { name: "Havelock Island (Swaraj Dweep)", lat: 11.9761, lng: 92.9876 },
        { name: "Radhanagar Beach No. 7", lat: 11.9835, lng: 92.9515 },
        { name: "Neil Island (Shaheed Dweep)", lat: 11.8322, lng: 93.0505 },
      ]),
      inclusions: JSON.stringify([
        "5 Nights in ocean-view luxury beach villas & 5-star private island resorts",
        "Royal Class premium tickets on high-speed luxury catamarans (Makruzz / Nautika)",
        "Daily lavish breakfast and curated beachside dinners",
        "Exclusive private sunset dinner setup at Radhanagar Beach",
        "Guided private snorkeling excursion with PADI certified dive master at Elephant Beach",
        "Private transfers in air-conditioned luxury SUVs on all islands",
      ]),
      exclusions: JSON.stringify([
        "Airfare to/from Veer Savarkar International Airport Port Blair (IXZ)",
        "Scuba diving certifications (optional add-on available)",
        "Personal expenses and premium alcoholic spirits",
      ]),
      paymentPolicy:
        "30% advance on booking, balance due 20 days prior to island arrival.",
      cancellationPolicy:
        "Full refund up to 30 days prior. 50% refund up to 15 days prior.",
      isFeatured: true,
      isPublished: true,
      viewsCount: 1850,
      itinerary: {
        create: [
          {
            dayNumber: 1,
            title: "Port Blair Arrival & Historic Cellular Jail Light & Sound",
            description:
              "Touch down at Port Blair where our concierge welcomes you. Transfer to your luxury cliffside resort overlooking the Andaman Sea. Evening private VIP seating at the Cellular Jail Light & Sound show narrating India's struggle for independence.",
            mealsIncluded: JSON.stringify(["Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Welcomhotel By ITC Hotels, Bay Island",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 4.8,
            accommodationDetails:
              "Designed by legendary architect Charles Correa with native Padauk wood suites looking out to the harbor.",
          },
          {
            dayNumber: 2,
            title: "Luxury Catamaran to Havelock & Radhanagar Sunset",
            description:
              "Board the Makruzz Royal Class catamaran slicing across cobalt waters to Havelock Island (Swaraj Dweep). Check in to Taj Exotica Resort & Spa. Late afternoon excursion to Radhanagar Beach (Beach No. 7), ranked amongst the finest beaches in the world.",
            mealsIncluded: JSON.stringify(["Breakfast", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Taj Exotica Resort & Spa, Andamans",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 5.0,
            accommodationDetails:
              "Sprawling 46-acre sanctuary with luxury stilted villas under coconut canopies, steps away from pristine shoreline.",
          },
          {
            dayNumber: 3,
            title: "Private Speedboat to Elephant Beach Reefs & Snorkeling",
            description:
              "Private chartered speedboat to the secluded reefs of Elephant Beach. Enjoy private guided snorkeling amongst untouched staghorn corals, sea turtles, and clownfish with a certified PADI marine naturalist. Afternoon spa indulgence at Jiva Spa.",
            mealsIncluded: JSON.stringify(["Breakfast", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Taj Exotica Resort & Spa, Andamans",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 5.0,
            accommodationDetails: "Curated beachside dining under lantern-lit banyan trees.",
          },
          {
            dayNumber: 4,
            title: "Escape to Neil Island: Natural Coral Bridge & Bharatpur Beach",
            description:
              "Cruise to Neil Island (Shaheed Dweep), an oasis of slow island life. Visit the magnificent Howrah Bridge—a geological natural limestone rock arch formation. Relax on the lagoon waters of Bharatpur beach.",
            mealsIncluded: JSON.stringify(["Breakfast", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1510414842594-a61752af3337?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Sea Shell Samssara Neil Island",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 4.8,
            accommodationDetails:
              "Chic beachside pool villas offering private boardwalks onto quiet coral beaches.",
          },
          {
            dayNumber: 5,
            title: "Laxmanpur Beach Sunset & Catamaran Return to Port Blair",
            description:
              "Witness the famous Laxmanpur beach sunset point known for shells and vivid color spectrums. Board the late afternoon luxury catamaran back to Port Blair. Celebratory farewell seafood banquet at a rooftop overlooking the illuminated harbor.",
            mealsIncluded: JSON.stringify(["Breakfast", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Welcomhotel By ITC Hotels, Bay Island",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 4.8,
            accommodationDetails: "Harbor-view deluxe suite with personalized farewell gift.",
          },
          {
            dayNumber: 6,
            title: "Port Blair Departure",
            description:
              "Leisurely breakfast by the pool and assisted transfer to Port Blair airport for your flight home.",
            mealsIncluded: JSON.stringify(["Breakfast"]),
            activityPhotos: JSON.stringify([]),
            accommodationName: "Airport Drop-off",
            accommodationPhoto: null,
            accommodationRating: 5.0,
            accommodationDetails: "Private luxury chauffeur drop-off.",
          },
        ],
      },
    },
  });

  // Package 4: Rajasthan
  const rajasthan = await prisma.package.create({
    data: {
      title: "Rajasthan Sovereign Royalty: Lake Palace, Blue City & Amber Fortress",
      slug: "rajasthan-sovereign-royalty",
      destination: "Rajasthan, India",
      durationDays: 6,
      durationNights: 5,
      basePrice: 145000,
      discountedPrice: 119000,
      featuredImage:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85",
      ]),
      overview:
        "Relive the grandeur of the Rajput Maharajas. Cruise the shimmering waters of Lake Pichola to your private island palace in Udaipur, marvel at the towering ramparts of Mehrangarh in Jodhpur, and enter the pink-hued gates and amber bastions of Jaipur with royal historians.",
      mapCoordinates: JSON.stringify([
        { name: "Udaipur Lake Pichola", lat: 24.5764, lng: 73.6835 },
        { name: "Ranakpur Jain Temples", lat: 25.1163, lng: 73.4735 },
        { name: "Jodhpur Blue City & Mehrangarh", lat: 26.2978, lng: 73.0185 },
        { name: "Jaipur Pink City & Amber Fort", lat: 26.9855, lng: 75.8513 },
      ]),
      inclusions: JSON.stringify([
        "5 Nights in authentic royal heritage palace suites (Taj / Oberoi / Raas)",
        "Daily royal champagne breakfast and 4-course Rajputana thali dinners",
        "Private chauffeur-driven Mercedes / BMW / Toyota Fortuner throughout",
        "Private solar boat cruise to Jagmandir Island Palace on Lake Pichola",
        "Curated private tour of Mehrangarh Fort with a royal family curator",
        "All palace entry tickets, camera permits, and monument concierge access",
      ]),
      exclusions: JSON.stringify([
        "Airfares to Udaipur (UDR) and from Jaipur (JAI)",
        "Hot air balloon ride over Jaipur (optional booking available)",
        "Personal purchases of gemstones, textiles, and antique crafts",
      ]),
      paymentPolicy:
        "25% confirmation deposit, 75% payable 14 days before check-in.",
      cancellationPolicy:
        "100% refund up to 21 days before arrival date. 50% refund up to 10 days prior.",
      isFeatured: true,
      isPublished: true,
      viewsCount: 3120,
      itinerary: {
        create: [
          {
            dayNumber: 1,
            title: "Udaipur: Venice of the East & Lake Pichola Private Boat",
            description:
              "Arrive in Udaipur. Arrive at the private jetty where your royal boat awaits to ferry you across Lake Pichola. Check in to your palace suite. Afternoon private visit to the City Palace complex followed by a candlelit rooftop dinner overlooking the illuminated lake.",
            mealsIncluded: JSON.stringify(["Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Taj Lake Palace, Udaipur",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 5.0,
            accommodationDetails:
              "Legendary 18th-century white marble palace floating in the center of Lake Pichola.",
          },
          {
            dayNumber: 2,
            title: "Artisans of Mewar & Vintage Car Collection",
            description:
              "Explore Saheliyon ki Bari (Courtyard of Maidens) and the private vintage car gallery of the Maharana of Mewar. Afternoon high tea at Jagmandir Island palace.",
            mealsIncluded: JSON.stringify(["Breakfast", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Taj Lake Palace, Udaipur",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 5.0,
            accommodationDetails: "Private butler service and royal spa access.",
          },
          {
            dayNumber: 3,
            title: "Ranakpur Marble Marvel to the Blue Citadel of Jodhpur",
            description:
              "Drive through the rugged Aravalli hills stopping at Ranakpur to witness 1,444 intricately carved marble pillars where no two are alike. Arrive in Jodhpur and check into Raas, nestled right beneath the majestic Mehrangarh Fort.",
            mealsIncluded: JSON.stringify(["Breakfast", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "Raas Jodhpur (Luxury Heritage Haveli)",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 4.9,
            accommodationDetails:
              "18th-century haveli in red sandstone directly facing the towering fort ramparts.",
          },
          {
            dayNumber: 4,
            title: "Mehrangarh Fort Curator Tour & Blue City Heritage Walk",
            description:
              "Exclusive before-hours private tour of Mehrangarh Fort with the head curator. Walk through the blue-washed alleyways of the old quarter, meeting multigenerational spice and textile families. Afternoon transfer to Jaipur.",
            mealsIncluded: JSON.stringify(["Breakfast", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "The Oberoi Rajvilas, Jaipur",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 5.0,
            accommodationDetails:
              "32-acre fort-style estate with sunken marble tubs, peacocks, and private reflection pools.",
          },
          {
            dayNumber: 5,
            title: "Jaipur: Amber Fort Sheesh Mahal, Hawa Mahal & Royal Observatory",
            description:
              "Morning jeep ascent to Amber Fort to witness the sparkling mirror halls of Sheesh Mahal. Photo stop at the honeycomb facade of Hawa Mahal and VIP access to the private residential quarters of City Palace Jaipur.",
            mealsIncluded: JSON.stringify(["Breakfast", "Dinner"]),
            activityPhotos: JSON.stringify([
              "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
            ]),
            accommodationName: "The Oberoi Rajvilas, Jaipur",
            accommodationPhoto:
              "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
            accommodationRating: 5.0,
            accommodationDetails: "Signature private sitar recital by torchlight.",
          },
          {
            dayNumber: 6,
            title: "Royal Departure from the Pink City",
            description:
              "Champagne breakfast amidst lush gardens. Assisted chauffeur transfer to Jaipur International Airport for your onward journey.",
            mealsIncluded: JSON.stringify(["Breakfast"]),
            activityPhotos: JSON.stringify([]),
            accommodationName: "Airport Transfer",
            accommodationPhoto: null,
            accommodationRating: 5.0,
            accommodationDetails: "Exclusive VIP vehicle drop-off at departure terminal.",
          },
        ],
      },
    },
  });

  // 3. Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        customerName: "Vikramaditya & Radhika Singhania",
        tripDestination: "Kashmir Celestial Serenade",
        rating: 5,
        reviewText:
          "Trip Master delivered an extraordinary experience in Gulmarg and Pahalgam. The private Shikara at sunset with fresh hot Kahwa, followed by our stay at The Khyber, was pure magic. The 24/7 concierge was always one step ahead.",
        customerPhoto:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        isPublished: true,
      },
      {
        customerName: "Dr. Ananya & Devansh Roy",
        tripDestination: "Kerala Sovereign Backwaters",
        rating: 5,
        reviewText:
          "From the moment our chauffeur met us at Kochi airport to the private houseboat with a chef preparing fresh Karimeen, every detail was immaculate. Kumarakom Lake Resort was like stepping into heaven.",
        customerPhoto:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        isPublished: true,
      },
      {
        customerName: "Siddharth & Natasha Kapoor",
        tripDestination: "Andaman Sovereign Islands",
        rating: 5,
        reviewText:
          "The private villa at Taj Exotica Havelock was unbelievable! Trip Master took care of all Makruzz tickets and private speedboats seamlessly. Truly high-end hospitality without any friction.",
        customerPhoto:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        isPublished: true,
      },
      {
        customerName: "Meera & Rajesh Bansal",
        tripDestination: "Rajasthan Sovereign Royalty",
        rating: 5,
        reviewText:
          "Staying at Taj Lake Palace and having a private curator walk us through Mehrangarh Fort was the highlight of our 25th anniversary. We will never book luxury travel with anyone else.",
        customerPhoto:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        isPublished: true,
      },
    ],
  });

  // 4. FAQs
  await prisma.fAQ.createMany({
    data: [
      {
        question: "How does booking and payment work with Trip Master?",
        answer:
          "All our journeys are guest-based with zero cumbersome logins. When you submit an inquiry or choose to book, our luxury concierge reviews your dates, secures provisional holds on premium suites, and shares a digital quote. You can confirm via secure Razorpay payment (Credit Cards, Net Banking, UPI) with our flexible advance deposit structure.",
        category: "Booking & Payments",
        order: 1,
        isPublished: true,
      },
      {
        question: "Can itineraries be customized to our specific dates and interests?",
        answer:
          "Yes, absolutely. Every itinerary shown on our portal is a bespoke blueprint. We can add or remove nights, upgrade to presidential villas, arrange private helicopter transfers, or cater to special culinary and dietary requirements upon request.",
        category: "Customization",
        order: 2,
        isPublished: true,
      },
      {
        question: "What safety, vehicle, and chauffeur standards are maintained?",
        answer:
          "We only operate sanitized, late-model luxury SUVs and sedans (Toyota Innova Crysta, Fortuner, Mercedes, BMW). Our chauffeurs are background-verified, English and regional language proficient, and trained in hospitality etiquette.",
        category: "Safety & Transfers",
        order: 3,
        isPublished: true,
      },
      {
        question: "What is your cancellation and refund policy?",
        answer:
          "We offer some of the most traveller-friendly cancellation policies in luxury hospitality. Most packages offer 100% full refund up to 14 to 21 days before departure. The exact terms are transparently displayed on each package page and on your digital booking voucher.",
        category: "Cancellations",
        order: 4,
        isPublished: true,
      },
      {
        question: "Is there someone available to help us during our trip?",
        answer:
          "Yes. Every party is assigned a Dedicated Trip Concierge accessible 24/7 via phone and WhatsApp. They monitor flight timings, hotel check-ins, weather conditions, and special dining reservations in real-time.",
        category: "Concierge Support",
        order: 5,
        isPublished: true,
      },
    ],
  });

  // 5. Seed Realistic CRM Customers, Inquiries, Bookings & Document Vault
  const now = new Date();
  const todayFollowUp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0);
  const overdueFollowUp = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
  const upcomingFollowUp = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days ahead

  // Customer 1: Rohan Malhotra
  const c1 = await prisma.customer.create({
    data: {
      name: "Rohan Malhotra",
      email: "rohan.malhotra@luxurytravel.com",
      phone: "+91 98111 22334",
      whatsappNumber: "+91 98111 22334",
      city: "Mumbai",
      notes: "VIP connoisseur, prefers corner lake view suites and king beds.",
    },
  });

  const inq1 = await prisma.inquiry.create({
    data: {
      customerId: c1.id,
      packageId: kashmir.id,
      destination: "Kashmir, India",
      travelDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      paxCount: 2,
      status: "QUOTED",
      followUpDate: todayFollowUp,
      followUpNote: "Client reviewing quote; call to confirm Sukoon Houseboat suite block.",
      internalNotes: JSON.stringify([
        "2026-11-04 11:30 AM: Inquired via website. Wants 5-star mountain suites.",
        "2026-11-05 10:15 AM: Spoke with Mr. Malhotra. Sent tailored quote ₹1,96,000 via WhatsApp.",
      ]),
    },
  });

  const bk1 = await prisma.booking.create({
    data: {
      bookingReference: "TM-KAS-2026-001",
      customerId: c1.id,
      packageId: kashmir.id,
      inquiryId: inq1.id,
      travelStartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      travelEndDate: new Date(Date.now() + 36 * 24 * 60 * 60 * 1000),
      paxCount: 2,
      totalAmount: 196000,
      amountPaid: 58800,
      balanceAmount: 137200,
      bookingStatus: "PARTIALLY_PAID",
      documents: JSON.stringify([
        "https://tripmaster.in/docs/vouchers/TM-KAS-001.pdf",
      ]),
      paymentTransactions: {
        create: [
          {
            razorpayOrderId: "order_KashmirAdvance01",
            razorpayPaymentId: "pay_KashmirSuccess01",
            amount: 58800,
            paymentMethod: "UPI",
            status: "SUCCESS",
          },
        ],
      },
      customerDocuments: {
        create: [
          {
            customerId: c1.id,
            title: "Kashmir Luxury Proposal & Quote #TM-104",
            type: "QUOTATION",
            fileUrl: "https://tripmaster.in/docs/quotes/TM-Q-104.pdf",
            fileSize: "1.4 MB",
          },
          {
            customerId: c1.id,
            title: "Provisional Booking Voucher - Sukoon & Khyber",
            type: "CONFIRMATION",
            fileUrl: "https://tripmaster.in/docs/vouchers/TM-KAS-001.pdf",
            fileSize: "840 KB",
          },
          {
            customerId: c1.id,
            title: "Deposit Payment Receipt #RCP-9921",
            type: "RECEIPT",
            fileUrl: "https://tripmaster.in/docs/receipts/RCP-9921.pdf",
            fileSize: "420 KB",
          },
        ],
      },
    },
  });

  // Customer 2: Meera Bansal
  const c2 = await prisma.customer.create({
    data: {
      name: "Meera & Rajesh Bansal",
      email: "meera.bansal@delhicapital.in",
      phone: "+91 98711 55667",
      whatsappNumber: "+91 98711 55667",
      city: "New Delhi",
      notes: "Celebrating 25th wedding anniversary. Requires private butler & vintage car transfer.",
    },
  });

  await prisma.inquiry.create({
    data: {
      customerId: c2.id,
      packageId: rajasthan.id,
      destination: "Rajasthan Sovereign Royalty",
      travelDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      paxCount: 2,
      status: "CONTACTED",
      followUpDate: overdueFollowUp, // Overdue!
      followUpNote: "OVERDUE: Call client back regarding Jagmandir private candlelight dinner upgrade.",
      internalNotes: JSON.stringify([
        "2026-11-03 04:00 PM: Website lead received for Rajasthan Royal Odyssey.",
        "2026-11-04 02:00 PM: Called Mrs. Bansal. She wants Lake Palace suites facing City Palace.",
      ]),
    },
  });

  // Customer 3: Dr. Ananya Roy
  const c3 = await prisma.customer.create({
    data: {
      name: "Dr. Ananya & Devansh Roy",
      email: "ananya.roy@medicare.org",
      phone: "+91 97400 33445",
      whatsappNumber: "+91 97400 33445",
      city: "Bengaluru",
      notes: "High tea enthusiast, requests Ayurvedic rejuvenation package inclusion.",
    },
  });

  await prisma.inquiry.create({
    data: {
      customerId: c3.id,
      packageId: kerala.id,
      destination: "Kerala Sovereign Backwaters",
      travelDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      paxCount: 2,
      status: "NEW",
      followUpDate: todayFollowUp, // Due Today!
      followUpNote: "Share private 1-bedroom Kettuvallam luxury houseboat photographs.",
      internalNotes: JSON.stringify([
        "2026-11-05 06:10 PM: New guest inquiry received. Needs quiet secluded backwater bays.",
      ]),
    },
  });

  // Customer 4: Siddharth Kapoor (Converted with confirmed booking)
  const c4 = await prisma.customer.create({
    data: {
      name: "Siddharth & Natasha Kapoor",
      email: "siddharth.kapoor@venture.in",
      phone: "+91 99888 11223",
      whatsappNumber: "+91 99888 11223",
      city: "Hyderabad",
      notes: "Scuba certified, loves oceanfront villas.",
    },
  });

  const inq4 = await prisma.inquiry.create({
    data: {
      customerId: c4.id,
      packageId: andaman.id,
      destination: "Andaman Sovereign Islands",
      travelDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      paxCount: 2,
      status: "CONVERTED",
      followUpDate: null,
      internalNotes: JSON.stringify([
        "2026-10-28: Inquired for Havelock & Neil luxury escape.",
        "2026-11-01: Confirmed Taj Exotica pool villa. Full amount collected.",
      ]),
    },
  });

  await prisma.booking.create({
    data: {
      bookingReference: "TM-AND-2026-002",
      customerId: c4.id,
      packageId: andaman.id,
      inquiryId: inq4.id,
      travelStartDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      travelEndDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      paxCount: 2,
      totalAmount: 210000,
      amountPaid: 210000,
      balanceAmount: 0,
      bookingStatus: "CONFIRMED",
      paymentTransactions: {
        create: [
          {
            razorpayOrderId: "order_AndamanFull01",
            razorpayPaymentId: "pay_AndamanSuccess01",
            amount: 210000,
            paymentMethod: "Credit Card",
            status: "SUCCESS",
          },
        ],
      },
      customerDocuments: {
        create: [
          {
            customerId: c4.id,
            title: "Guest Passports & Island Ferry E-Tickets",
            type: "TICKET",
            fileUrl: "https://tripmaster.in/docs/tickets/TM-FERRY-AND.pdf",
            fileSize: "2.1 MB",
          },
          {
            customerId: c4.id,
            title: "Taj Exotica Havelock Confirmed Voucher",
            type: "CONFIRMATION",
            fileUrl: "https://tripmaster.in/docs/vouchers/TM-AND-002.pdf",
            fileSize: "910 KB",
          },
        ],
      },
    },
  });

  // Booking 3: Meera Bansal - Rajasthan Royal Odyssey (Fully Paid via Razorpay + RTGS)
  await prisma.booking.create({
    data: {
      bookingReference: "TM-RAJ-2026-003",
      customerId: c2.id,
      packageId: rajasthan.id,
      travelStartDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      travelEndDate: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000),
      paxCount: 2,
      adultsCount: 2,
      childrenCount: 0,
      specialRequests: "25th Anniversary celebration. Vintage car pickup at Udaipur and Lake Palace private candlelit dinner.",
      totalAmount: 340000,
      amountPaid: 340000,
      balanceAmount: 0,
      bookingStatus: "CONFIRMED",
      paymentTransactions: {
        create: [
          {
            razorpayOrderId: "order_RajAdvance03",
            razorpayPaymentId: "pay_RajToken03",
            amount: 100000,
            paymentMethod: "RAZORPAY_ONLINE",
            status: "SUCCESS",
            notes: "Online token advance paid via Razorpay",
          },
          {
            amount: 240000,
            paymentMethod: "BANK_TRANSFER",
            status: "SUCCESS",
            notes: "Balance payment settled via HDFC Bank RTGS UTR: HDFCR52026110298",
          },
        ],
      },
      customerDocuments: {
        create: [
          {
            customerId: c2.id,
            title: "Rajasthan Heritage Itinerary & Voucher",
            type: "CONFIRMATION",
            fileUrl: "https://tripmaster.in/docs/vouchers/TM-RAJ-003.pdf",
            fileSize: "1.2 MB",
          },
          {
            customerId: c2.id,
            title: "RTGS Balance Payment Receipt #RCP-9940",
            type: "RECEIPT",
            fileUrl: "https://tripmaster.in/docs/receipts/RCP-9940.pdf",
            fileSize: "380 KB",
          },
        ],
      },
    },
  });

  // Booking 4: Dr. Ananya Roy - Kerala Backwaters (Partially Paid with Pending Balance)
  await prisma.booking.create({
    data: {
      bookingReference: "TM-KER-2026-004",
      customerId: c3.id,
      packageId: kerala.id,
      travelStartDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      travelEndDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      paxCount: 2,
      adultsCount: 2,
      childrenCount: 0,
      specialRequests: "Ayurvedic massage session pre-booking at Kumarakom Lake Resort.",
      totalAmount: 156000,
      amountPaid: 45000,
      balanceAmount: 111000,
      bookingStatus: "PARTIALLY_PAID",
      paymentTransactions: {
        create: [
          {
            razorpayOrderId: "order_KeralaToken04",
            razorpayPaymentId: "pay_KeralaUpi04",
            amount: 45000,
            paymentMethod: "UPI",
            status: "SUCCESS",
            notes: "Advance deposit collected via GooglePay UPI",
          },
        ],
      },
      customerDocuments: {
        create: [
          {
            customerId: c3.id,
            title: "Provisional Kerala Booking Confirmation",
            type: "CONFIRMATION",
            fileUrl: "https://tripmaster.in/docs/vouchers/TM-KER-004.pdf",
            fileSize: "780 KB",
          },
        ],
      },
    },
  });

  // Customer 5: Rajesh Gupta & Booking 5 (Cancelled with Refund)
  const c5 = await prisma.customer.create({
    data: {
      name: "Rajesh & Priya Gupta",
      email: "rajesh.gupta@fintechcorp.in",
      phone: "+91 98200 44556",
      whatsappNumber: "+91 98200 44556",
      city: "Gurugram",
      notes: "Corporate client. Trip cancelled due to international business travel.",
    },
  });

  await prisma.booking.create({
    data: {
      bookingReference: "TM-KAS-2026-005",
      customerId: c5.id,
      packageId: kashmir.id,
      travelStartDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      travelEndDate: new Date(Date.now() + 66 * 24 * 60 * 60 * 1000),
      paxCount: 2,
      adultsCount: 2,
      childrenCount: 0,
      specialRequests: "Heated suite in Gulmarg.",
      totalAmount: 196000,
      amountPaid: 0,
      balanceAmount: 196000,
      bookingStatus: "CANCELLED",
      paymentTransactions: {
        create: [
          {
            razorpayOrderId: "order_KashmirRefund05",
            razorpayPaymentId: "pay_KashmirCancel05",
            amount: 50000,
            paymentMethod: "CARD",
            status: "REFUNDED",
            refundStatus: "FULL_REFUND",
            refundAmount: 50000,
            notes: "Guest requested cancellation 45 days in advance; full refund issued to original card.",
          },
        ],
      },
    },
  });

  console.log("Database seeded successfully with 5 comprehensive bookings!");
  console.log(`Created 4 luxury packages:`);
  console.log(`- ${kashmir.title}`);
  console.log(`- ${kerala.title}`);
  console.log(`- ${andaman.title}`);
  console.log(`- ${rajasthan.title}`);
  console.log(`Created sample booking: ${bk1.bookingReference}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

