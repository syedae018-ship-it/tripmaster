import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PackageCatalog } from "@/components/packages/PackageCatalog";

export const metadata: Metadata = {
  title: "Curated Luxury Packages & Escapes | Trip Master",
  description:
    "Explore our complete collection of bespoke luxury itineraries across Kashmir, Kerala, Andaman, and Rajasthan. 5-star heritage stays and 24/7 dedicated concierges.",
};

export default async function PackagesPage(props: {
  searchParams: Promise<{
    destination?: string;
    duration?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const initialDestination = searchParams?.destination || "";
  const initialDuration = searchParams?.duration || "";

  const rawPackages = await prisma.package.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  const packages = rawPackages.map((pkg) => ({
    id: pkg.id,
    title: pkg.title,
    slug: pkg.slug,
    destination: pkg.destination,
    durationDays: pkg.durationDays,
    durationNights: pkg.durationNights,
    basePrice: pkg.basePrice,
    discountedPrice: pkg.discountedPrice,
    featuredImage: pkg.featuredImage,
    overview: pkg.overview,
    inclusions: JSON.parse(pkg.inclusions || "[]"),
    viewsCount: pkg.viewsCount,
  }));

  return (
    <main className="bg-[#FAF9F6] min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#0D2C24] text-white py-14 sm:py-18 border-b border-[#1A453B] relative overflow-hidden font-sans">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1800&q=80')",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <p className="eyebrow text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-400 font-sans">
            Private Portfolio
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-2 leading-[1.12]">
            Curated Bespoke Itineraries
          </h1>
          <p className="font-sans mt-3 text-base text-white/85 max-w-2xl font-normal leading-relaxed text-pretty">
            Every journey includes verified 5-star heritage retreats, private chauffeured luxury SUVs, and direct 24/7 personal concierge support.
          </p>
        </div>
      </div>

      {/* Interactive Catalog Component */}
      <PackageCatalog
        initialPackages={packages}
        initialDestination={initialDestination}
        initialDuration={initialDuration}
      />
    </main>
  );
}
