"use client";

import { useState } from "react";
import { Star, MessageSquare, ArrowUpRight, ChevronLeft, ChevronRight, Check } from "lucide-react";

export interface ReviewItem {
  id: string;
  customerName: string;
  tripDestination: string;
  rating: number;
  reviewText: string;
  customerPhoto: string | null;
}

export function SocialProofReviews({
  testimonials = [],
}: {
  testimonials: ReviewItem[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const fallbackReviews: ReviewItem[] = [
    {
      id: "rev-1",
      customerName: "Priya S.",
      tripDestination: "Bali Holiday · 2 weeks ago",
      rating: 5,
      reviewText:
        "An amazing experience! Everything was well organised — from flights to our private pool villa in Seminyak and sunrise trek in Ubud. Highly recommend their services.",
      customerPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "rev-2",
      customerName: "Rohan & Aarti Mehta",
      tripDestination: "Dubai & Desert Safari · 1 month ago",
      rating: 5,
      reviewText:
        "The private yacht cruise along Dubai Marina and the VIP desert camp were unforgettable. Seamless chauffeur transfers and zero waiting in queues anywhere.",
      customerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "rev-3",
      customerName: "Siddharth Verma",
      tripDestination: "Kashmir Royal Sanctuary · 3 weeks ago",
      rating: 5,
      reviewText:
        "The luxury cedar houseboat on Dal Lake and the suite at The Khyber were out of this world. Our personal concierge was attentive 24/7. Worth every single rupee.",
      customerPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "rev-4",
      customerName: "Vikram & Sunita Kapoor",
      tripDestination: "Europe Highlights · 2 months ago",
      rating: 5,
      reviewText:
        "From the Glacier Express in Switzerland to our private Seine cruise in Paris, Trip Master planned every single train and transfer with precision. Truly world-class.",
      customerPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
  ];

  const displayReviews = testimonials.length > 0 ? testimonials : fallbackReviews;
  const currentReview = displayReviews[currentIndex] || fallbackReviews[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayReviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === displayReviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="reviews" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Section Header (Left-aligned) */}
      <div className="mb-10 text-left max-w-3xl">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-[1.12]">
          Trusted by travellers. Proven by experiences.
        </h2>
        <p className="font-sans text-base sm:text-lg text-[#52525B] mt-2 font-normal">
          Real reviews from real people who have travelled with us.
        </p>
      </div>

      {/* Top 2-Column Summary Cards (grid-cols-1 md:grid-cols-2 gap-6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card 1: Google Reviews */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E4E2DD] shadow-card flex items-center justify-between hover:border-[#0D2C24]/30 transition-all">
          <div className="flex items-center gap-4">
            {/* Google Logo Icon SVG */}
            <div className="w-14 h-14 rounded-2xl bg-[#F3F1ED] flex items-center justify-center shrink-0 border border-[#E4E2DD]">
              <svg className="w-7 h-7" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <div className="font-heading font-bold text-2xl sm:text-3xl text-[#111111] tabular-nums tracking-tight">
                4.8 / 5
              </div>
              <div className="font-sans text-xs sm:text-sm font-semibold text-[#52525B]">
                Google Rating
              </div>
            </div>
          </div>

          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold uppercase tracking-wider text-[#0D2C24] hover:text-[#133E33] inline-flex items-center gap-1 group py-2"
          >
            <span>Read Google Reviews</span>
            <ArrowUpRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Card 2: Customer Reviews */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E4E2DD] shadow-card flex items-center justify-between hover:border-[#0D2C24]/30 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F3F1ED] text-[#0D2C24] flex items-center justify-center shrink-0 border border-[#E4E2DD]">
              <MessageSquare className="w-7 h-7 stroke-[2]" />
            </div>
            <div>
              <div className="font-heading font-bold text-2xl sm:text-3xl text-[#111111] tabular-nums tracking-tight">
                2,500+
              </div>
              <div className="font-sans text-xs sm:text-sm font-semibold text-[#52525B]">
                Customer Reviews
              </div>
            </div>
          </div>

          <a
            href="#reviews-carousel"
            className="text-xs font-semibold uppercase tracking-wider text-[#0D2C24] hover:text-[#133E33] inline-flex items-center gap-1 group py-2"
          >
            <span>View All Reviews</span>
            <ArrowUpRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Bottom Review Carousel Container (Full Width below the 2 cards) */}
      <div
        id="reviews-carousel"
        className="bg-white rounded-2xl border border-[#E4E2DD] shadow-card overflow-hidden"
      >
        {/* Top bar inside container */}
        <div className="bg-[#FAF9F6] px-6 py-4 border-b border-[#E4E2DD] flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
            Third-Party Review Embed (e.g., Google Reviews)
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
            <Check className="w-3.5 h-3.5" />
            Verified Reviews
          </span>
        </div>

        {/* Interactive Carousel Card */}
        <div className="p-8 sm:p-12 relative flex items-center justify-between gap-6 sm:gap-10">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            className="w-11 h-11 rounded-full bg-[#FAF9F6] border border-[#E4E2DD] hover:bg-[#F3F1ED] text-[#111111] flex items-center justify-center shrink-0 transition-colors shadow-xs"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Review Center Content */}
          <div className="flex-1 max-w-2xl mx-auto text-center space-y-4">
            {/* Reviewer Avatar */}
            <div className="mx-auto w-16 h-16 rounded-full overflow-hidden border-2 border-[#0D2C24] p-0.5 shadow-sm">
              {currentReview.customerPhoto ? (
                <img
                  src={currentReview.customerPhoto}
                  alt={currentReview.customerName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-[#0D2C24] text-white flex items-center justify-center font-heading font-bold text-lg rounded-full">
                  {currentReview.customerName[0]}
                </div>
              )}
            </div>

            {/* 5-Star Rating */}
            <div className="flex items-center justify-center gap-1 text-amber-500">
              {[...Array(currentReview.rating || 5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
              ))}
            </div>

            {/* Review Quote Text */}
            <blockquote className="font-sans text-base sm:text-xl text-[#111111] font-normal leading-relaxed italic">
              "{currentReview.reviewText}"
            </blockquote>

            {/* Author Footer */}
            <div className="pt-2">
              <span className="font-heading font-bold text-sm text-[#111111]">
                {currentReview.customerName}
              </span>
              <span className="text-[#52525B] text-xs font-medium block mt-0.5">
                {currentReview.tripDestination}
              </span>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNext}
            className="w-11 h-11 rounded-full bg-[#FAF9F6] border border-[#E4E2DD] hover:bg-[#F3F1ED] text-[#111111] flex items-center justify-center shrink-0 transition-colors shadow-xs"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Pagination Dots */}
        <div className="pb-6 flex items-center justify-center gap-2">
          {displayReviews.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? "w-8 bg-[#0D2C24]" : "w-2 bg-[#E4E2DD] hover:bg-[#52525B]"
              }`}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

