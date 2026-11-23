import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, countryId, ...data } = body;

    if (!type || !countryId) {
      return NextResponse.json(
        { success: false, error: "Type and countryId are required" },
        { status: 400 }
      );
    }

    if (type === "PLACE") {
      const place = await prisma.masterPlaceItem.create({
        data: {
          countryId,
          name: data.name,
          locationSubtitle: data.locationSubtitle || "",
          description: data.description || "",
          durationDay: Number(data.durationDay) || 1,
          category: data.category || "ATTRACTION",
          photos: JSON.stringify(data.photos || []),
        },
      });
      return NextResponse.json({ success: true, item: place });
    }

    if (type === "HOTEL") {
      const hotel = await prisma.masterHotel.create({
        data: {
          countryId,
          name: data.name,
          placeName: data.placeName || "",
          starRating: Number(data.starRating) || 4.0,
          roomCategory: data.roomCategory || "Deluxe Room",
          description: data.description || "",
          mealPlans: JSON.stringify(data.mealPlans || ["Breakfast Included"]),
          photos: JSON.stringify(data.photos || []),
        },
      });
      return NextResponse.json({ success: true, item: hotel });
    }

    if (type === "TRANSFER") {
      const transfer = await prisma.masterTransfer.create({
        data: {
          countryId,
          title: data.title,
          vehicleType: data.vehicleType || "Private AC Coach",
          description: data.description || "",
          photo: data.photo || "",
        },
      });
      return NextResponse.json({ success: true, item: transfer });
    }

    return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    console.error("Create preset item error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create preset item" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json({ success: false, error: "Type and id required" }, { status: 400 });
    }

    if (type === "COUNTRY") {
      await prisma.masterCountry.delete({ where: { id } });
    } else if (type === "PLACE") {
      await prisma.masterPlaceItem.delete({ where: { id } });
    } else if (type === "HOTEL") {
      await prisma.masterHotel.delete({ where: { id } });
    } else if (type === "TRANSFER") {
      await prisma.masterTransfer.delete({ where: { id } });
    }

    return NextResponse.json({ success: true, message: "Preset deleted" });
  } catch (error: any) {
    console.error("Delete preset error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete preset" },
      { status: 500 }
    );
  }
}

