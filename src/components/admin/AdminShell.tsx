"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If on /admin/login, render bare without admin sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans antialiased text-slate-900">
      {/* 100% Locked Sticky Sidebar */}
      <AdminSidebar />
      {/* Main Workspace Area with independent vertical scrolling */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-[#F8FAFC]">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 bg-[#F8FAFC]">
          {children}
        </main>
      </div>
    </div>
  );
}
