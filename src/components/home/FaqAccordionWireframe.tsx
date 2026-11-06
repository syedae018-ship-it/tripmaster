"use client";

import { useState } from "react";
import { ChevronDown, Plus, Minus, HelpCircle } from "lucide-react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function FaqAccordionWireframe({
  faqs = [],
}: {
  faqs: FAQItem[];
}) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || "faq-1");

  const fallbackFaqs: FAQItem[] = [
    {
      id: "faq-1",
      question: "How do I book a holiday package?",
      answer:
        "Booking with Trip Master is completely seamless and guest-friendly with zero login friction. Simply click 'Plan My Trip' or 'Explore' on your preferred package. You can choose to reserve your slot directly with a 25% token advance via Razorpay, or request a custom itinerary quote. A dedicated travel manager will confirm all flight connections, room preferences, and vouchers within 4 hours.",
      category: "Booking",
    },
    {
      id: "faq-2",
      question: "Are your packages customisable?",
      answer:
        "Yes, 100%. Every package is a flexible blueprint designed to be tailored to your specific schedule, party size, and luxury preferences. We can adjust the duration, upgrade your villa or suite, arrange private chartered yachts or helicopter transfers, and accommodate special culinary and dietary requests.",
      category: "Customisation",
    },
    {
      id: "faq-3",
      question: "What is included in the package price?",
      answer:
        "Our pricing is transparent and comprehensive. All packages include vetted 4★ and 5★ accommodations, daily gourmet breakfast, private chauffeured luxury SUVs/sedans with professional captains, priority sightseeing passes, airport VIP meet & greet, and 24/7 concierge support. We never charge hidden surcharges.",
      category: "Pricing & Inclusions",
    },
    {
      id: "faq-4",
      question: "What are your payment and cancellation policies?",
      answer:
        "We offer flexible payment terms: you can lock your reservation with a 25% booking token deposit, with the remaining balance due 15 days before departure. We also offer 100% full refund cancellation up to 14–21 days prior to your travel date, clearly detailed on every booking voucher.",
      category: "Policies",
    },
    {
      id: "faq-5",
      question: "Will I have support during my trip?",
      answer:
        "Yes. From arrival to departure, you will have a personal on-ground Trip Concierge available 24/7 via phone and WhatsApp. They monitor flight schedules, arrange seamless hotel check-ins, manage route chauffeurs, and assist with restaurant reservations in real-time.",
      category: "Support",
    },
  ];

  const displayFaqs = faqs.length > 0 ? faqs : fallbackFaqs;

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faqs" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Section Header (Left-aligned) */}
      <div className="mb-10 text-left max-w-3xl">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-[1.12]">
          Questions before you take off?
        </h2>
      </div>

      {/* 5 Stacked Full-Width Accordion Rows with left chevron and right +/- */}
      <div className="space-y-3.5">
        {displayFaqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "bg-white border-[#0D2C24]/40 shadow-card"
                  : "bg-white border-[#E4E2DD] hover:border-slate-300"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors focus-visible:outline-none"
              >
                {/* Left chevron and question in Helvetica Bold */}
                <div className="flex items-center gap-3.5 pr-4">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[#0D2C24] text-amber-300" : "bg-[#F3F1ED] text-[#52525B]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <span className="font-heading font-bold text-base sm:text-lg text-[#111111] leading-snug">
                    {faq.question}
                  </span>
                </div>

                {/* Right +/- toggle icon */}
                <div className="w-7 h-7 rounded-full bg-[#FAF9F6] border border-[#E4E2DD] flex items-center justify-center text-[#52525B] shrink-0">
                  {isOpen ? <Minus className="w-4 h-4 text-[#0D2C24]" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#52525B] leading-relaxed border-t border-[#F3F1ED] pl-16">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
