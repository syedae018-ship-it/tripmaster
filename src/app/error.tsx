"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RotateCcw, Home, AlertCircle, Phone, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  useEffect(() => {
    // Log exception to monitoring services in production
    console.error("[TripMaster Exception Caught by Boundary]:", error);
  }, [error]);

  return (
    <main className="bg-[#FAF9F6] min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 font-sans select-none relative overflow-hidden">
      <div className="relative z-10 max-w-xl w-full text-center space-y-7">
        {/* Eyebrow Alert Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold tracking-widest uppercase">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Concierge Notice · Itinerary Interruption</span>
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#111111] tracking-tight leading-[1.15]">
            An Unexpected Detour Occurred.
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#52525B] max-w-md mx-auto font-normal leading-relaxed text-pretty">
            We encountered a temporary disruption while curating your travel view. Our personal concierge operations have logged the incident.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto btn bg-[#0D2C24] hover:bg-[#133E33] text-white px-7 py-3.5 rounded-full font-heading font-bold text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 shadow-card hover:shadow-elevation hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-300" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto btn bg-white hover:bg-[#F3F1ED] text-[#111111] hover:text-[#0D2C24] border border-[#E4E2DD] px-7 py-3.5 rounded-full font-heading font-bold text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 shadow-2xs hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Home className="w-4 h-4 text-[#0D2C24]" />
            <span>Return to Curated Journeys</span>
          </Link>
        </div>

        {/* Technical Diagnostics (Collapsible for debugging / dev) */}
        {(error?.message || error?.digest) && (
          <div className="pt-4 max-w-lg mx-auto text-left">
            <button
              type="button"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#71717A] hover:text-[#111111] py-1 border-b border-[#E4E2DD]/70 transition-colors"
            >
              <span>Diagnostic Reference {error.digest ? `(${error.digest.slice(0, 8)})` : ""}</span>
              {showTechnicalDetails ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#71717A]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#71717A]" />
              )}
            </button>

            {showTechnicalDetails && (
              <div className="mt-2.5 p-3.5 rounded-xl bg-white border border-[#E4E2DD] text-xs font-mono text-slate-700 break-words whitespace-pre-wrap leading-relaxed shadow-2xs">
                {error.message || "An unhandled runtime error occurred."}
                {error.digest && (
                  <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    Incident ID: {error.digest}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Concierge Assistance Support */}
        <div className="pt-6 border-t border-[#E4E2DD]/80 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-[#52525B]">
          <span>Speak directly to your travel concierge:</span>
          <div className="flex items-center gap-3">
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-1 font-semibold text-[#0D2C24] hover:underline"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>+91 98765 43210</span>
            </a>
            <span>•</span>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#0D2C24] hover:underline"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
