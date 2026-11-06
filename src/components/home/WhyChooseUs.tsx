export function WhyChooseUs() {
  const distinctions = [
    {
      title: "Individual Choreography",
      description:
        "Every itinerary is engineered around private milestones, bespoke gourmet palates, and chosen tempos. No pre-packaged schedules.",
    },
    {
      title: "Vetted Heritage & 5-Star Sanctuaries",
      description:
        "Established partnerships with Taj, Oberoi, Khyber, and private eco-luxury estates with guaranteed privileges, suite upgrades, and breakfast inclusion.",
    },
    {
      title: "Dedicated Chauffeured Fleet",
      description:
        "Dedicated luxury SUVs (Innova Crysta, Fortuner, Mercedes) with certified courteous chauffeur captains, chilled bottled water, and regional permits.",
    },
    {
      title: "24/7 Dedicated Trip Concierge",
      description:
        "A personal ground manager assigned to your party, accessible via direct WhatsApp and direct phone hotline from arrival to departure.",
    },
    {
      title: "Zero-Account Guest Access",
      description:
        "Book and inquire directly with zero registration friction. No accounts, passwords, or customer verification walls required.",
    },
    {
      title: "Transparent & Flexible Settle Terms",
      description:
        "Honest pricing in INR with zero concealed surcharges and traveller-friendly cancellation policies up to 100% refund.",
    },
  ];

  return (
    <section id="why-us" className="py-20 sm:py-28 bg-white border-t border-[#E4E2DD] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <p className="eyebrow text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-800">
            Service Philosophy
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-[1.12] mt-3 text-balance">
            The standards behind every journey we design.
          </h2>
          <p className="mt-4 text-base text-[#52525B] font-normal leading-relaxed text-pretty">
            We orchestrate private, restorative journeys where every flight connection, suite preference, and road transit is verified before your arrival.
          </p>
        </div>

        {/* 2-Column Architectural Ruled Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {distinctions.map((item, idx) => (
            <div
              key={idx}
              className="pt-6 border-t border-[#E4E2DD] flex flex-col justify-between"
            >
              <div>
                <span className="font-sans text-xs font-bold text-[#D97706] tabular-nums block mb-2">
                  0{idx + 1}
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm sm:text-[15px] text-[#52525B] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
