"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroBannerWireframe({
  title = "Your next unforgettable journey starts here.",
  subtitle = "Curated holiday packages, trusted by thousands of happy travellers.",
  bgImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85",
}: {
  title?: string;
  subtitle?: string;
  bgImage?: string;
}) {
  return (
    <section className="pt-3 sm:pt-6 pb-2 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {/* Full-width rounded hero container */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[460px] sm:min-h-[580px] lg:min-h-[620px] flex items-center justify-center p-6 sm:p-12 lg:p-16 text-center shadow-[0_20px_50px_-20px_rgba(13,44,36,0.3)] border border-[#E4E2DD]">
        {/* Destination Scenery Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-105"
          style={{
            backgroundImage: `url('${bgImage}')`,
          }}
        />

        {/* High-Contrast Luxury Tint Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D2C24]/75 via-[#0D2C24]/82 to-[#0D2C24]/92 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/25" />

        {/* Centered Content */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-4 sm:space-y-6">
          {/* Main Headline (Helvetica Bold) */}
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-[4.1rem] font-bold tracking-tight text-white leading-[1.12] text-balance break-words">
            {title}
          </h1>

          {/* Subheadline (Poppins) */}
          <p className="font-sans text-sm sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-normal leading-relaxed text-pretty">
            {subtitle}
          </p>

          {/* Primary CTA Button (Dark navy/slate rounded button) */}
          <div className="pt-2 sm:pt-4 flex items-center justify-center gap-4 w-full">
            <Link
              href="/packages"
              className="btn bg-[#0D2C24] hover:bg-[#133E33] text-white px-6 sm:px-7 py-3.5 sm:py-4 min-h-[48px] rounded-full font-heading font-bold text-xs sm:text-sm tracking-wider uppercase inline-flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl border border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full sm:w-auto"
            >
              <span>Explore Holiday Packages</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

