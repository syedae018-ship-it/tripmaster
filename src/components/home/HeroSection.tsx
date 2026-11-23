"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, IndianRupee, ArrowRight } from "lucide-react";

export function HeroSection() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (duration) params.set("duration", duration);
    if (budget === "under_1lakh") params.set("maxPrice", "100000");
    if (budget === "1_to_1.5lakh") {
      params.set("minPrice", "100000");
      params.set("maxPrice", "150000");
    }
    if (budget === "above_1.5lakh") params.set("minPrice", "150000");

    router.push(`/packages?${params.toString()}`);
  };

  return (
    <section className="relative bg-[#0D2C24] text-white overflow-hidden" id="main-content">
      {/* Background Photography with Controlled Editorial Gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D2C24]/75 via-[#0D2C24]/88 to-[#0D2C24]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-24 flex flex-col justify-between min-h-[82vh]">
        {/* Editorial Headline & Narrative */}
        <div className="max-w-3xl space-y-5">
          <p className="eyebrow text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-400 font-sans">
            Private Concierge & Handcrafted Itineraries
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold tracking-tight leading-[1.12] text-white">
            Curated journeys through India's most <span className="text-amber-300">extraordinary sanctuaries</span>.
          </h1>
          <p className="font-sans text-base sm:text-lg text-white/85 font-normal leading-relaxed text-pretty pt-1">
            Private cedar houseboats in Kashmir, misted cardamom estates in Munnar, untouched coral lagoons in Havelock, and historic desert fortresses in Rajasthan.
          </p>
        </div>

        {/* Grounded Search & Filter Console */}
        <div className="mt-12 w-full bg-white rounded-2xl p-2.5 sm:p-3 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.12)] border border-[#E4E2DD] text-[#111111] font-sans">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 items-center"
          >
            {/* Destination Field */}
            <div className="flex items-center gap-3 px-3 py-2 border-b sm:border-b-0 sm:border-r border-[#E4E2DD]">
              <MapPin className="w-4 h-4 text-[#0D2C24] shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
                  Destination
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#111111] focus:outline-none cursor-pointer mt-0.5"
                >
                  <option value="">All Regions</option>
                  <option value="Kashmir">Kashmir (Srinagar & Gulmarg)</option>
                  <option value="Kerala">Kerala (Backwaters & Munnar)</option>
                  <option value="Andaman">Andaman (Havelock Islands)</option>
                  <option value="Rajasthan">Rajasthan (Udaipur & Jaipur)</option>
                </select>
              </div>
            </div>

            {/* Duration Field */}
            <div className="flex items-center gap-3 px-3 py-2 border-b sm:border-b-0 lg:border-r border-[#E4E2DD]">
              <Calendar className="w-4 h-4 text-[#0D2C24] shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#111111] focus:outline-none cursor-pointer mt-0.5"
                >
                  <option value="">Any Length</option>
                  <option value="1-5">1 to 5 Days (Escape)</option>
                  <option value="6-8">6 to 8 Days (Signature)</option>
                  <option value="9+">9+ Days (Grand Circuit)</option>
                </select>
              </div>
            </div>

            {/* Budget / Price Tier */}
            <div className="flex items-center gap-3 px-3 py-2 border-b sm:border-b-0 lg:border-r border-[#E4E2DD]">
              <IndianRupee className="w-4 h-4 text-[#0D2C24] shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
                  Per Guest Tariff
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#111111] focus:outline-none cursor-pointer mt-0.5"
                >
                  <option value="">All Tariffs</option>
                  <option value="under_1lakh">Under ₹1,00,000</option>
                  <option value="1_to_1.5lakh">₹1,00,000 to ₹1,50,000</option>
                  <option value="above_1.5lakh">₹1,50,000 and above</option>
                </select>
              </div>
            </div>

            {/* Search Submit */}
            <div className="p-1 sm:col-span-2 lg:col-span-1">
              <button
                type="submit"
                className="btn btn-primary w-full h-11 text-xs uppercase tracking-wider font-semibold rounded-xl justify-between shadow-sm"
              >
                <span>Explore Journeys</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
