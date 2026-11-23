import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingReference, utrNumber, paymentProofUrl, amountSubmitted } = body;

    if (!bookingReference || !utrNumber) {
      return NextResponse.json(
        { success: false, error: "Booking reference and UTR/Transaction number are required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { bookingReference },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    const updated = await prisma.booking.update({
      where: { bookingReference },
      data: {
        utrNumber,
        paymentProofUrl: paymentProofUrl || null,
        paymentMethod: "UPI_QR",
        bookingStatus: "PENDING_VERIFICATION",
      },
    });

    // Record pending transaction
    await prisma.paymentTransaction.create({
      data: {
        bookingId: booking.id,
        amount: Number(amountSubmitted) || booking.balanceAmount,
        paymentMethod: "UPI_QR",
        status: "PENDING_VERIFICATION",
        notes: `Customer submitted manual UTR: ${utrNumber}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment reference submitted for verification.",
      booking: updated,
    });
  } catch (error: any) {
    console.error("Submit UTR error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to submit reference" },
      { status: 500 }
    );
  }
}

