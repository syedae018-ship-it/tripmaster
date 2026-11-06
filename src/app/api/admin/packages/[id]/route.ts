import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const pkg = await prisma.package.findUnique({
      where: { id },
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

    const formatted = {
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
      package: formatted,
    });
  } catch (error) {
    console.error("Admin fetch package by id error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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

    // Check existing
    const existing = await prisma.package.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Package not found" },
        { status: 404 }
      );
    }

    // Update package info
    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        title: title || existing.title,
        slug: slug || existing.slug,
        destination: destination || existing.destination,
        durationDays: durationDays
          ? parseInt(durationDays, 10)
          : existing.durationDays,
        durationNights: durationNights
          ? parseInt(durationNights, 10)
          : existing.durationNights,
        basePrice: basePrice ? parseFloat(basePrice) : existing.basePrice,
        discountedPrice:
          discountedPrice !== undefined
            ? discountedPrice
              ? parseFloat(discountedPrice)
              : null
            : existing.discountedPrice,
        featuredImage: featuredImage || existing.featuredImage,
        galleryImages: galleryImages
          ? JSON.stringify(galleryImages)
          : existing.galleryImages,
        overview: overview !== undefined ? overview : existing.overview,
        mapCoordinates: mapCoordinates
          ? JSON.stringify(mapCoordinates)
          : existing.mapCoordinates,
        inclusions: inclusions
          ? JSON.stringify(inclusions)
          : existing.inclusions,
        exclusions: exclusions
          ? JSON.stringify(exclusions)
          : existing.exclusions,
        paymentPolicy: paymentPolicy || existing.paymentPolicy,
        cancellationPolicy: cancellationPolicy || existing.cancellationPolicy,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : existing.isPublished,
      },
    });

    // If itinerary was sent, replace the days cleanly
    if (Array.isArray(itinerary)) {
      await prisma.itineraryDay.deleteMany({
        where: { packageId: id },
      });

      for (let i = 0; i < itinerary.length; i++) {
        const day = itinerary[i];
        await prisma.itineraryDay.create({
          data: {
            packageId: id,
            dayNumber: day.dayNumber || i + 1,
            title: day.title || `Day ${i + 1}`,
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
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Package updated successfully",
      package: updatedPackage,
    });
  } catch (error) {
    console.error("Admin update package error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update package" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete package error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete package" },
      { status: 500 }
    );
  }
}

