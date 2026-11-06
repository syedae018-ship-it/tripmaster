import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        inquiries: {
          orderBy: { createdAt: "desc" },
          include: {
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
          },
        },
        bookings: {
          orderBy: { createdAt: "desc" },
          include: {
            package: {
              select: {
                id: true,
                title: true,
                destination: true,
              },
            },
            paymentTransactions: true,
          },
        },
        documents: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    const totalSpend = customer.bookings.reduce(
      (sum, b) => sum + (b.amountPaid || 0),
      0
    );
    const totalBalance = customer.bookings.reduce(
      (sum, b) => sum + (b.balanceAmount || 0),
      0
    );

    const formattedInquiries = customer.inquiries.map((inq) => ({
      ...inq,
      internalNotes: inq.internalNotes
        ? (JSON.parse(inq.internalNotes) as string[])
        : [],
    }));

    return NextResponse.json({
      success: true,
      customer: {
        ...customer,
        inquiries: formattedInquiries,
        metrics: {
          totalSpend,
          totalBalance,
          totalInquiries: customer.inquiries.length,
          totalBookings: customer.bookings.length,
        },
      },
    });
  } catch (error) {
    console.error("Admin fetch customer 360 error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch customer profile" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { name, email, phone, whatsappNumber, city, notes } = body;

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        whatsappNumber,
        city,
        notes,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Customer profile updated successfully",
      customer: updated,
    });
  } catch (error) {
    console.error("Admin update customer error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Customer profile deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete customer error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}

