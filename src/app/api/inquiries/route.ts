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
      destination,
      packageId,
      travelDate,
      paxCount,
      notes,
    } = body;

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { success: false, error: "Name and at least Email or Phone are required" },
        { status: 400 }
      );
    }

    // 1. Find or create Customer
    let customer = await prisma.customer.findFirst({
      where: {
        OR: [
          email ? { email: { equals: email } } : {},
          phone ? { phone: { equals: phone } } : {},
        ].filter(Boolean),
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name,
          email: email || `${phone.replace(/\D/g, "")}@guest.tripmaster.in`,
          phone: phone || "",
          whatsappNumber: whatsappNumber || phone || "",
          city: city || "",
          notes: notes ? `Guest Notes: ${notes}` : undefined,
        },
      });
    } else {
      // Update phone or whatsapp if provided
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

    // 2. Create Inquiry
    const parsedTravelDate = travelDate ? new Date(travelDate) : null;
    const initialNotes = [
      `Inquiry received via website on ${new Date().toLocaleDateString("en-IN")}.`,
      notes ? `Customer Note: ${notes}` : "",
    ].filter(Boolean);

    const inquiry = await prisma.inquiry.create({
      data: {
        customerId: customer.id,
        packageId: packageId || null,
        destination: destination || "Bespoke Exploration",
        travelDate: parsedTravelDate,
        paxCount: paxCount ? parseInt(paxCount, 10) : 2,
        status: "NEW",
        internalNotes: JSON.stringify(initialNotes),
      },
      include: {
        package: {
          select: {
            title: true,
            slug: true,
          },
        },
        customer: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been submitted to the Trip Master Concierge.",
      inquiryId: inquiry.id,
      customerName: customer.name,
      packageTitle: inquiry.package?.title || inquiry.destination,
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit inquiry. Please try again." },
      { status: 500 }
    );
  }
}

