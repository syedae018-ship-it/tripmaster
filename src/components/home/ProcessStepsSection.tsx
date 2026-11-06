import { FileText, Calendar, CheckCircle2, Plane, ArrowRight } from "lucide-react";

export function ProcessStepsSection() {
  const steps = [
    {
      stepNumber: "01",
      icon: FileText,
      title: "Tell us what you're dreaming of.",
      description: "Share your destination, budget and travel dates.",
    },
    {
      stepNumber: "02",
      icon: Calendar,
      title: "We create your holiday plan.",
      description: "Our team prepares a customised itinerary.",
    },
    {
      stepNumber: "03",
      icon: CheckCircle2,
      title: "Confirm your trip.",
      description: "Review the itinerary, inclusions and payment details.",
    },
    {
      stepNumber: "04",
      icon: Plane,
      title: "Travel with confidence.",
      description: "Receive full support and travel information.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Section Header (Left-aligned) */}
      <div className="mb-12 text-left max-w-3xl">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-[1.12]">
          Your holiday, made simple.
        </h2>
      </div>

      {/* 4-Step Horizontal Flow with Connecting Arrows (→) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isNotLast = idx < steps.length - 1;

          return (
            <div
              key={idx}
              className="relative p-6 sm:p-7 rounded-2xl bg-white border border-[#E4E2DD] shadow-card flex flex-col justify-between hover:border-[#0D2C24]/40 transition-all text-left"
            >
              <div>
                {/* Step Top Row with Icon Circle & Number */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-full bg-[#0D2C24] text-amber-300 flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="font-heading font-bold text-xs text-[#52525B] bg-[#F3F1ED] px-2.5 py-1 rounded-full tabular-nums">
                    Step {step.stepNumber}
                  </span>
                </div>

                {/* Step Title in Helvetica Bold */}
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#111111] tracking-tight leading-snug">
                  {step.title}
                </h3>

                {/* Step Description in Poppins */}
                <p className="mt-2 text-sm text-[#52525B] leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              {/* Connecting Arrow for Desktop (between steps) */}
              {isNotLast && (
                <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[#FAF9F6] border border-[#E4E2DD] items-center justify-center text-[#0D2C24] shadow-xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
