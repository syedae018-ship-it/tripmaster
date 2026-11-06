import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const followUpFilter = searchParams.get("followUpFilter");

    const where: Record<string, unknown> = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    // Follow-up scheduling filter
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (followUpFilter === "today") {
      where.followUpDate = {
        gte: todayStart,
        lte: todayEnd,
      };
    } else if (followUpFilter === "overdue") {
      where.followUpDate = {
        lt: todayStart,
      };
      // Ignore if already converted or lost
      where.status = { notIn: ["CONVERTED", "LOST"] };
    } else if (followUpFilter === "upcoming") {
      where.followUpDate = {
        gt: todayEnd,
        lte: weekEnd,
      };
    }

    if (search) {
      where.OR = [
        { destination: { contains: search } },
        { customer: { name: { contains: search } } },
        { customer: { phone: { contains: search } } },
        { customer: { email: { contains: search } } },
      ];
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: [
        { followUpDate: "asc" },
        { createdAt: "desc" },
      ],
      include: {
        customer: true,
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
            destination: true,
            basePrice: true,
            discountedPrice: true,
            durationDays: true,
          },
        },
      },
    });

    const formatted = inquiries.map((inq) => ({
      ...inq,
      internalNotes: inq.internalNotes
        ? (JSON.parse(inq.internalNotes) as string[])
        : [],
    }));

    return NextResponse.json({
      success: true,
      inquiries: formatted,
    });
  } catch (error) {
    console.error("Admin fetch inquiries error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

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
      status,
      followUpDate,
      followUpNote,
    } = body;

    if (!name || (!phone && !email)) {
      return NextResponse.json(
        { success: false, error: "Guest name and contact number/email are required" },
        { status: 400 }
      );
    }

    // 1. Find or create Customer
    let customer = await prisma.customer.findFirst({
      where: {
        OR: [
          phone ? { phone: { equals: phone } } : {},
          email ? { email: { equals: email } } : {},
        ].filter(Boolean),
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name,
          email: email || `${phone.replace(/\D/g, "")}@lead.tripmaster.in`,
          phone: phone || "",
          whatsappNumber: whatsappNumber || phone || "",
          city: city || "",
          notes: notes ? `Initial Lead Note: ${notes}` : undefined,
        },
      });
    } else {
      // Update details if provided
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

    // 2. Prepare internal note
    const timestamp = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const initialNotes = [
      `${timestamp}: Manual inquiry logged by Admin Concierge.`,
      notes ? `Requirements: ${notes}` : "",
      followUpNote ? `Follow-up plan: ${followUpNote}` : "",
    ].filter(Boolean);

    // 3. Create Inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        customerId: customer.id,
        packageId: packageId || null,
        destination: destination || "Bespoke Journey",
        travelDate: travelDate ? new Date(travelDate) : null,
        paxCount: paxCount ? parseInt(paxCount, 10) : 2,
        status: status || "NEW",
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        followUpNote: followUpNote || null,
        internalNotes: JSON.stringify(initialNotes),
      },
      include: {
        customer: true,
        package: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lead inquiry logged successfully",
      inquiry,
    });
  } catch (error) {
    console.error("Admin create inquiry error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create inquiry" },
      { status: 500 }
    );
  }
}

