import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const original = await prisma.package.findUnique({
      where: { id },
      include: {
        itinerary: {
          orderBy: { dayNumber: "asc" },
        },
      },
    });

    if (!original) {
      return NextResponse.json(
        { success: false, error: "Package not found" },
        { status: 404 }
      );
    }

    const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
    const newTitle = `${original.title} (Copy)`;

    const duplicated = await prisma.package.create({
      data: {
        title: newTitle,
        slug: newSlug,
        destination: original.destination,
        durationDays: original.durationDays,
        durationNights: original.durationNights,
        basePrice: original.basePrice,
        discountedPrice: original.discountedPrice,
        featuredImage: original.featuredImage,
        galleryImages: original.galleryImages,
        overview: original.overview,
        mapCoordinates: original.mapCoordinates,
        inclusions: original.inclusions,
        exclusions: original.exclusions,
        paymentPolicy: original.paymentPolicy,
        cancellationPolicy: original.cancellationPolicy,
        isFeatured: false,
        isPublished: false, // Default duplicated to draft
        itinerary: {
          create: original.itinerary.map((day) => ({
            dayNumber: day.dayNumber,
            title: day.title,
            description: day.description,
            mealsIncluded: day.mealsIncluded,
            activityPhotos: day.activityPhotos,
            accommodationName: day.accommodationName,
            accommodationPhoto: day.accommodationPhoto,
            accommodationRating: day.accommodationRating,
            accommodationCategory: day.accommodationCategory,
            accommodationDetails: day.accommodationDetails,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Package duplicated successfully",
      package: duplicated,
    });
  } catch (error) {
    console.error("Admin duplicate package error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to duplicate package" },
      { status: 500 }
    );
  }
}

