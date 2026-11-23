import Link from "next/link";
import { Compass, ArrowRight, ArrowLeft, Phone, MessageSquare, MapPin } from "lucide-react";

export default function NotFound() {
  const popularDestinations = [
    { name: "Kashmir Valley", query: "Kashmir" },
    { name: "Kerala Backwaters", query: "Kerala" },
    { name: "Andaman Islands", query: "Andaman" },
    { name: "Royal Rajasthan", query: "Rajasthan" },
  ];

  return (
    <main className="bg-[#FAF9F6] min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans select-none relative overflow-hidden">
      {/* Background Decorative Ambient Watermark */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.03]">
        <Compass className="w-[600px] h-[600px] text-[#0D2C24]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        {/* Brand Luxury Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D2C24]/5 border border-[#0D2C24]/10 text-[#0D2C24] text-xs font-semibold tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>404 · Uncharted Route</span>
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#111111] tracking-tight leading-[1.12]">
            This Journey Lies <span className="text-[#0D2C24]">Beyond the Map</span>.
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#52525B] max-w-lg mx-auto font-normal leading-relaxed text-pretty">
            The itinerary or page you are seeking does not exist or may have been repositioned by our concierge team. Let us guide you back to our curated sanctuaries.
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto btn bg-[#0D2C24] hover:bg-[#133E33] text-white px-7 py-3.5 rounded-full font-heading font-bold text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 shadow-card hover:shadow-elevation hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-amber-300" />
            <span>Return to Curated Journeys</span>
          </Link>

          <Link
            href="/packages"
            className="w-full sm:w-auto btn bg-white hover:bg-[#F3F1ED] text-[#111111] hover:text-[#0D2C24] border border-[#E4E2DD] px-7 py-3.5 rounded-full font-heading font-bold text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 shadow-2xs hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Explore All Packages</span>
            <ArrowRight className="w-4 h-4 text-[#0D2C24]" />
          </Link>
        </div>

        {/* Quick Route Shortcuts */}
        <div className="pt-6 border-t border-[#E4E2DD]/80 max-w-md mx-auto">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-[#71717A] mb-3">
            Popular Curated Destinations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {popularDestinations.map((dest) => (
              <Link
                key={dest.query}
                href={`/packages?destination=${encodeURIComponent(dest.query)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E4E2DD] text-xs font-medium text-[#111111] hover:text-[#0D2C24] hover:border-[#0D2C24]/30 hover:bg-[#FAF9F6] transition-all shadow-2xs"
              >
                <MapPin className="w-3 h-3 text-amber-600" />
                <span>{dest.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Concierge Assistance Footer */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#52525B]">
          <span>Need immediate concierge assistance?</span>
          <div className="flex items-center gap-3">
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-1 font-semibold text-[#0D2C24] hover:underline"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>+91 98765 43210</span>
            </a>
            <span>•</span>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#0D2C24] hover:underline"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
