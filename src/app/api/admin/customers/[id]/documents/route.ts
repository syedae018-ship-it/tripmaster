import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { title, type, fileUrl, fileSize, bookingId } = body;

    if (!title || !fileUrl) {
      return NextResponse.json(
        { success: false, error: "Document title and file URL are required" },
        { status: 400 }
      );
    }

    const doc = await prisma.customerDocument.create({
      data: {
        customerId: id,
        bookingId: bookingId || null,
        title,
        type: type || "QUOTATION",
        fileUrl,
        fileSize: fileSize || "1.0 MB",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Document attached successfully",
      document: doc,
    });
  } catch (error) {
    console.error("Admin attach document error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to attach document" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const docId = searchParams.get("docId");

    if (!docId) {
      return NextResponse.json(
        { success: false, error: "Document ID is required" },
        { status: 400 }
      );
    }

    await prisma.customerDocument.delete({
      where: { id: docId },
    });

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete document error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete document" },
      { status: 500 }
    );
  }
}

