import { PackageItem } from "@/components/packages/PackageCatalog";

export interface FallbackItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  mealsIncluded: string[];
  activityPhotos: string[];
  accommodationName: string;
  accommodationPhoto: string | null;
  accommodationRating: number;
  accommodationDetails: string;
}

export interface FallbackPackageDetail extends PackageItem {
  galleryImages: string[];
  mapCoordinates: { name: string; lat: number; lng: number }[];
  exclusions: string[];
  paymentPolicy: string;
  cancellationPolicy: string;
  isFeatured: boolean;
  isPublished: boolean;
  itinerary: FallbackItineraryDay[];
}

export const FALLBACK_PACKAGES: FallbackPackageDetail[] = [
  {
    id: "pkg-kashmir-celestial",
    title: "Kashmir Celestial Serenade: Gulmarg Gondola & Dal Royal Houseboat",
    slug: "kashmir-celestial-serenade",
    destination: "Kashmir, India",
    durationDays: 6,
    durationNights: 5,
    basePrice: 125000,
    discountedPrice: 98000,
    featuredImage:
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
    ],
    overview:
      "Surrender to the crown of the Himalayas. Glide through the lotus-dappled waters of Dal Lake on a private Shikara, sleep under hand-carved cedar ceilings in a luxury heritage houseboat, soar to 14,000 feet on the Gulmarg Gondola Phase II, and stroll through the saffron plains and pine-scented meadows of Pahalgam.",
    mapCoordinates: [
      { name: "Srinagar (Dal Lake)", lat: 34.0837, lng: 74.7973 },
      { name: "Gulmarg Meadows", lat: 34.0484, lng: 74.3805 },
      { name: "Pahalgam Valley of Shepherds", lat: 34.0163, lng: 75.315 },
      { name: "Aru Valley Sanctuary", lat: 34.0921, lng: 75.2638 },
    ],
    inclusions: [
      "5 Nights accommodation in 5-star luxury resorts & premium lake-facing houseboat",
      "Daily gourmet breakfast & 4-course royal Kashmiri Wazwan dinner experience",
      "Private chauffeur-driven luxury SUV (Innova Crysta / Toyota Fortuner) throughout",
      "VIP Priority tickets for Gulmarg Gondola Phase 1 & Phase 2",
      "Sunset 2-hour private Shikara cruise on Dal Lake with hot Kashmiri Kahwa",
      "All toll taxes, parking, driver allowances, and 24/7 dedicated trip manager",
    ],
    exclusions: [
      "Domestic or International flights to/from Srinagar International Airport (SXR)",
      "Pony rides and private sledging in Gulmarg & Pahalgam (can be pre-booked upon request)",
      "Personal expenses, laundry, telephone calls, and alcoholic beverages",
      "Travel and medical insurance (available as an optional add-on)",
    ],
    paymentPolicy:
      "30% advance deposit required at time of confirmation. Balance 70% payable 15 days prior to arrival. Razorpay Credit/Debit cards, UPI, and Bank Transfers accepted.",
    cancellationPolicy:
      "Free cancellation up to 21 days before travel date with 100% refund. 50% refund between 20 to 10 days. Non-refundable within 9 days of travel.",
    isFeatured: true,
    isPublished: true,
    viewsCount: 1420,
    itinerary: [
      {
        dayNumber: 1,
        title: "Royal Arrival in Srinagar & Sunset Shikara on Dal Lake",
        description:
          "Arrive at Srinagar International Airport where your private Trip Master chauffeur welcomes you with traditional saffron Kahwa. Transfer to your luxury heritage houseboat stationed on Dal Lake. In the evening, embark on a serene 2-hour Shikara ride observing floating flower gardens and Char Chinar island against the twilight Pir Panjal peaks.",
        mealsIncluded: ["Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        ],
        accommodationName: "Pahalgam Hotel & River Cottages",
        accommodationPhoto:
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
        accommodationRating: 4.8,
        accommodationDetails: "Cedar cottage facing pine mountains.",
      },
      {
        dayNumber: 6,
        title: "Srinagar Departure & Farewell Kahwa",
        description:
          "Enjoy a final morning breakfast overlooking Dal Lake before your private chauffeur transfers you to Srinagar International Airport for your return flight.",
        mealsIncluded: ["Breakfast"],
        activityPhotos: [],
        accommodationName: "Airport Drop-off",
        accommodationPhoto: null,
        accommodationRating: 5.0,
        accommodationDetails: "Private luxury chauffeur transfer with luggage assistance.",
      },
    ],
  },
  {
    id: "pkg-kerala-sovereign",
    title: "Kerala Sovereign Backwaters, Tea Sanctuaries & Marari Sands",
    slug: "kerala-sovereign-backwaters",
    destination: "Kerala, India",
    durationDays: 6,
    durationNights: 5,
    basePrice: 110000,
    discountedPrice: 89000,
    featuredImage:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
    ],
    overview:
      "Unwind in God's Own Country. From the mist-draped tea carpet hills of Munnar to private luxury houseboats cruising through secret palm-canopied canals of Kumarakom, capped off with barefoot luxury villas overlooking the Arabian Sea in Marari.",
    mapCoordinates: [
      { name: "Cochin International Airport", lat: 10.1556, lng: 76.3916 },
      { name: "Munnar Tea Plantations", lat: 10.0889, lng: 77.0595 },
      { name: "Kumarakom Lake Canals", lat: 9.6175, lng: 76.4301 },
      { name: "Marari Secluded Beach", lat: 9.6006, lng: 76.2999 },
    ],
    inclusions: [
      "5 Nights in luxury heritage pool villas & private 1-bedroom air-conditioned Kettuvallam houseboat",
      "All meals on the private houseboat freshly prepared by dedicated on-board chef",
      "Daily lavish gourmet buffet breakfast at all luxury resorts",
      "Private chauffeur-driven premium air-conditioned luxury vehicle throughout the tour",
      "Curated spice plantation tour and private tea tasting session in Munnar",
      "Complimentary 60-minute Ayurvedic rejuvenation couple massage at Kumarakom",
    ],
    exclusions: [
      "Airfares to/from Cochin International Airport (COK)",
      "Optional water sports at Marari Beach",
      "Personal expenses, gratuities, and alcoholic beverages",
    ],
    paymentPolicy:
      "25% advance to block luxury pool villas and houseboat. Balance 75% payable 10 days before departure.",
    cancellationPolicy:
      "100% refund up to 14 days prior to travel. 50% refund within 7 to 13 days.",
    isFeatured: true,
    isPublished: true,
    viewsCount: 2180,
    itinerary: [
      {
        dayNumber: 1,
        title: "Cochin to the Cloud-Kissed Tea Estates of Munnar",
        description:
          "Arrive in Cochin and journey up the Western Ghats past Cheeyappara waterfalls to Munnar. Check into your mountain villa nestled amidst emerald tea estates. Enjoy evening high tea on your terrace overlooking rolling mist.",
        mealsIncluded: ["Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Lunch", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast"],
        activityPhotos: [],
        accommodationName: "Airport Transfer",
        accommodationPhoto: null,
        accommodationRating: 5.0,
        accommodationDetails: "Seamless airport transfer with express check-in guidance.",
      },
    ],
  },
  {
    id: "pkg-andaman-sovereign",
    title: "Andaman Sovereign Islands: Havelock Turquoise & Neil Coral Eden",
    slug: "andaman-sovereign-islands",
    destination: "Andaman Islands, India",
    durationDays: 6,
    durationNights: 5,
    basePrice: 135000,
    discountedPrice: 105000,
    featuredImage:
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1510414842594-a61752af3337?auto=format&fit=crop&w=1200&q=85",
    ],
    overview:
      "Indulge in India's most pristine tropical paradise. Pure azure waters, white powder sand voted Asia's best at Radhanagar Beach, private luxury catamarans, and untouched coral reefs in Havelock and Neil Island with private beach villa stays.",
    mapCoordinates: [
      { name: "Port Blair Capital", lat: 11.6234, lng: 92.7265 },
      { name: "Havelock Island (Swaraj Dweep)", lat: 11.9761, lng: 92.9876 },
      { name: "Radhanagar Beach No. 7", lat: 11.9835, lng: 92.9515 },
      { name: "Neil Island (Shaheed Dweep)", lat: 11.8322, lng: 93.0505 },
    ],
    inclusions: [
      "5 Nights in ocean-view luxury beach villas & 5-star private island resorts",
      "Royal Class premium tickets on high-speed luxury catamarans (Makruzz / Nautika)",
      "Daily lavish breakfast and curated beachside dinners",
      "Exclusive private sunset dinner setup at Radhanagar Beach",
      "Guided private snorkeling excursion with PADI certified dive master at Elephant Beach",
      "Private transfers in air-conditioned luxury SUVs on all islands",
    ],
    exclusions: [
      "Airfare to/from Veer Savarkar International Airport Port Blair (IXZ)",
      "Scuba diving certifications (optional add-on available)",
      "Personal expenses and premium alcoholic spirits",
    ],
    paymentPolicy:
      "30% advance on booking, balance due 20 days prior to island arrival.",
    cancellationPolicy:
      "Full refund up to 30 days prior. 50% refund up to 15 days prior.",
    isFeatured: true,
    isPublished: true,
    viewsCount: 1850,
    itinerary: [
      {
        dayNumber: 1,
        title: "Port Blair Arrival & Historic Cellular Jail Light & Sound",
        description:
          "Touch down at Port Blair where our concierge welcomes you. Transfer to your luxury cliffside resort overlooking the Andaman Sea. Evening private VIP seating at the Cellular Jail Light & Sound show narrating India's struggle for independence.",
        mealsIncluded: ["Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1510414842594-a61752af3337?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast"],
        activityPhotos: [],
        accommodationName: "Airport Drop-off",
        accommodationPhoto: null,
        accommodationRating: 5.0,
        accommodationDetails: "Private luxury chauffeur drop-off.",
      },
    ],
  },
  {
    id: "pkg-rajasthan-sovereign",
    title: "Rajasthan Sovereign Royalty: Lake Palace, Blue City & Amber Fortress",
    slug: "rajasthan-sovereign-royalty",
    destination: "Rajasthan, India",
    durationDays: 6,
    durationNights: 5,
    basePrice: 145000,
    discountedPrice: 119000,
    featuredImage:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85",
    ],
    overview:
      "Relive the grandeur of the Rajput Maharajas. Cruise the shimmering waters of Lake Pichola to your private island palace in Udaipur, marvel at the towering ramparts of Mehrangarh in Jodhpur, and enter the pink-hued gates and amber bastions of Jaipur with royal historians.",
    mapCoordinates: [
      { name: "Udaipur Lake Pichola", lat: 24.5764, lng: 73.6835 },
      { name: "Ranakpur Jain Temples", lat: 25.1163, lng: 73.4735 },
      { name: "Jodhpur Blue City & Mehrangarh", lat: 26.2978, lng: 73.0185 },
      { name: "Jaipur Pink City & Amber Fort", lat: 26.9855, lng: 75.8513 },
    ],
    inclusions: [
      "5 Nights in authentic royal heritage palace suites (Taj / Oberoi / Raas)",
      "Daily royal champagne breakfast and 4-course Rajputana thali dinners",
      "Private chauffeur-driven Mercedes / BMW / Toyota Fortuner throughout",
      "Private solar boat cruise to Jagmandir Island Palace on Lake Pichola",
      "Curated private tour of Mehrangarh Fort with a royal family curator",
      "All palace entry tickets, camera permits, and monument concierge access",
    ],
    exclusions: [
      "Airfares to Udaipur (UDR) and from Jaipur (JAI)",
      "Hot air balloon ride over Jaipur (optional booking available)",
      "Personal purchases of gemstones, textiles, and antique crafts",
    ],
    paymentPolicy:
      "25% confirmation deposit, 75% payable 14 days before check-in.",
    cancellationPolicy:
      "100% refund up to 21 days before arrival date. 50% refund up to 10 days prior.",
    isFeatured: true,
    isPublished: true,
    viewsCount: 3120,
    itinerary: [
      {
        dayNumber: 1,
        title: "Udaipur: Venice of the East & Lake Pichola Private Boat",
        description:
          "Arrive in Udaipur. Arrive at the private jetty where your royal boat awaits to ferry you across Lake Pichola. Check in to your palace suite. Afternoon private visit to the City Palace complex followed by a candlelit rooftop dinner overlooking the illuminated lake.",
        mealsIncluded: ["Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast", "Dinner"],
        activityPhotos: [
          "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        ],
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
        mealsIncluded: ["Breakfast"],
        activityPhotos: [],
        accommodationName: "Airport Transfer",
        accommodationPhoto: null,
        accommodationRating: 5.0,
        accommodationDetails: "Exclusive VIP vehicle drop-off at departure terminal.",
      },
    ],
  },
];

export function safeParseJson<T>(value: any, fallback: T): T {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "object") return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getFallbackPackages(): PackageItem[] {
  return FALLBACK_PACKAGES.map((pkg) => ({
    id: pkg.id,
    title: pkg.title,
    slug: pkg.slug,
    destination: pkg.destination,
    durationDays: pkg.durationDays,
    durationNights: pkg.durationNights,
    basePrice: pkg.basePrice,
    discountedPrice: pkg.discountedPrice,
    featuredImage: pkg.featuredImage,
    overview: pkg.overview,
    inclusions: pkg.inclusions,
    viewsCount: pkg.viewsCount,
  }));
}

export function getFallbackPackageBySlug(slug: string): FallbackPackageDetail | undefined {
  return FALLBACK_PACKAGES.find((pkg) => pkg.slug === slug);
}
