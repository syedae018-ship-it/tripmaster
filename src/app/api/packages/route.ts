import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destination = searchParams.get("destination");
    const duration = searchParams.get("duration");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");
    const featured = searchParams.get("featured");

    // Build Prisma where clause
    const where: Record<string, unknown> = {
      isPublished: true,
    };

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (destination && destination !== "all") {
      where.destination = {
        contains: destination,
      };
    }

    if (duration) {
      if (duration === "1-5") {
        where.durationDays = { lte: 5 };
      } else if (duration === "6-8") {
        where.durationDays = { gte: 6, lte: 8 };
      } else if (duration === "9+") {
        where.durationDays = { gte: 9 };
      }
    }

    if (minPrice || maxPrice) {
      const priceFilter: { gte?: number; lte?: number } = {};
      if (minPrice) priceFilter.gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice);
      where.basePrice = priceFilter;
    }

    // Determine sorting
    let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
    if (sort === "price_asc") {
      orderBy = { discountedPrice: "asc" };
    } else if (sort === "price_desc") {
      orderBy = { discountedPrice: "desc" };
    } else if (sort === "duration") {
      orderBy = { durationDays: "asc" };
    } else if (sort === "views") {
      orderBy = { viewsCount: "desc" };
    }

    const packages = await prisma.package.findMany({
      where,
      orderBy,
      include: {
        itinerary: {
          select: {
            dayNumber: true,
            title: true,
            accommodationName: true,
            accommodationRating: true,
          },
          orderBy: {
            dayNumber: "asc",
          },
        },
      },
    });

    // Parse JSON fields safely
    const formattedPackages = packages.map((pkg) => ({
      ...pkg,
      galleryImages: JSON.parse(pkg.galleryImages || "[]"),
      mapCoordinates: JSON.parse(pkg.mapCoordinates || "[]"),
      inclusions: JSON.parse(pkg.inclusions || "[]"),
      exclusions: JSON.parse(pkg.exclusions || "[]"),
    }));

    return NextResponse.json({
      success: true,
      count: formattedPackages.length,
      packages: formattedPackages,
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}
