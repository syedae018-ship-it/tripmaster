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
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAdminLayout } from "./AdminLayoutContext";

export function AdminSidebar() {
  const pathname = usePathname();
  const {
    mobileSidebarOpen,
    closeMobileSidebar,
    desktopSidebarCollapsed,
    toggleDesktopSidebar,
  } = useAdminLayout();

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

  const checkIsActive = (item: (typeof navigation)[0]) => {
    return item.exact
      ? pathname === item.href
      : pathname.startsWith(item.href) ||
          (item.aliases && item.aliases.some((a) => pathname.startsWith(a)));
  };

  return (
    <>
      {/* =========================================================================
          1. DESKTOP STICKY SIDEBAR (Hidden on mobile < lg, visible on lg+)
          Supports collapse to icon-only rail (w-20) or full width (w-64)
          ========================================================================= */}
      <aside
        className={`hidden lg:flex flex-col justify-between select-none font-sans border-r border-slate-200 bg-white h-screen sticky top-0 overflow-y-auto transition-[width] duration-200 ease-in-out shrink-0 z-30 ${
          desktopSidebarCollapsed ? "w-20" : "w-64"
        }`}
        aria-label="Desktop Navigation Sidebar"
      >
        <div>
          {/* Brand Logo Container */}
          <div
            className={`border-b border-slate-200/90 bg-white transition-all ${
              desktopSidebarCollapsed ? "p-3 flex flex-col items-center gap-2" : "p-4 flex items-center justify-between"
            }`}
          >
            <Link
              href="/admin"
              className={`flex items-center gap-3 group ${
                desktopSidebarCollapsed ? "justify-center" : ""
              }`}
              title="Trip Master Workstation"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1.5 shadow-2xs group-hover:border-blue-400 transition-colors shrink-0">
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

              {!desktopSidebarCollapsed && (
                <div className="overflow-hidden">
                  <div className="font-heading font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
                    TRIP MASTER
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] tracking-[0.16em] uppercase text-sky-600 font-semibold block whitespace-nowrap">
                    Workstation CRM
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Collapse Toggle */}
            <button
              type="button"
              onClick={toggleDesktopSidebar}
              className={`text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer ${
                desktopSidebarCollapsed ? "w-8 h-8 flex items-center justify-center mt-1" : ""
              }`}
              title={desktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={desktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {desktopSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="px-2.5 py-4 space-y-1">
            {!desktopSidebarCollapsed && (
              <div className="px-2.5 mb-2 text-[10px] uppercase font-bold tracking-[0.16em] text-slate-400">
                Core Modules
              </div>
            )}

            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = checkIsActive(item);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={desktopSidebarCollapsed ? item.name : undefined}
                  className={`flex items-center rounded-xl text-xs font-medium transition-all group ${
                    desktopSidebarCollapsed
                      ? "justify-center p-2.5"
                      : "gap-2.5 px-3 py-2"
                  } ${
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
                  {!desktopSidebarCollapsed && (
                    <span className="whitespace-nowrap truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Public Portal Quicklink */}
        <div className={`border-t border-slate-200 bg-slate-50/70 ${desktopSidebarCollapsed ? "p-2.5" : "p-3.5"}`}>
          <Link
            href="/"
            target="_blank"
            title={desktopSidebarCollapsed ? "Public Website" : undefined}
            className={`flex items-center rounded-xl bg-white hover:bg-sky-50/60 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all border border-slate-200 shadow-2xs ${
              desktopSidebarCollapsed
                ? "justify-center p-2.5"
                : "justify-between px-3 py-2"
            }`}
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              {!desktopSidebarCollapsed && <span>Public Website</span>}
            </div>
            {!desktopSidebarCollapsed && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </Link>
        </div>
      </aside>

      {/* =========================================================================
          2. MOBILE DRAWER SIDEBAR (Visible on screens < lg)
          Fully responsive slide-over drawer with backdrop overlay & close button
          ========================================================================= */}
      <div className="lg:hidden">
        {/* Backdrop overlay */}
        <div
          className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 ${
            mobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />

        {/* Slide-out Drawer Panel */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between select-none font-sans border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Mobile Navigation Menu"
        >
          <div className="overflow-y-auto flex-1">
            {/* Drawer Header with Brand Logo & Close Button */}
            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
              <Link
                href="/admin"
                onClick={closeMobileSidebar}
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1.5 shadow-2xs">
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

              {/* Close Button */}
              <button
                type="button"
                onClick={closeMobileSidebar}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Menu */}
            <div className="px-3 py-4 space-y-1">
              <div className="px-2.5 mb-2 text-[10px] uppercase font-bold tracking-[0.16em] text-slate-400">
                Core Modules
              </div>

              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = checkIsActive(item);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileSidebar}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
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
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Drawer Footer: Public Portal Quicklink */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/80 space-y-2">
            <Link
              href="/"
              target="_blank"
              onClick={closeMobileSidebar}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white hover:bg-sky-50/60 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-all border border-slate-200 shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Visit Public Website</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <div className="text-[10px] text-center text-slate-400 font-mono pt-1">
              Trip Master v2.4 • Admin Portal
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
