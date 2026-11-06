import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { field } = body; // 'isPublished' or 'isFeatured'

    if (field !== "isPublished" && field !== "isFeatured") {
      return NextResponse.json(
        { success: false, error: "Invalid toggle field" },
        { status: 400 }
      );
    }

    const current = await prisma.package.findUnique({
      where: { id },
      select: { [field]: true },
    });

    if (!current) {
      return NextResponse.json(
        { success: false, error: "Package not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.package.update({
      where: { id },
      data: {
        [field]: !current[field as keyof typeof current],
      },
    });

    return NextResponse.json({
      success: true,
      message: `${field === "isPublished" ? "Publish status" : "Featured status"} updated`,
      package: updated,
    });
  } catch (error) {
    console.error("Error toggling package field:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update package status" },
      { status: 500 }
    );
  }
}

