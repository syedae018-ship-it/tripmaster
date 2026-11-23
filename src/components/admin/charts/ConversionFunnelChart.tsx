"use client";

import { useState } from "react";
import { Filter, Users, ArrowDown, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { FunnelStage } from "@/lib/admin/analytics";

interface ConversionFunnelChartProps {
  data: FunnelStage[];
}

export function ConversionFunnelChart({ data }: ConversionFunnelChartProps) {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
        No inquiry funnel metrics recorded yet.
      </div>
    );
  }

  const initialCount = data[0]?.count || 1;
  const finalCount = data[data.length - 1]?.count || 0;
  const overallConversion = ((finalCount / initialCount) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
              Inquiry Conversion Funnel
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              <CheckCircle2 className="w-3 h-3 text-blue-600" />
              {overallConversion}% Overall Win Rate
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Conversion velocity from inquiry intake to finalized itinerary and deposit settlement.
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Initial Leads Pool
          </span>
          <span className="text-base font-heading font-bold text-slate-900 tabular-nums">
            {initialCount} Travellers
          </span>
        </div>
      </div>

      {/* Stepped Funnel Visualization */}
      <div className="space-y-2.5">
        {data.map((stage, idx) => {
          const isLast = idx === data.length - 1;
          const isSelected = activeStage === idx;
          const barWidthPercent = Math.max(stage.conversionPercent, 18);

          return (
            <div
              key={stage.stage}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "border-blue-600 ring-2 ring-blue-500/10 bg-blue-50/20"
                  : "border-slate-200/80 bg-white hover:border-slate-300"
              }`}
              onMouseEnter={() => setActiveStage(idx)}
              onMouseLeave={() => setActiveStage(null)}
            >
              {/* Stage Top Line */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-[11px] text-white shadow-2xs"
                    style={{ backgroundColor: stage.color }}
                  >
                    {stage.stage}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                      {stage.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {stage.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono tabular-nums block">
                      {stage.count}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Travellers
                    </span>
                  </div>

                  <div className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono font-bold text-xs">
                    {stage.conversionPercent}%
                  </div>
                </div>
              </div>

              {/* Progress Funnel Bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-500 relative"
                  style={{
                    width: `${barWidthPercent}%`,
                    backgroundColor: stage.color,
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-30" />
                </div>
              </div>

              {/* Micro SLA badge & step transition */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {stage.slaText}
                </span>

                {idx > 0 && (
                  <span className="text-slate-400">
                    Step Retention:{" "}
                    <strong className="text-slate-700 font-mono">
                      {stage.stepConversion}%
                    </strong>
                    {stage.dropoffPercent > 0 && (
                      <span className="text-rose-600 font-mono ml-1.5">
                        (-{stage.dropoffPercent}% drop)
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Concierge Velocity Benchmark */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium text-slate-700">
            Speed to Quote: <strong>&lt; 3.2 hours average</strong> (industry benchmark 24h)
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Active Concierge SLA Compliant</span>
        </div>
      </div>
    </div>
  );
}
