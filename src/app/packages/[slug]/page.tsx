import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PackageDetailClient } from "@/components/packages/PackageDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const pkg = await prisma.package.findUnique({
    where: { slug },
    select: { title: true, overview: true, destination: true },
  });

  if (!pkg) {
    return {
      title: "Package Not Found | Trip Master",
    };
  }

  return {
    title: `${pkg.title} | Trip Master Luxury Travel`,
    description: pkg.overview.slice(0, 160),
    openGraph: {
      title: `${pkg.title} - ${pkg.destination}`,
      description: pkg.overview.slice(0, 160),
    },
  };
}

export default async function PackageDetailPage(props: PageProps) {
  const { slug } = await props.params;

  const pkg = await prisma.package.findUnique({
    where: { slug },
    include: {
      itinerary: {
        orderBy: {
          dayNumber: "asc",
        },
      },
    },
  });

  if (!pkg) {
    notFound();
  }

  // Increment views count asynchronously
  prisma.package
    .update({
      where: { id: pkg.id },
      data: { viewsCount: { increment: 1 } },
    })
    .catch((err) => console.error("Error updating views:", err));

  const formattedPackage = {
    ...pkg,
    galleryImages: JSON.parse(pkg.galleryImages || "[]") as string[],
    mapCoordinates: JSON.parse(pkg.mapCoordinates || "[]") as {
      name: string;
      lat: number;
      lng: number;
    }[],
    inclusions: JSON.parse(pkg.inclusions || "[]") as string[],
    exclusions: JSON.parse(pkg.exclusions || "[]") as string[],
    itinerary: pkg.itinerary.map((day) => ({
      ...day,
      mealsIncluded: JSON.parse(day.mealsIncluded || "[]") as string[],
      activityPhotos: JSON.parse(day.activityPhotos || "[]") as string[],
    })),
  };

  return <PackageDetailClient pkg={formattedPackage} />;
}
