import { ShieldCheck, Compass, Clock, Award } from "lucide-react";

export function StatsCounter() {
  const commitments = [
    {
      title: "100% Private Fleet",
      subtitle: "Dedicated luxury SUVs & certified chauffeur captains on all routes",
      icon: Compass,
    },
    {
      title: "Vetted 5-Star Sanctuaries",
      subtitle: "Inspected boutique estates, heritage palaces & private villas",
      icon: Award,
    },
    {
      title: "On-Ground Concierge",
      subtitle: "Direct personal manager reachable via WhatsApp throughout your stay",
      icon: Clock,
    },
    {
      title: "Guest-First Privacy",
      subtitle: "Direct guest reservations with no customer login or account barriers",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-12 bg-[#F3F1ED] border-y border-[#E4E2DD] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {commitments.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E4E2DD] flex items-center justify-center shrink-0 text-[#0D2C24] shadow-xs mt-0.5">
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-[#111111] tracking-tight">
                    {item.title}
                  </h3>
                  <p className="font-sans mt-1 text-xs text-[#52525B] leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
