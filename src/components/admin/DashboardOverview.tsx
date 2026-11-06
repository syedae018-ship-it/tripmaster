"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  MessageSquareText,
  CreditCard,
  TrendingUp,
  PlusCircle,
  ExternalLink,
  Clock,
  Sparkles,
  ArrowUpRight,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  CalendarClock,
  Send,
  Users,
} from "lucide-react";

interface UrgentInquiry {
  id: string;
  destination: string;
  travelDate: string | null;
  paxCount: number;
  status: string;
  followUpDate: string | null;
  followUpNote: string | null;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    whatsappNumber: string | null;
    email: string;
    city: string | null;
  };
  package: {
    id: string;
    title: string;
    destination: string;
  } | null;
}

interface DashboardData {
  kpis: {
    totalPackages: number;
    activePackages: number;
    totalInquiries: number;
    inquiriesToday: number;
    totalBookings: number;
    activeBookings: number;
    totalRevenueCollected: number;
    totalOutstandingBalance: number;
    overdueCount?: number;
    todayFollowUpCount?: number;
  };
  followUpAlerts?: {
    overdue: UrgentInquiry[];
    today: UrgentInquiry[];
  };
  recentInquiries: Array<{
    id: string;
    destination: string;
    travelDate: string | null;
    paxCount: number;
    status: string;
    createdAt: string;
    customer: {
      id: string;
      name: string;
      email: string;
      phone: string;
      city: string | null;
    };
    package: {
      id: string;
      title: string;
      slug: string;
    } | null;
  }>;
}

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res);
        }
      })
      .catch((err) => console.error("Error loading dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalPackages: 0,
    activePackages: 0,
    totalInquiries: 0,
    inquiriesToday: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalRevenueCollected: 0,
    totalOutstandingBalance: 0,
    overdueCount: 0,
    todayFollowUpCount: 0,
  };

  const overdue = data?.followUpAlerts?.overdue || [];
  const todayDue = data?.followUpAlerts?.today || [];
  const hasUrgentFollowUps = overdue.length > 0 || todayDue.length > 0;

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#082F24]">
            Concierge Operations Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time pipeline overview, guest follow-up priorities, bookings, and revenue metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-900 border border-amber-300 font-medium text-sm hover:bg-amber-500/20 transition-all"
          >
            <CalendarClock className="w-4 h-4 text-amber-700" />
            CRM Pipeline
          </Link>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-medium text-sm hover:bg-slate-200 transition-all"
          >
            <Users className="w-4 h-4 text-slate-600" />
            Customers
          </Link>
          <Link
            href="/admin/packages/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#082F24] text-white font-medium text-sm hover:bg-[#0c4434] transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-[#dfbd75]" />
            New Package
          </Link>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active Packages */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#dfbd75]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Luxury Packages
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {kpis.activePackages}
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              published of {kpis.totalPackages} total
            </span>
          </div>
          <div className="mt-3 text-xs text-emerald-700 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Ready for instant guest quotes</span>
          </div>
        </div>

        {/* Inquiries */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#dfbd75]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Guest Inquiries
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <MessageSquareText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {kpis.totalInquiries}
            </span>
            {kpis.inquiriesToday > 0 ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 font-mono tabular-nums">
                +{kpis.inquiriesToday} new today
              </span>
            ) : (
              <span className="text-xs text-slate-500">All-time</span>
            )}
          </div>
          <div className="mt-3 text-xs text-blue-700 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Average response: &lt; 30 mins</span>
          </div>
        </div>

        {/* Active Bookings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#dfbd75]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Bookings
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {kpis.activeBookings}
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              of {kpis.totalBookings} total
            </span>
          </div>
          <div className="mt-3 text-xs text-amber-700 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>High guest conversion rate</span>
          </div>
        </div>

        {/* Revenue Collected */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#dfbd75]/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Revenue Collected
            </span>
            <div className="p-2.5 rounded-xl bg-[#0F2E26]/10 text-[#0F2E26]">
              <TrendingUp className="w-5 h-5 text-[#C59B27]" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              ₹{kpis.totalRevenueCollected.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
            <span>Outstanding balance:</span>
            <span className="font-semibold text-amber-700 font-mono tabular-nums">
              ₹{kpis.totalOutstandingBalance.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* TODAY'S FOLLOW-UPS & OVERDUE TASKS WIDGET */}
      {hasUrgentFollowUps && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-50/40 via-white to-red-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 font-bold">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-xl font-bold text-[#082F24]">
                    Follow-Up Tasks & Concierge Reminders
                  </h2>
                  {overdue.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 animate-pulse">
                      {overdue.length} Overdue
                    </span>
                  )}
                  {todayDue.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      {todayDue.length} Due Today
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-priority guest inquiries needing concierge callback or custom itinerary quotes today.
                </p>
              </div>
            </div>

            <Link
              href="/admin/inquiries"
              className="text-xs font-semibold text-[#082F24] hover:text-[#dfbd75] inline-flex items-center gap-1 group self-start sm:self-auto"
            >
              Open Full Kanban Pipeline
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Overdue Items */}
            {overdue.map((item) => {
              const waNumber = (item.customer.whatsappNumber || item.customer.phone).replace(/\D/g, "");
              const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
                `Hello ${item.customer.name}, warm greetings from Trip Master Luxury Concierge regarding your inquiry for ${item.destination}.`
              )}`;

              return (
                <div
                  key={item.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-red-50/20 hover:bg-red-50/40 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="mt-1 w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/customers/${item.customer.id}`}
                          className="font-semibold text-slate-900 hover:text-[#082F24] hover:underline"
                        >
                          {item.customer.name}
                        </Link>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-medium text-slate-600">
                          {item.destination}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-red-100 text-red-700">
                          OVERDUE: {item.followUpDate ? new Date(item.followUpDate).toLocaleDateString("en-IN") : ""}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 italic">
                        {item.followUpNote || "Follow up regarding quotation and itinerary preferences."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-600" />
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${item.customer.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      Call
                    </a>
                    <Link
                      href="/admin/inquiries"
                      className="px-3 py-1.5 rounded-lg bg-[#082F24] text-white text-xs font-medium hover:bg-[#0c4434] transition-colors"
                    >
                      View Lead
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Today Due Items */}
            {todayDue.map((item) => {
              const waNumber = (item.customer.whatsappNumber || item.customer.phone).replace(/\D/g, "");
              const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
                `Hello ${item.customer.name}, greetings from Trip Master Concierge! Just checking in regarding your travel plan to ${item.destination}.`
              )}`;

              return (
                <div
                  key={item.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-50/15 hover:bg-amber-50/30 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="mt-1 w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/customers/${item.customer.id}`}
                          className="font-semibold text-slate-900 hover:text-[#082F24] hover:underline"
                        >
                          {item.customer.name}
                        </Link>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-medium text-slate-600">
                          {item.destination}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-amber-100 text-amber-800">
                          DUE TODAY
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 italic">
                        {item.followUpNote || "Scheduled discussion for custom dates & hotel options."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-600" />
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${item.customer.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      Call
                    </a>
                    <Link
                      href="/admin/inquiries"
                      className="px-3 py-1.5 rounded-lg bg-[#082F24] text-white text-xs font-medium hover:bg-[#0c4434] transition-colors"
                    >
                      View Lead
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Inquiries Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-[#082F24]">
              Recent Guest Inquiries
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest inquiries received from the public website concierge portal
            </p>
          </div>
          <Link
            href="/admin/inquiries"
            className="text-xs font-semibold text-[#082F24] hover:text-[#dfbd75] inline-flex items-center gap-1 group"
          >
            View All Inquiries
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {data?.recentInquiries && data.recentInquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-50/95 backdrop-blur z-10 text-slate-500 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Guest</th>
                  <th className="py-3 px-4">Destination / Package</th>
                  <th className="py-3 px-4">Travel Date</th>
                  <th className="py-3 px-4">Party</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentInquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {inq.customer.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 font-mono tabular-nums">
                        <span>{inq.customer.phone}</span>
                        {inq.customer.city && (
                          <span className="text-slate-400">• {inq.customer.city}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">
                        {inq.package?.title || inq.destination}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {inq.destination}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono tabular-nums">
                      {inq.travelDate ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {inq.travelDate}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic font-sans">Flexible</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-xs font-semibold">
                      {inq.paxCount} {inq.paxCount > 1 ? "Guests" : "Guest"}
                    </td>
                    <td className="py-3 px-4">
                      {inq.status === "NEW" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          New Lead
                        </span>
                      ) : inq.status === "CONTACTED" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Contacted
                        </span>
                      ) : inq.status === "QUOTED" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          Quoted
                        </span>
                      ) : inq.status === "CONVERTED" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Converted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          {inq.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-slate-400 whitespace-nowrap font-mono tabular-nums">
                      {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <MessageSquareText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-medium">No inquiries received yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              New website bookings and inquiries will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
