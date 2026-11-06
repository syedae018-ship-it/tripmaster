import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Package slug is required" },
        { status: 400 }
      );
    }

    const pkg = await prisma.package.findUnique({
      where: { slug },
      include: {
        itinerary: {
          orderBy: {
            dayNumber: "asc",
          },
        },
      },
    });

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: "Package not found" },
        { status: 404 }
      );
    }

    // Increment views count asynchronously
    prisma.package
      .update({
        where: { id: pkg.id },
        data: { viewsCount: { increment: 1 } },
      })
      .catch((err) => console.error("Error updating views:", err));

    const formattedPackage = {
      ...pkg,
      galleryImages: JSON.parse(pkg.galleryImages || "[]"),
      mapCoordinates: JSON.parse(pkg.mapCoordinates || "[]"),
      inclusions: JSON.parse(pkg.inclusions || "[]"),
      exclusions: JSON.parse(pkg.exclusions || "[]"),
      itinerary: pkg.itinerary.map((day) => ({
        ...day,
        mealsIncluded: JSON.parse(day.mealsIncluded || "[]"),
        activityPhotos: JSON.parse(day.activityPhotos || "[]"),
      })),
    };

    return NextResponse.json({
      success: true,
      package: formattedPackage,
    });
  } catch (error) {
    console.error("Error fetching package by slug:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch package details" },
      { status: 500 }
    );
  }
}

