import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PackageDetailClient } from "@/components/packages/PackageDetailClient";
import { getFallbackPackageBySlug, safeParseJson } from "@/lib/fallbackPackages";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  let pkg = null;
  try {
    pkg = await prisma.package.findUnique({
      where: { slug },
      select: { title: true, overview: true, destination: true },
    });
  } catch (err) {
    console.error("[generateMetadata] Database query error:", err);
  }

  if (!pkg) {
    const fallback = getFallbackPackageBySlug(slug);
    if (fallback) {
      pkg = { title: fallback.title, overview: fallback.overview, destination: fallback.destination };
    }
  }

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

  let pkg = null;
  try {
    pkg = await prisma.package.findUnique({
      where: { slug },
      include: {
        itinerary: {
          orderBy: {
            dayNumber: "asc",
          },
        },
      },
    });
  } catch (err) {
    console.error("[PackageDetailPage] Database query error:", err);
  }

  if (!pkg) {
    const fallback = getFallbackPackageBySlug(slug);
    if (fallback) {
      return <PackageDetailClient pkg={fallback} />;
    }
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
    galleryImages: safeParseJson<string[]>(pkg.galleryImages, []),
    mapCoordinates: safeParseJson<{ name: string; lat: number; lng: number }[]>(pkg.mapCoordinates, []),
    inclusions: safeParseJson<string[]>(pkg.inclusions, []),
    exclusions: safeParseJson<string[]>(pkg.exclusions, []),
    itinerary: pkg.itinerary.map((day) => ({
      ...day,
      mealsIncluded: safeParseJson<string[]>(day.mealsIncluded, []),
      activityPhotos: safeParseJson<string[]>(day.activityPhotos, []),
    })),
  };

  return <PackageDetailClient pkg={formattedPackage} />;
}
