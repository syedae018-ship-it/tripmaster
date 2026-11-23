"use client";

import { useState } from "react";
import { TrendingUp, Calendar, ArrowUpRight, BarChart2 } from "lucide-react";
import { MonthlyRevenuePoint } from "@/lib/admin/analytics";

interface MonthlyRevenueChartProps {
  data: MonthlyRevenuePoint[];
}

export function MonthlyRevenueChart({ data }: MonthlyRevenueChartProps) {
  const [activeMetric, setActiveMetric] = useState<"revenue" | "bookings">("revenue");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
        No monthly performance data recorded yet.
      </div>
    );
  }

  // Chart Dimensions
  const svgWidth = 740;
  const svgHeight = 260;
  const paddingX = 50;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Max scale calculation
  const values = data.map((d) => (activeMetric === "revenue" ? d.revenue : d.bookingsCount));
  const targetValues = data.map((d) => (activeMetric === "revenue" ? d.target : Math.round(d.target / 120000)));
  const maxValue = Math.max(...values, ...targetValues) * 1.15 || 100;

  // Coordinate mapping
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const val = activeMetric === "revenue" ? d.revenue : d.bookingsCount;
    const y = paddingTop + chartHeight - (val / maxValue) * chartHeight;
    return { x, y, data: d, val };
  });

  const targetPoints = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const targetVal = activeMetric === "revenue" ? d.target : Math.round(d.target / 120000);
    const y = paddingTop + chartHeight - (targetVal / maxValue) * chartHeight;
    return { x, y };
  });

  // Generate smooth SVG Catmull-Rom or cubic bezier curve
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return path;
  };

  const smoothLinePath = generateSmoothPath(points);
  const smoothAreaPath = `${smoothLinePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;
  const targetLinePath = generateSmoothPath(targetPoints);

  // Key Summary stats
  const totalRevenuePeriod = data.reduce((s, d) => s + d.revenue, 0);
  const totalBookingsPeriod = data.reduce((s, d) => s + d.bookingsCount, 0);
  const latestGrowth = data[data.length - 1]?.growthPercent || 15;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
      {/* Chart Top Header & Metric View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
              Monthly Revenue & Intake Performance
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono tabular-nums">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              +{latestGrowth}% MoM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Realized cash collection vs fiscal quota across 6 trailing months.
          </p>
        </div>

        {/* Metric Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 self-start sm:self-auto">
          <button
            onClick={() => setActiveMetric("revenue")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMetric === "revenue"
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Gross Revenue (₹)
          </button>
          <button
            onClick={() => setActiveMetric("bookings")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMetric === "bookings"
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Expeditions Count
          </button>
        </div>
      </div>

      {/* Primary KPI Strip above Chart */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-y border-slate-100">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            6-Month Aggregate
          </span>
          <div className="text-lg sm:text-xl font-heading font-bold text-slate-900 tabular-nums">
            {activeMetric === "revenue"
              ? `₹${totalRevenuePeriod.toLocaleString("en-IN")}`
              : `${totalBookingsPeriod} Bookings`}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Monthly Run-Rate
          </span>
          <div className="text-lg sm:text-xl font-heading font-bold text-emerald-700 tabular-nums">
            {activeMetric === "revenue"
              ? `₹${Math.round(totalRevenuePeriod / data.length).toLocaleString("en-IN")}`
              : `${(totalBookingsPeriod / data.length).toFixed(1)} / mo`}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Current Month Intake
          </span>
          <div className="text-lg sm:text-xl font-heading font-bold text-slate-900 tabular-nums">
            {activeMetric === "revenue"
              ? `₹${data[data.length - 1]?.revenue.toLocaleString("en-IN")}`
              : `${data[data.length - 1]?.bookingsCount} Journeys`}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Target Realization
          </span>
          <div className="text-lg sm:text-xl font-heading font-bold text-blue-700 tabular-nums">
            {Math.round(
              (data[data.length - 1]?.revenue / (data[data.length - 1]?.target || 1)) * 100
            )}
            %
          </div>
        </div>
      </div>

      {/* Responsive SVG Chart Canvas */}
      <div className="relative w-full aspect-[740/260] min-h-[200px]">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible select-none"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Emerald luxury gradient for cash collected */}
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#10B981" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.00" />
            </linearGradient>

            {/* Target Line Gradient - Clean Slate */}
            <linearGradient id="targetGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#64748B" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingTop + chartHeight * pct;
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Target Benchmark Line (Dashed Slate) */}
          <path
            d={targetLinePath}
            fill="none"
            stroke="url(#targetGradient)"
            strokeWidth="2"
            strokeDasharray="5 5"
            strokeLinecap="round"
          />

          {/* Area Gradient Fill */}
          <path d={smoothAreaPath} fill="url(#emeraldGradient)" />

          {/* Foreground Bold Emerald Spline */}
          <path
            d={smoothLinePath}
            fill="none"
            stroke="#059669"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Nodes */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={i}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Node Outer Ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 8 : 5}
                  fill="#FFFFFF"
                  stroke="#047857"
                  strokeWidth={isHovered ? 3.5 : 2.5}
                  className="transition-all duration-200"
                />

                {/* X-Axis Month Label */}
                <text
                  x={pt.x}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  className={`text-[11px] font-sans font-medium transition-colors ${
                    isHovered
                      ? "fill-slate-900 font-bold"
                      : "fill-slate-500"
                  }`}
                >
                  {pt.data.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip card */}
        {hoveredIndex !== null && (
          <div
            className="absolute -top-3 z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-150"
            style={{
              left: `${
                ((points[hoveredIndex].x) / svgWidth) * 100
              }%`,
            }}
          >
            <div className="bg-slate-900 text-white rounded-2xl p-3 shadow-xl border border-slate-700/80 min-w-[160px]">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {data[hoveredIndex].fullMonth}
              </div>
              <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                ₹{data[hoveredIndex].revenue.toLocaleString("en-IN")}
              </div>
              <div className="text-xs text-slate-300 mt-1 flex items-center justify-between border-t border-slate-800 pt-1">
                <span>Bookings:</span>
                <span className="font-semibold text-white">
                  {data[hoveredIndex].bookingsCount}
                </span>
              </div>
              <div className="text-[11px] text-amber-300 flex items-center justify-between">
                <span>Target:</span>
                <span className="font-mono">
                  ₹{data[hoveredIndex].target.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 rounded-full bg-[#047857]" />
            <span className="font-medium text-slate-700">Actual Realized Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-0.5 border-t-2 border-dashed border-[#c5a059]" />
            <span className="font-medium text-slate-700">Monthly Concierge Target</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Interactive SVG Engine • Live Data Sync
        </div>
      </div>
    </div>
  );
}
