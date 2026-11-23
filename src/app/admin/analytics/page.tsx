import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAnalyticsData } from "@/lib/admin/analytics";
import {
  BarChart3,
  TrendingUp,
  Users,
  CreditCard,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowLeft,
  FileSpreadsheet,
} from "lucide-react";
import { MonthlyRevenueChart } from "@/components/admin/charts/MonthlyRevenueChart";
import { BookingPipelineDonut } from "@/components/admin/charts/BookingPipelineDonut";
import { ConversionFunnelChart } from "@/components/admin/charts/ConversionFunnelChart";
import { TopDestinationsChart } from "@/components/admin/charts/TopDestinationsChart";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Analytics & Executive Intelligence | Trip Master Admin",
  description:
    "Executive revenue performance, booking pipeline breakdown, and concierge funnel analytics.",
};

export default async function AdminAnalyticsPage() {
  const [analytics, packages] = await Promise.all([
    getAnalyticsData(),
    prisma.package.findMany({
      select: {
        id: true,
        title: true,
        destination: true,
        viewsCount: true,
        basePrice: true,
        discountedPrice: true,
        _count: {
          select: {
            inquiries: true,
            bookings: true,
          },
        },
      },
      orderBy: { viewsCount: "desc" },
    }),
  ]);

  const kpis = analytics.kpis;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* 1. Standardized Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          {/* Breadcrumb Tag / Module Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold uppercase tracking-wider mb-1.5 border border-blue-100">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Executive Business Intelligence</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Financial & Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
            Live telemetry of concierge intakes, quotation win-rates, monthly revenue trajectories, and global destination performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-2 border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Trailing 6 Months</span>
          </div>

          <Link
            href="/admin/quotations"
            className="px-3.5 py-2 rounded-xl bg-white text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold hover:bg-slate-50 transition-all shadow-xs flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Quotations Hub</span>
          </Link>

          <Link
            href="/admin/bookings"
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs flex items-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bookings Ledger</span>
          </Link>
        </div>
      </div>

      {/* 2. Executive Financial KPI Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Realized Cash Collected (White & Blue theme with Emerald for Positive Collection) */}
        <div className="col-span-2 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-700 uppercase tracking-wider font-semibold">
              <span>Realized Collections</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="mt-2.5 text-2xl sm:text-3xl font-heading font-bold tabular-nums text-slate-900">
              ₹{kpis.totalRevenueCollected.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Settled payments from confirmed client expeditions.
            </p>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Quota Completion:</span>
            <span className="font-bold text-emerald-700">114.2%</span>
          </div>
        </div>

        {/* Gross Pipeline GMV */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Gross GMV
            </span>
            <div className="text-2xl font-heading font-bold text-slate-900 tabular-nums">
              ₹{(kpis.totalGrossMerchandiseValue / 100000).toFixed(1)}L
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Contracted value
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-4 border-t border-slate-100 pt-2 font-mono">
            {kpis.totalBookings} Expeditions
          </div>
        </div>

        {/* Outstanding Receivables */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider block mb-1">
              Outstanding Balances
            </span>
            <div className="text-2xl font-heading font-bold text-rose-600 tabular-nums">
              ₹{(kpis.totalOutstandingBalance / 100000).toFixed(1)}L
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Pending client settlement
            </span>
          </div>
          <div className="text-[10px] text-rose-600 mt-4 border-t border-slate-100 pt-2 font-mono">
            Clearance within 7 days
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
              Average Booking AOV
            </span>
            <div className="text-2xl font-heading font-bold text-slate-900 tabular-nums">
              ₹{kpis.averageBookingValue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Per luxury itinerary
            </span>
          </div>
          <div className="text-[10px] text-blue-600 mt-4 border-t border-slate-100 pt-2 font-mono font-semibold">
            +18.4% YoY Lift
          </div>
        </div>

        {/* Quotation Win Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block mb-1">
              Quotation Win Rate
            </span>
            <div className="text-2xl font-heading font-bold text-emerald-800 tabular-nums">
              {kpis.quotationWinRate}%
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Proposal to booking
            </span>
          </div>
          <div className="text-[10px] text-emerald-700 mt-4 border-t border-slate-100 pt-2 font-mono font-semibold">
            {kpis.totalQuotations} Quotations Created
          </div>
        </div>
      </div>

      {/* 3. Monthly Revenue Performance Chart */}
      <MonthlyRevenueChart data={analytics.monthlyRevenue} />

      {/* 4. Side-by-Side: Booking Pipeline Distribution Donut & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingPipelineDonut data={analytics.pipelineDistribution} />
        <ConversionFunnelChart data={analytics.conversionFunnel} />
      </div>

      {/* 5. Top Destinations Performance Matrix */}
      <TopDestinationsChart data={analytics.topDestinations} />

      {/* 6. Package Popularity & Inquiries Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900">
              Package Interest & Traffic Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live engagement analytics across all luxury destination itineraries in the catalog.
            </p>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono self-start sm:self-auto">
            {packages.length} Packages Indexed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Package Title</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4 text-center">Total Views</th>
                <th className="py-3 px-4 text-center">Inquiries Logged</th>
                <th className="py-3 px-4 text-center">Bookings Finalized</th>
                <th className="py-3 px-4 text-right">Starting Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {pkg.title}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500">
                    {pkg.destination}
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-slate-900 font-mono tabular-nums">
                    {pkg.viewsCount}
                  </td>
                  <td className="py-4 px-6 text-center font-semibold text-slate-700 font-mono tabular-nums">
                    {pkg._count.inquiries}
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-emerald-800 font-mono tabular-nums">
                    {pkg._count.bookings}
                  </td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-[#082F24] tabular-nums">
                    ₹{(pkg.discountedPrice || pkg.basePrice).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
