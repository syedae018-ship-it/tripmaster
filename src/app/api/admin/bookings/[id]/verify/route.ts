import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { amountVerified, notes } = body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { customer: true, package: true },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    const verifiedAmount =
      amountVerified !== undefined ? Number(amountVerified) : booking.balanceAmount;
    const newPaid = booking.amountPaid + verifiedAmount;
    const newBalance = Math.max(0, booking.totalAmount - newPaid);
    const isFullyPaid = newBalance === 0;

    // Generate Invoice Number if fully paid
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        amountPaid: newPaid,
        balanceAmount: newBalance,
        bookingStatus: isFullyPaid ? "CONFIRMED" : "PARTIALLY_PAID",
        isVerified: true,
        taxInvoiceNumber: invoiceNumber,
      },
    });

    // Update or create payment transaction
    await prisma.paymentTransaction.create({
      data: {
        bookingId: booking.id,
        amount: verifiedAmount,
        paymentMethod: booking.paymentMethod || "BANK_TRANSFER",
        status: "SUCCESS",
        notes: notes || `Admin verified manual payment of ₹${verifiedAmount.toLocaleString("en-IN")}`,
      },
    });

    // Add Invoice to Customer Documents
    await prisma.customerDocument.create({
      data: {
        customerId: booking.customerId,
        bookingId: booking.id,
        title: `Official Tax Invoice & Receipt (${invoiceNumber})`,
        type: "RECEIPT",
        fileUrl: `/pay/${booking.bookingReference}?invoice=true`,
        fileSize: "Tax Invoice PDF",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      booking: updated,
      invoiceNumber,
    });
  } catch (error: any) {
    console.error("Admin verify payment error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}

