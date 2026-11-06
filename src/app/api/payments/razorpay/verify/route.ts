import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyRazorpayPaymentSignature,
  generateBookingReference,
} from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required payment authorization credentials" },
        { status: 400 }
      );
    }

    if (!bookingData) {
      return NextResponse.json(
        { success: false, error: "Booking metadata is missing" },
        { status: 400 }
      );
    }

    // 1. Verify Payment Signature
    const verification = verifyRazorpayPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!verification.isValid) {
      return NextResponse.json(
        { success: false, error: verification.error || "Payment verification failed" },
        { status: 400 }
      );
    }

    const {
      packageId,
      name,
      email,
      phone,
      whatsappNumber,
      city,
      travelStartDate,
      travelEndDate,
      paxCount = 2,
      adultsCount = 2,
      childrenCount = 0,
      specialRequests,
      totalAmount,
      amountPaid,
      paymentMethod = "RAZORPAY_ONLINE",
    } = bookingData;

    // 2. Fetch package to confirm existence and get destination prefix
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: "Target luxury package not found" },
        { status: 404 }
      );
    }

    // 3. Find or Create Customer
    let customer = await prisma.customer.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name,
          email,
          phone,
          whatsappNumber: whatsappNumber || phone,
          city: city || null,
        },
      });
    } else {
      // Update missing details if needed
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: customer.name || name,
          city: customer.city || city || null,
          whatsappNumber: customer.whatsappNumber || whatsappNumber || phone,
        },
      });
    }

    // 4. Calculate Financial Balance and Booking Status
    const finalTotalAmount = Number(totalAmount) || pkg.discountedPrice || pkg.basePrice;
    const finalAmountPaid = Number(amountPaid) || 0;
    const finalBalanceAmount = Math.max(0, finalTotalAmount - finalAmountPaid);
    const bookingStatus = finalBalanceAmount === 0 ? "CONFIRMED" : "PARTIALLY_PAID";

    // Destination prefix for reference
    let destPrefix = "TM";
    if (pkg.destination.toLowerCase().includes("kashmir")) destPrefix = "TM-KAS";
    else if (pkg.destination.toLowerCase().includes("kerala")) destPrefix = "TM-KER";
    else if (pkg.destination.toLowerCase().includes("andaman")) destPrefix = "TM-AND";
    else if (pkg.destination.toLowerCase().includes("rajasthan")) destPrefix = "TM-RAJ";

    const bookingReference = generateBookingReference(destPrefix);

    const startDate = new Date(travelStartDate);
    let endDate = travelEndDate ? new Date(travelEndDate) : new Date(startDate);
    if (!travelEndDate && pkg.durationDays) {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (pkg.durationDays - 1));
    }

    // 5. Create Booking & Transaction atomically
    const booking = await prisma.booking.create({
      data: {
        bookingReference,
        customerId: customer.id,
        packageId: pkg.id,
        travelStartDate: startDate,
        travelEndDate: endDate,
        paxCount: Number(paxCount) || 2,
        adultsCount: Number(adultsCount) || 2,
        childrenCount: Number(childrenCount) || 0,
        specialRequests: specialRequests || null,
        totalAmount: finalTotalAmount,
        amountPaid: finalAmountPaid,
        balanceAmount: finalBalanceAmount,
        bookingStatus,
        paymentTransactions: {
          create: [
            {
              razorpayOrderId: razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              razorpaySignature: razorpay_signature,
              amount: finalAmountPaid,
              paymentMethod,
              status: "SUCCESS",
              notes: verification.isSimulated
                ? "Simulated online checkout payment verified"
                : "Live Razorpay online payment verified",
            },
          ],
        },
        customerDocuments: {
          create: [
            {
              customerId: customer.id,
              title: `Instant Payment Receipt #${razorpay_payment_id.slice(-6).toUpperCase()}`,
              type: "RECEIPT",
              fileUrl: `https://tripmaster.in/receipts/${bookingReference}.pdf`,
              fileSize: "410 KB",
            },
            {
              customerId: customer.id,
              title: `Provisional Booking Voucher - ${pkg.title.slice(0, 30)}...`,
              type: "CONFIRMATION",
              fileUrl: `https://tripmaster.in/vouchers/${bookingReference}.pdf`,
              fileSize: "920 KB",
            },
          ],
        },
      },
      include: {
        customer: true,
        package: true,
        paymentTransactions: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and booking created",
      bookingReference: booking.bookingReference,
      bookingId: booking.id,
      booking,
    });
  } catch (error: any) {
    console.error("Razorpay verification handler error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process and verify payment" },
      { status: 500 }
    );
  }
}

