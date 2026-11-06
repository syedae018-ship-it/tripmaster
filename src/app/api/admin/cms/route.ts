import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      return NextResponse.json(
        { success: false, error: "Settings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: {
        ...settings,
        socialLinks: JSON.parse(settings.socialLinks || "{}"),
        stats: JSON.parse(settings.stats || "[]"),
        features: JSON.parse(settings.features || "[]"),
        bankDetails: settings.bankDetails ? JSON.parse(settings.bankDetails) : {},
      },
    });
  } catch (error) {
    console.error("Admin fetch CMS settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName,
      tagline,
      aboutText,
      heroTitle,
      heroSubtitle,
      heroImage,
      email,
      phone,
      whatsappNumber,
      address,
      gstNumber,
      bankDetails,
      socialLinks,
      stats,
      features,
    } = body;

    const updated = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        companyName,
        tagline,
        aboutText,
        heroTitle,
        heroSubtitle,
        heroImage,
        email,
        phone,
        whatsappNumber,
        address,
        gstNumber,
        bankDetails: bankDetails ? JSON.stringify(bankDetails) : null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : undefined,
        stats: stats ? JSON.stringify(stats) : undefined,
        features: features ? JSON.stringify(features) : undefined,
      },
      create: {
        id: "default",
        companyName: companyName || "Trip Master",
        tagline: tagline || "Curating Unforgettable Luxury Journeys",
        aboutText: aboutText || "",
        heroTitle: heroTitle || "Bespoke Luxury Escapes For The Discerning Traveller",
        heroSubtitle: heroSubtitle || "",
        heroImage:
          heroImage ||
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85",
        email: email || "concierge@tripmaster.in",
        phone: phone || "+91 98765 43210",
        whatsappNumber: whatsappNumber || "+91 98765 43210",
        address: address || "The Oberoi Grand Arc, MG Road, Bengaluru",
        gstNumber: gstNumber || "29AABCU9603R1ZX",
        bankDetails: bankDetails ? JSON.stringify(bankDetails) : null,
        socialLinks: JSON.stringify(socialLinks || {}),
        stats: JSON.stringify(stats || []),
        features: JSON.stringify(features || []),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Website settings updated successfully",
      settings: updated,
    });
  } catch (error) {
    console.error("Admin update CMS settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

