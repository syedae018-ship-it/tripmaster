"use client";

import { useState } from "react";
import { CreditCard, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { PipelineSlice } from "@/lib/admin/analytics";

interface BookingPipelineDonutProps {
  data: PipelineSlice[];
}

export function BookingPipelineDonut({ data }: BookingPipelineDonutProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
        No booking pipeline records available.
      </div>
    );
  }

  const totalAmount = data.reduce((s, item) => s + item.amount, 0);
  const totalCount = data.reduce((s, item) => s + item.count, 0);

  // SVG Donut geometry
  const size = 200;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDasharray and strokeDashoffset for each segment
  let accumulatedPercent = 0;
  const segments = data.map((item, idx) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += item.percentage;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
      idx,
    };
  });

  const activeItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
            Booking Pipeline Distribution
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
            {totalCount} Total
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Breakdown of expeditions across payment clearance and fulfillment.
        </p>
      </div>

      {/* Donut and Center Display */}
      <div className="flex flex-col sm:flex-row items-center gap-6 py-1">
        <div className="relative w-[180px] h-[180px] shrink-0 mx-auto sm:mx-0">
          <svg
            width={180}
            height={180}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90 select-none w-full h-full"
          >
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Segment Arcs */}
            {segments.map((seg) => {
              const isHovered = hoveredIndex === seg.idx;
              return (
                <circle
                  key={seg.status}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(seg.idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Center Callout Metric */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 pointer-events-none">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {activeItem ? activeItem.label : "Total Pipeline"}
            </span>
            <div className="text-lg font-heading font-bold text-slate-900 tabular-nums">
              {activeItem
                ? `₹${(activeItem.amount / 100000).toFixed(1)}L`
                : `₹${(totalAmount / 100000).toFixed(1)}L`}
            </div>
            <span className="text-[11px] text-blue-700 font-semibold">
              {activeItem ? `${activeItem.percentage}% share` : `${totalCount} Expeditions`}
            </span>
          </div>
        </div>

        {/* Quick Legend Pillars */}
        <div className="flex-1 w-full space-y-1.5">
          {data.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={item.status}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-between text-xs cursor-pointer ${
                  isHovered ? "bg-slate-50 ring-1 ring-slate-200" : "hover:bg-slate-50/70"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block leading-tight">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.count} bookings • {item.percentage}%
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 tabular-nums block text-xs">
                    ₹{item.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Payment Settlement Health</span>
        <span className="font-semibold text-emerald-700 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          94.2% Settlement Rate
        </span>
      </div>
    </div>
  );
}
