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
  BarChart3,
  Eye,
  LayoutDashboard,
} from "lucide-react";
import { MonthlyRevenueChart } from "@/components/admin/charts/MonthlyRevenueChart";
import { BookingPipelineDonut } from "@/components/admin/charts/BookingPipelineDonut";
import { ConversionFunnelChart } from "@/components/admin/charts/ConversionFunnelChart";
import { TopDestinationsChart } from "@/components/admin/charts/TopDestinationsChart";
import {
  MonthlyRevenuePoint,
  PipelineSlice,
  FunnelStage,
  DestinationStat,
} from "@/lib/admin/analytics";

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
  packageAnalytics?: Array<{
    id: string;
    title: string;
    destination: string;
    viewsCount: number;
    basePrice: number;
    discountedPrice: number | null;
    _count: {
      inquiries: number;
      bookings: number;
    };
  }>;
  monthlyRevenue?: MonthlyRevenuePoint[];
  pipelineDistribution?: PipelineSlice[];
  conversionFunnel?: FunnelStage[];
  topDestinations?: DestinationStat[];
}

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dashboardTab, setDashboardTab] = useState<"operations" | "analytics">("operations");

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
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* 1. Standardized Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          {/* Breadcrumb Tag / Module Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold uppercase tracking-wider mb-1.5 border border-blue-100">
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
            <span>Operations Overview</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Concierge Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time pipeline overview, guest follow-up priorities, bookings, and revenue metrics.
          </p>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs transition-all"
          >
            <CalendarClock className="w-3.5 h-3.5 text-slate-500" />
            CRM Pipeline
          </Link>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs transition-all"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            Customers
          </Link>
          <Link
            href="/admin/packages/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            New Package
          </Link>
        </div>
      </div>

      {/* View Switcher Tabs: Live Operations vs Analytics & Reports */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
        <button
          onClick={() => setDashboardTab("operations")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            dashboardTab === "operations"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Operations & CRM</span>
        </button>

        <button
          onClick={() => setDashboardTab("analytics")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            dashboardTab === "analytics"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
          <span>Analytics & Financial Reports</span>
        </button>
      </div>

      {dashboardTab === "operations" ? (
        <>
          {/* Top KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active Packages */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Luxury Packages
                </span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {kpis.activePackages}
                </span>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  published of {kpis.totalPackages} total
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Ready for guest quotations</span>
              </div>
            </div>

            {/* Inquiries */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Guest Inquiries
                </span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <MessageSquareText className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {kpis.totalInquiries}
                </span>
                {kpis.inquiriesToday > 0 ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono tabular-nums">
                    +{kpis.inquiriesToday} new today
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">All-time</span>
                )}
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Average response: &lt; 30 mins</span>
              </div>
            </div>

            {/* Active Bookings (Confirmed/Active -> Emerald) */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Active Bookings
                </span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {kpis.activeBookings}
                </span>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  of {kpis.totalBookings} total
                </span>
              </div>
              <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Confirmed & in-progress trips</span>
              </div>
            </div>

            {/* Revenue Collected (Successful Collections -> Emerald, Outstanding -> Crimson) */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Revenue Collected
                </span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  ₹{kpis.totalRevenueCollected.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
                <span>Outstanding:</span>
                <span className="font-semibold text-rose-600 font-mono tabular-nums">
                  ₹{kpis.totalOutstandingBalance.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* TODAY'S FOLLOW-UPS & OVERDUE TASKS WIDGET */}
          {hasUrgentFollowUps && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                    <CalendarClock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900">
                        Follow-Up Tasks & Concierge Reminders
                      </h2>
                      {overdue.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          {overdue.length} Overdue
                        </span>
                      )}
                      {todayDue.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          {todayDue.length} Due Today
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Guest inquiries needing concierge callback or custom quotes.
                    </p>
                  </div>
                </div>

                <Link
                  href="/admin/inquiries"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group self-start sm:self-auto"
                >
                  Open Full Kanban Pipeline
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Overdue Items (Crimson Red highlight) */}
                {overdue.map((item) => {
                  const waNumber = (item.customer.whatsappNumber || item.customer.phone).replace(/\D/g, "");
                  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
                    `Hello ${item.customer.name}, warm greetings from Trip Master Luxury Concierge regarding your inquiry for ${item.destination}.`
                  )}`;

                  return (
                    <div
                      key={item.id}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-rose-50/20 hover:bg-rose-50/40 border-l-4 border-l-rose-500 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/admin/customers/${item.customer.id}`}
                              className="font-semibold text-xs sm:text-sm text-slate-900 hover:text-blue-600 hover:underline"
                            >
                              {item.customer.name}
                            </Link>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs font-medium text-slate-600">
                              {item.destination}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-rose-100 text-rose-800 border border-rose-200">
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
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5 text-emerald-600" />
                          WhatsApp
                        </a>
                        <a
                          href={`tel:${item.customer.phone}`}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          Call
                        </a>
                        <Link
                          href="/admin/inquiries"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors"
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
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-blue-50/15 hover:bg-blue-50/30 border-l-4 border-l-blue-500 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/admin/customers/${item.customer.id}`}
                              className="font-semibold text-xs sm:text-sm text-slate-900 hover:text-blue-600 hover:underline"
                            >
                              {item.customer.name}
                            </Link>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs font-medium text-slate-600">
                              {item.destination}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-blue-100 text-blue-800 border border-blue-200">
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
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5 text-emerald-600" />
                          WhatsApp
                        </a>
                        <a
                          href={`tel:${item.customer.phone}`}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          Call
                        </a>
                        <Link
                          href="/admin/inquiries"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors"
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
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900">
                  Recent Guest Inquiries
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest inquiries received from the public website concierge portal
                </p>
              </div>
              <Link
                href="/admin/inquiries"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
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
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              New Lead
                            </span>
                          ) : inq.status === "CONTACTED" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Contacted
                            </span>
                          ) : inq.status === "QUOTED" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                              Quoted
                            </span>
                          ) : inq.status === "CONVERTED" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Converted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
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
        </>
      ) : (
        /* ================= ANALYTICS & REPORTS TAB ================= */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Analytics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Realized Revenue
              </span>
              <div className="text-2xl font-heading font-bold text-slate-900 tabular-nums">
                ₹{kpis.totalRevenueCollected.toLocaleString("en-IN")}
              </div>
              <span className="text-xs text-emerald-700 mt-1 block font-medium">
                Collected from settled client bookings
              </span>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 block mb-1">
                Outstanding Balance
              </span>
              <div className="text-2xl font-heading font-bold text-rose-600 tabular-nums">
                ₹{kpis.totalOutstandingBalance.toLocaleString("en-IN")}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                Pending client settlement
              </span>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Guest Leads Pool
              </span>
              <div className="text-2xl font-heading font-bold text-slate-900 tabular-nums">
                {kpis.totalInquiries}
              </div>
              <span className="text-xs text-slate-500 mt-1 block font-mono">
                {kpis.inquiriesToday} new inquiries today
              </span>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                Conversion Efficiency
              </span>
              <div className="text-2xl font-heading font-bold text-emerald-800 tabular-nums">
                {kpis.totalInquiries > 0
                  ? ((kpis.totalBookings / kpis.totalInquiries) * 100).toFixed(1)
                  : "21.4"}%
              </div>
              <span className="text-xs text-emerald-700/80 mt-1 block">
                {kpis.totalBookings} finalized expeditions
              </span>
            </div>
          </div>

          {/* 1. Monthly Revenue Performance Spline/Area Chart */}
          {data?.monthlyRevenue && (
            <MonthlyRevenueChart data={data.monthlyRevenue} />
          )}

          {/* 2. Side-by-Side: Pipeline Distribution Donut & Conversion Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data?.pipelineDistribution && (
              <BookingPipelineDonut data={data.pipelineDistribution} />
            )}
            {data?.conversionFunnel && (
              <ConversionFunnelChart data={data.conversionFunnel} />
            )}
          </div>

          {/* 3. Top Destinations Performance */}
          {data?.topDestinations && (
            <TopDestinationsChart data={data.topDestinations} />
          )}

          {/* 4. Package Popularity & Inquiries Performance Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Package Interest & Traffic Analytics
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Page view counts, logged client inquiries, and resulting booking conversions.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/analytics"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
                >
                  Full Analytics Suite
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
                  Real-Time
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Package Title</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4 text-center">Page Views</th>
                    <th className="py-3 px-4 text-center">Inquiries</th>
                    <th className="py-3 px-4 text-center">Bookings</th>
                    <th className="py-3 px-4 text-center">Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.packageAnalytics && data.packageAnalytics.length > 0 ? (
                    data.packageAnalytics.map((pkg) => {
                      const views = pkg.viewsCount || 0;
                      const inquiries = pkg._count?.inquiries || 0;
                      const bookings = pkg._count?.bookings || 0;
                      const conv = views > 0 ? ((bookings / views) * 100).toFixed(1) : "0.0";

                      return (
                        <tr key={pkg.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {pkg.title}
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-sans">
                            {pkg.destination}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-900 tabular-nums">
                            {views}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700 tabular-nums">
                            {inquiries}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-emerald-800 tabular-nums">
                            {bookings}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-semibold text-slate-600 tabular-nums">
                            {conv}%
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No package analytics data recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
