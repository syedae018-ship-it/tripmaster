import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ bookingRef: string }> }
) {
  try {
    const { bookingRef } = await context.params;

    const booking = await prisma.booking.findUnique({
      where: { bookingReference: bookingRef },
      include: {
        customer: true,
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
            destination: true,
            durationDays: true,
            durationNights: true,
            featuredImage: true,
            inclusions: true,
          },
        },
        paymentTransactions: {
          orderBy: { createdAt: "desc" },
        },
        customerDocuments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking reference not found" },
        { status: 404 }
      );
    }

    let inclusions: string[] = [];
    if (booking.package?.inclusions) {
      if (typeof booking.package.inclusions === "string") {
        try {
          inclusions = JSON.parse(booking.package.inclusions);
        } catch {
          inclusions = [booking.package.inclusions];
        }
      } else if (Array.isArray(booking.package.inclusions)) {
        inclusions = booking.package.inclusions;
      }
    }

    const packageData = booking.package
      ? {
          ...booking.package,
          featuredImage:
            booking.package.featuredImage ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
          title: booking.package.title || booking.customPackageTitle || "Bespoke Journey",
          destination:
            booking.package.destination ||
            booking.customDestination ||
            "Exclusive Destination",
          inclusions,
        }
      : {
          id: "custom",
          title: booking.customPackageTitle || "Bespoke Luxury Experience",
          slug: "custom",
          destination: booking.customDestination || "Bespoke Destination",
          durationDays: Math.max(
            1,
            Math.round(
              (new Date(booking.travelEndDate).getTime() -
                new Date(booking.travelStartDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          ),
          durationNights: Math.max(
            0,
            Math.round(
              (new Date(booking.travelEndDate).getTime() -
                new Date(booking.travelStartDate).getTime()) /
                (1000 * 60 * 60 * 24)
            ) - 1
          ),
          featuredImage:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
          inclusions: ["Luxury Concierge", "VIP Assistance"],
        };

    return NextResponse.json({
      success: true,
      booking: {
        ...booking,
        package: packageData,
      },
    });
  } catch (error: any) {
    console.error("Fetch booking by ref error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve booking" },
      { status: 500 }
    );
  }
}

