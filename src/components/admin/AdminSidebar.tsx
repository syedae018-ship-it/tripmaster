"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  MessageSquareText,
  Users,
  Compass,
  MapPin,
  FileText,
  CreditCard,
  Image as ImageIcon,
  FileEdit,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard Overview",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Analytics & Reports",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      name: "Leads & Inquiries",
      href: "/admin/inquiries",
      icon: MessageSquareText,
      aliases: ["/admin/leads"],
    },
    {
      name: "Customer Profiles",
      href: "/admin/customers",
      icon: Users,
    },
    {
      name: "Holiday Packages",
      href: "/admin/packages",
      icon: Compass,
    },
    {
      name: "Destinations & Presets",
      href: "/admin/presets",
      icon: MapPin,
    },
    {
      name: "Quotation Builder",
      href: "/admin/quotations",
      icon: FileText,
    },
    {
      name: "Bookings & Invoices",
      href: "/admin/bookings",
      icon: CreditCard,
    },
    {
      name: "Media Vault",
      href: "/admin/media",
      icon: ImageIcon,
      aliases: ["/admin/gallery"],
    },
    {
      name: "Website CMS",
      href: "/admin/cms",
      icon: FileEdit,
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 overflow-y-auto border-r border-slate-200 bg-white flex flex-col justify-between select-none font-sans z-40">
      <div>
        {/* Official Brand Logo Container */}
        <div className="p-4 border-b border-slate-200/90 bg-white">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1.5 shadow-2xs group-hover:border-blue-400 transition-colors">
              <img
                src="/logo.png"
                alt="TripMaster"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.includes("/images/logo.png")) {
                    target.src = "/images/logo.png";
                  }
                }}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-heading font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
                TRIP MASTER
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-[10px] tracking-[0.16em] uppercase text-sky-600 font-semibold block">
                Workstation CRM
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="px-3 py-4 space-y-1">
          <div className="px-2.5 mb-2 text-[10px] uppercase font-bold tracking-[0.16em] text-slate-400">
            Core Modules
          </div>

          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) ||
                (item.aliases && item.aliases.some((a) => pathname.startsWith(a)));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-800 shadow-2xs border border-blue-200/90 font-semibold"
                    : "text-slate-600 hover:bg-blue-50/60 hover:text-blue-700 border border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"
                  }`}
                />
                <span className="whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Public Portal Quicklink */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/70">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-white hover:bg-sky-50/60 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all border border-slate-200 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            <span>Public Website</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>
    </aside>
  );
}
