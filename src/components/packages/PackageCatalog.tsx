"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  ArrowRight,
  Filter,
  RotateCcw,
} from "lucide-react";

export interface PackageItem {
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
  viewsCount: number;
}

export function PackageCatalog({
  initialPackages,
  initialDestination = "",
  initialDuration = "",
}: {
  initialPackages: PackageItem[];
  initialDestination?: string;
  initialDuration?: string;
}) {
  const [selectedDestination, setSelectedDestination] = useState(initialDestination);
  const [selectedDuration, setSelectedDuration] = useState(initialDuration);
  const [maxBudget, setMaxBudget] = useState<number>(200000);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Filtering & Sorting logic
  const filteredPackages = useMemo(() => {
    return initialPackages
      .filter((pkg) => {
        // Destination filter
        if (
          selectedDestination &&
          selectedDestination !== "all" &&
          !pkg.destination.toLowerCase().includes(selectedDestination.toLowerCase())
        ) {
          return false;
        }

        // Duration filter
        if (selectedDuration === "1-5" && pkg.durationDays > 5) return false;
        if (
          selectedDuration === "6-8" &&
          (pkg.durationDays < 6 || pkg.durationDays > 8)
        )
          return false;
        if (selectedDuration === "9+" && pkg.durationDays < 9) return false;

        // Price filter
        const price = pkg.discountedPrice || pkg.basePrice;
        if (price > maxBudget) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountedPrice || a.basePrice;
        const priceB = b.discountedPrice || b.basePrice;

        if (sortBy === "price_asc") return priceA - priceB;
        if (sortBy === "price_desc") return priceB - priceA;
        if (sortBy === "duration") return a.durationDays - b.durationDays;
        if (sortBy === "views") return b.viewsCount - a.viewsCount;
        return 0; // default featured
      });
  }, [
    initialPackages,
    selectedDestination,
    selectedDuration,
    maxBudget,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedDestination("");
    setSelectedDuration("");
    setMaxBudget(200000);
    setSortBy("featured");
  };

  const destinations = [
    { label: "All Regions", value: "" },
    { label: "Kashmir", value: "Kashmir" },
    { label: "Kerala", value: "Kerala" },
    { label: "Andaman", value: "Andaman" },
    { label: "Rajasthan", value: "Rajasthan" },
  ];

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top Filter & Sorter Toolbar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-[#E4E2DD] mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
              Filter Curated Journeys
            </h2>
            <p className="text-xs text-[#52525B] mt-0.5 font-medium tabular-nums">
              Showing {filteredPackages.length} of {initialPackages.length} available itineraries
            </p>
          </div>

          {/* Destination Segment Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {destinations.map((dest) => (
              <button
                key={dest.value}
                type="button"
                onClick={() => setSelectedDestination(dest.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                  selectedDestination === dest.value
                    ? "bg-[#0D2C24] text-white shadow-xs"
                    : "bg-[#F3F1ED] text-[#52525B] hover:text-[#111111] hover:bg-[#EBE7DF]"
                }`}
              >
                {dest.label}
              </button>
            ))}
          </div>

          {/* Reset Action */}
          {(selectedDestination || selectedDuration || maxBudget < 200000) && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] hover:underline self-start lg:self-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Detailed Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-5 mt-5 border-t border-[#E4E2DD]/70">
          {/* Duration Selector */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
              Duration Window
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full bg-white border border-[#E4E2DD] rounded-xl px-3.5 py-2 text-xs text-[#111111] font-medium focus:outline-none focus:border-[#0D2C24] transition-colors"
            >
              <option value="">Any Length of Stay</option>
              <option value="1-5">1 to 5 Days (Escape)</option>
              <option value="6-8">6 to 8 Days (Signature)</option>
              <option value="9+">9+ Days (Grand Circuit)</option>
            </select>
          </div>

          {/* Budget Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
                Max Budget (Per Guest)
              </label>
              <span className="text-xs font-medium text-[#0D2C24] tabular-nums">
                Up to ₹{maxBudget.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min="80000"
              max="200000"
              step="5000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-[#0D2C24] cursor-pointer"
            />
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white border border-[#E4E2DD] rounded-xl px-3.5 py-2 text-xs text-[#111111] font-medium focus:outline-none focus:border-[#0D2C24] transition-colors"
            >
              <option value="featured">Curated Order</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="duration">Duration: Short to Long</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      {filteredPackages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E4E2DD] p-8 shadow-card">
          <div className="w-12 h-12 rounded-xl bg-[#F3F1ED] text-[#0D2C24] flex items-center justify-center mx-auto mb-3">
            <Filter className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-xl font-bold text-[#111111]">
            No Journeys Match Selected Criteria
          </h3>
          <p className="mt-1 text-xs text-[#52525B] max-w-sm mx-auto">
            Try adjusting your budget or selecting a different destination.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="btn btn-secondary text-xs uppercase tracking-wider font-semibold rounded-xl mt-5 px-5 py-2"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPackages.map((pkg) => {
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

                    <p className="mt-2.5 text-sm text-[#52525B] font-normal line-clamp-2 leading-relaxed">
                      {pkg.overview}
                    </p>

                    {/* Inclusions Row */}
                    <div className="mt-4 pt-3 border-t border-[#F3F1ED] flex flex-wrap gap-1.5">
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
      )}
    </div>
  );
}
