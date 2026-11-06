import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const {
      transactionId,
      refundAmount,
      refundReason,
      refundStatus = "FULL_REFUND",
    } = body;

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: "Transaction ID is required for refund" },
        { status: 400 }
      );
    }

    const tx = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!tx || tx.bookingId !== id) {
      return NextResponse.json(
        { success: false, error: "Payment transaction not found for this booking" },
        { status: 404 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    const amountToRefund = Number(refundAmount) || tx.amount;
    const isFullRefund = amountToRefund >= tx.amount;

    // 1. Update the Transaction
    const updatedTx = await prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        status: isFullRefund ? "REFUNDED" : "SUCCESS",
        refundStatus: isFullRefund ? "FULL_REFUND" : "PARTIAL_REFUND",
        refundAmount: amountToRefund,
        notes: tx.notes
          ? `${tx.notes} | Refund: ₹${amountToRefund.toLocaleString("en-IN")} (${refundReason || "Processed"})`
          : `Refund of ₹${amountToRefund.toLocaleString("en-IN")}: ${refundReason || "Processed"}`,
      },
    });

    // 2. Recalculate Booking Paid & Balance
    const allTxs = await prisma.paymentTransaction.findMany({
      where: { bookingId: id },
    });

    const totalPaid = allTxs.reduce((sum, t) => {
      if (t.status === "SUCCESS") return sum + (t.amount - (t.refundAmount || 0));
      if (t.status === "REFUNDED") return sum + (t.amount - (t.refundAmount || t.amount));
      return sum;
    }, 0);

    const balanceAmount = Math.max(0, booking.totalAmount - Math.max(0, totalPaid));
    let newBookingStatus = booking.bookingStatus;
    if (totalPaid <= 0 && booking.bookingStatus === "CANCELLED") {
      newBookingStatus = "CANCELLED";
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        amountPaid: Math.max(0, totalPaid),
        balanceAmount,
        bookingStatus: newBookingStatus,
      },
      include: {
        customer: true,
        package: true,
        paymentTransactions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Refund processed and logged in financial ledger",
      transaction: updatedTx,
      booking: updatedBooking,
    });
  } catch (error: any) {
    console.error("Process refund error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process refund" },
      { status: 500 }
    );
  }
}

