import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    console.error("Get quotation error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch quotation" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      title,
      destination,
      durationDays,
      durationNights,
      pricePerPerson,
      totalAmount,
      travelDate,
      paxCount,
      adultsCount,
      childrenCount,
      status,
      content,
      pdfUrl,
      customerId,
    } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (destination !== undefined) updateData.destination = destination;
    if (durationDays !== undefined) updateData.durationDays = Number(durationDays);
    if (durationNights !== undefined) updateData.durationNights = Number(durationNights);
    if (pricePerPerson !== undefined) updateData.pricePerPerson = Number(pricePerPerson);
    if (totalAmount !== undefined) updateData.totalAmount = Number(totalAmount);
    if (travelDate !== undefined)
      updateData.travelDate = travelDate ? new Date(travelDate) : null;
    if (paxCount !== undefined) updateData.paxCount = Number(paxCount);
    if (adultsCount !== undefined) updateData.adultsCount = Number(adultsCount);
    if (childrenCount !== undefined) updateData.childrenCount = Number(childrenCount);
    if (status !== undefined) updateData.status = status;
    if (pdfUrl !== undefined) updateData.pdfUrl = pdfUrl;
    if (customerId !== undefined) updateData.customerId = customerId || null;
    if (content !== undefined) {
      updateData.content =
        typeof content === "string" ? content : JSON.stringify(content);
    }

    const updated = await prisma.quotation.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        package: true,
      },
    });

    return NextResponse.json({
      success: true,
      quotation: {
        ...updated,
        content:
          typeof updated.content === "string"
            ? JSON.parse(updated.content)
            : updated.content,
      },
    });
  } catch (error: any) {
    console.error("Update quotation error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update quotation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.quotation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Quotation deleted" });
  } catch (error: any) {
    console.error("Delete quotation error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete quotation" },
      { status: 500 }
    );
  }
}

