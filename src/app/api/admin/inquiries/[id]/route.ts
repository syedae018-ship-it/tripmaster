import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        customer: true,
        package: true,
        booking: {
          select: {
            id: true,
            bookingReference: true,
            bookingStatus: true,
            totalAmount: true,
            amountPaid: true,
            balanceAmount: true,
          },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: "Inquiry not found" },
        { status: 404 }
      );
    }

    const formatted = {
      ...inquiry,
      internalNotes: inquiry.internalNotes
        ? (JSON.parse(inquiry.internalNotes) as string[])
        : [],
    };

    return NextResponse.json({
      success: true,
      inquiry: formatted,
    });
  } catch (error) {
    console.error("Admin fetch inquiry by ID error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiry details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status, followUpDate, followUpNote, newNote } = body;

    const current = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!current) {
      return NextResponse.json(
        { success: false, error: "Inquiry not found" },
        { status: 404 }
      );
    }

    const dataToUpdate: Record<string, unknown> = {};

    if (status !== undefined) {
      dataToUpdate.status = status;
    }

    if (followUpDate !== undefined) {
      dataToUpdate.followUpDate = followUpDate ? new Date(followUpDate) : null;
    }

    if (followUpNote !== undefined) {
      dataToUpdate.followUpNote = followUpNote;
    }

    // Append new internal note if sent
    if (newNote && typeof newNote === "string") {
      const existingNotes = current.internalNotes
        ? (JSON.parse(current.internalNotes) as string[])
        : [];
      const timestamp = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
      existingNotes.push(`${timestamp}: ${newNote.trim()}`);
      dataToUpdate.internalNotes = JSON.stringify(existingNotes);
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: dataToUpdate,
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
      message: "Inquiry updated successfully",
      inquiry: {
        ...updated,
        internalNotes: updated.internalNotes
          ? (JSON.parse(updated.internalNotes) as string[])
          : [],
      },
    });
  } catch (error) {
    console.error("Admin update inquiry error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update inquiry" },
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

    await prisma.inquiry.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete inquiry error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}

