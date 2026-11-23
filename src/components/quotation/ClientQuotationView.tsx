"use client";

import { useState, useEffect, useRef } from "react";
import {
  Download,
  Share2,
  CheckCircle2,
  Loader2,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import {
  MobileQuotationDossier,
  QuotationContentData,
} from "@/components/quotation/MobileQuotationDossier";
import { generateMobilePdf } from "@/lib/pdfGenerator";

interface ClientQuotationViewProps {
  initialQuotation?: any;
  slug: string;
}

export function ClientQuotationView({
  initialQuotation,
  slug,
}: ClientQuotationViewProps) {
  const dossierRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(!initialQuotation);
  const [quotation, setQuotation] = useState<any | null>(initialQuotation || null);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!initialQuotation && slug) {
      fetchQuotation(slug);
    }
  }, [initialQuotation, slug]);

  const fetchQuotation = async (s: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/quotations/${s}`);
      const data = await res.json();
      if (data.success && data.quotation) {
        setQuotation(data.quotation);
      }
    } catch (e) {
      console.error("Failed to load quotation:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!dossierRef.current || !quotation) return;
    try {
      setDownloading(true);
      const fileName = `${(quotation.title || "TripMaster_Plan").replace(/[^a-zA-Z0-9]/g, "_")}_Mobile_Plan.pdf`;
      const res = await generateMobilePdf(dossierRef.current, {
        fileName,
        scale: 3.0,
      });
      if (res.success) {
        setToast("PDF downloaded! You can now view it or share via WhatsApp.");
        setTimeout(() => setToast(null), 4000);
      }
    } catch (e) {
      console.error("PDF download failed:", e);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: quotation?.title || "Trip Master Itinerary",
        text: `Here is the bespoke itinerary & quotation for ${quotation?.title}`,
        url: window.location.href,
      }).catch(() => {
        // Ignored if user cancels share dialog
      });
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToast("Dossier link copied to clipboard!");
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F2EE] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#0D2C24] mb-2" />
        <p className="text-xs text-zinc-600 font-medium">
          Loading your bespoke itinerary dossier...
        </p>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="min-h-screen bg-[#F4F2EE] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="font-heading text-xl font-bold text-zinc-900 mb-1">
          Quotation Not Found
        </h2>
        <p className="text-xs text-zinc-600 mb-4">
          This itinerary link may have expired or is unavailable.
        </p>
        <a
          href="/"
          className="px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider bg-[#0D2C24] text-white rounded-xl"
        >
          Return to Trip Master
        </a>
      </div>
    );
  }

  const content: QuotationContentData =
    typeof quotation.content === "string"
      ? JSON.parse(quotation.content)
      : quotation.content;

  const totalTripAmount =
    quotation.totalAmount ||
    (quotation.pricePerPerson || 0) * (quotation.paxCount || 2);
  const payableAmount =
    quotation.paymentAmountDue !== undefined &&
    quotation.paymentAmountDue !== null &&
    quotation.paymentAmountDue > 0
      ? quotation.paymentAmountDue
      : totalTripAmount;

  return (
    <div className="min-h-screen bg-[#EDEAE3] font-sans text-zinc-900 pb-24">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 inset-x-4 max-w-sm mx-auto z-50 bg-[#0D2C24] text-white px-4 py-3 rounded-2xl shadow-elevation border border-emerald-800 text-xs font-medium flex items-center gap-2 text-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Floating Client Action Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E4E2DD] shadow-xs px-4 py-3">
        <div className="max-w-[430px] mx-auto flex items-center justify-between gap-2">
          <a href="/" className="inline-block py-1">
            <img
              src="/images/logo.png"
              alt="TripMaster - Experience Neighbourhood"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.includes("/logo.png")) {
                  target.src = "/logo.png";
                }
              }}
              className="h-8 w-auto object-contain"
            />
          </a>

          <div className="flex items-center gap-1.5">
            {quotation.paymentLinkActive && quotation.paymentStatus !== "PAID" && (
              <a
                href={`/pay/quote/${slug}`}
                className="px-3 py-2 text-[10px] font-heading font-bold uppercase tracking-wider bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white rounded-xl transition-[background-color,transform] duration-150 shadow-xs flex items-center gap-1"
              >
                <CreditCard className="w-3 h-3 text-emerald-200" />
                <span>Pay <span className="tabular-nums">₹{payableAmount.toLocaleString("en-IN")}</span></span>
              </a>
            )}

            {quotation.paymentStatus === "PAID" && (
              <a
                href={`/pay/quote/${slug}`}
                className="px-3 py-2 text-[10px] font-heading font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Paid</span>
              </a>
            )}

            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-3.5 py-2 text-[11px] font-heading font-bold uppercase tracking-wider bg-[#0D2C24] hover:bg-[#133E33] active:scale-95 text-white rounded-xl transition-[background-color,transform] duration-150 shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {downloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Download</span> PDF
            </button>

            <button
              onClick={handleShare}
              className="w-9 h-9 flex items-center justify-center text-zinc-600 hover:text-black border border-[#E4E2DD] rounded-xl hover:bg-zinc-100 active:scale-95 transition-[background-color,transform] duration-150 cursor-pointer"
              title="Share Dossier"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Central Mobile Container */}
      <div className="max-w-[430px] mx-auto px-2 sm:px-0 mt-4 sm:mt-6">
        <MobileQuotationDossier
          ref={dossierRef}
          data={content}
          quotationNumber={quotation.quotationNumber}
          clientName={quotation.customer?.name}
        />
      </div>

      {/* Floating Bottom Booking / Payment Bar if Active */}
      {quotation.paymentLinkActive && quotation.paymentStatus !== "PAID" && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E4E2DD] shadow-lg p-3">
          <div className="max-w-[430px] mx-auto flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">
                Total Payable Now
              </span>
              <span className="font-heading font-bold text-base text-[#0D2C24]">
                ₹{payableAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <a
              href={`/pay/quote/${slug}`}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <span>Lock Reservation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
