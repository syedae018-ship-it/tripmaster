import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destination = searchParams.get("destination");
    const category = searchParams.get("category");

    const where: any = {};
    if (destination && destination !== "ALL") {
      where.destination = { contains: destination };
    }
    if (category && category !== "ALL") {
      where.category = category;
    }

    const places = await prisma.masterPlace.findMany({
      where,
      orderBy: { order: "asc" },
    });

    const parsedPlaces = places.map((p) => ({
      ...p,
      photos: p.photos ? JSON.parse(p.photos) : [],
      tags: p.tags ? JSON.parse(p.tags) : [],
    }));

    return NextResponse.json({ success: true, places: parsedPlaces });
  } catch (error: any) {
    console.error("Fetch master places error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch places" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      destination,
      placeTitle,
      locationSubtitle,
      description,
      category,
      photos,
      tags,
    } = body;

    if (!destination || !placeTitle) {
      return NextResponse.json(
        { success: false, error: "Destination and Place Title are required" },
        { status: 400 }
      );
    }

    const place = await prisma.masterPlace.create({
      data: {
        destination,
        placeTitle,
        locationSubtitle: locationSubtitle || null,
        description: description || "",
        category: category || "ATTRACTION",
        photos: JSON.stringify(photos || []),
        tags: JSON.stringify(tags || []),
      },
    });

    return NextResponse.json({
      success: true,
      place: {
        ...place,
        photos: photos || [],
        tags: tags || [],
      },
    });
  } catch (error: any) {
    console.error("Create master place error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save place" },
      { status: 500 }
    );
  }
}
