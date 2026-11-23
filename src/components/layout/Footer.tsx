"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide on admin panel
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer id="contact" className="bg-[#0D2C24] text-white border-t border-[#1A453B] pt-16 pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 pb-14 border-b border-[#1A453B]">
          {/* Column 1 (Brand) */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/images/logo-white.png"
                alt="TripMaster - Experience Neighbourhood"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.includes("/logo.png")) {
                    target.src = "/logo.png";
                  }
                }}
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="text-sm text-white/75 leading-relaxed max-w-sm">
              Your trusted travel partner for memorable holiday experiences around the world.
            </p>
          </div>

          {/* Column 2 (Explore) */}
          <div className="space-y-3.5">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-amber-300">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80 font-medium">
              <li>
                <Link href="/destinations" className="hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-white transition-colors">
                  Holiday Packages
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-white transition-colors">
                  Customer Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 (Get in Touch) */}
          <div className="space-y-3.5">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-amber-300">
              Get in Touch
            </h4>
            <div className="space-y-3 text-xs text-white/80 font-medium">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white tabular-nums">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <a href="mailto:info@travelcompany.com" className="hover:text-white">
                  info@travelcompany.com
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>The Oberoi Grand Arc, MG Road, Bengaluru, India</span>
              </div>

              {/* Social Icons Row */}
              <div className="pt-2 flex items-center gap-3 text-white">
                <a
                  href="https://instagram.com/tripmasterluxury"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@tripmastertravel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar (Separated by 1px top border) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          {/* Left: Credentials & Policies */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-center sm:text-left">
            <span>Business Registration</span>
            <span>•</span>
            <span>Travel Credentials</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms & Conditions</span>
          </div>

          {/* Right: Copyright */}
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
            <span>•</span>
            <p>© 2026 Trip Master. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
