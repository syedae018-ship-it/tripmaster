"use client";

import { usePathname } from "next/navigation";
import { AdminLayoutProvider } from "./AdminLayoutContext";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on /admin/login, render bare without admin layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminLayoutProvider>
      <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans antialiased text-slate-900">
        {/* Sticky Desktop Sidebar & Slide-over Mobile Drawer */}
        <AdminSidebar />
        {/* Main Workspace Area with independent vertical scrolling */}
        <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-[#F8FAFC]">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-6 lg:p-8 bg-[#F8FAFC]">
            {children}
          </main>
        </div>
      </div>
    </AdminLayoutProvider>
  );
}
