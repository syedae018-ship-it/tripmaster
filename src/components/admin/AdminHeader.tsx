"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
} from "lucide-react";
import { useAdminLayout } from "./AdminLayoutContext";

export function AdminHeader() {
  const router = useRouter();
  const {
    toggleMobileSidebar,
    desktopSidebarCollapsed,
    toggleDesktopSidebar,
  } = useAdminLayout();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/admin/login");
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3.5 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 z-20">
      {/* Left side: Navigation toggles & branding */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={toggleMobileSidebar}
          aria-label="Open sidebar navigation"
          className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Identity */}
        <Link
          href="/admin"
          className="flex items-center gap-2 lg:hidden shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1 group-hover:border-blue-400 transition-colors">
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
          <span className="font-heading font-bold text-sm tracking-tight text-slate-900 truncate">
            Trip Master
          </span>
        </Link>

        {/* Desktop Sidebar Collapse Toggle */}
        <button
          type="button"
          onClick={toggleDesktopSidebar}
          aria-label={desktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={desktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:flex w-9 h-9 rounded-xl items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 -ml-2"
        >
          {desktopSidebarCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-slate-600" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* Desktop Concierge Operations Tag */}
        <div className="hidden sm:flex items-center gap-2 truncate">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
            Concierge Operations Hub
          </span>
        </div>
      </div>

      {/* Right side: Public Site, Profile & Logout */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Public Site Preview (Tablet/Desktop) */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50/60 rounded-xl border border-slate-200/80 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
          <span>View Site</span>
        </Link>

        {/* Admin Profile */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 border border-sky-200 flex items-center justify-center font-bold text-xs font-mono shrink-0">
            TM
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              Master Concierge Admin
            </span>
            <span className="text-[10px] uppercase font-bold text-sky-600">
              SUPER_ADMIN
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          title="Sign Out"
          aria-label="Sign Out"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 px-2.5 sm:px-3 py-1.5 rounded-xl transition-colors border border-slate-200 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
