import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const status = searchParams.get("status") || "ALL";

    const where: any = {};
    if (status !== "ALL") {
      where.status = status;
    }
    if (query) {
      where.OR = [
        { quotationNumber: { contains: query } },
        { title: { contains: query } },
        { destination: { contains: query } },
        { customer: { name: { contains: query } } },
        { customer: { phone: { contains: query } } },
        { customer: { email: { contains: query } } },
      ];
    }

    const quotations = await prisma.quotation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        package: {
          select: { id: true, title: true, slug: true, featuredImage: true },
        },
      },
    });

    return NextResponse.json({ success: true, quotations });
  } catch (error: any) {
    console.error("List quotations error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch quotations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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
      customerId,
      customerData,
      packageId,
      inquiryId,
    } = body;

    if (!title || !destination || !content) {
      return NextResponse.json(
        { success: false, error: "Title, destination, and content are required" },
        { status: 400 }
      );
    }

    // Resolve or create customer if provided
    let finalCustomerId = customerId;
    if (!finalCustomerId && customerData && (customerData.phone || customerData.email)) {
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          OR: [
            customerData.phone ? { phone: customerData.phone } : {},
            customerData.email ? { email: customerData.email } : {},
          ].filter((c) => Object.keys(c).length > 0),
        },
      });

      if (existingCustomer) {
        finalCustomerId = existingCustomer.id;
      } else {
        const newCustomer = await prisma.customer.create({
          data: {
            name: customerData.name || "Traveller",
            phone: customerData.phone || "",
            email: customerData.email || "",
            whatsappNumber: customerData.whatsappNumber || customerData.phone || "",
            city: customerData.city || null,
          },
        });
        finalCustomerId = newCustomer.id;
      }
    }

    // Generate quotation number (QT-YYYYMM-XXXX)
    const timestamp = Date.now().toString().slice(-4);
    const datePrefix = new Date().toISOString().slice(0, 7).replace("-", "");
    const quotationNumber = `QT-${datePrefix}-${timestamp}`;

    // Create unique share slug
    const cleanDest = destination.toLowerCase().replace(/[^a-z0-9]/g, "");
    const shareSlug = `${cleanDest}-quote-${timestamp}-${Math.random().toString(36).substring(2, 6)}`;

    const quotation = await prisma.quotation.create({
      data: {
        quotationNumber,
        title,
        destination,
        durationDays: Number(durationDays) || 4,
        durationNights: Number(durationNights) || 3,
        pricePerPerson: Number(pricePerPerson) || 0,
        totalAmount:
          Number(totalAmount) ||
          (Number(pricePerPerson) || 0) * (Number(paxCount) || 2),
        travelDate: travelDate ? new Date(travelDate) : null,
        paxCount: Number(paxCount) || 2,
        adultsCount: Number(adultsCount) || 2,
        childrenCount: Number(childrenCount) || 0,
        status: status || "DRAFT",
        content: typeof content === "string" ? content : JSON.stringify(content),
        customerId: finalCustomerId || null,
        packageId: packageId || null,
        inquiryId: inquiryId || null,
        shareSlug,
      },
      include: {
        customer: true,
        package: true,
      },
    });

    // If customer exists, also save record in CustomerDocument vault
    if (finalCustomerId) {
      await prisma.customerDocument.create({
        data: {
          customerId: finalCustomerId,
          title: `Quotation: ${title} (${quotationNumber})`,
          type: "QUOTATION",
          fileUrl: `/quote/${shareSlug}`,
          fileSize: "Mobile PDF Dossier",
        },
      });
    }

    return NextResponse.json({ success: true, quotation });
  } catch (error: any) {
    console.error("Create quotation error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create quotation" },
      { status: 500 }
    );
  }
}

