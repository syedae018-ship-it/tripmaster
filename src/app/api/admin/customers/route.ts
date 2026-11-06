import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        inquiries: {
          select: { id: true, createdAt: true, status: true },
          orderBy: { createdAt: "desc" },
        },
        bookings: {
          select: {
            id: true,
            totalAmount: true,
            amountPaid: true,
            balanceAmount: true,
            bookingStatus: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            documents: true,
          },
        },
      },
    });

    const formatted = customers.map((c) => {
      const lifetimeSpend = c.bookings.reduce((sum, b) => sum + (b.amountPaid || 0), 0);
      const confirmedBookingsCount = c.bookings.filter(
        (b) => b.bookingStatus === "CONFIRMED" || b.bookingStatus === "COMPLETED"
      ).length;

      // Last interaction calculation
      const dates = [
        c.createdAt.getTime(),
        c.updatedAt.getTime(),
        ...c.inquiries.map((i) => i.createdAt.getTime()),
        ...c.bookings.map((b) => b.createdAt.getTime()),
      ];
      const lastInteraction = new Date(Math.max(...dates));

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        whatsappNumber: c.whatsappNumber,
        city: c.city,
        notes: c.notes,
        createdAt: c.createdAt,
        totalInquiries: c.inquiries.length,
        totalBookings: c.bookings.length,
        confirmedBookingsCount,
        lifetimeSpend,
        documentCount: c._count.documents,
        lastInteraction,
      };
    });

    return NextResponse.json({
      success: true,
      customers: formatted,
    });
  } catch (error) {
    console.error("Admin fetch customers error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, whatsappNumber, city, notes } = body;

    if (!name || (!phone && !email)) {
      return NextResponse.json(
        { success: false, error: "Customer name and phone or email are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.customer.findFirst({
      where: {
        OR: [
          phone ? { phone: { equals: phone } } : {},
          email ? { email: { equals: email } } : {},
        ].filter(Boolean),
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "A customer profile with this phone or email already exists",
          existingCustomerId: existing.id,
        },
        { status: 409 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email: email || `${phone.replace(/\D/g, "")}@guest.tripmaster.in`,
        phone: phone || "",
        whatsappNumber: whatsappNumber || phone || "",
        city: city || "",
        notes: notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Customer profile created successfully",
      customer,
    });
  } catch (error) {
    console.error("Admin create customer error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create customer" },
      { status: 500 }
    );
  }
}

