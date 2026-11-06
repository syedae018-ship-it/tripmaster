import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BarChart3, TrendingUp, Users, Compass, Eye, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics & Reports | Trip Master Admin",
};

export default async function AdminAnalyticsPage() {
  const packages = await prisma.package.findMany({
    select: {
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
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Phase 6 Analytics Shell Ready</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#082F24]">
            Performance & Traffic Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track package interest, page view counts, conversion rates, and revenue performance.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        <h3 className="font-heading text-xl font-bold text-[#082F24]">
          Package Popularity & Inquiries Ledger
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF8F5] text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Package Title</th>
                <th className="py-3.5 px-6">Destination</th>
                <th className="py-3.5 px-6 text-center">Total Views</th>
                <th className="py-3.5 px-6 text-center">Inquiries Logged</th>
                <th className="py-3.5 px-6 text-center">Bookings Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {packages.map((pkg, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    {pkg.title}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500">
                    {pkg.destination}
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-[#082F24]">
                    {pkg.viewsCount}
                  </td>
                  <td className="py-4 px-6 text-center font-semibold text-slate-700">
                    {pkg._count.inquiries}
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-emerald-800">
                    {pkg._count.bookings}
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

