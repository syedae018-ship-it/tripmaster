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

    // Handle existing booking balance payment
    if (bookingData.existingBookingReference) {
      const existing = await prisma.booking.findUnique({
        where: { bookingReference: bookingData.existingBookingReference },
        include: { customer: true },
      });

      if (existing) {
        const finalAmountPaid = Number(bookingData.amountPaid) || existing.balanceAmount;
        const newPaid = existing.amountPaid + finalAmountPaid;
        const newBal = Math.max(0, existing.totalAmount - newPaid);
        const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const updated = await prisma.booking.update({
          where: { bookingReference: existing.bookingReference },
          data: {
            amountPaid: newPaid,
            balanceAmount: newBal,
            bookingStatus: newBal === 0 ? "CONFIRMED" : "PARTIALLY_PAID",
            isVerified: true,
            taxInvoiceNumber: invoiceNumber,
            paymentMethod: "RAZORPAY_ONLINE",
          },
        });

        await prisma.paymentTransaction.create({
          data: {
            bookingId: existing.id,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            amount: finalAmountPaid,
            paymentMethod: "RAZORPAY_ONLINE",
            status: "SUCCESS",
            notes: "Balance payment verified via Razorpay Checkout",
          },
        });

        await prisma.customerDocument.create({
          data: {
            customerId: existing.customerId,
            bookingId: existing.id,
            title: `Official Tax Invoice & Receipt (${invoiceNumber})`,
            type: "RECEIPT",
            fileUrl: `/pay/${existing.bookingReference}?invoice=true`,
            fileSize: "Tax Invoice PDF",
          },
        });

        return NextResponse.json({
          success: true,
          booking: updated,
          invoiceNumber,
        });
      }
    }

    // Handle quotation-based payment (Direct payment link from Quotation Builder)
    if (bookingData.quotationId || bookingData.quotationSlug) {
      const quotation = await prisma.quotation.findFirst({
        where: {
          OR: [
            bookingData.quotationId ? { id: bookingData.quotationId } : undefined,
            bookingData.quotationSlug ? { shareSlug: bookingData.quotationSlug } : undefined,
            bookingData.quotationNumber ? { quotationNumber: bookingData.quotationNumber } : undefined,
          ].filter(Boolean) as any,
        },
        include: { customer: true, package: true },
      });

      if (!quotation) {
        return NextResponse.json(
          { success: false, error: "Referenced client quotation not found" },
          { status: 404 }
        );
      }

      const clientName = bookingData.name || quotation.customer?.name || "Client";
      const clientEmail = bookingData.email || quotation.customer?.email || "";
      const clientPhone = bookingData.phone || quotation.customer?.phone || "";
      const clientWhatsapp = bookingData.whatsappNumber || clientPhone;
      const clientCity = bookingData.city || quotation.customer?.city || null;

      // 1. Resolve or create Customer
      let customer = quotation.customer;
      if (!customer) {
        customer = await prisma.customer.findFirst({
          where: {
            OR: [
              clientEmail ? { email: clientEmail } : undefined,
              clientPhone ? { phone: clientPhone } : undefined,
            ].filter(Boolean) as any,
          },
        });
      }

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: clientName,
            email: clientEmail,
            phone: clientPhone,
            whatsappNumber: clientWhatsapp,
            city: clientCity,
          },
        });
      } else {
        await prisma.customer.update({
          where: { id: customer.id },
          data: {
            name: customer.name || clientName,
            phone: customer.phone || clientPhone,
            whatsappNumber: customer.whatsappNumber || clientWhatsapp,
            city: customer.city || clientCity,
          },
        });
      }

      // 2. Financial calculation
      const totalAmount = Number(bookingData.totalAmount) || quotation.totalAmount || (quotation.pricePerPerson * quotation.paxCount);
      const finalAmountPaid = Number(bookingData.amountPaid) || quotation.paymentAmountDue || totalAmount;
      const finalBalanceAmount = Math.max(0, totalAmount - finalAmountPaid);
      const bookingStatus = finalBalanceAmount === 0 ? "CONFIRMED" : "PARTIALLY_PAID";
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 3. Destination Prefix for Reference
      let destPrefix = "TM-QT";
      if (quotation.destination?.toLowerCase().includes("singapore")) destPrefix = "TM-SIN";
      else if (quotation.destination?.toLowerCase().includes("bali")) destPrefix = "TM-BAL";
      else if (quotation.destination?.toLowerCase().includes("dubai")) destPrefix = "TM-DXB";

      const bookingReference = generateBookingReference(destPrefix);

      const rawQuotationStartDate =
        quotation.travelDate ||
        bookingData.travelStartDate ||
        bookingData.startDate;
      const travelStartDate = rawQuotationStartDate
        ? new Date(rawQuotationStartDate)
        : new Date();
      const rawQuotationEndDate =
        bookingData.travelEndDate || bookingData.endDate;
      let travelEndDate = rawQuotationEndDate
        ? new Date(rawQuotationEndDate)
        : new Date(travelStartDate);
      if (!rawQuotationEndDate) {
        travelEndDate = new Date(travelStartDate);
        travelEndDate.setDate(
          travelEndDate.getDate() + (quotation.durationDays || 4) - 1
        );
      }

      // 4. Create or update confirmed booking linked to this quotation
      const existingBooking = await prisma.booking.findFirst({
        where: { quotationId: quotation.id },
        include: { paymentTransactions: true },
      });

      let booking: any;
      if (existingBooking) {
        const cumulativePaid = existingBooking.amountPaid + finalAmountPaid;
        const cumulativeBalance = Math.max(0, existingBooking.totalAmount - cumulativePaid);
        const updatedStatus = cumulativeBalance === 0 ? "CONFIRMED" : "PARTIALLY_PAID";

        booking = await prisma.booking.update({
          where: { id: existingBooking.id },
          data: {
            amountPaid: cumulativePaid,
            balanceAmount: cumulativeBalance,
            bookingStatus: updatedStatus,
            paymentTransactions: {
              create: [
                {
                  razorpayOrderId: razorpay_order_id,
                  razorpayPaymentId: razorpay_payment_id,
                  razorpaySignature: razorpay_signature,
                  amount: finalAmountPaid,
                  paymentMethod: "RAZORPAY_ONLINE",
                  status: "SUCCESS",
                  notes: `Quotation installment payment verified via Razorpay for ${quotation.quotationNumber}`,
                },
              ],
            },
          },
          include: {
            customer: true,
            paymentTransactions: true,
          },
        });
      } else {
        booking = await prisma.booking.create({
          data: {
            bookingReference,
            customerId: customer.id,
            packageId: quotation.packageId || null,
            quotationId: quotation.id,
            customPackageTitle: quotation.title,
            customDestination: quotation.destination,
            travelStartDate,
            travelEndDate,
            paxCount: quotation.paxCount || 2,
            adultsCount: quotation.adultsCount || 2,
            childrenCount: quotation.childrenCount || 0,
            specialRequests:
              bookingData.specialRequests ||
              `Quotation Plan Ref: ${quotation.quotationNumber}`,
            totalAmount,
            amountPaid: finalAmountPaid,
            balanceAmount: finalBalanceAmount,
            bookingStatus,
            paymentMethod: "RAZORPAY_ONLINE",
            isVerified: true,
            taxInvoiceNumber: invoiceNumber,
            taxInvoiceUrl: `/pay/${bookingReference}?invoice=true`,
            paymentTransactions: {
              create: [
                {
                  razorpayOrderId: razorpay_order_id,
                  razorpayPaymentId: razorpay_payment_id,
                  razorpaySignature: razorpay_signature,
                  amount: finalAmountPaid,
                  paymentMethod: "RAZORPAY_ONLINE",
                  status: "SUCCESS",
                  notes: `Quotation Payment verified via Razorpay for ${quotation.quotationNumber}`,
                },
              ],
            },
            customerDocuments: {
              create: [
                {
                  customerId: customer.id,
                  title: `Tax Invoice & Receipt #${invoiceNumber}`,
                  type: "RECEIPT",
                  fileUrl: `/pay/${bookingReference}?invoice=true`,
                  fileSize: "Tax Invoice PDF",
                },
                {
                  customerId: customer.id,
                  title: `Client Quotation Dossier - ${quotation.title}`,
                  type: "QUOTATION",
                  fileUrl: `/quote/${quotation.shareSlug}`,
                  fileSize: "Mobile Itinerary PDF",
                },
              ],
            },
          },
          include: {
            customer: true,
            paymentTransactions: true,
          },
        });
      }

      // 5. Update Quotation Status
      await prisma.quotation.update({
        where: { id: quotation.id },
        data: {
          status: "CONVERTED",
          paymentStatus: finalBalanceAmount === 0 ? "PAID" : "PARTIALLY_PAID",
          paymentAmountDue: finalBalanceAmount,
          customerId: customer.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Quotation payment verified successfully",
        bookingReference: booking.bookingReference,
        bookingId: booking.id,
        invoiceNumber,
        booking,
        quotation,
      });
    }

    const {
      packageId,
      name,
      email,
      phone,
      whatsappNumber,
      city,
      startDate: inputStartDate,
      endDate: inputEndDate,
      travelStartDate: inputTravelStartDate,
      travelEndDate: inputTravelEndDate,
      paxCount,
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
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const rawStartDate = inputTravelStartDate || inputStartDate;
    const rawEndDate = inputTravelEndDate || inputEndDate;

    const travelStartDate = rawStartDate ? new Date(rawStartDate) : new Date();
    let travelEndDate = rawEndDate ? new Date(rawEndDate) : new Date(travelStartDate);
    if (!rawEndDate && pkg.durationDays) {
      travelEndDate = new Date(travelStartDate);
      travelEndDate.setDate(travelEndDate.getDate() + (pkg.durationDays - 1));
    }

    // 5. Create Booking & Transaction atomically
    const booking = await prisma.booking.create({
      data: {
        bookingReference,
        customerId: customer.id,
        packageId: pkg.id,
        travelStartDate,
        travelEndDate,
        paxCount: Number(paxCount) || 2,
        adultsCount: Number(adultsCount) || 2,
        childrenCount: Number(childrenCount) || 0,
        specialRequests: specialRequests || null,
        totalAmount: finalTotalAmount,
        amountPaid: finalAmountPaid,
        balanceAmount: finalBalanceAmount,
        bookingStatus,
        paymentMethod: paymentMethod || "RAZORPAY_ONLINE",
        isVerified: true,
        taxInvoiceNumber: invoiceNumber,
        taxInvoiceUrl: `/booking-success/${bookingReference}?invoice=true`,
        paymentTransactions: {
          create: [
            {
              razorpayOrderId: razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              razorpaySignature: razorpay_signature,
              amount: finalAmountPaid,
              paymentMethod: paymentMethod || "RAZORPAY_ONLINE",
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
              fileUrl: `/booking-success/${bookingReference}?invoice=true`,
              fileSize: "410 KB",
            },
            {
              customerId: customer.id,
              title: `Provisional Booking Voucher - ${pkg.title.slice(0, 30)}...`,
              type: "CONFIRMATION",
              fileUrl: `/booking-success/${bookingReference}`,
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
      invoiceNumber,
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

