import { Users, Star, Calendar } from "lucide-react";

export function TrustStatsStrip() {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Happy Travellers",
      subtext: "Trusted holiday guests across India & worldwide",
    },
    {
      icon: Star,
      value: "4.8 / 5",
      label: "Verified Rating (Google Reviews)",
      subtext: "Consistently rated 5-star for curated luxury & concierge",
      isStar: true,
    },
    {
      icon: Calendar,
      value: "15+",
      label: "Years of Experience",
      subtext: "Dedicated travel specialists crafting dream escapes",
    },
  ];

  return (
    <section className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <div className="bg-white rounded-2xl border border-[#E4E2DD] shadow-card overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E4E2DD]">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 flex items-center gap-5 text-left hover:bg-[#FAF9F6]/60 transition-colors"
              >
                {/* Icon Container */}
                <div className="w-12 h-12 rounded-xl bg-[#F3F1ED] text-[#0D2C24] flex items-center justify-center shrink-0 border border-[#E4E2DD] shadow-xs">
                  <Icon className={`w-6 h-6 stroke-[2] ${stat.isStar ? "fill-amber-400 text-amber-500" : ""}`} />
                </div>

                {/* Content */}
                <div>
                  <div className="font-heading font-bold text-2xl sm:text-3xl text-[#111111] tabular-nums tracking-tight">
                    {stat.value}
                  </div>
                  <div className="font-sans font-semibold text-sm text-[#111111] mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
