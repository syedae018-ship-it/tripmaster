"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function FaqSection({ faqs }: { faqs: FAQItem[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faqs" className="py-20 sm:py-28 bg-[#FAF9F6] border-t border-[#E4E2DD] font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-12">
          <p className="eyebrow text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-800">
            Frequently Asked Questions
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-[1.12] mt-2 text-balance">
            Concierge policies & booking details.
          </h2>
        </div>

        <div className="divide-y divide-[#E4E2DD] border-y border-[#E4E2DD]">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="py-5">
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between text-left text-base sm:text-lg font-bold text-[#111111] hover:text-[#0D2C24] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D2C24] rounded-sm"
                >
                  <span className="pr-6 font-heading font-bold">{faq.question}</span>
                  <div className="w-6 h-6 flex items-center justify-center text-[#52525B] shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-3 pb-2 pr-12 text-sm text-[#52525B] leading-relaxed font-sans">
                    <p>{faq.answer}</p>
                    <span className="inline-block mt-3 text-[11px] font-semibold uppercase tracking-wider text-[#52525B]">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
