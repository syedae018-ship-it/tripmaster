"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Phone } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Do not render public navbar on admin pages
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/packages" },
    { label: "About", href: "/#about" },
    { label: "Reviews", href: "/#reviews" },
    { label: "Contact", href: "/#contact" },
  ];

  const handleOpenPlanTrip = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-plan-trip-modal"));
    }
  };

  return (
    <>
      {/* Accessible skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0A2E23] focus:text-white focus:text-sm focus:rounded-sm focus:shadow-md"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled
            ? "bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E4E2DD] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
            : "bg-[#FAF9F6] border-b border-[#E4E2DD]"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[68px]">
            {/* Official Brand Logo */}
            <Link
              href="/"
              className="flex items-center group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0D2C24] rounded-sm py-1"
              aria-label="TripMaster - Experience Neighbourhood"
            >
              <img
                src="/images/logo.png"
                alt="TripMaster - Experience Neighbourhood"
                className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
              />
            </Link>

            {/* Centered / Flowing Primary Navigation */}
            <nav className="hidden md:flex items-center gap-8 font-sans" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isDestinations =
                  (link.href === "/packages" || link.href === "/destinations") &&
                  (pathname === "/packages" ||
                    pathname === "/destinations" ||
                    Boolean(pathname?.startsWith("/packages/")) ||
                    Boolean(pathname?.startsWith("/destinations/")));
                const isActive = pathname === link.href || isDestinations;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`text-[13px] tracking-wide transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0D2C24] rounded-sm ${
                      isActive
                        ? "text-[#111111] font-semibold"
                        : "text-[#52525B] hover:text-[#111111] font-medium"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Cluster */}
            <div className="hidden sm:flex items-center gap-5">
              <a
                href="tel:+919876543210"
                className="text-[13px] text-[#52525B] hover:text-[#111111] font-sans font-medium tabular-nums flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0D2C24]"
              >
                <Phone className="w-3.5 h-3.5 text-[#0D2C24]" />
                <span>+91 98765 43210</span>
              </a>

              <button
                type="button"
                onClick={handleOpenPlanTrip}
                className="btn btn-primary rounded-full px-5 py-2 text-xs font-semibold tracking-wider font-sans flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Plan My Trip</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>

            {/* Mobile Menu Toggle Button (Min 44x44px target) */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-11 h-11 flex items-center justify-center text-[#111111] rounded-lg hover:bg-[#F3F1ED] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D2C24]"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E4E2DD] bg-[#FAF9F6] px-5 py-6 space-y-5 animate-in slide-in-from-top-2 duration-150 shadow-lg">
            <nav className="flex flex-col space-y-3 font-sans">
              {navLinks.map((link) => {
                const isDestinations =
                  (link.href === "/packages" || link.href === "/destinations") &&
                  (pathname === "/packages" ||
                    pathname === "/destinations" ||
                    Boolean(pathname?.startsWith("/packages/")) ||
                    Boolean(pathname?.startsWith("/destinations/")));
                const isActive = pathname === link.href || isDestinations;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`text-sm py-2.5 border-b border-[#E4E2DD]/60 font-medium ${
                      isActive ? "text-[#0D2C24] font-semibold" : "text-[#111111] hover:text-[#0D2C24]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 flex flex-col gap-3 font-sans">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenPlanTrip();
                }}
                className="btn btn-primary w-full h-11 text-xs tracking-wider font-semibold rounded-full flex items-center justify-center gap-1.5"
              >
                <span>Plan My Trip</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
              <a
                href="tel:+919876543210"
                className="text-center text-xs text-[#52525B] font-sans font-medium tabular-nums py-2"
              >
                Direct Concierge: +91 98765 43210
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
