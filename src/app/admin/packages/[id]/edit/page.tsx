import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PackageStudio } from "@/components/admin/PackageStudio";

export const metadata: Metadata = {
  title: "Edit Package Studio | Trip Master Admin",
};

interface EditPackageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPackagePage(props: EditPackageProps) {
  const { id } = await props.params;

  const pkg = await prisma.package.findUnique({
    where: { id },
    include: {
      itinerary: {
        orderBy: { dayNumber: "asc" },
      },
    },
  });

  if (!pkg) {
    notFound();
  }

  const initialData = {
    id: pkg.id,
    title: pkg.title,
    slug: pkg.slug,
    destination: pkg.destination,
    durationDays: pkg.durationDays,
    durationNights: pkg.durationNights,
    basePrice: pkg.basePrice,
    discountedPrice: pkg.discountedPrice,
    featuredImage: pkg.featuredImage,
    galleryImages: JSON.parse(pkg.galleryImages || "[]") as string[],
    overview: pkg.overview,
    mapCoordinates: JSON.parse(pkg.mapCoordinates || "[]") as Array<{
      name: string;
      lat: number;
      lng: number;
      dayNumber?: number;
    }>,
    inclusions: JSON.parse(pkg.inclusions || "[]") as string[],
    exclusions: JSON.parse(pkg.exclusions || "[]") as string[],
    paymentPolicy: pkg.paymentPolicy,
    cancellationPolicy: pkg.cancellationPolicy,
    isFeatured: pkg.isFeatured,
    isPublished: pkg.isPublished,
    itinerary: pkg.itinerary.map((d) => ({
      dayNumber: d.dayNumber,
      title: d.title,
      description: d.description,
      mealsIncluded: JSON.parse(d.mealsIncluded || "[]") as string[],
      activityPhotos: JSON.parse(d.activityPhotos || "[]") as string[],
      accommodationName: d.accommodationName || "",
      accommodationPhoto: d.accommodationPhoto || "",
      accommodationRating: d.accommodationRating || 5.0,
      accommodationCategory: d.accommodationCategory || "Luxury Resort",
      accommodationDetails: d.accommodationDetails || "",
    })),
  };

  return <PackageStudio initialData={initialData} isEdit={true} />;
}

