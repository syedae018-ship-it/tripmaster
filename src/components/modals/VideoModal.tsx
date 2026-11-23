"use client";

import { useState, useEffect } from "react";
import { X, Play, Star, MapPin, UserCheck } from "lucide-react";

export interface VideoModalData {
  title: string;
  traveler: string;
  trip: string;
  duration: string;
  videoUrl?: string;
  posterUrl: string;
  quote: string;
}

export function VideoModal() {
  const [videoData, setVideoData] = useState<VideoModalData | null>(null);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<VideoModalData>;
      if (customEvent.detail) {
        setVideoData(customEvent.detail);
      }
    };

    window.addEventListener("open-video-modal", handleOpen as EventListener);
    return () => window.removeEventListener("open-video-modal", handleOpen as EventListener);
  }, []);

  useEffect(() => {
    if (videoData) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [videoData]);

  if (!videoData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div
        className="relative w-full max-w-3xl bg-[#111111] text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setVideoData(null)}
          className="absolute top-4 right-4 z-20 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/60 hover:bg-black active:scale-95 text-white/90 hover:text-white flex items-center justify-center transition-[background-color,transform] duration-150 border border-white/20 cursor-pointer"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player / Presentation Screen */}
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center group">
          <img
            src={videoData.posterUrl}
            alt={videoData.title}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (!target.src.includes("1598091383021")) {
                target.src =
                  "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80";
              }
            }}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />

          {/* Interactive Player Simulation Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
            <span className="mt-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-amber-300 uppercase tracking-widest border border-white/10">
              Verified Traveller Story ({videoData.duration})
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/70">
            <span className="flex items-center gap-1.5 font-medium">
              <UserCheck className="w-4 h-4 text-emerald-400" /> Authentic Guest Experience
            </span>
            <span className="font-sans tabular-nums">{videoData.duration}</span>
          </div>
        </div>

        {/* Video Details & Quote */}
        <div className="p-6 sm:p-7 space-y-4 bg-[#141716] border-t border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1 text-amber-400 text-xs mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
                <span className="text-white/80 font-semibold ml-1.5">5.0 Star Experience</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-white tracking-tight">
                {videoData.title}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-white block">{videoData.traveler}</span>
              <span className="text-[11px] text-amber-300/90 font-medium flex items-center gap-1 justify-end">
                <MapPin className="w-3 h-3" />
                {videoData.trip}
              </span>
            </div>
          </div>

          <blockquote className="text-sm sm:text-base text-white/85 italic font-normal leading-relaxed border-l-2 border-amber-400 pl-4 py-1">
            "{videoData.quote}"
          </blockquote>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-white/50">
              Trip Master Verified Holiday Memories
            </span>
            <button
              type="button"
              onClick={() => {
                setVideoData(null);
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-plan-trip-modal", { detail: { destination: videoData.trip } }));
                }
              }}
              className="btn btn-primary rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider"
            >
              Plan A Trip Like This →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

