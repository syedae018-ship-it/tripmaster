"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

interface AdminLayoutContextType {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  desktopSidebarCollapsed: boolean;
  setDesktopSidebarCollapsed: (
    collapsed: boolean | ((prev: boolean) => boolean)
  ) => void;
  toggleDesktopSidebar: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | null>(null);

const STORAGE_KEY = "tripmaster_admin_sidebar_collapsed";

export function AdminLayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsedState] = useState(false);

  // Initialize desktop collapsed state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setDesktopSidebarCollapsedState(saved === "true");
      }
    } catch {
      // Ignore localStorage access failures
    }
  }, []);

  // Update localStorage when desktop collapsed state changes
  const setDesktopSidebarCollapsed = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      setDesktopSidebarCollapsedState((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        try {
          localStorage.setItem(STORAGE_KEY, String(next));
        } catch {
          // Ignore storage error
        }
        return next;
      });
    },
    []
  );

  const toggleDesktopSidebar = useCallback(() => {
    setDesktopSidebarCollapsed((prev) => !prev);
  }, [setDesktopSidebarCollapsed]);

  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpen((prev) => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  // Automatically close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  // Close mobile sidebar on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileSidebarOpen]);

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [mobileSidebarOpen]);

  return (
    <AdminLayoutContext.Provider
      value={{
        mobileSidebarOpen,
        setMobileSidebarOpen,
        toggleMobileSidebar,
        closeMobileSidebar,
        desktopSidebarCollapsed,
        setDesktopSidebarCollapsed,
        toggleDesktopSidebar,
      }}
    >
      {children}
    </AdminLayoutContext.Provider>
  );
}

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error("useAdminLayout must be used within an AdminLayoutProvider");
  }
  return context;
}
