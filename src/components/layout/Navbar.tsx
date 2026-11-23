"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ArrowUpRight, Phone, Search, ArrowRight, MapPin, Sparkles } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close modals on Escape key & manage scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchModalOpen(false);
      }
    };

    if (mobileMenuOpen || searchModalOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen, searchModalOpen]);

  // Focus search input on open
  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [searchModalOpen]);

  // Close drawer on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchModalOpen(false);
  }, [pathname]);

  // Do not render public navbar on admin pages
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: "About", href: "/#about" },
    { label: "Reviews", href: "/#reviews" },
    { label: "Contact", href: "/#contact" },
  ];

  const quickDestinations = [
    { name: "Kashmir", label: "Kashmir Valley", tagline: "Houseboats & Pines" },
    { name: "Kerala", label: "Kerala Backwaters", tagline: "Tea Hills & Lagoons" },
    { name: "Andaman", label: "Andaman Islands", tagline: "Coral Reefs & White Sands" },
    { name: "Rajasthan", label: "Rajasthan Palaces", tagline: "Forts & Heritage Suites" },
  ];

  const handleOpenPlanTrip = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-plan-trip-modal"));
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchModalOpen(false);
    const query = searchQuery.trim();
    if (query) {
      router.push(`/packages?destination=${encodeURIComponent(query)}`);
    } else {
      router.push("/packages");
    }
  };

  const handleSelectDestination = (dest: string) => {
    setSearchModalOpen(false);
    setMobileMenuOpen(false);
    router.push(`/packages?destination=${encodeURIComponent(dest)}`);
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
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.includes("/logo.png")) {
                    target.src = "/logo.png";
                  }
                }}
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

            {/* Right Action Cluster (Desktop) */}
            <div className="hidden sm:flex items-center gap-4">
              {/* Desktop Quick Search Trigger */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-[#52525B] hover:text-[#111111] hover:bg-[#F3F1ED] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D2C24]"
                aria-label="Search destinations and packages"
                title="Search destinations"
              >
                <Search className="w-4 h-4" />
              </button>

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
                className="btn btn-primary rounded-full px-5 py-2 text-xs font-semibold tracking-wider font-sans flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer min-h-[40px]"
              >
                <span>Plan My Trip</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>

            {/* Mobile Actions Cluster (Search & Hamburger, min 44x44px touch targets) */}
            <div className="flex md:hidden items-center gap-1.5">
              {/* Mobile Quick Search Button */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="w-11 h-11 flex items-center justify-center text-[#111111] rounded-lg hover:bg-[#F3F1ED] active:bg-[#ECEAE4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D2C24]"
                aria-label="Search destinations and packages"
              >
                <Search className="w-5 h-5 text-[#0D2C24]" />
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-11 h-11 flex items-center justify-center text-[#111111] rounded-lg hover:bg-[#F3F1ED] active:bg-[#ECEAE4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D2C24]"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E4E2DD] bg-[#FAF9F6]/98 backdrop-blur-md px-4 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-xl max-h-[calc(100vh-68px)] overflow-y-auto">
            {/* Quick Search Bar within Drawer */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#E4E2DD] bg-white text-left flex items-center justify-between text-xs text-[#52525B] shadow-2xs hover:border-[#0D2C24] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-[#0D2C24]" />
                <span className="font-medium">Search destinations, escapes...</span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0D2C24] bg-[#FAF9F6] px-2 py-0.5 rounded-md border border-[#E4E2DD]">
                Search
              </span>
            </button>

            {/* Navigation Links with >= 44x44px touch targets */}
            <nav className="flex flex-col space-y-1 font-sans" aria-label="Mobile Navigation">
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
                    className={`min-h-[44px] flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#0D2C24]/8 text-[#0D2C24] font-semibold"
                        : "text-[#111111] hover:bg-[#F3F1ED] active:bg-[#ECEAE4]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0D2C24]" aria-hidden="true" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Actions: Plan Trip & Concierge Call */}
            <div className="pt-2 flex flex-col gap-2.5 font-sans border-t border-[#E4E2DD]/70">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenPlanTrip();
                }}
                className="btn btn-primary w-full h-12 min-h-[48px] text-xs uppercase tracking-wider font-semibold rounded-full flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Plan My Trip</span>
                <ArrowUpRight className="w-4 h-4 text-amber-300" />
              </button>

              <a
                href="tel:+919876543210"
                className="min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E4E2DD] bg-white text-xs font-semibold text-[#111111] shadow-2xs hover:bg-[#F3F1ED] active:scale-[0.99] transition-all tabular-nums"
              >
                <Phone className="w-3.5 h-3.5 text-[#0D2C24]" />
                <span>Direct Concierge: +91 98765 43210</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Dedicated Search Popup Modal */}
      {searchModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search destinations and packages"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-4 pt-16 sm:pt-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSearchModalOpen(false);
            }
          }}
        >
          <div className="relative w-full max-w-lg bg-[#FAF9F6] rounded-2xl shadow-2xl border border-[#E4E2DD] overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E2DD] bg-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="font-heading text-sm font-bold tracking-tight text-[#111111]">
                  Search Destinations & Expeditions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="w-11 h-11 flex items-center justify-center text-[#52525B] hover:text-[#111111] rounded-lg hover:bg-[#F3F1ED] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D2C24]"
                aria-label="Close search dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="p-5 space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 text-[#0D2C24] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kashmir, Kerala, Andaman, Rajasthan..."
                  className="w-full min-h-[48px] pl-11 pr-10 py-3 bg-white border border-[#E4E2DD] rounded-xl text-base text-[#111111] placeholder:text-[#8E8B82] focus:outline-none focus:ring-2 focus:ring-[#0D2C24] focus:border-transparent font-sans shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="w-9 h-9 flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#111111] rounded-full hover:bg-[#F3F1ED]"
                    aria-label="Clear search input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Destination Suggestions (1-tap chips) */}
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
                  Featured Sanctuaries (1-Tap Explore)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickDestinations.map((dest) => (
                    <button
                      key={dest.name}
                      type="button"
                      onClick={() => handleSelectDestination(dest.name)}
                      className="min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#E4E2DD] bg-white hover:border-[#0D2C24] hover:bg-[#F3F1ED] active:bg-[#ECEAE4] text-left flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-[#0D2C24] group-hover:scale-110 transition-transform shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-[#111111] leading-tight">
                            {dest.name}
                          </div>
                          <div className="text-[10px] text-[#52525B]">{dest.tagline}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#52525B] group-hover:text-[#0D2C24] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#E4E2DD]/70">
                <button
                  type="button"
                  onClick={() => handleSelectDestination("")}
                  className="min-h-[44px] px-3 py-2 text-xs font-medium text-[#52525B] hover:text-[#111111] transition-colors"
                >
                  View All Packages
                </button>

                <button
                  type="submit"
                  className="btn btn-primary min-h-[44px] px-5 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <span>Explore Journeys</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
