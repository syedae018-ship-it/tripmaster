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
    const { amount, paymentMethod = "BANK_TRANSFER", notes, date } = body;

    const paymentAmount = Number(amount);
    if (!paymentAmount || paymentAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid payment amount is required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { customer: true, paymentTransactions: true },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking record not found" },
        { status: 404 }
      );
    }

    // 1. Create Transaction
    const tx = await prisma.paymentTransaction.create({
      data: {
        bookingId: id,
        amount: paymentAmount,
        paymentMethod,
        status: "SUCCESS",
        notes: notes || `Manual payment recorded (${paymentMethod})`,
        createdAt: date ? new Date(date) : new Date(),
      },
    });

    // 2. Fetch all transactions to accurately calculate paid amount
    const allTxs = await prisma.paymentTransaction.findMany({
      where: { bookingId: id },
    });

    const totalPaid = allTxs.reduce((sum, t) => {
      if (t.status === "SUCCESS") return sum + t.amount;
      if (t.status === "REFUNDED" && t.refundAmount) return sum + (t.amount - t.refundAmount);
      return sum;
    }, 0);

    const balanceAmount = Math.max(0, booking.totalAmount - totalPaid);
    let newStatus = booking.bookingStatus;

    if (balanceAmount === 0 && (newStatus === "PARTIALLY_PAID" || newStatus === "PENDING")) {
      newStatus = "CONFIRMED";
    } else if (totalPaid > 0 && newStatus === "PENDING") {
      newStatus = "PARTIALLY_PAID";
    }

    // 3. Update Booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        amountPaid: totalPaid,
        balanceAmount,
        bookingStatus: newStatus,
      },
      include: {
        customer: true,
        package: true,
        paymentTransactions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // 4. Also create a receipt document in the customer's vault
    await prisma.customerDocument.create({
      data: {
        customerId: booking.customerId,
        bookingId: id,
        title: `Payment Receipt (₹${paymentAmount.toLocaleString("en-IN")}) - ${paymentMethod}`,
        type: "RECEIPT",
        fileUrl: `https://tripmaster.in/receipts/TM-MAN-${Date.now().toString(36)}.pdf`,
        fileSize: "360 KB",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment successfully recorded in ledger",
      transaction: tx,
      booking: updatedBooking,
    });
  } catch (error: any) {
    console.error("Record payment error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to record payment" },
      { status: 500 }
    );
  }
}

