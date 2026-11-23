import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      whatsappNumber,
      city,
      packageId,
      travelStartDate: inputTravelStartDate,
      travelEndDate: inputTravelEndDate,
      startDate: inputStartDate,
      endDate: inputEndDate,
      paxCount,
      adultsCount,
      childrenCount,
      notes,
      specialRequests,
    } = body;

    const travelStartDate = inputTravelStartDate || inputStartDate;
    const travelEndDate = inputTravelEndDate || inputEndDate;

    if (!name || (!email && !phone) || !packageId || !travelStartDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, contact details (email or phone), package, and travel dates are required",
        },
        { status: 400 }
      );
    }

    // Verify package
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: "Package not found" },
        { status: 404 }
      );
    }

    const numAdults = adultsCount
      ? parseInt(String(adultsCount), 10)
      : paxCount
      ? parseInt(String(paxCount), 10)
      : 2;
    const numChildren = childrenCount ? parseInt(String(childrenCount), 10) : 0;
    const pax = paxCount ? parseInt(String(paxCount), 10) : numAdults + numChildren;
    const pricePerPerson = pkg.discountedPrice || pkg.basePrice;
    const totalAmount = pricePerPerson * pax;

    // 1. Find or create Customer
    let customer = await prisma.customer.findFirst({
      where: {
        OR: [
          email ? { email: { equals: email } } : undefined,
          phone ? { phone: { equals: phone } } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name,
          email: email || `${(phone || "").replace(/\D/g, "")}@guest.tripmaster.in`,
          phone: phone || "",
          whatsappNumber: whatsappNumber || phone || "",
          city: city || "",
          notes: notes ? `Booking request notes: ${notes}` : undefined,
        },
      });
    } else {
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: name || customer.name,
          phone: phone || customer.phone,
          whatsappNumber: whatsappNumber || customer.whatsappNumber,
          city: city || customer.city,
        },
      });
    }

    // 2. Generate Reference
    const datePrefix = new Date().toISOString().slice(2, 7).replace("-", "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingReference = `TM-${datePrefix}-${randomSuffix}`;

    const startDate = new Date(travelStartDate);
    const endDate = travelEndDate
      ? new Date(travelEndDate)
      : new Date(startDate.getTime() + (pkg.durationDays || 4) * 24 * 60 * 60 * 1000);

    const booking = await prisma.booking.create({
      data: {
        bookingReference,
        customerId: customer.id,
        packageId: pkg.id,
        travelStartDate: startDate,
        travelEndDate: endDate,
        paxCount: pax,
        adultsCount: numAdults,
        childrenCount: numChildren,
        specialRequests: specialRequests || notes || null,
        totalAmount,
        amountPaid: 0,
        balanceAmount: totalAmount,
        bookingStatus: "PENDING",
      },
      include: {
        package: {
          select: {
            title: true,
            destination: true,
            durationDays: true,
            durationNights: true,
            featuredImage: true,
          },
        },
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Booking reservation created successfully.",
      bookingReference: booking.bookingReference,
      bookingId: booking.id,
      totalAmount: booking.totalAmount,
      currency: "INR",
      customerName: customer.name,
      packageTitle: pkg.title,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

