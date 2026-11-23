import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const quotation = await prisma.quotation.findFirst({
      where: {
        OR: [{ shareSlug: slug }, { id: slug }, { quotationNumber: slug }],
      },
      include: {
        customer: {
          select: { name: true, phone: true, email: true },
        },
        package: {
          select: { title: true, slug: true, featuredImage: true },
        },
        bookings: {
          select: {
            id: true,
            bookingReference: true,
            totalAmount: true,
            amountPaid: true,
            balanceAmount: true,
            bookingStatus: true,
            taxInvoiceNumber: true,
            taxInvoiceUrl: true,
            paymentTransactions: {
              select: {
                id: true,
                razorpayPaymentId: true,
                amount: true,
                status: true,
                createdAt: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { success: false, error: "Quotation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      quotation: {
        ...quotation,
        content:
          typeof quotation.content === "string"
            ? JSON.parse(quotation.content)
            : quotation.content,
      },
    });
  } catch (error: any) {
    console.error("Public quotation error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load quotation" },
      { status: 500 }
    );
  }
}

