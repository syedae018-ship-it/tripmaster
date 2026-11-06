"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  Package,
  MessageSquareText,
  Users,
  CreditCard,
  FileEdit,
  BarChart3,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
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
      name: "Quotations & Plans",
      href: "/admin/quotations",
      icon: FileText,
      badge: "Mobile PDF",
    },
    {
      name: "Media Vault",
      href: "/admin/gallery",
      icon: ImageIcon,
      badge: "Vault",
    },
    {
      name: "Packages & Assets",
      href: "/admin/packages",
      icon: Package,
      badge: "Core",
    },
    {
      name: "Inquiries & Leads",
      href: "/admin/inquiries",
      icon: MessageSquareText,
      badge: "Active",
    },
    {
      name: "Customer Profiles",
      href: "/admin/customers",
      icon: Users,
      badge: "CRM",
    },
    {
      name: "Bookings & Payments",
      href: "/admin/bookings",
      icon: CreditCard,
      badge: "Ledger",
    },
    {
      name: "Website Content / CMS",
      href: "/admin/cms",
      icon: FileEdit,
    },
    {
      name: "Analytics & Reports",
      href: "/admin/analytics",
      icon: BarChart3,
      badge: "Phase 6",
    },
  ];

  return (
    <aside className="w-64 bg-[#0C1116] text-[#E6EDF3] flex flex-col justify-between shrink-0 border-r border-[#1F2937]/90 min-h-screen select-none">
      <div>
        {/* Admin Brand */}
        <div className="p-5 border-b border-[#1F2937]/80">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#dfbd75] to-[#c5a059] flex items-center justify-center text-[#0C1116] shadow-xs group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-heading text-lg font-bold tracking-[0.14em] text-white uppercase block leading-none">
                Trip Master
              </span>
              <span className="text-[9px] tracking-[0.24em] uppercase text-[#dfbd75] font-semibold mt-1 block">
                Command Center
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="px-3 py-5 space-y-1">
          <div className="px-3 mb-2 text-[10px] uppercase font-bold tracking-[0.18em] text-slate-500">
            Operations
          </div>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? "bg-[#1F2937] text-white shadow-xs border border-white/10 font-semibold"
                    : "text-slate-400 hover:bg-[#161F28] hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-[#dfbd75]" : "text-slate-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-[#dfbd75] text-[#0C1116]"
                        : "bg-[#1E293B] text-slate-400 border border-slate-700/60"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Public Site Shortcut & Concierge Status */}
      <div className="p-4 border-t border-[#1F2937]/80 bg-[#080D11] space-y-2.5">
        <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono tabular-nums text-slate-300">Concierge Desk Live</span>
          </span>
          <span className="font-mono text-[10px] text-slate-500">v2.4</span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between p-2.5 rounded-xl bg-[#161F28] hover:bg-[#1F2937] text-xs font-medium text-slate-300 hover:text-white transition-all border border-slate-700/60"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#dfbd75]" />
            <span>Open Public Portal</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </Link>
      </div>
    </aside>
  );
}
