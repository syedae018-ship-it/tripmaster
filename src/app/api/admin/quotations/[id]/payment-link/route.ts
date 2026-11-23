import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      paymentAmountDue,
      paymentPlan = "CUSTOM",
      paymentNote,
      paymentLinkActive = true,
    } = body;

    const quotation = await prisma.quotation.findFirst({
      where: {
        OR: [{ id }, { quotationNumber: id }, { shareSlug: id }],
      },
      include: {
        customer: true,
        package: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { success: false, error: "Quotation not found" },
        { status: 404 }
      );
    }

    const totalTripAmount =
      quotation.totalAmount || quotation.pricePerPerson * quotation.paxCount;
    const amountDue =
      paymentAmountDue !== undefined && paymentAmountDue !== null
        ? Number(paymentAmountDue)
        : totalTripAmount;

    const updated = await prisma.quotation.update({
      where: { id: quotation.id },
      data: {
        paymentAmountDue: amountDue,
        paymentPlan,
        paymentNote:
          paymentNote ||
          `Payment for ${quotation.title} (${quotation.quotationNumber})`,
        paymentLinkActive: Boolean(paymentLinkActive),
      },
      include: {
        customer: true,
        package: true,
        bookings: {
          include: { paymentTransactions: true },
        },
      },
    });

    const host =
      req.headers.get("x-forwarded-host") ||
      req.headers.get("host") ||
      "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const paymentUrl = `${protocol}://${host}/pay/quote/${quotation.shareSlug}`;

    return NextResponse.json({
      success: true,
      quotation: updated,
      paymentUrl,
      amountDue,
      paymentStatus: updated.paymentStatus,
      paymentLinkActive: updated.paymentLinkActive,
    });
  } catch (error: any) {
    console.error("Payment link creation error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to generate payment link" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const quotation = await prisma.quotation.findFirst({
      where: {
        OR: [{ id }, { quotationNumber: id }, { shareSlug: id }],
      },
      include: {
        customer: true,
        package: true,
        bookings: {
          include: { paymentTransactions: true },
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

    const host =
      req.headers.get("x-forwarded-host") ||
      req.headers.get("host") ||
      "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const paymentUrl = `${protocol}://${host}/pay/quote/${quotation.shareSlug}`;

    const totalTripAmount =
      quotation.totalAmount || quotation.pricePerPerson * quotation.paxCount;
    const amountDue =
      quotation.paymentAmountDue !== null && quotation.paymentAmountDue !== undefined
        ? quotation.paymentAmountDue
        : totalTripAmount;

    return NextResponse.json({
      success: true,
      quotation,
      paymentUrl,
      amountDue,
      paymentStatus: quotation.paymentStatus,
      paymentLinkActive: quotation.paymentLinkActive,
    });
  } catch (error: any) {
    console.error("Get payment link error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch payment link details" },
      { status: 500 }
    );
  }
}
