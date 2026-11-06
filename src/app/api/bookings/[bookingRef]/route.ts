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

    const inclusions = booking.package?.inclusions
      ? (JSON.parse(booking.package.inclusions) as string[])
      : [];

    return NextResponse.json({
      success: true,
      booking: {
        ...booking,
        package: {
          ...booking.package,
          inclusions,
        },
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

