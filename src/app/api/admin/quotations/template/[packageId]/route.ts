import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ packageId: string }> }
) {
  try {
    const { packageId } = await params;

    const pkg = await prisma.package.findFirst({
      where: {
        OR: [{ id: packageId }, { slug: packageId }],
      },
      include: {
        itinerary: {
          orderBy: { dayNumber: "asc" },
        },
      },
    });

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: "Package not found" },
        { status: 404 }
      );
    }

    // Also fetch master places for this destination to supplement if needed
    const masterPlaces = await prisma.masterPlace.findMany({
      where: {
        destination: { contains: pkg.destination },
      },
      orderBy: { order: "asc" },
    });

    // Fetch site settings for advisor & branding
    const settings = await prisma.siteSettings.findFirst();

    // Map itinerary to Days with Places
    const days = pkg.itinerary.map((d) => {
      let activityPhotos: string[] = [];
      try {
        activityPhotos = JSON.parse(d.activityPhotos);
      } catch {
        activityPhotos = [];
      }

      // If this package is Singapore Explorer, we have matching detailed places
      const isSingapore = pkg.destination.toLowerCase().includes("singapore");
      let placesForDay: any[] = [];

      if (isSingapore && d.dayNumber === 1) {
        placesForDay = [
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
        ];
      } else if (isSingapore && d.dayNumber === 2) {
        placesForDay = [
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
        ];
      } else if (isSingapore && d.dayNumber === 3) {
        placesForDay = [
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
        ];
      } else if (isSingapore && d.dayNumber === 4) {
        placesForDay = [
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
        ];
      } else {
        // Fallback for other packages
        placesForDay = [
          {
            title: d.title,
            subtitle: `${pkg.destination}`,
            category: "ATTRACTION",
            photos: activityPhotos.length > 0 ? activityPhotos : [pkg.featuredImage],
            description: d.description,
          },
        ];
      }

      return {
        dayNumber: d.dayNumber,
        dayTitle: `Day ${d.dayNumber} - ${pkg.destination}`,
        dateLabel: d.title,
        places: placesForDay,
        hotel: d.accommodationName
          ? {
              name: d.accommodationName,
              photo: d.accommodationPhoto || pkg.featuredImage,
              rating: d.accommodationRating || 4.5,
              roomType: d.accommodationCategory || "4-Star Room",
              description:
                d.accommodationDetails ||
                "Relax in premium comfort with modern amenities and pool access.",
            }
          : null,
      };
    });

    let inclusions: string[] = [];
    let exclusions: string[] = [];
    let mapCoordinates: any[] = [];
    try {
      inclusions = JSON.parse(pkg.inclusions);
    } catch {
      inclusions = [];
    }
    try {
      exclusions = JSON.parse(pkg.exclusions);
    } catch {
      exclusions = [];
    }
    try {
      mapCoordinates = JSON.parse(pkg.mapCoordinates);
    } catch {
      mapCoordinates = [];
    }

    const price = pkg.discountedPrice || pkg.basePrice;

    const templateContent = {
      heroImage: pkg.featuredImage,
      title: pkg.title,
      subtitle: `Curated ${pkg.durationNights} Nights / ${pkg.durationDays} Days Itinerary Plan`,
      mapIntro: pkg.overview,
      mapStops:
        mapCoordinates.length > 0
          ? mapCoordinates.map((m: any) => ({
              name: m.name,
              label: m.label || "Planned Stop",
            }))
          : [
              { name: "Arrival Airport", label: "Arrival Transfer" },
              { name: "City Center", label: "Heritage & Culture" },
              { name: "Iconic Attractions", label: "Full Day Experience" },
              { name: "Scenic Coastline / Vista", label: "Leisure & Views" },
            ],
      summary: {
        duration: `${pkg.durationNights} Nights, ${pkg.durationDays} Days`,
        destination: pkg.destination,
        pricePerPersonFormatted: `INR ${price.toLocaleString("en-IN")} per person`,
        pricePerPerson: price,
        paxCount: 2,
        totalCostFormatted: `INR ${(price * 2).toLocaleString("en-IN")} for 2 Travellers`,
      },
      costBreakdown: [
        {
          category: `Accommodations (${pkg.durationNights} Nights)`,
          cost: `INR ${Math.round(price * 0.42).toLocaleString("en-IN")}`,
        },
        {
          category: "Sightseeing & Experiences",
          cost: `INR ${Math.round(price * 0.32).toLocaleString("en-IN")}`,
        },
        {
          category: "Transfers & Transport",
          cost: `INR ${Math.round(price * 0.16).toLocaleString("en-IN")}`,
        },
        {
          category: "Taxes & Local Concierge",
          cost: `INR ${Math.round(price * 0.1).toLocaleString("en-IN")}`,
        },
      ],
      staySummary: {
        city: pkg.destination,
        hotelName:
          days[0]?.hotel?.name || `${pkg.destination} Premium 4-Star Resort`,
        roomType: "Superior Room with Breakfast",
        rating: 4.5,
        photo:
          days[0]?.hotel?.photo ||
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      },
      mealsBanner: {
        title: "Meals Included Throughout Your Journey",
        description:
          "Daily breakfast included at hotel. Lunch & Dinner at leisure or recommended dining spots.",
        tags: [
          "Breakfast Included (Daily)",
          "Lunch At Leisure",
          "Dinner Recommendations",
        ],
      },
      quickDayWiseSummary: days.map((d) => ({
        day: `Day ${d.dayNumber}`,
        summary: d.dateLabel,
      })),
      days,
      momentsThatMatter: [
        {
          url:
            days[0]?.places[1]?.photos[0] ||
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
          caption: `${pkg.destination} Twilight Splendor`,
        },
        {
          url:
            days[1]?.places[0]?.photos[0] ||
            "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80",
          caption: "Unforgettable Thrills",
        },
        {
          url:
            days[2]?.places[0]?.photos[0] ||
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
          caption: "Panoramic Horizons",
        },
        {
          url:
            days[2]?.places[2]?.photos[0] ||
            "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
          caption: "Sensory Night Wonders",
        },
      ],
      inclusions,
      exclusions,
      paymentPolicy: [
        `INR ${Math.round(price * 0.4).toLocaleString("en-IN")} per person advance token to confirm slot.`,
        "Balance payment 15 days prior to travel date.",
        "100% refund on cancellation up to 21 days before departure.",
        "50% refund between 14-20 days before departure.",
        "Non-refundable within 14 days of travel.",
      ],
      reviews: [
        {
          customerName: "Jainam Mehta",
          tripDestination: pkg.title,
          rating: 5,
          reviewText: `Trip Master made our ${pkg.destination} holiday effortless. The hotel was superb, and tickets and transfers were ready with zero queues.`,
        },
        {
          customerName: "Dr Sajeev Nair",
          tripDestination: pkg.title,
          rating: 5,
          reviewText:
            "Flawless planning! Every highlight in the dossier was delivered with top quality. Our holiday advisor was available on WhatsApp 24/7.",
        },
        {
          customerName: "Dinesh Gandhi",
          tripDestination: pkg.title,
          rating: 5,
          reviewText:
            "Very transparent pricing and excellent 4-star property. Every place mentioned was seamless.",
        },
      ],
      advisor: {
        name: "Master Concierge Desk",
        phone: settings?.phone || "+91 98765 43210",
        whatsappNumber: settings?.whatsappNumber || "+91 98765 43210",
        email: settings?.email || "concierge@tripmaster.in",
        offices: "SINGAPORE AND INDIA",
        companyName: settings?.companyName || "Trip Master",
      },
    };

    return NextResponse.json({
      success: true,
      package: pkg,
      templateContent,
      masterPlaces,
    });
  } catch (error: any) {
    console.error("Template load error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to generate template" },
      { status: 500 }
    );
  }
}
