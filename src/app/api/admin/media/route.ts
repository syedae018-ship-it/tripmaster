import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destination = searchParams.get("destination");
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    const where: any = {};
    if (destination && destination !== "ALL") {
      where.destination = { contains: destination };
    }
    if (category && category !== "ALL") {
      where.category = category;
    }
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { destination: { contains: query } },
      ];
    }

    const mediaItems = await prisma.mediaItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, media: mediaItems });
  } catch (error: any) {
    console.error("Fetch media error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch media" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, url, destination, category, fileSize, mimeType } = body;

    if (!title || !url) {
      return NextResponse.json(
        { success: false, error: "Title and URL are required" },
        { status: 400 }
      );
    }

    const item = await prisma.mediaItem.create({
      data: {
        title,
        url,
        destination: destination || null,
        category: category || "PLACE",
        fileSize: fileSize || null,
        mimeType: mimeType || null,
      },
    });

    return NextResponse.json({ success: true, media: item });
  } catch (error: any) {
    console.error("Create media item error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save media" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Media item ID is required" },
        { status: 400 }
      );
    }

    await prisma.mediaItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Asset deleted successfully" });
  } catch (error: any) {
    console.error("Delete media error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete media asset" },
      { status: 500 }
    );
  }
}


