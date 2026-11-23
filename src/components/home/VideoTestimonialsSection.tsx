"use client";

import { Play, Star, MapPin } from "lucide-react";

export function VideoTestimonialsSection() {
  const featuredVideo = {
    title: "A Family Honeymoon & Sanctuary Holiday in Bali",
    traveler: "Ananya & Devansh Roy",
    trip: "Bali, Indonesia",
    duration: "02:45",
    posterUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85",
    quote: "Everything from our private pool villa to our dedicated chauffeur was flawless. We didn't have to worry about a single detail.",
  };

  const sideVideos = [
    {
      id: "vid-2",
      title: "Dubai Marina Yacht & Desert Dune Safari",
      traveler: "Rohan & Aarti Mehta",
      trip: "Dubai, UAE",
      duration: "01:50",
      posterUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
      quote: "The VIP sunset yacht cruise was breathtaking. Truly world-class hospitality.",
    },
    {
      id: "vid-3",
      title: "Kashmir Cedar Houseboat & Gulmarg Gondola",
      traveler: "Siddharth Verma",
      trip: "Kashmir, India",
      duration: "02:15",
      posterUrl: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
      quote: "Hot Kashmiri Kahwa on Dal Lake while the sun set behind snowy peaks — unforgettable.",
    },
    {
      id: "vid-4",
      title: "Swiss Alps Express & Paris Seine Romance",
      traveler: "Vikram & Sunita Kapoor",
      trip: "Europe Highlights",
      duration: "03:10",
      posterUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
      quote: "The most seamless European holiday we've ever taken. Every connection was verified in advance.",
    },
  ];

  const handleOpenVideo = (video: typeof featuredVideo) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-video-modal", { detail: video })
      );
    }
  };

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Section Header (Left-aligned) */}
      <div className="mb-10 text-left max-w-3xl">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-[1.12]">
          Don't just take our word for it.
        </h2>
        <p className="font-sans text-base sm:text-lg text-[#52525B] mt-2 font-normal">
          Hear from people who have travelled with us.
        </p>
      </div>

      {/* Asymmetric 4-Item Video Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (Wider Featured Video Card) */}
        <div
          onClick={() => handleOpenVideo(featuredVideo)}
          className="lg:col-span-6 group cursor-pointer relative bg-white rounded-2xl border border-[#E4E2DD] shadow-card hover:shadow-elevation overflow-hidden flex flex-col transition-all duration-300"
        >
          {/* Video Thumbnail with Play Button */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-black">
            <img
              src={featuredVideo.posterUrl}
              alt={featuredVideo.title}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.includes("1598091383021")) {
                  target.src =
                    "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80";
                }
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-[#0D2C24] transition-all">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-1" />
              </div>
            </div>

            {/* Top Badge */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-[11px] font-semibold uppercase tracking-wider">
              Customer Testimonial Video (Real Traveller Experience)
            </div>

            {/* Bottom Duration Badge */}
            <div className="absolute bottom-4 right-4 bg-black/75 px-2.5 py-1 rounded-md text-[11px] text-white font-mono tabular-nums">
              {featuredVideo.duration}
            </div>
          </div>

          {/* Details Bar */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                ))}
                <span className="text-xs font-semibold text-[#52525B] ml-2">Verified Experience</span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#111111] group-hover:text-[#0D2C24] transition-colors leading-snug">
                {featuredVideo.title}
              </h3>
              <p className="mt-2 text-sm text-[#52525B] leading-relaxed italic">
                "{featuredVideo.quote}"
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E4E2DD] flex items-center justify-between text-xs">
              <span className="font-heading font-bold text-[#111111]">
                {featuredVideo.traveler}
              </span>
              <span className="text-[#0D2C24] font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                {featuredVideo.trip}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (3 Equal Stacked/Portrait Cards) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
          {sideVideos.map((video, idx) => (
            <div
              key={video.id}
              onClick={() => handleOpenVideo(video)}
              className="group cursor-pointer bg-white rounded-2xl border border-[#E4E2DD] shadow-card hover:shadow-elevation p-4 flex flex-col sm:flex-col lg:flex-row gap-4 items-center transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative w-full lg:w-44 h-36 lg:h-28 rounded-xl overflow-hidden shrink-0 bg-black">
                <img
                  src={video.posterUrl}
                  alt={video.title}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.includes("1598091383021")) {
                      target.src =
                        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80";
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#0D2C24] transition-all">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-white font-mono tabular-nums">
                  {video.duration}
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 space-y-1 text-left w-full">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D2C24] bg-[#F3F1ED] px-2 py-0.5 rounded-md inline-block">
                  Video 0{idx + 2} · {video.trip}
                </span>
                <h4 className="font-heading font-bold text-sm sm:text-base text-[#111111] group-hover:text-[#0D2C24] transition-colors line-clamp-2 leading-snug">
                  {video.title}
                </h4>
                <p className="text-xs text-[#52525B] line-clamp-1 italic">
                  "{video.quote}"
                </p>
                <div className="text-[11px] font-semibold text-[#111111] pt-1">
                  {video.traveler}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

