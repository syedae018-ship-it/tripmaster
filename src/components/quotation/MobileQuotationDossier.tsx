"use client";

import React from "react";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  Phone,
  Mail,
  ShieldCheck,
  Building,
  Utensils,
  Compass,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export interface QuotationContentData {
  heroImage: string;
  title: string;
  subtitle?: string;
  mapIntro?: string;
  mapStops?: Array<{ name: string; label?: string }>;
  summary: {
    duration: string;
    destination: string;
    pricePerPersonFormatted: string;
    pricePerPerson: number;
    paxCount?: number;
    totalCostFormatted?: string;
  };
  costBreakdown: Array<{ category: string; cost: string }>;
  staySummary: {
    city: string;
    hotelName: string;
    roomType: string;
    rating: number;
    photo: string;
  };
  mealsBanner: {
    title: string;
    description: string;
    tags: string[];
  };
  quickDayWiseSummary: Array<{ day: string; summary: string }>;
  days: Array<{
    dayNumber: number;
    dayTitle: string;
    dateLabel?: string;
    places: Array<{
      title: string;
      subtitle: string;
      category?: string;
      photos: string[];
      description: string;
    }>;
    hotel?: {
      name: string;
      photo: string;
      rating: number;
      roomType: string;
      description: string;
    } | null;
  }>;
  momentsThatMatter: Array<{ url: string; caption: string }>;
  inclusions: string[];
  exclusions: string[];
  paymentPolicy: string[];
  reviews: Array<{
    customerName: string;
    tripDestination: string;
    rating: number;
    reviewText: string;
  }>;
  advisor: {
    name: string;
    phone: string;
    whatsappNumber: string;
    email: string;
    offices: string;
    companyName: string;
  };
}

