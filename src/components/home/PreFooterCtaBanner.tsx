"use client";

import { ArrowRight } from "lucide-react";

export function PreFooterCtaBanner() {
  const handleOpenPlanTrip = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-plan-trip-modal"));
    }
  };

  return (
    <section className="py-12 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Full-width rounded card container */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0D2C24] text-white p-6 sm:p-12 lg:p-20 text-center shadow-[0_20px_50px_-20px_rgba(13,44,36,0.35)] border border-[#1A453B]">
        {/* Subtle Destination Scenery Background Texture */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D2C24]/85 via-[#0D2C24]/90 to-[#0D2C24]" />

        {/* Centered Content */}
        <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-5">
          {/* Heading in Helvetica Bold */}
          <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] text-balance">
            Your next story is waiting.
          </h2>

          {/* Subtext in Poppins */}
          <p className="font-sans text-sm sm:text-base md:text-lg text-white/85 max-w-xl mx-auto font-normal leading-relaxed text-pretty">
            Let's plan a holiday you'll remember for years.
          </p>

          {/* Primary Button */}
          <div className="pt-2 sm:pt-3">
            <button
              type="button"
              onClick={handleOpenPlanTrip}
              className="btn bg-white hover:bg-[#FAF9F6] text-[#0D2C24] px-7 sm:px-8 py-3.5 sm:py-4 min-h-[48px] rounded-full font-heading font-bold text-xs sm:text-sm tracking-wider uppercase inline-flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer w-full sm:w-auto"
            >
              <span>Plan Your Holiday</span>
              <ArrowRight className="w-4 h-4 text-[#0D2C24]" />
            </button>
          </div>

          {/* Micro-copy below button */}
          <p className="text-xs text-white/70 font-medium pt-1">
            No-pressure enquiry · Speak to our travel team
          </p>
        </div>
      </div>
    </section>
  );
}

