import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateBookingReference } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const balanceFilter = searchParams.get("balance") || "ALL";
    const sortBy = searchParams.get("sort") || "newest";

    // Build filter query
    const where: any = {};

    if (status !== "ALL") {
      where.bookingStatus = status;
    }

    if (balanceFilter === "HAS_BALANCE") {
      where.balanceAmount = { gt: 0 };
    } else if (balanceFilter === "FULLY_PAID") {
      where.balanceAmount = 0;
      where.bookingStatus = { in: ["CONFIRMED", "COMPLETED"] };
    } else if (balanceFilter === "REFUNDED") {
      where.bookingStatus = "CANCELLED";
    }

    if (search) {
      where.OR = [
        { bookingReference: { contains: search } },
        { customer: { name: { contains: search } } },
        { customer: { phone: { contains: search } } },
        { customer: { email: { contains: search } } },
        { package: { title: { contains: search } } },
        { customPackageTitle: { contains: search } },
        { customDestination: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "oldest") {
      orderBy = { createdAt: "asc" };
    } else if (sortBy === "amount_desc") {
      orderBy = { totalAmount: "desc" };
    } else if (sortBy === "amount_asc") {
      orderBy = { totalAmount: "asc" };
    } else if (sortBy === "balance_desc") {
      orderBy = { balanceAmount: "desc" };
    } else if (sortBy === "departure_soon") {
      orderBy = { travelStartDate: "asc" };
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            whatsappNumber: true,
            city: true,
          },
        },
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
            destination: true,
            basePrice: true,
            discountedPrice: true,
          },
        },
        paymentTransactions: {
          orderBy: { createdAt: "desc" },
        },
        customerDocuments: {
          orderBy: { createdAt: "desc" },
        },
        inquiry: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    // Compute Overall KPIs
    const allBookings = await prisma.booking.findMany({
      select: {
        totalAmount: true,
        amountPaid: true,
        balanceAmount: true,
        bookingStatus: true,
      },
    });

    const totalBookings = allBookings.length;
    const confirmedCount = allBookings.filter(
      (b) => b.bookingStatus === "CONFIRMED" || b.bookingStatus === "COMPLETED"
    ).length;
    const totalBookingValue = allBookings.reduce(
      (sum, b) => sum + (b.totalAmount || 0),
      0
    );
    const totalRevenueCollected = allBookings.reduce(
      (sum, b) => sum + (b.amountPaid || 0),
      0
    );
    const totalOutstandingBalance = allBookings.reduce(
      (sum, b) => sum + (b.balanceAmount || 0),
      0
    );

    return NextResponse.json({
      success: true,
      kpis: {
        totalBookings,
        confirmedCount,
        totalBookingValue,
        totalRevenueCollected,
        totalOutstandingBalance,
      },
      bookings,
    });
  } catch (error: any) {
    console.error("Admin fetch bookings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings list" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerId,
      // Or new customer fields
      newCustomerName,
      newCustomerEmail,
      newCustomerPhone,
      newCustomerWhatsapp,
      newCustomerCity,

      packageId,
      inquiryId,
      travelStartDate,
      travelEndDate,
      paxCount = 2,
      adultsCount = 2,
      childrenCount = 0,
      specialRequests,
      totalAmount,
      initialAmountPaid = 0,
      paymentMethod = "BANK_TRANSFER",
      paymentNotes,
      bookingStatus = "PARTIALLY_PAID",
    } = body;

    if (!packageId || !travelStartDate || !totalAmount) {
      return NextResponse.json(
        {
          success: false,
          error: "Package, Travel Start Date, and Total Amount are required",
        },
        { status: 400 }
      );
    }

    // 1. Resolve Customer
    let finalCustomerId = customerId;
    if (!finalCustomerId) {
      if (!newCustomerName || !newCustomerPhone || !newCustomerEmail) {
        return NextResponse.json(
          {
            success: false,
            error: "Select an existing customer or provide name, email, and phone",
          },
          { status: 400 }
        );
      }

      // Check if existing
      let cust = await prisma.customer.findFirst({
        where: {
          OR: [{ email: newCustomerEmail }, { phone: newCustomerPhone }],
        },
      });

      if (!cust) {
        cust = await prisma.customer.create({
          data: {
            name: newCustomerName,
            email: newCustomerEmail,
            phone: newCustomerPhone,
            whatsappNumber: newCustomerWhatsapp || newCustomerPhone,
            city: newCustomerCity || null,
          },
        });
      }
      finalCustomerId = cust.id;
    }

    // 2. Fetch package
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: "Selected package not found" },
        { status: 404 }
      );
    }

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

    const finalTotal = Number(totalAmount);
    const finalPaid = Number(initialAmountPaid) || 0;
    const finalBalance = Math.max(0, finalTotal - finalPaid);
    const finalStatus =
      bookingStatus || (finalBalance === 0 ? "CONFIRMED" : "PARTIALLY_PAID");

    // 3. Create Booking
    const booking = await prisma.booking.create({
      data: {
        bookingReference,
        customerId: finalCustomerId,
        packageId: pkg.id,
        inquiryId: inquiryId || null,
        travelStartDate: startDate,
        travelEndDate: endDate,
        paxCount: Number(paxCount) || 2,
        adultsCount: Number(adultsCount) || 2,
        childrenCount: Number(childrenCount) || 0,
        specialRequests: specialRequests || null,
        totalAmount: finalTotal,
        amountPaid: finalPaid,
        balanceAmount: finalBalance,
        bookingStatus: finalStatus,
        paymentTransactions:
          finalPaid > 0
            ? {
                create: [
                  {
                    amount: finalPaid,
                    paymentMethod,
                    status: "SUCCESS",
                    notes:
                      paymentNotes ||
                      "Initial reservation payment recorded during booking creation",
                  },
                ],
              }
            : undefined,
        customerDocuments: {
          create: [
            {
              customerId: finalCustomerId,
              title: `Booking Confirmation Voucher #${bookingReference}`,
              type: "CONFIRMATION",
              fileUrl: `https://tripmaster.in/vouchers/${bookingReference}.pdf`,
              fileSize: "850 KB",
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

    // 4. If linked to an inquiry, mark the inquiry as CONVERTED
    if (inquiryId) {
      await prisma.inquiry.update({
        where: { id: inquiryId },
        data: {
          status: "CONVERTED",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error: any) {
    console.error("Admin create booking error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}

