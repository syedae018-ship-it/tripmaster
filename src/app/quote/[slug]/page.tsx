import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ClientQuotationView } from "@/components/quotation/ClientQuotationView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const quotation = await prisma.quotation.findFirst({
      where: {
        OR: [{ shareSlug: slug }, { id: slug }, { quotationNumber: slug }],
      },
      select: {
        title: true,
        destination: true,
        durationDays: true,
        durationNights: true,
      },
    });

    if (quotation) {
      return {
        title: `${quotation.title} | Trip Master Luxury Itinerary Dossier`,
        description: `Bespoke ${quotation.durationNights}N / ${quotation.durationDays}D luxury holiday plan for ${quotation.destination}.`,
      };
    }
  } catch (e) {
    console.error("Error generating quotation metadata:", e);
  }

  return {
    title: "Luxury Itinerary & Bespoke Quotation Dossier | Trip Master",
    description: "Curated bespoke holiday experiences with handpicked luxury properties, private transfers, and dedicated concierge support.",
  };
}

export default async function ClientQuotationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let initialQuotation: any = null;
  try {
    const q = await prisma.quotation.findFirst({
      where: {
        OR: [{ shareSlug: slug }, { id: slug }, { quotationNumber: slug }],
      },
      include: {
        customer: {
          select: { name: true, phone: true, email: true },
        },
        package: {
          select: { title: true, slug: true, featuredImage: true },
        },
        bookings: {
          select: {
            id: true,
            bookingReference: true,
            totalAmount: true,
            amountPaid: true,
            balanceAmount: true,
            bookingStatus: true,
            taxInvoiceNumber: true,
            taxInvoiceUrl: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (q) {
      initialQuotation = {
        ...q,
        content:
          typeof q.content === "string" ? JSON.parse(q.content) : q.content,
      };
    }
  } catch (e) {
    console.error("Failed to load quotation on server:", e);
  }

  return <ClientQuotationView initialQuotation={initialQuotation} slug={slug} />;
}
