"use client";

import { useState } from "react";
import { MapPin, TrendingUp, Eye, MessageSquareText, CreditCard, Award } from "lucide-react";
import { DestinationStat } from "@/lib/admin/analytics";

interface TopDestinationsChartProps {
  data: DestinationStat[];
}

export function TopDestinationsChart({ data }: TopDestinationsChartProps) {
  const [sortBy, setSortBy] = useState<"revenue" | "inquiries" | "conversion">("revenue");

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
        No destination metrics recorded yet.
      </div>
    );
  }

  // Sorted list based on selected view
  const sortedDestinations = [...data].sort((a, b) => {
    if (sortBy === "revenue") return b.revenue - a.revenue;
    if (sortBy === "inquiries") return b.inquiries - a.inquiries;
    return b.conversionRate - a.conversionRate;
  });

  const maxRevenue = Math.max(...data.map((d) => d.revenue)) || 1;
  const maxInquiries = Math.max(...data.map((d) => d.inquiries)) || 1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
      {/* Header & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
              Top Destinations & Portfolios
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
              {data.length} Regions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparative revenue intake, inquiry momentum, and booking conversion by global region.
          </p>
        </div>

        {/* Sort Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 self-start sm:self-auto">
          <button
            onClick={() => setSortBy("revenue")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sortBy === "revenue"
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            By Revenue
          </button>
          <button
            onClick={() => setSortBy("inquiries")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sortBy === "inquiries"
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            By Leads
          </button>
          <button
            onClick={() => setSortBy("conversion")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sortBy === "conversion"
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Conversion %
          </button>
        </div>
      </div>

      {/* Destinations Ranking List */}
      <div className="space-y-2.5">
        {sortedDestinations.slice(0, 6).map((dest, idx) => {
          const barWidthPercent =
            sortBy === "revenue"
              ? Math.max(Math.round((dest.revenue / maxRevenue) * 100), 12)
              : Math.max(Math.round((dest.inquiries / maxInquiries) * 100), 12);

          return (
            <div
              key={dest.destination}
              className="p-3 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-2xs transition-all space-y-2"
            >
              {/* Destination Top Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                        {dest.destination}
                      </h4>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {dest.highlightBadge}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {dest.packagesCount} Curated Itineraries • {dest.views} Catalog Views
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="font-heading font-bold text-xs sm:text-sm text-slate-900 tabular-nums block">
                      ₹{dest.revenue.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Realized Gross
                    </span>
                  </div>

                  <div className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono font-bold text-xs">
                    {dest.conversionRate}% Conv
                  </div>
                </div>
              </div>

              {/* Progress Relative Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-700 to-blue-500 transition-all duration-500"
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>

              {/* Micro-metrics breakdown */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span className="flex items-center gap-1.5">
                  <MessageSquareText className="w-3.5 h-3.5 text-blue-500" />
                  <strong className="text-slate-700 font-mono">{dest.inquiries}</strong> leads logged
                </span>

                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <strong className="text-slate-700 font-mono">{dest.bookings}</strong> bookings finalized
                </span>

                <span className="text-slate-400 hidden sm:inline">
                  Avg Booking AOV: ₹{Math.round(dest.revenue / Math.max(dest.bookings, 1)).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
