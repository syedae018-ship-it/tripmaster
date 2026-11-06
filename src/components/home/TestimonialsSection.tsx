import { Star } from "lucide-react";

interface TestimonialItem {
  id: string;
  customerName: string;
  tripDestination: string;
  rating: number;
  reviewText: string;
  customerPhoto: string | null;
}

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: TestimonialItem[];
}) {
  return (
    <section id="reviews" className="py-20 sm:py-28 bg-white border-t border-[#E4E2DD] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="eyebrow text-[11px] font-semibold tracking-[0.18em] uppercase text-emerald-800">
            Guest Chronicles
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-[1.12] mt-2 text-balance">
            Reflections from our private travelers.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-7 rounded-2xl bg-[#FAF9F6] border border-[#E4E2DD] shadow-xs hover:shadow-card transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Clean Star Indicators */}
                <div className="flex items-center gap-1 mb-4" aria-label={`Rating: ${item.rating} out of 5 stars`}>
                  {[...Array(item.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 text-[#D97706] fill-[#D97706]"
                    />
                  ))}
                </div>

                <p className="font-sans text-sm sm:text-base text-[#111111] font-normal leading-relaxed">
                  "{item.reviewText}"
                </p>
              </div>

              {/* Guest Profile & Destination */}
              <div className="mt-6 pt-4 border-t border-[#E4E2DD] flex items-center gap-3">
                {item.customerPhoto ? (
                  <img
                    src={item.customerPhoto}
                    alt={item.customerName}
                    className="w-9 h-9 rounded-full object-cover border border-[#E4E2DD]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#0D2C24] text-white flex items-center justify-center font-heading font-bold text-xs">
                    {item.customerName[0]}
                  </div>
                )}
                <div>
                  <div className="font-heading font-bold text-xs text-[#111111]">
                    {item.customerName}
                  </div>
                  <div className="font-sans text-[11px] text-[#52525B]">
                    {item.tripDestination}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