interface MobileQuotationDossierProps {
  data: QuotationContentData;
  quotationNumber?: string;
  clientName?: string;
  id?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const MobileQuotationDossier = React.forwardRef<
  HTMLDivElement,
  MobileQuotationDossierProps
>(({ data, quotationNumber, clientName, id = "mobile-quotation-dossier" }, ref) => {
  return (
    <div
      ref={ref}
      id={id}
      className="w-full max-w-[430px] mx-auto bg-[#FBFBFA] text-[#111111] font-sans antialiased shadow-2xl overflow-hidden rounded-3xl border border-[#E4E2DD] selection:bg-amber-200"
      style={{
        width: "430px",
        minWidth: "430px",
      }}
    >
      {/* =====================================================================
          1. HERO BANNER & PACKAGE TITLE
          ===================================================================== */}
      <div className="relative w-full aspect-[4/3] bg-zinc-900 overflow-hidden">
        <img
          src={data.heroImage}
          alt={data.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 flex flex-col justify-between p-5 text-white">
          {/* Top Brand Header inside Mobile PDF */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-amber-300">
                Trip Master
              </span>
              <span className="text-[10px] text-white/70">• Luxury Dossier</span>
            </div>
            {quotationNumber && (
              <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded text-white backdrop-blur-xs">
                {quotationNumber}
              </span>
            )}
          </div>

          {/* Hero Bottom Copy */}
          <div>
            {clientName && (
              <span className="text-[11px] font-medium text-amber-300 uppercase tracking-wider block mb-1">
                Prepared Exclusively for {clientName}
              </span>
            )}
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white leading-tight drop-shadow-sm">
              {data.title}
            </h1>
            {data.subtitle && (
              <p className="text-xs text-white/85 font-normal mt-1 leading-relaxed">
                {data.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Mobile Body Container */}
      <div className="p-4 space-y-4">
        {/* =====================================================================
            2. MAP VIEW & ROUTE STOPS CARD
            ===================================================================== */}
        <div className="bg-white rounded-2xl p-4 border border-[#E4E2DD] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#0D2C24]" />
              <h3 className="font-heading font-bold text-sm text-[#0D2C24] uppercase tracking-wider">
                Map View & Route Overview
              </h3>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {data.summary.destination}
            </span>
          </div>

          {/* Map Preview Graphic with Pinned Stops */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-emerald-900 to-[#0D2C24] p-3.5 text-white">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-2 pb-1 border-b border-white/10">
              <span>Planned Itinerary Stops</span>
              <span>{data.mapStops?.length || 5} Pinned Locations</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {data.mapStops?.map((stop, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-1.5 bg-white/10 backdrop-blur-xs rounded-lg p-1.5 text-[10px]"
                >
                  <MapPin className="w-3 h-3 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block leading-tight">
                      {stop.name}
                    </span>
                    {stop.label && (
                      <span className="text-white/70 text-[9px] block">
                        {stop.label}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {data.mapIntro && (
            <p className="text-xs text-[#52525B] leading-relaxed font-normal">
              {data.mapIntro}
            </p>
          )}
        </div>

        {/* =====================================================================
            3. SUMMARY CARD
            ===================================================================== */}
        <div className="bg-white rounded-2xl p-4 border border-[#E4E2DD] shadow-xs space-y-3">
          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#0D2C24]">
            Trip Summary
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 bg-[#F6F5F2] p-2.5 rounded-xl border border-[#E4E2DD]">
              <Calendar className="w-4 h-4 text-[#0D2C24]" />
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                  Duration
                </span>
                <span className="font-heading font-bold text-zinc-900">
                  {data.summary.duration}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#F6F5F2] p-2.5 rounded-xl border border-[#E4E2DD]">
              <MapPin className="w-4 h-4 text-[#0D2C24]" />
              <div>
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                  Destination
                </span>
                <span className="font-heading font-bold text-zinc-900">
                  {data.summary.destination}
                </span>
              </div>
            </div>
          </div>

          {/* Highlighted Dark Emerald Price Bar */}
          <div className="bg-[#0D2C24] text-white rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block">
                Total Quotation Value
              </span>
              <span className="font-heading text-lg font-bold text-white tracking-tight">
                {data.summary.pricePerPersonFormatted}
              </span>
            </div>
            {data.summary.totalCostFormatted && (
              <span className="text-[10px] text-white/80 bg-white/10 px-2 py-1 rounded-lg">
                {data.summary.totalCostFormatted}
              </span>
            )}
          </div>
        </div>

        {/* =====================================================================
            4. PACKAGE COST BREAKDOWN & STAY/MEAL OVERVIEW
            ===================================================================== */}
        <div className="bg-white rounded-2xl p-4 border border-[#E4E2DD] shadow-xs space-y-3.5">
          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#0D2C24]">
            Package Cost Breakdown (Per Person)
          </h3>

          <div className="divide-y divide-[#E4E2DD] border border-[#E4E2DD] rounded-xl overflow-hidden text-xs">
            <div className="grid grid-cols-12 bg-[#F6F5F2] p-2 font-heading font-bold text-zinc-600 text-[10px] uppercase tracking-wider">
              <span className="col-span-8">Category</span>
              <span className="col-span-4 text-right">Cost</span>
            </div>
            {data.costBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 p-2.5 items-center font-medium text-zinc-800"
              >
                <span className="col-span-8 text-xs">{item.category}</span>
                <span className="col-span-4 text-right font-heading font-bold text-[#0D2C24]">
                  {item.cost}
                </span>
              </div>
            ))}
          </div>

          {/* Featured Stay Summary Card */}
          {data.staySummary && (
            <div className="border border-[#E4E2DD] rounded-xl p-2.5 bg-[#FAF9F6] flex gap-3 items-center">
              <img
                src={data.staySummary.photo}
                alt={data.staySummary.hotelName}
                className="w-16 h-16 rounded-lg object-cover shrink-0 shadow-xs"
              />
              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] uppercase font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Stay • {data.staySummary.city}
                  </span>
                  <div className="flex items-center text-amber-500 text-[10px]">
                    <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                    <span className="ml-0.5 font-bold">
                      {data.staySummary.rating}
                    </span>
                  </div>
                </div>
                <h4 className="font-heading font-bold text-zinc-900 truncate mt-0.5">
                  {data.staySummary.hotelName}
                </h4>
                <p className="text-[10px] text-zinc-500 truncate">
                  {data.staySummary.roomType}
                </p>
              </div>
            </div>
          )}

          {/* Meals Included Banner */}
          {data.mealsBanner && (
            <div className="border border-amber-200 bg-amber-50/70 rounded-xl p-3 text-xs">
              <div className="flex items-center gap-1.5 text-amber-900 font-heading font-bold text-xs uppercase tracking-wider mb-1">
                <Utensils className="w-3.5 h-3.5 text-amber-700" />
                <span>{data.mealsBanner.title}</span>
              </div>
              <p className="text-[11px] text-amber-950 font-normal leading-relaxed mb-2">
                {data.mealsBanner.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {data.mealsBanner.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] bg-white border border-amber-300 text-amber-900 font-semibold px-2 py-0.5 rounded-full"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =====================================================================
            5. QUICK DAY-WISE SUMMARY
            ===================================================================== */}
        <div className="bg-white rounded-2xl p-4 border border-[#E4E2DD] shadow-xs space-y-2.5">
          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#0D2C24]">
            Quick Day-wise Summary
          </h3>

          <div className="space-y-2">
            {data.quickDayWiseSummary.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2 rounded-xl bg-[#F6F5F2] border border-[#E4E2DD]/70 text-xs"
              >
                <span className="font-heading font-bold text-xs text-white bg-[#0D2C24] px-2 py-0.5 rounded-md shrink-0">
                  {item.day}
                </span>
                <span className="text-zinc-800 font-medium leading-relaxed self-center">
                  {item.summary}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================================
            6. DETAILED DAY-BY-DAY ITINERARY (DAYS 1 TO 4)
            ===================================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pt-2">
            <Calendar className="w-4 h-4 text-[#0D2C24]" />
            <h3 className="font-heading font-bold text-sm text-[#0D2C24] uppercase tracking-wider">
              Detailed Day-by-Day Itinerary
            </h3>
          </div>

          {data.days.map((day) => (
            <div
              key={day.dayNumber}
              className="bg-white rounded-2xl border border-[#E4E2DD] shadow-xs overflow-hidden"
            >
              {/* Day Header Banner */}
              <div className="bg-[#0D2C24] text-white p-3 flex items-center justify-between">
                <div>
                  <span className="font-heading font-bold text-sm tracking-tight text-white block">
                    {day.dayTitle}
                  </span>
                  {day.dateLabel && (
                    <span className="text-[10px] text-amber-300 block font-medium">
                      {day.dateLabel}
                    </span>
                  )}
                </div>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/80 font-bold uppercase tracking-wider">
                  Day 0{day.dayNumber}
                </span>
              </div>

              {/* Stacked Place Cards */}
              <div className="p-3.5 space-y-4 divide-y divide-[#E4E2DD]">
                {day.places.map((place, pIdx) => (
                  <div key={pIdx} className={`${pIdx > 0 ? "pt-4" : ""} space-y-2`}>
                    {/* Place Header */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-heading font-bold text-sm text-zinc-900">
                          {place.title}
                        </h4>
                        {place.category && (
                          <span className="text-[9px] uppercase font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            {place.category}
                          </span>
                        )}
                      </div>
                      {place.subtitle && (
                        <div className="flex items-center gap-1 text-[11px] text-zinc-500 mt-0.5 font-normal">
                          <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{place.subtitle}</span>
                        </div>
                      )}
                    </div>

                    {/* Place Photos Grid */}
                    {place.photos && place.photos.length > 0 && (
                      <div
                        className={`grid gap-1.5 ${
                          place.photos.length > 1 ? "grid-cols-2" : "grid-cols-1"
                        }`}
                      >
                        {place.photos.slice(0, 2).map((photoUrl, photoIdx) => (
                          <div
                            key={photoIdx}
                            className="aspect-[16/10] rounded-xl overflow-hidden bg-zinc-100 border border-[#E4E2DD]"
                          >
                            <img
                              src={photoUrl}
                              alt={place.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Place Description */}
                    <p className="text-xs text-[#52525B] leading-relaxed font-normal">
                      {place.description}
                    </p>
                  </div>
                ))}

                {/* End-of-Day Hotel Card */}
                {day.hotel && (
                  <div className="pt-4">
                    <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-emerald-800" />
                          <span className="text-[10px] uppercase font-bold text-emerald-900 tracking-wider">
                            Overnight Accommodation
                          </span>
                        </div>
                        <div className="flex items-center text-amber-500 text-[10px]">
                          <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                          <span className="ml-0.5 font-bold">
                            {day.hotel.rating} Stars
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2.5">
                        <img
                          src={day.hotel.photo}
                          alt={day.hotel.name}
                          className="w-16 h-16 rounded-lg object-cover shrink-0 border border-emerald-200 shadow-xs"
                        />
                        <div className="text-xs flex-1 min-w-0">
                          <h5 className="font-heading font-bold text-zinc-900 truncate">
                            {day.hotel.name}
                          </h5>
                          <span className="text-[10px] text-zinc-600 block">
                            {day.hotel.roomType}
                          </span>
                          <p className="text-[10px] text-zinc-500 line-clamp-2 mt-0.5">
                            {day.hotel.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* =====================================================================
            7. MOMENTS THAT MATTER (PHOTO COLLAGE)
            ===================================================================== */}
        {data.momentsThatMatter && data.momentsThatMatter.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-[#E4E2DD] shadow-xs space-y-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#0D2C24]">
                Moments That Matter
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {data.momentsThatMatter.map((moment, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden border border-[#E4E2DD] group"
                >
                  <img
                    src={moment.url}
                    alt={moment.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2 text-white">
                    <span className="text-[10px] font-medium leading-tight">
                      {moment.caption}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            8. WHAT'S INCLUDED & EXCLUDED
            ===================================================================== */}
        <div className="bg-white rounded-2xl p-4 border border-[#E4E2DD] shadow-xs space-y-3.5">
          {/* Inclusions */}
          <div>
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>What's Included</span>
            </h3>
            <ul className="space-y-1.5">
              {data.inclusions.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-zinc-700 leading-relaxed"
                >
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="pt-2 border-t border-[#E4E2DD]">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-2">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>What's Excluded</span>
            </h3>
            <ul className="space-y-1.5">
              {data.exclusions.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-zinc-600 leading-relaxed"
                >
                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* =====================================================================
            9. PAYMENT POLICY & TERMS
            ===================================================================== */}
        <div className="bg-white rounded-2xl p-4 border border-[#E4E2DD] shadow-xs space-y-2.5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0D2C24]" />
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#0D2C24]">
              Payment Policy & Cancellation Terms
            </h3>
          </div>

          <div className="space-y-1.5 text-xs text-zinc-700">
            {data.paymentPolicy.map((policy, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span className="leading-relaxed">{policy}</span>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================================
            10. VERIFIED TRAVELLER REVIEWS
            ===================================================================== */}
        {data.reviews && data.reviews.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-[#E4E2DD] shadow-xs space-y-3">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#0D2C24]">
              Verified Traveller Experiences
            </h3>

            <div className="space-y-2.5">
              {data.reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#F6F5F2] border border-[#E4E2DD] space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-zinc-900">
                      {rev.customerName}
                    </span>
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-amber-400 stroke-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-600 italic leading-relaxed">
                    "{rev.reviewText}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            11. ABOUT US & HOLIDAY ADVISOR CARD
            ===================================================================== */}
        <div className="bg-[#0D2C24] text-white rounded-2xl p-4 space-y-3.5">
          <div>
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
              About Trip Master
            </span>
            <p className="text-xs text-white/80 font-normal leading-relaxed mt-1">
              Trip Master is an artisanal luxury travel concierge. We curate bespoke holiday experiences with handpicked 4-star and 5-star properties, seamless transfers, and dedicated concierge support.
            </p>
          </div>

          <div className="border-t border-white/10 pt-3">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block mb-2">
              Your Dedicated Holiday Advisor
            </span>

            <div className="flex items-center justify-between text-xs mb-3">
              <div>
                <span className="font-heading font-bold text-sm text-white block">
                  {data.advisor.name}
                </span>
                <span className="text-[10px] text-white/60 block">
                  {data.advisor.offices}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={`tel:${data.advisor.phone}`}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span>Call Advisor</span>
              </a>
              <a
                href={`https://wa.me/${data.advisor.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hi, I have questions regarding my ${data.title} quotation.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="text-[9px] text-white/50 text-center border-t border-white/10 pt-2.5">
            © 2026 {data.advisor.companyName}. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
});

MobileQuotationDossier.displayName = "MobileQuotationDossier";
