"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Download,
  MessageSquare,
  Phone,
  Share2,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  MobileQuotationDossier,
  QuotationContentData,
} from "@/components/quotation/MobileQuotationDossier";
import { generateMobilePdf } from "@/lib/pdfGenerator";

export default function ClientQuotationPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const dossierRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [quotation, setQuotation] = useState<any | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchQuotation(slug);
    }
  }, [slug]);

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
      const fileName = `${quotation.title.replace(/[^a-zA-Z0-9]/g, "_")}_Mobile_Plan.pdf`;
      const res = await generateMobilePdf(dossierRef.current, {
        fileName,
        scale: 2.5,
      });
      if (res.success) {
        setToast("PDF downloaded! You can now view it or share via WhatsApp.");
        setTimeout(() => setToast(null), 4000);
      }
    } catch (e) {
      alert("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: quotation?.title || "Trip Master Itinerary",
        text: `Here is the mobile itinerary & quotation for ${quotation?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToast("Link copied to clipboard!");
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

  const content: QuotationContentData = quotation.content;

  return (
    <div className="min-h-screen bg-[#EDEAE3] font-sans text-zinc-900 pb-20">
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
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#0D2C24] text-white flex items-center justify-center font-heading font-bold text-xs">
              TM
            </div>
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#0D2C24]">
              Trip Master
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-3 py-1.5 text-[11px] font-heading font-bold uppercase tracking-wider bg-[#0D2C24] hover:bg-[#133E33] text-white rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              {downloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 text-zinc-600 hover:text-black border border-[#E4E2DD] rounded-xl hover:bg-zinc-100 transition-colors"
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
    </div>
  );
}
