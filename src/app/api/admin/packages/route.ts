import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const destination = searchParams.get("destination");

    const where: Record<string, unknown> = {};

    if (status === "published") where.isPublished = true;
    if (status === "draft") where.isPublished = false;

    if (destination && destination !== "all") {
      where.destination = { contains: destination };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { destination: { contains: search } },
        { slug: { contains: search } },
      ];
    }

    const packages = await prisma.package.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        itinerary: {
          select: {
            id: true,
            dayNumber: true,
            title: true,
            accommodationName: true,
            accommodationRating: true,
            accommodationPhoto: true,
          },
          orderBy: { dayNumber: "asc" },
        },
        _count: {
          select: {
            bookings: true,
            inquiries: true,
          },
        },
      },
    });

    const formatted = packages.map((pkg) => ({
      ...pkg,
      galleryImages: JSON.parse(pkg.galleryImages || "[]"),
      mapCoordinates: JSON.parse(pkg.mapCoordinates || "[]"),
      inclusions: JSON.parse(pkg.inclusions || "[]"),
      exclusions: JSON.parse(pkg.exclusions || "[]"),
    }));

    return NextResponse.json({
      success: true,
      packages: formatted,
    });
  } catch (error) {
    console.error("Admin fetch packages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      destination,
      durationDays,
      durationNights,
      basePrice,
      discountedPrice,
      featuredImage,
      galleryImages,
      overview,
      mapCoordinates,
      inclusions,
      exclusions,
      paymentPolicy,
      cancellationPolicy,
      isFeatured,
      isPublished,
      itinerary,
    } = body;

    if (!title || !destination || !basePrice) {
      return NextResponse.json(
        { success: false, error: "Title, Destination, and Base Price are required" },
        { status: 400 }
      );
    }

    // Auto-generate or sanitize slug
    let finalSlug = slug
      ? slug
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
      : title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "");

    // Check slug collision
    const existing = await prisma.package.findUnique({
      where: { slug: finalSlug },
    });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    const createdPackage = await prisma.package.create({
      data: {
        title,
        slug: finalSlug,
        destination,
        durationDays: parseInt(durationDays || "5", 10),
        durationNights: parseInt(durationNights || "4", 10),
        basePrice: parseFloat(basePrice),
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
        featuredImage:
          featuredImage ||
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        galleryImages: JSON.stringify(galleryImages || []),
        overview: overview || "",
        mapCoordinates: JSON.stringify(mapCoordinates || []),
        inclusions: JSON.stringify(inclusions || []),
        exclusions: JSON.stringify(exclusions || []),
        paymentPolicy:
          paymentPolicy ||
          "30% advance deposit at booking. Balance 70% payable 15 days prior to arrival.",
        cancellationPolicy:
          cancellationPolicy ||
          "100% full refund up to 21 days before travel. 50% refund up to 10 days before travel.",
        isFeatured: Boolean(isFeatured),
        isPublished: Boolean(isPublished),
        itinerary: {
          create: (itinerary || []).map(
            (
              day: {
                dayNumber: number;
                title: string;
                description: string;
                mealsIncluded: string[];
                activityPhotos: string[];
                accommodationName?: string;
                accommodationPhoto?: string;
                accommodationRating?: number;
                accommodationCategory?: string;
                accommodationDetails?: string;
              },
              idx: number
            ) => ({
              dayNumber: day.dayNumber || idx + 1,
              title: day.title || `Day ${idx + 1}`,
              description: day.description || "",
              mealsIncluded: JSON.stringify(day.mealsIncluded || []),
              activityPhotos: JSON.stringify(day.activityPhotos || []),
              accommodationName: day.accommodationName || null,
              accommodationPhoto: day.accommodationPhoto || null,
              accommodationRating: day.accommodationRating
                ? parseFloat(String(day.accommodationRating))
                : 5.0,
              accommodationCategory: day.accommodationCategory || "Luxury Resort",
              accommodationDetails: day.accommodationDetails || null,
            })
          ),
        },
      },
      include: {
        itinerary: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Package created successfully",
      package: createdPackage,
    });
  } catch (error) {
    console.error("Admin create package error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create package" },
      { status: 500 }
    );
  }
}

