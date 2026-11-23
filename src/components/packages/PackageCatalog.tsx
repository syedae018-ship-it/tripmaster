"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  ArrowRight,
  Filter,
  RotateCcw,
  ChevronDown,
  SlidersHorizontal,
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

function normalizeDuration(d: string): string {
  const val = (d || "").toLowerCase().trim();
  if (val === "short" || val === "1-5") return "1-5";
  if (val === "medium" || val === "6-8" || val === "6-7") return "6-8";
  if (val === "long" || val === "9+" || val === "8+") return "9+";
  return val;
}

export function PackageCatalog({
  initialPackages,
  initialDestination = "",
  initialDuration = "",
  initialMaxBudget,
}: {
  initialPackages: PackageItem[];
  initialDestination?: string;
  initialDuration?: string;
  initialMaxBudget?: number;
}) {
  const [selectedDestination, setSelectedDestination] = useState<string>(
    initialDestination.toLowerCase() === "all" ? "" : initialDestination
  );
  const [selectedDuration, setSelectedDuration] = useState<string>(
    normalizeDuration(initialDuration)
  );
  const [maxBudget, setMaxBudget] = useState<number>(
    initialMaxBudget ?? 200000
  );
  const [sortBy, setSortBy] = useState<string>("featured");
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Dynamically resolve all destination options from packages
  const destinations = useMemo(() => {
    const list = [
      { label: "All Regions", value: "" },
      { label: "Kashmir", value: "Kashmir" },
      { label: "Kerala", value: "Kerala" },
      { label: "Andaman", value: "Andaman" },
      { label: "Rajasthan", value: "Rajasthan" },
    ];

    const known = new Set(list.map((d) => d.value.toLowerCase()).filter(Boolean));

    initialPackages.forEach((pkg) => {
      if (!pkg.destination) return;
      const primary = pkg.destination.split(",")[0].trim();
      const lower = primary.toLowerCase();
      if (!known.has(lower)) {
        known.add(lower);
        list.push({ label: primary, value: primary });
      }
    });

    return list;
  }, [initialPackages]);

  // Filtering & Sorting logic
  const filteredPackages = useMemo(() => {
    return initialPackages
      .filter((pkg) => {
        // Destination filter
        if (
          selectedDestination &&
          selectedDestination.toLowerCase() !== "all" &&
          !pkg.destination.toLowerCase().includes(selectedDestination.toLowerCase())
        ) {
          return false;
        }

        // Duration filter
        const normDuration = normalizeDuration(selectedDuration);
        if (normDuration === "1-5" && pkg.durationDays > 5) return false;
        if (
          normDuration === "6-8" &&
          (pkg.durationDays < 6 || pkg.durationDays > 8)
        )
          return false;
        if (normDuration === "9+" && pkg.durationDays < 9) return false;

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

  const hasActiveFilters = Boolean(
    (selectedDestination && selectedDestination.toLowerCase() !== "all") ||
    selectedDuration ||
    maxBudget < 200000 ||
    sortBy !== "featured"
  );

  const resetFilters = () => {
    setSelectedDestination("");
    setSelectedDuration("");
    setMaxBudget(200000);
    setSortBy("featured");
    setShowMobileFilters(false);
  };

  const isDestinationSelected = (destValue: string) => {
    if (!selectedDestination || selectedDestination.toLowerCase() === "all") {
      return !destValue;
    }
    if (!destValue) return false;
    return (
      selectedDestination.toLowerCase() === destValue.toLowerCase() ||
      selectedDestination.toLowerCase().includes(destValue.toLowerCase()) ||
      destValue.toLowerCase().includes(selectedDestination.toLowerCase())
    );
  };

  const detailedFilterCount =
    (selectedDuration ? 1 : 0) +
    (maxBudget < 200000 ? 1 : 0) +
    (sortBy !== "featured" ? 1 : 0);

  return (
    <div className="py-8 sm:py-12 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 font-sans">
      {/* Top Filter & Sorter Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-card border border-[#E4E2DD] mb-6 sm:mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg sm:text-2xl font-bold text-[#111111] tracking-tight">
                Filter Curated Journeys
              </h2>
              <p className="text-xs text-[#52525B] mt-0.5 font-medium tabular-nums">
                Showing {filteredPackages.length} of {initialPackages.length} available itineraries
              </p>
            </div>

            {/* Desktop Reset Action (visible on lg when filters active) */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Desktop Destination Segment Buttons */}
          <div className="hidden sm:flex flex-wrap items-center gap-1.5">
            {destinations.map((dest) => {
              const active = isDestinationSelected(dest.value);
              return (
                <button
                  key={dest.value || "all"}
                  type="button"
                  onClick={() => setSelectedDestination(dest.value)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    active
                      ? "bg-[#0D2C24] text-white shadow-xs"
                      : "bg-[#F3F1ED] text-[#52525B] hover:text-[#111111] hover:bg-[#EBE7DF]"
                  }`}
                >
                  {dest.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Filter Controls Bar: Compact Dropdown + Filter Toggle */}
          <div className="sm:hidden flex items-center gap-2 w-full pt-1">
            {/* Space-efficient Region Dropdown Menu Button */}
            <div className="relative flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1.5 bg-[#F3F1ED] hover:bg-[#EBE7DF] border border-[#E4E2DD] rounded-xl px-3 py-2 text-xs font-semibold text-[#111111] transition-colors">
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-[#0D2C24] shrink-0" />
                  <span className="truncate">
                    {destinations.find((d) => isDestinationSelected(d.value))?.label || "All Regions"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
              </div>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-base"
                aria-label="Filter by region"
              >
                {destinations.map((dest) => (
                  <option key={dest.value || "all"} value={dest.value}>
                    {dest.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filters Toggle Button */}
            <button
              type="button"
              onClick={() => setShowMobileFilters((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors shrink-0 ${
                showMobileFilters || detailedFilterCount > 0
                  ? "bg-[#0D2C24] text-white border-[#0D2C24]"
                  : "bg-[#F3F1ED] text-[#52525B] border-[#E4E2DD] hover:text-[#111111]"
              }`}
              aria-expanded={showMobileFilters}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {detailedFilterCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-400 text-[#0D2C24] rounded-full text-[10px] font-bold">
                  {detailedFilterCount}
                </span>
              )}
            </button>

            {/* Mobile Reset Action */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="p-2 rounded-xl text-[#D97706] hover:bg-amber-50 border border-amber-200 shrink-0 transition-colors"
                title="Reset Filters"
                aria-label="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tablet Reset Action (visible on sm..lg) */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="hidden sm:inline-flex lg:hidden items-center gap-1.5 text-xs font-semibold text-[#D97706] hover:underline self-start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Detailed Controls Row */}
        <div
          className={`${
            showMobileFilters ? "grid" : "hidden sm:grid"
          } grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-[#E4E2DD]/70`}
        >
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
              min="50000"
              max="250000"
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
        <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-[#E4E2DD] p-6 sm:p-8 shadow-card space-y-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0D2C24]/5 text-[#0D2C24] flex items-center justify-center mx-auto border border-[#0D2C24]/10">
            <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-[#0D2C24]" />
          </div>
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#111111]">
              No Matching Itineraries Found
            </h3>
            <p className="mt-1.5 text-xs text-[#52525B] max-w-sm mx-auto leading-relaxed">
              We couldn&apos;t find any journeys matching your current filter selections. Try broadening your budget or choosing another destination.
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="btn btn-secondary min-h-[40px] sm:min-h-[44px] text-xs uppercase tracking-wider font-semibold rounded-xl px-5 sm:px-6 py-2 sm:py-2.5 inline-flex items-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {filteredPackages.map((pkg) => {
            const price = pkg.discountedPrice || pkg.basePrice;
            const primaryDestination = pkg.destination.split(",")[0].trim();

            return (
              <article
                key={pkg.id}
                className="group bg-white rounded-xl sm:rounded-2xl border border-[#E4E2DD] shadow-card hover:shadow-elevation transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Photo Frame */}
                <Link
                  href={`/packages/${pkg.slug}`}
                  className="block relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-[#F3F1ED]"
                >
                  <img
                    src={pkg.featuredImage}
                    alt={pkg.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80";
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Destination badge */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black/65 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/20 text-[10px] sm:text-[11px] font-medium text-white flex items-center gap-1 shadow-sm max-w-[58%] sm:max-w-none">
                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 shrink-0" />
                    <span className="truncate">{primaryDestination}</span>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/65 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/20 text-[10px] sm:text-[11px] font-sans tabular-nums text-white flex items-center gap-1 shadow-sm shrink-0">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/80 shrink-0" />
                    <span>
                      {pkg.durationDays}D/{pkg.durationNights}N
                    </span>
                  </div>
                </Link>

                {/* Card Body */}
                <div className="p-3 sm:p-5 lg:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-sm sm:text-lg lg:text-xl font-bold text-[#111111] group-hover:text-[#0D2C24] transition-colors leading-snug tracking-tight line-clamp-2">
                      <Link href={`/packages/${pkg.slug}`}>{pkg.title}</Link>
                    </h3>

                    <p className="hidden sm:block mt-2 text-xs sm:text-sm text-[#52525B] font-normal line-clamp-2 leading-relaxed">
                      {pkg.overview}
                    </p>

                    {/* Inclusions Row */}
                    {Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 && (
                      <div className="mt-2 sm:mt-3 sm:pt-2.5 sm:border-t sm:border-[#F3F1ED] flex flex-wrap gap-1 sm:gap-1.5">
                        {/* Mobile: 1 compact highlight tag */}
                        <span className="sm:hidden bg-[#F3F1ED] text-[#52525B] px-1.5 py-0.5 rounded text-[10px] font-medium border border-[#E4E2DD]/60 truncate max-w-full">
                          {pkg.inclusions[0]}
                        </span>
                        {/* Tablet/Desktop: Top 2-3 tags */}
                        {pkg.inclusions.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="hidden sm:inline-block bg-[#F3F1ED] text-[#52525B] px-2 py-0.5 rounded-md text-[11px] font-medium border border-[#E4E2DD]/60"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pricing Strip & Action Button */}
                  <div className="mt-3 pt-2.5 sm:mt-5 sm:pt-4 border-t border-[#E4E2DD] flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3">
                    <div className="min-w-0">
                      <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#52525B] block">
                        Tariff From
                      </span>
                      <div className="flex flex-wrap items-baseline gap-1 sm:gap-1.5 mt-0.5">
                        <span className="price-display text-base sm:text-xl lg:text-2xl font-bold text-[#111111] tabular-nums">
                          ₹{price.toLocaleString("en-IN")}
                        </span>
                        {pkg.discountedPrice && pkg.discountedPrice < pkg.basePrice && (
                          <span className="text-[10px] sm:text-xs text-[#71717A] line-through tabular-nums">
                            ₹{pkg.basePrice.toLocaleString("en-IN")}
                          </span>
                        )}
                        <span className="text-[10px] sm:text-xs text-[#52525B] whitespace-nowrap">
                          / guest
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/packages/${pkg.slug}`}
                      className="btn btn-secondary text-[11px] sm:text-xs uppercase tracking-wider font-semibold rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 min-h-[34px] sm:min-h-[38px] inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform w-full sm:w-auto shrink-0"
                    >
                      <span className="sm:hidden">Explore</span>
                      <span className="hidden sm:inline">View Itinerary</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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
