import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    const testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });

    const faqs = await prisma.fAQ.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    });

    const formattedSettings = settings
      ? {
          ...settings,
          socialLinks: JSON.parse(settings.socialLinks || "{}"),
          stats: JSON.parse(settings.stats || "[]"),
          features: JSON.parse(settings.features || "[]"),
        }
      : null;

    return NextResponse.json({
      success: true,
      settings: formattedSettings,
      testimonials,
      faqs,
    });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}
