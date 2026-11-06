"use client";

import { useState } from "react";
import { Check, ArrowRight, Users, ShieldCheck, Heart, Award } from "lucide-react";

export function AboutTeamSection({
  aboutText,
}: {
  aboutText?: string;
}) {
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  const bulletPoints = [
    { title: "Personalised itineraries", desc: "Designed around your exact schedule, budget, and travel tempo." },
    { title: "Transparent pricing", desc: "All inclusions clearly detailed upfront with zero hidden surcharges." },
    { title: "Dedicated travel support (before, during & after)", desc: "Direct WhatsApp and hotline access to your personal curator 24/7." },
    { title: "Experienced and passionate travel team", desc: "Seasoned destination specialists with verified local connections worldwide." },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Section Header (Left-aligned) */}
      <div className="mb-12 text-left max-w-3xl">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-[1.12]">
          More than a holiday. A team that cares.
        </h2>
      </div>

      {/* 2-Column Split Layout (grid-cols-1 lg:grid-cols-12 gap-8 items-center) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column (5 cols): Rounded image container featuring OUR TEAM / OFFICE IMAGE */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-card border border-[#E4E2DD] bg-[#F3F1ED] group">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85"
              alt="Trip Master Travel Specialists and Curators Team"
              className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

            {/* Top Label Badge */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>Our Team & Travel Specialists</span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-amber-300 font-heading font-bold text-xs uppercase tracking-widest block">
                Trip Master Concierge Studio
              </span>
              <p className="font-heading font-bold text-lg leading-snug">
                Passionate travel architects behind every bespoke journey.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Content & Bullets */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Subheading (Helvetica Bold) */}
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
            Why travellers choose us
          </h3>

          {/* Intro Paragraph (Poppins) */}
          <p className="font-sans text-base sm:text-lg text-[#52525B] leading-relaxed font-normal">
            {aboutText ||
              "At Trip Master, we believe travel should be more than a booking — it should be an effortless, soul-enriching experience. For over 15 years, our specialist curators have crafted personalized holiday packages across the globe, pairing handpicked 5-star sanctuaries with dedicated 24/7 on-ground concierge support."}
          </p>

          {/* 4 Checkmark Bullet Points (✓) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {bulletPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border border-[#E4E2DD] shadow-xs flex items-start gap-3 hover:border-[#0D2C24]/40 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#0D2C24] text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="font-heading font-bold text-sm text-[#111111]">
                    {point.title}
                  </div>
                  <div className="font-sans text-xs text-[#52525B] mt-0.5">
                    {point.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button: Dark rounded button "MEET OUR TEAM →" */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setTeamModalOpen(true)}
              className="btn bg-[#0D2C24] hover:bg-[#133E33] text-white px-7 py-3.5 rounded-full font-heading font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2.5 shadow-md hover:shadow-lg transition-all"
            >
              <span>Meet Our Team</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Team Modal */}
      {teamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E4E2DD] p-7 sm:p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#E4E2DD]">
              <div>
                <h3 className="font-heading text-2xl font-bold text-[#111111]">
                  Meet The Trip Master Team
                </h3>
                <p className="text-xs text-[#52525B] mt-0.5">
                  Dedicated holiday specialists based in Bengaluru & on-ground across key global hubs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTeamModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F3F1ED] hover:bg-[#E4E2DD] text-[#111111] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-[#FAF9F6] border border-[#E4E2DD]">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  alt="Ananya Sharma"
                  className="w-20 h-20 rounded-full mx-auto object-cover mb-3 border-2 border-[#0D2C24]"
                />
                <h4 className="font-heading font-bold text-sm text-[#111111]">Ananya Sharma</h4>
                <span className="text-[11px] text-[#0D2C24] font-semibold block">Head of Curations</span>
                <p className="text-[11px] text-[#52525B] mt-1">12+ years designing Southeast Asia & Island escapes.</p>
              </div>

              <div className="text-center p-4 rounded-xl bg-[#FAF9F6] border border-[#E4E2DD]">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                  alt="Devansh Patel"
                  className="w-20 h-20 rounded-full mx-auto object-cover mb-3 border-2 border-[#0D2C24]"
                />
                <h4 className="font-heading font-bold text-sm text-[#111111]">Devansh Patel</h4>
                <span className="text-[11px] text-[#0D2C24] font-semibold block">Middle East & Europe Lead</span>
                <p className="text-[11px] text-[#52525B] mt-1">Specialist in Swiss Alps circuits & Dubai luxury.</p>
              </div>

              <div className="text-center p-4 rounded-xl bg-[#FAF9F6] border border-[#E4E2DD]">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                  alt="Meera Nambiar"
                  className="w-20 h-20 rounded-full mx-auto object-cover mb-3 border-2 border-[#0D2C24]"
                />
                <h4 className="font-heading font-bold text-sm text-[#111111]">Meera Nambiar</h4>
                <span className="text-[11px] text-[#0D2C24] font-semibold block">24/7 Concierge Director</span>
                <p className="text-[11px] text-[#52525B] mt-1">Ensuring real-time support from departure to return.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setTeamModalOpen(false)}
                className="btn btn-primary px-5 py-2 text-xs uppercase tracking-wider font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
