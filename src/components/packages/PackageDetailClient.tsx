"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  Shield,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
  ChevronDown,
  Building,
  Utensils,
  Camera,
  CreditCard,
  Compass,
  ArrowRight,
  Eye,
} from "lucide-react";

export interface ItineraryDayItem {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  mealsIncluded: string[];
  activityPhotos: string[];
  accommodationName: string | null;
  accommodationPhoto: string | null;
  accommodationRating: number | null;
  accommodationDetails: string | null;
}

export interface MapCoordinateItem {
  name: string;
  lat: number;
  lng: number;
}

export interface PackageDetailData {
  id: string;
  title: string;
  slug: string;
  destination: string;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  discountedPrice: number | null;
  featuredImage: string;
  galleryImages: string[];
  overview: string;
  mapCoordinates: MapCoordinateItem[];
  inclusions: string[];
  exclusions: string[];
  paymentPolicy: string;
  cancellationPolicy: string;
  viewsCount: number;
  itinerary: ItineraryDayItem[];
}

export function PackageDetailClient({ pkg }: { pkg: PackageDetailData }) {
  // Sidebar State
  const [activeTab, setActiveTab] = useState<"inquiry" | "book">("inquiry");

  // Accordion state: by default expand Day 1
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({
    1: true,
    2: true,
  });

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  // Gallery active photo
  const [selectedPhoto, setSelectedPhoto] = useState<string>(pkg.featuredImage);

  // Inquiry form state
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    travelDate: "",
    paxCount: "2",
    notes: "",
  });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [inquiryError, setInquiryError] = useState("");

  // Direct Booking form state
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    travelStartDate: "",
    paxCount: "2",
    notes: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<{
    reference: string;
    totalAmount: number;
  } | null>(null);
  const [bookingError, setBookingError] = useState("");

  const effectivePrice = pkg.discountedPrice || pkg.basePrice;
  const paxBookingCount = parseInt(bookingForm.paxCount || "2", 10);
  const calculatedTotal = effectivePrice * paxBookingCount;

  // Handle Inquiry Submit
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryLoading(true);
    setInquiryError("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...inquiryForm,
          packageId: pkg.id,
          destination: pkg.destination,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setInquirySuccess({
        id: data.inquiryId,
        name: data.customerName,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setInquiryError(err.message);
      } else {
        setInquiryError("An error occurred");
      }
    } finally {
      setInquiryLoading(false);
    }
  };

  // Handle Direct Booking Submit
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingForm,
          packageId: pkg.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create booking");
      }

      setBookingSuccess({
        reference: data.bookingReference,
        totalAmount: data.totalAmount,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setBookingError(err.message);
      } else {
        setBookingError("An error occurred");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const allPhotos = [pkg.featuredImage, ...pkg.galleryImages].filter(
    (val, idx, arr) => arr.indexOf(val) === idx
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-24 font-sans">
      {/* 1. Top Breadcrumb & Title Hero */}
      <div className="bg-[#0D2C24] text-white pt-8 pb-12 border-b border-[#1A453B]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/70 mb-3 font-sans">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/packages" className="hover:text-white transition-colors">
              Journeys
            </Link>
            <span>/</span>
            <span className="text-amber-300 font-semibold">{pkg.destination}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2.5">
                <span className="bg-amber-400 text-[#0D2C24] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full font-sans">
                  {pkg.destination}
                </span>
                <span className="text-xs text-white/80 flex items-center gap-1 font-sans tabular-nums">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  {pkg.durationDays} Days / {pkg.durationNights} Nights
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.12] max-w-3xl">
                {pkg.title}
              </h1>
            </div>

            {/* Price Preview Card */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-5 text-right shrink-0">
              <span className="text-[11px] uppercase tracking-wider text-white/70 block font-semibold">
                Tariff From
              </span>
              <div className="flex items-baseline justify-end gap-2 mt-0.5">
                <span className="price-display text-3xl sm:text-4xl font-bold text-white tabular-nums">
                  ₹{effectivePrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-white/70 font-normal">/ guest</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLUMNS: Gallery, Overview, Itinerary, Map, Inclusions */}
          <div className="lg:col-span-8 space-y-10">
            {/* Asymmetric Magazine Photo Grid */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Large Hero Frame (2 cols) */}
                <div className="md:col-span-2 relative h-[380px] sm:h-[480px] rounded-2xl overflow-hidden shadow-card border border-[#E4E2DD] bg-[#111111] group">
                  <img
                    src={selectedPhoto}
                    alt={pkg.title}
                    className="w-full h-full object-cover scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="bg-black/60 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-medium tracking-wide">
                      <Camera className="w-3.5 h-3.5 text-amber-300" />
                      Authentic Curated Expedition Capture
                    </span>
                  </div>
                </div>

                {/* Stacked Preview Frames (1 col) */}
                <div className="hidden md:flex flex-col gap-4 h-[480px]">
                  {allPhotos.slice(1, 3).map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPhoto(img)}
                      className={`relative flex-1 rounded-2xl overflow-hidden border cursor-pointer group transition-all ${
                        selectedPhoto === img
                          ? "border-[#D97706] ring-2 ring-[#D97706]/40"
                          : "border-[#E4E2DD] opacity-85 hover:opacity-100 hover:border-[#0D2C24]"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Preview ${idx + 2}`}
                        className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                  ))}

                  {/* 3rd slot with "View All Photos" thumbnail if more than 3 photos */}
                  {allPhotos.length > 3 ? (
                    <div
                      onClick={() => setSelectedPhoto(allPhotos[3])}
                      className="relative flex-1 rounded-2xl overflow-hidden border border-[#E4E2DD] cursor-pointer group"
                    >
                      <img
                        src={allPhotos[3]}
                        alt="More captures"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-center p-2 group-hover:bg-black/50 transition-colors">
                        <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-amber-300" />
                          +{allPhotos.length - 3} Captures
                        </span>
                      </div>
                    </div>
                  ) : allPhotos[0] && (
                    <div
                      onClick={() => setSelectedPhoto(allPhotos[0])}
                      className="relative flex-1 rounded-2xl overflow-hidden border border-[#E4E2DD] cursor-pointer group"
                    >
                      <img
                        src={allPhotos[0]}
                        alt="Hero view"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Thumbnail Strip */}
              {allPhotos.length > 1 && (
                <div className="flex md:hidden items-center gap-2.5 overflow-x-auto pb-2">
                  {allPhotos.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhoto(img)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border transition-all ${
                        selectedPhoto === img
                          ? "border-[#D97706] ring-2 ring-[#D97706]/40"
                          : "border-[#E4E2DD] opacity-75"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Key Luxury Attributes Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[#E4E2DD] shadow-card text-center font-sans">
              <div className="p-2 border-r border-[#E4E2DD]">
                <Building className="w-5 h-5 text-[#0D2C24] mx-auto mb-1.5" />
                <span className="font-heading font-bold text-xs text-[#111111] block">5★ Heritage Stays</span>
                <span className="text-[11px] text-[#52525B]">Oberoi / Taj / Khyber</span>
              </div>
              <div className="p-2 border-r border-[#E4E2DD]">
                <Utensils className="w-5 h-5 text-[#0D2C24] mx-auto mb-1.5" />
                <span className="font-heading font-bold text-xs text-[#111111] block">Gourmet Meals</span>
                <span className="text-[11px] text-[#52525B]">Breakfast & Chef Dinners</span>
              </div>
              <div className="p-2 border-r border-[#E4E2DD]">
                <Compass className="w-5 h-5 text-[#0D2C24] mx-auto mb-1.5" />
                <span className="font-heading font-bold text-xs text-[#111111] block">Private SUV Fleet</span>
                <span className="text-[11px] text-[#52525B]">Chauffeur Captain</span>
              </div>
              <div className="p-2">
                <Star className="w-5 h-5 text-[#D97706] mx-auto mb-1.5 fill-[#D97706]" />
                <span className="font-heading font-bold text-xs text-[#111111] block">24/7 Concierge</span>
                <span className="text-[11px] text-[#52525B]">Personal WhatsApp</span>
              </div>
            </div>

            {/* Overview Section */}
            <div className="bg-white rounded-2xl p-7 sm:p-8 shadow-card border border-[#E4E2DD] space-y-4 font-sans">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                The Journey Overview
              </h2>
              <p className="text-sm sm:text-base text-[#52525B] leading-relaxed font-normal">
                {pkg.overview}
              </p>
            </div>

            {/* Day-Wise Itinerary Accordion with Stay Highlight Cards */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                    Day-By-Day Curated Itinerary
                  </h2>
                  <p className="text-xs text-[#52525B] mt-1">
                    Every day features handpicked activities, culinary meals, and luxury stay highlights.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const all: Record<number, boolean> = {};
                      pkg.itinerary.forEach((day) => (all[day.dayNumber] = true));
                      setExpandedDays(all);
                    }}
                    className="text-xs font-semibold text-[#0D2C24] hover:text-[#D97706] underline"
                  >
                    Expand All Days
                  </button>
                  <span className="text-[#E4E2DD]">•</span>
                  <button
                    type="button"
                    onClick={() => setExpandedDays({})}
                    className="text-xs font-semibold text-[#52525B] hover:text-[#111111]"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Editorial Day-Wise Dossier Timeline with Continuous Left Track */}
              <div className="relative pl-6 sm:pl-10 border-l-2 border-[#E4E2DD] ml-3 sm:ml-6 space-y-8">
                {pkg.itinerary.map((day) => {
                  const isExpanded = !!expandedDays[day.dayNumber];
                  const dayPadded = String(day.dayNumber).padStart(2, "0");

                  return (
                    <div key={day.id} className="relative">
                      {/* Timeline Numbered Node */}
                      <div className="absolute -left-[35px] sm:-left-[51px] top-5 w-8 h-8 rounded-full bg-[#0D2C24] text-amber-300 border-2 border-[#FAF9F6] flex items-center justify-center font-heading text-[10px] sm:text-[11px] font-bold tabular-nums shadow-sm">
                        {dayPadded}
                      </div>

                      <div className="bg-white rounded-2xl border border-[#E4E2DD] shadow-card overflow-hidden transition-all duration-300">
                        {/* Dossier Day Header */}
                        <button
                          type="button"
                          onClick={() => toggleDay(day.dayNumber)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-[#FAF9F6] transition-colors focus:outline-none"
                        >
                          <div className="space-y-1">
                            <span className="eyebrow text-emerald-800 block">
                              Day {dayPadded} Expedition
                            </span>
                            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#111111] leading-snug tracking-tight">
                              {day.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 ml-4">
                            {/* Meal Chips */}
                            <div className="hidden sm:flex items-center gap-1.5">
                              {day.mealsIncluded.map((meal, mIdx) => (
                                <span
                                  key={mIdx}
                                  className="bg-[#F3F1ED] text-[#111111] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#E4E2DD]"
                                >
                                  {meal}
                                </span>
                              ))}
                            </div>

                            <div
                              className={`w-8 h-8 rounded-full bg-[#FAF9F6] border border-[#E4E2DD] flex items-center justify-center transition-transform duration-300 ${
                                isExpanded ? "rotate-180 bg-[#0D2C24] text-amber-300" : "text-[#52525B]"
                              }`}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </button>

                        {/* Accordion Body */}
                        {isExpanded && (
                          <div className="px-6 pb-7 pt-2 border-t border-[#E4E2DD]/60 space-y-6">
                            {/* Detailed Narrative */}
                            <p className="text-sm sm:text-base text-[#52525B] font-normal leading-relaxed">
                              {day.description}
                            </p>

                            {/* Activity Photos */}
                            {day.activityPhotos.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {day.activityPhotos.map((photo, pIdx) => (
                                  <div
                                    key={pIdx}
                                    className="relative h-48 rounded-xl overflow-hidden shadow-xs border border-[#E4E2DD]"
                                  >
                                    <img
                                      src={photo}
                                      alt={`${day.title} activity`}
                                      className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Bespoke Stay Highlight Feature Card (Horizontal Split) */}
                            {day.accommodationName && (
                              <div className="bg-[#F3F1ED] border border-[#E4E2DD] rounded-xl p-5 shadow-xs">
                                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E4E2DD]/60">
                                  <div className="flex items-center gap-2">
                                    <Building className="w-4 h-4 text-[#0D2C24]" />
                                    <span className="eyebrow text-[#0D2C24]">
                                      Sanctuary Stay For Day {dayPadded}
                                    </span>
                                  </div>
                                  {day.accommodationRating && (
                                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-[#0D2C24] px-2.5 py-0.5 rounded-full font-sans tabular-nums">
                                      <Star className="w-3 h-3 fill-amber-300" />
                                      <span>{day.accommodationRating.toFixed(1)} ★ Luxury Standard</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-5 items-start">
                                  {day.accommodationPhoto && (
                                    <div className="w-full sm:w-44 h-32 rounded-lg overflow-hidden shrink-0 border border-[#E4E2DD] relative">
                                      <img
                                        src={day.accommodationPhoto}
                                        alt={day.accommodationName}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="space-y-2 flex-1">
                                    <h4 className="font-heading text-lg font-bold text-[#111111]">
                                      {day.accommodationName}
                                    </h4>
                                    <p className="text-xs text-[#52525B] font-normal leading-relaxed">
                                      {day.accommodationDetails || "Handpicked 5-star heritage sanctuary featuring personalized butler service and gourmet dining."}
                                    </p>
                                    {day.mealsIncluded.length > 0 && (
                                      <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                                        <span className="text-emerald-800 font-semibold">Included Dining:</span>
                                        {day.mealsIncluded.map((meal, idx) => (
                                          <span
                                            key={idx}
                                            className="bg-white border border-[#E4E2DD] text-[#111111] px-2 py-0.5 rounded text-[10px] font-semibold"
                                          >
                                            {meal}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Route Map Preview */}
            <div className="bg-white rounded-2xl p-7 sm:p-8 shadow-card border border-[#E4E2DD] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                    Interactive Route Map & Pins
                  </h2>
                  <p className="text-xs text-[#52525B] mt-1">
                    Route coordinates and verified checkpoints for this expedition.
                  </p>
                </div>
                <Compass className="w-6 h-6 text-[#0D2C24]" />
              </div>

              {/* Coordinates List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.mapCoordinates.map((pin, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3.5 rounded-xl bg-[#F3F1ED] border border-[#E4E2DD] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#0D2C24] text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {pIdx + 1}
                      </span>
                      <span className="text-xs font-bold text-[#111111]">{pin.name}</span>
                    </div>
                    <span className="text-[10px] font-sans tabular-nums text-[#52525B] bg-white px-2 py-0.5 rounded border border-[#E4E2DD]">
                      {pin.lat.toFixed(2)}°N, {pin.lng.toFixed(2)}°E
                    </span>
                  </div>
                ))}
              </div>

              {/* Visual Map Canvas / Embed Simulation */}
              <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-[#0D2C24] flex flex-col items-center justify-center text-center p-6 border border-[#1A453B]">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')",
                  }}
                />
                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D2C24]/90 border border-amber-300/40 text-amber-300 text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Live Route Navigation Checkpoints</span>
                  </div>
                  <h4 className="font-heading text-xl font-bold text-white">
                    {pkg.destination} Scenic Corridor
                  </h4>
                  <p className="text-xs text-white/80 max-w-sm mx-auto">
                    Full route mapped with GPS waypoints, private chauffeur checkpoints, and airport VIP meet & greet points.
                  </p>
                </div>
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="bg-white rounded-2xl p-7 shadow-card border border-[#E4E2DD]">
                <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[#E4E2DD]">
                  <CheckCircle className="w-6 h-6 text-[#0D2C24]" />
                  <h3 className="font-heading text-xl font-bold text-[#111111]">
                    What Is Included
                  </h3>
                </div>
                <ul className="space-y-3">
                  {pkg.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#111111] leading-relaxed">
                      <span className="text-[#0D2C24] font-bold shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-white rounded-2xl p-7 shadow-card border border-[#E4E2DD]">
                <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[#E4E2DD]">
                  <XCircle className="w-6 h-6 text-[#52525B]" />
                  <h3 className="font-heading text-xl font-bold text-[#111111]">
                    What Is Excluded
                  </h3>
                </div>
                <ul className="space-y-3">
                  {pkg.exclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#52525B] leading-relaxed">
                      <span className="text-rose-500 font-bold shrink-0">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Payment & Cancellation Policies */}
            <div className="bg-white rounded-2xl p-7 sm:p-8 shadow-card border border-[#E4E2DD] space-y-6">
              <h3 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">
                Booking Terms & Cancellation Guarantees
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-[#F3F1ED] border border-[#E4E2DD]">
                  <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#111111] mb-2">
                    <CreditCard className="w-4 h-4 text-[#0D2C24]" />
                    <span>Payment Policy</span>
                  </div>
                  <p className="text-xs text-[#52525B] leading-relaxed font-sans">
                    {pkg.paymentPolicy}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#F3F1ED] border border-[#E4E2DD]">
                  <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#111111] mb-2">
                    <Shield className="w-4 h-4 text-[#0D2C24]" />
                    <span>Cancellation Policy</span>
                  </div>
                  <p className="text-xs text-[#52525B] leading-relaxed font-sans">
                    {pkg.cancellationPolicy}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: Sticky Dual-Tab Booking & Inquiry Sidebar */}
          <div className="lg:col-span-4 sticky top-24 space-y-5">
            <div className="bg-white rounded-2xl shadow-card border border-[#E4E2DD] overflow-hidden">
              {/* Tabs Switcher */}
              <div className="flex border-b border-[#E4E2DD] bg-[#FAF9F6]">
                <button
                  type="button"
                  onClick={() => setActiveTab("inquiry")}
                  className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all font-sans ${
                    activeTab === "inquiry"
                      ? "bg-white text-[#0D2C24] border-b-2 border-[#0D2C24]"
                      : "text-[#52525B] hover:text-[#111111]"
                  }`}
                >
                  Custom Quote
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("book")}
                  className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all font-sans ${
                    activeTab === "book"
                      ? "bg-white text-[#0D2C24] border-b-2 border-[#0D2C24]"
                      : "text-[#52525B] hover:text-[#111111]"
                  }`}
                >
                  Direct Reserve
                </button>
              </div>

              {/* Price Banner inside Card */}
              <div className="p-5 bg-[#0D2C24] text-white flex items-center justify-between font-sans">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-amber-300 block font-semibold">
                    Tariff Per Guest
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="price-display text-2xl sm:text-3xl font-bold text-white tabular-nums">
                      ₹{effectivePrice.toLocaleString("en-IN")}
                    </span>
                    {pkg.discountedPrice && pkg.basePrice > pkg.discountedPrice && (
                      <span className="text-xs line-through text-white/50 tabular-nums">
                        ₹{pkg.basePrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-white block tabular-nums">
                    {pkg.durationDays}D / {pkg.durationNights}N
                  </span>
                  <span className="text-[10px] text-amber-300 font-medium">
                    5★ Stays Included
                  </span>
                </div>
              </div>

              {/* TAB 1: Send Inquiry / Custom Quote */}
              {activeTab === "inquiry" && (
                <div className="p-5 sm:p-6 font-sans">
                  {inquirySuccess ? (
                    <div className="text-center py-6 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#F3F1ED] text-[#0D2C24] flex items-center justify-center mx-auto border border-[#E4E2DD]">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <h4 className="font-heading text-lg font-bold text-[#111111]">
                        Inquiry Received
                      </h4>
                      <p className="text-xs text-[#52525B] leading-relaxed">
                        Ref ID:{" "}
                        <code className="font-semibold text-[#0D2C24] bg-[#F3F1ED] px-1.5 py-0.5 rounded-md border border-[#E4E2DD] tabular-nums">
                          {inquirySuccess.id}
                        </code>
                        . Our travel curator will share a personalized proposal shortly.
                      </p>
                      <button
                        type="button"
                        onClick={() => setInquirySuccess(null)}
                        className="text-xs font-semibold text-[#0D2C24] hover:underline pt-2 block mx-auto uppercase tracking-wider"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                      {inquiryError && (
                        <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                          {inquiryError}
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your full name"
                          value={inquiryForm.name}
                          onChange={(e) =>
                            setInquiryForm({ ...inquiryForm, name: e.target.value })
                          }
                          className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-xs text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1">
                            Phone / WhatsApp *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={inquiryForm.phone}
                            onChange={(e) =>
                              setInquiryForm({
                                ...inquiryForm,
                                phone: e.target.value,
                                whatsappNumber: e.target.value,
                              })
                            }
                            className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-xs tabular-nums text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="you@email.com"
                            value={inquiryForm.email}
                            onChange={(e) =>
                              setInquiryForm({ ...inquiryForm, email: e.target.value })
                            }
                            className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-xs text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1">
                            Travel Date
                          </label>
                          <input
                            type="date"
                            value={inquiryForm.travelDate}
                            onChange={(e) =>
                              setInquiryForm({
                                ...inquiryForm,
                                travelDate: e.target.value,
                              })
                            }
                            className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-xs tabular-nums text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1">
                            Guests
                          </label>
                          <select
                            value={inquiryForm.paxCount}
                            onChange={(e) =>
                              setInquiryForm({
                                ...inquiryForm,
                                paxCount: e.target.value,
                              })
                            }
                            className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-xs text-[#111111] focus:outline-none focus:border-[#0D2C24] bg-white cursor-pointer"
                          >
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests (Couple)</option>
                            <option value="3">3 Guests</option>
                            <option value="4">4 Guests (Family)</option>
                            <option value="5">5+ Guests</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1">
                          Special Requests
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Suite preferences, celebrations..."
                          value={inquiryForm.notes}
                          onChange={(e) =>
                            setInquiryForm({ ...inquiryForm, notes: e.target.value })
                          }
                          className="w-full p-3 rounded-xl border border-[#E4E2DD] text-xs text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={inquiryLoading}
                        className="btn btn-primary w-full h-11 text-xs uppercase tracking-wider font-semibold rounded-xl justify-center"
                      >
                        {inquiryLoading ? (
                          <span>Submitting...</span>
                        ) : (
                          <>
                            <span>Request Custom Quote</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: Book Directly */}
              {activeTab === "book" && (
                <div className="p-5 sm:p-6 font-sans">
                  {/* Instant Checkout Shortcut Button */}
                  <Link
                    href={`/book/${pkg.slug}`}
                    className="btn btn-primary w-full h-11 text-xs uppercase tracking-wider font-semibold rounded-xl mb-4 justify-center"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Instant Razorpay Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="relative flex py-2 items-center mb-4">
                    <div className="flex-grow border-t border-[#E4E2DD]"></div>
                    <span className="flex-shrink mx-3 text-[10px] uppercase font-semibold text-[#52525B]">
                      Or Reserve Slot
                    </span>
                    <div className="flex-grow border-t border-[#E4E2DD]"></div>
                  </div>

                  {bookingSuccess ? (
                    <div className="text-center py-6 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#F3F1ED] text-[#0D2C24] flex items-center justify-center mx-auto border border-[#E4E2DD]">
                        <CheckCircle className="w-7 h-7" />
                      </div>
                      <h4 className="font-heading text-lg font-bold text-[#111111]">
                        Booking Reserved!
                      </h4>
                      <p className="text-xs text-[#52525B] leading-relaxed">
                        Booking Ref:{" "}
                        <strong className="text-[#111111] font-semibold tabular-nums">
                          {bookingSuccess.reference}
                        </strong>
                      </p>
                      <div className="p-3 bg-[#F3F1ED] rounded-xl text-xs font-bold text-[#0D2C24] border border-[#E4E2DD]">
                        Total Est: ₹{bookingSuccess.totalAmount.toLocaleString("en-IN")}
                      </div>
                      <p className="text-[11px] text-[#52525B]">
                        Our Concierge will send the Razorpay payment link & confirmation voucher to your WhatsApp/Email.
                      </p>
                      <button
                        type="button"
                        onClick={() => setBookingSuccess(null)}
                        className="text-xs font-semibold text-[#0D2C24] hover:underline pt-2 block mx-auto uppercase tracking-wider"
                      >
                        New Reservation
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                      {bookingError && (
                        <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                          {bookingError}
                        </div>
                      )}

                      {/* Real-time Calculation Summary */}
                      <div className="p-3 rounded-xl bg-[#F3F1ED] border border-[#E4E2DD] flex items-center justify-between text-xs">
                        <span className="text-[#52525B]">
                          ₹{effectivePrice.toLocaleString("en-IN")} × {paxBookingCount} Guests
                        </span>
                        <span className="font-heading font-bold text-[#0D2C24] text-sm tabular-nums">
                          ₹{calculatedTotal.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1">
                          Primary Traveller Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Vikram Singhania"
                          value={bookingForm.name}
                          onChange={(e) =>
                            setBookingForm({ ...bookingForm, name: e.target.value })
                          }
                          className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-xs text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={bookingForm.phone}
                            onChange={(e) =>
                              setBookingForm({
                                ...bookingForm,
                                phone: e.target.value,
                                whatsappNumber: e.target.value,
                              })
                            }
                            className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-xs tabular-nums text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="vikram@email.com"
                            value={bookingForm.email}
                            onChange={(e) =>
                              setBookingForm({ ...bookingForm, email: e.target.value })
                            }
                            className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-xs text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1">
                            Travel Date *
                          </label>
                          <input
                            type="date"
                            required
                            value={bookingForm.travelStartDate}
                            onChange={(e) =>
                              setBookingForm({
                                ...bookingForm,
                                travelStartDate: e.target.value,
                              })
                            }
                            className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-xs tabular-nums text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1">
                            Guests
                          </label>
                          <select
                            value={bookingForm.paxCount}
                            onChange={(e) =>
                              setBookingForm({
                                ...bookingForm,
                                paxCount: e.target.value,
                              })
                            }
                            className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-xs text-[#111111] focus:outline-none focus:border-[#0D2C24] bg-white cursor-pointer"
                          >
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4">4 Guests</option>
                            <option value="5">5+ Guests</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="btn btn-primary w-full h-11 rounded-xl text-xs uppercase tracking-wider font-semibold justify-center"
                      >
                        {bookingLoading ? (
                          <span>Reserving Hold...</span>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Confirm Provisional Hold</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Direct WhatsApp Concierge CTA */}
              <div className="p-4 bg-[#F3F1ED] border-t border-[#E4E2DD] text-center space-y-2 font-sans">
                <a
                  href={`https://wa.me/919876543210?text=Hello%20Trip%20Master%20Concierge,%20I%20am%20interested%20in%20${encodeURIComponent(
                    pkg.title
                  )}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba5a] text-slate-900 font-bold py-2.5 rounded-xl text-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4 fill-slate-900" />
                  <span>Instant WhatsApp with Concierge</span>
                </a>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[#52525B] tabular-nums font-medium">
                  <Phone className="w-3 h-3 text-[#0D2C24]" />
                  <span>Direct Hotline: +91 98765 43210</span>
                </div>
              </div>
            </div>

            {/* Trust Assurances */}
            <div className="p-5 rounded-2xl bg-white border border-[#E4E2DD] shadow-card space-y-2.5 text-xs text-[#52525B] font-sans">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#0D2C24] shrink-0" />
                <span className="font-medium text-[#111111]">100% Financial Hold Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#D97706] fill-[#D97706] shrink-0" />
                <span className="font-medium text-[#111111]">Vetted Luxury 5★ Heritage Hotels</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0D2C24] shrink-0" />
                <span className="font-medium text-[#111111]">Complimentary Room Upgrades (Subject to availability)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

