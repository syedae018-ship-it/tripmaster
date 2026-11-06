import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        package: {
          include: {
            itinerary: {
              orderBy: { dayNumber: "asc" },
            },
          },
        },
        paymentTransactions: {
          orderBy: { createdAt: "desc" },
        },
        customerDocuments: {
          orderBy: { createdAt: "desc" },
        },
        inquiry: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error: any) {
    console.error("Fetch single booking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch booking details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const {
      bookingStatus,
      totalAmount,
      travelStartDate,
      travelEndDate,
      paxCount,
      adultsCount,
      childrenCount,
      specialRequests,
    } = body;

    const currentBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!currentBooking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    const dataToUpdate: any = {};

    if (bookingStatus) {
      dataToUpdate.bookingStatus = bookingStatus;
    }

    if (totalAmount !== undefined && Number(totalAmount) >= 0) {
      const newTotal = Number(totalAmount);
      dataToUpdate.totalAmount = newTotal;
      dataToUpdate.balanceAmount = Math.max(0, newTotal - currentBooking.amountPaid);
    }

    if (travelStartDate) {
      dataToUpdate.travelStartDate = new Date(travelStartDate);
    }

    if (travelEndDate) {
      dataToUpdate.travelEndDate = new Date(travelEndDate);
    }

    if (paxCount !== undefined) dataToUpdate.paxCount = Number(paxCount);
    if (adultsCount !== undefined) dataToUpdate.adultsCount = Number(adultsCount);
    if (childrenCount !== undefined) dataToUpdate.childrenCount = Number(childrenCount);
    if (specialRequests !== undefined) dataToUpdate.specialRequests = specialRequests;

    const updated = await prisma.booking.update({
      where: { id },
      data: dataToUpdate,
      include: {
        customer: true,
        package: true,
        paymentTransactions: true,
        customerDocuments: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
      booking: updated,
    });
  } catch (error: any) {
    console.error("Update booking error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update booking" },
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

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete booking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}

