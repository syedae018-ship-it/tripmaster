import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";

export interface PackageSummary {
  id: string;
  title: string;
  slug: string;
  destination: string;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  discountedPrice: number | null;
  featuredImage: string;
}

export function CuratedEscapePackages({
  packages = [],
}: {
  packages: PackageSummary[];
}) {
  // Take top 4 or display full 4-grid matching wireframe
  const displayedPackages = packages.slice(0, 4);

  return (
    <section id="packages" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Section Header (Left-aligned) */}
      <div className="mb-10 text-left max-w-3xl">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-[1.12]">
          Find your kind of escape.
        </h2>
        <p className="font-sans text-base sm:text-lg text-[#52525B] mt-2 font-normal">
          Explore carefully selected holiday experiences.
        </p>
      </div>

      {/* 4-Column Package Card Grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {displayedPackages.map((pkg) => {
          const price = pkg.discountedPrice || pkg.basePrice;

          return (
            <article
              key={pkg.id}
              className="group bg-white rounded-2xl border border-[#E4E2DD] shadow-card hover:shadow-elevation transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Top destination photo (aspect-[4/3], rounded top corners) */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3F1ED]">
                <img
                  src={pkg.featuredImage}
                  alt={pkg.destination}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-medium text-white flex items-center gap-1 shadow-sm">
                  <MapPin className="w-3 h-3 text-amber-300" />
                  <span>{pkg.destination}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Destination Title in Helvetica Bold */}
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#111111] group-hover:text-[#0D2C24] transition-colors leading-snug tracking-tight">
                    <Link href={`/packages/${pkg.slug}`}>{pkg.destination}</Link>
                  </h3>

                  {/* Duration text in Poppins */}
                  <div className="flex items-center gap-1.5 text-xs text-[#52525B] font-medium mt-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#0D2C24]" />
                    <span>
                      {pkg.durationDays} Days / {pkg.durationNights} Nights
                    </span>
                  </div>

                  {/* Starting Price in Poppins/Helvetica */}
                  <div className="mt-4 pt-3 border-t border-[#F3F1ED]">
                    <span className="text-[11px] font-semibold text-[#52525B] uppercase tracking-wider block">
                      Starting From
                    </span>
                    <div className="price-display text-xl sm:text-2xl font-bold text-[#111111] tabular-nums mt-0.5">
                      ₹{price.toLocaleString("en-IN")}
                      <span className="text-xs font-normal text-[#52525B] ml-1">/ person</span>
                    </div>
                  </div>
                </div>

                {/* Bottom link button: EXPLORE → */}
                <div className="mt-5">
                  <Link
                    href={`/packages/${pkg.slug}`}
                    className="btn btn-primary w-full py-2.5 text-xs font-semibold uppercase tracking-wider justify-between rounded-xl group/btn"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-amber-300" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Full-Width Bottom Bar Button */}
      <Link
        href="/packages"
        className="w-full py-4 rounded-xl border border-[#E4E2DD] bg-white hover:bg-[#F3F1ED] text-[#111111] hover:text-[#0D2C24] font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-card transition-all"
      >
        <span>View All Destinations</span>
        <ArrowRight className="w-4 h-4 text-amber-600" />
      </Link>
    </section>
  );
}

