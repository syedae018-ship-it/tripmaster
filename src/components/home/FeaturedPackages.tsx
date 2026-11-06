import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";

interface PackageCardProps {
  id: string;
  title: string;
  slug: string;
  destination: string;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  discountedPrice: number | null;
  featuredImage: string;
  overview: string;
  inclusions: string[];
}

export function FeaturedPackages({ packages }: { packages: PackageCardProps[] }) {
  return (
    <section id="destinations" className="py-20 sm:py-28 bg-[#FAF9F6] border-t border-[#E4E2DD] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#E4E2DD]">
          <div className="max-w-xl">
            <p className="eyebrow text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-800">
              Curated Portfolio
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-[1.12] mt-2 text-balance">
              Featured private expeditions.
            </h2>
          </div>

          <Link
            href="/packages"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0D2C24] hover:text-[#133E33] transition-colors self-start sm:self-end group pb-1"
          >
            <span>View All Journeys</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 2-Column Editorial Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {packages.map((pkg) => {
            const price = pkg.discountedPrice || pkg.basePrice;

            return (
              <article
                key={pkg.id}
                className="group bg-white rounded-2xl border border-[#E4E2DD] shadow-card hover:shadow-elevation transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Photo Frame */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F3F1ED]">
                  <img
                    src={pkg.featuredImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-medium text-white flex items-center gap-1.5 shadow-sm">
                    <MapPin className="w-3 h-3 text-amber-300" />
                    <span>{pkg.destination}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-sans tabular-nums text-white flex items-center gap-1.5 shadow-sm">
                    <Clock className="w-3 h-3 text-white/80" />
                    <span>
                      {pkg.durationDays}D / {pkg.durationNights}N
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#111111] group-hover:text-[#0D2C24] transition-colors leading-snug tracking-tight">
                      <Link href={`/packages/${pkg.slug}`}>{pkg.title}</Link>
                    </h3>

                    <p className="mt-3 text-sm text-[#52525B] font-normal line-clamp-2 leading-relaxed">
                      {pkg.overview}
                    </p>

                    {/* Inclusions Row */}
                    <div className="mt-4 pt-3.5 border-t border-[#F3F1ED] flex flex-wrap gap-1.5">
                      {pkg.inclusions.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-[#F3F1ED] text-[#52525B] px-2.5 py-1 rounded-md text-[11px] font-medium border border-[#E4E2DD]/60"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Strip & Action Button */}
                  <div className="mt-6 pt-4 border-t border-[#E4E2DD] flex items-baseline justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#52525B] block">
                        Tariff From
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="price-display text-2xl sm:text-3xl font-bold text-[#111111] tabular-nums">
                          ₹{price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-[#52525B]">/ guest</span>
                      </div>
                    </div>

                    <Link
                      href={`/packages/${pkg.slug}`}
                      className="btn btn-secondary text-xs uppercase tracking-wider font-semibold rounded-xl px-4 py-2"
                    >
                      <span>View Itinerary</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
