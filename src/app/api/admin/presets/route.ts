import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const countries = await prisma.masterCountry.findMany({
      orderBy: { order: "asc" },
      include: {
        places: { orderBy: { order: "asc" } },
        hotels: { orderBy: { order: "asc" } },
        transfers: { orderBy: { order: "asc" } },
      },
    });

    const parsedCountries = countries.map((c) => ({
      ...c,
      mapCoordinates: c.mapCoordinates ? JSON.parse(c.mapCoordinates) : [],
      inclusions: c.inclusions ? JSON.parse(c.inclusions) : [],
      exclusions: c.exclusions ? JSON.parse(c.exclusions) : [],
      paymentTerms: c.paymentTerms ? JSON.parse(c.paymentTerms) : [],
      places: c.places.map((p) => ({
        ...p,
        photos: p.photos ? JSON.parse(p.photos) : [],
      })),
      hotels: c.hotels.map((h) => ({
        ...h,
        mealPlans: h.mealPlans ? JSON.parse(h.mealPlans) : [],
        photos: h.photos ? JSON.parse(h.photos) : [],
      })),
    }));

    return NextResponse.json({ success: true, countries: parsedCountries });
  } catch (error: any) {
    console.error("Fetch presets error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load presets" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      bannerImage,
      overview,
      mapCoordinates,
      inclusions = [],
      exclusions = [],
      paymentTerms = [],
    } = body;

    if (!name || !bannerImage) {
      return NextResponse.json(
        { success: false, error: "Country name and banner image are required" },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const country = await prisma.masterCountry.create({
      data: {
        name,
        slug,
        bannerImage,
        overview: overview || "",
        mapCoordinates: mapCoordinates ? JSON.stringify(mapCoordinates) : "[]",
        inclusions: JSON.stringify(inclusions),
        exclusions: JSON.stringify(exclusions),
        paymentTerms: JSON.stringify(paymentTerms),
      },
    });

    return NextResponse.json({ success: true, country });
  } catch (error: any) {
    console.error("Create country preset error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create country preset" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, inclusions, exclusions, paymentTerms, overview, bannerImage } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Country ID is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {};
    if (inclusions !== undefined) updateData.inclusions = JSON.stringify(inclusions);
    if (exclusions !== undefined) updateData.exclusions = JSON.stringify(exclusions);
    if (paymentTerms !== undefined) updateData.paymentTerms = JSON.stringify(paymentTerms);
    if (overview !== undefined) updateData.overview = overview;
    if (bannerImage !== undefined) updateData.bannerImage = bannerImage;

    const updated = await prisma.masterCountry.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, country: updated });
  } catch (error: any) {
    console.error("Update country preset error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update country preset" },
      { status: 500 }
    );
  }
}
