"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  CreditCard,
  Building,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Lock,
  ArrowRight,
  Download,
  Printer,
  Copy,
  AlertCircle,
  FileText,
  Phone,
  Check,
} from "lucide-react";
import { RazorpayModal } from "@/components/payment/RazorpayModal";

interface QuotationPaymentPortalProps {
  slug: string;
}

export function QuotationPaymentPortal({ slug }: QuotationPaymentPortalProps) {
  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Razorpay Checkout State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    bookingReference: string;
    invoiceNumber?: string;
    amountPaid: number;
    transactionId: string;
  } | null>(null);

  // Client form overrides if needed
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchQuotation();
  }, [slug]);

  const fetchQuotation = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/quotations/${slug}`);
      const data = await res.json();
      if (data.success && data.quotation) {
        const q = data.quotation;
        setQuotation(q);
        setClientName(q.customer?.name || "");
        setClientPhone(q.customer?.phone || "");
        setClientEmail(q.customer?.email || "");

        // Check if already paid
        if (q.paymentStatus === "PAID" && q.bookings && q.bookings.length > 0) {
          const lastBooking = q.bookings[0];
          setPaymentSuccessData({
            bookingReference: lastBooking.bookingReference,
            invoiceNumber: lastBooking.taxInvoiceNumber,
            amountPaid: lastBooking.amountPaid,
            transactionId: lastBooking.paymentTransactions?.[0]?.razorpayPaymentId || "PAY-VERIFIED",
          });
        }
      } else {
        setError(data.error || "Quotation details could not be found");
      }
    } catch (e: any) {
      setError(e.message || "Failed to load quotation details");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const content = quotation?.content || {};
  const totalTripAmount =
    quotation?.totalAmount ||
    (quotation?.pricePerPerson || 0) * (quotation?.paxCount || 2);
  const amountToPay =
    quotation?.paymentAmountDue !== undefined &&
    quotation?.paymentAmountDue !== null &&
    quotation?.paymentAmountDue > 0
      ? quotation.paymentAmountDue
      : totalTripAmount;
  const remainingBalance = Math.max(0, totalTripAmount - amountToPay);

  // Initiate Razorpay Payment
  const handleStartPayment = async () => {
    try {
      setProcessingPayment(true);

      // 1. Create order via backend
      const orderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountToPay,
          currency: "INR",
          receipt: `qt_${quotation.quotationNumber}_${Date.now()}`,
          notes: {
            quotationId: quotation.id,
            quotationNumber: quotation.quotationNumber,
            quotationSlug: quotation.shareSlug,
            customerName: clientName || quotation.customer?.name || "Client",
            type: "QUOTATION_PAYMENT",
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to initiate payment gateway");
      }

      const order = orderData.order;

      // Check if real Razorpay script is active and NOT dummy mode
      const isDummy =
        order.isDummy ||
        order.isSimulated ||
        process.env.NEXT_PUBLIC_RAZORPAY_DUMMY_MODE === "true" ||
        order.keyId.includes("dummy");

      if (isDummy) {
        // Open our realistic Razorpay simulator modal
        setCurrentOrderId(order.id);
        setPaymentModalOpen(true);
        setProcessingPayment(false);
        return;
      }

      // Live / Test Mode: Load real Razorpay script
      const loadScript = () => {
        return new Promise((resolve) => {
          if ((window as any).Razorpay) return resolve(true);
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const loaded = await loadScript();
      if (!loaded) {
        // Fallback to simulator if script blocked
        setCurrentOrderId(order.id);
        setPaymentModalOpen(true);
        setProcessingPayment(false);
        return;
      }

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Trip Master Travel",
        description: `Payment for ${quotation.title} (${quotation.quotationNumber})`,
        image: "/logo.png",
        order_id: order.id,
        prefill: {
          name: clientName || quotation.customer?.name || "",
          email: clientEmail || quotation.customer?.email || "",
          contact: clientPhone || quotation.customer?.phone || "",
        },
        theme: {
          color: "#0F172A",
        },
        handler: async function (response: any) {
          await handlePaymentSuccess(response);
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e: any) {
      alert(`Payment Gateway Error: ${e.message || "Failed to initialize"}`);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Process Server-Side Verification on Payment Success
  const handlePaymentSuccess = async (paymentAuth: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    try {
      setProcessingPayment(true);

      const verifyRes = await fetch("/api/payments/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...paymentAuth,
          bookingData: {
            quotationId: quotation.id,
            quotationSlug: quotation.shareSlug,
            quotationNumber: quotation.quotationNumber,
            name: clientName || quotation.customer?.name || "Client",
            phone: clientPhone || quotation.customer?.phone || "",
            email: clientEmail || quotation.customer?.email || "",
            totalAmount: totalTripAmount,
            amountPaid: amountToPay,
            paymentMethod: "RAZORPAY_ONLINE",
          },
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        throw new Error(verifyData.error || "Payment verification failed on server");
      }

      setPaymentModalOpen(false);
      setPaymentSuccessData({
        bookingReference: verifyData.bookingReference,
        invoiceNumber: verifyData.invoiceNumber,
        amountPaid: amountToPay,
        transactionId: paymentAuth.razorpay_payment_id,
      });

      // Reload fresh quotation details
      await fetchQuotation();
    } catch (e: any) {
      alert(`Verification Error: ${e.message}`);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="font-heading font-bold text-lg text-slate-900">
            Loading Client Quotation & Payment Portal...
          </h3>
          <p className="text-xs text-slate-500">
            Fetching verified itinerary details and secure Razorpay gateway
          </p>
        </div>
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="font-heading font-bold text-2xl text-slate-900">
            Payment Link Unavailable
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {error || "The requested client quotation does not exist or has expired."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Return to TripMaster Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      {/* Top Brand & Security Strip */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="Trip Master"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (!target.src.includes("/images/logo.png")) {
                target.src = "/images/logo.png";
              }
            }}
            className="h-8 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit Razorpay Protected</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Copy Payment Link"
          >
            {copiedLink ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* PAYMENT SUCCESS BANNER IF PAID */}
        {paymentSuccessData && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-xs animate-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    Payment Verified & Confirmed
                  </span>
                  <h2 className="font-heading font-bold text-2xl text-emerald-950">
                    Thank You, {clientName || quotation.customer?.name || "Valued Traveler"}!
                  </h2>
                  <p className="text-xs text-emerald-800 mt-1">
                    Your payment of{" "}
                    <strong>₹{paymentSuccessData.amountPaid.toLocaleString("en-IN")}</strong> has
                    been successfully processed. Your luxury reservation is now confirmed.
                  </p>
                </div>
              </div>

              <div className="bg-white px-4 py-3 rounded-2xl border border-emerald-200/80 text-right shrink-0">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Booking Reference
                </span>
                <span className="font-mono font-bold text-base text-slate-900 block">
                  {paymentSuccessData.bookingReference}
                </span>
                <span className="text-[10px] font-mono text-emerald-700 block">
                  Txn: {paymentSuccessData.transactionId}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-emerald-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <a
                  href={`/pay/${paymentSuccessData.bookingReference}?invoice=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Tax Invoice / Receipt</span>
                </a>

                <a
                  href={`/quote/${quotation.shareSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100/50 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Itinerary Dossier</span>
                </a>
              </div>

              <span className="text-emerald-800 font-medium text-[11px]">
                A confirmation has been logged in your TripMaster Concierge profile.
              </span>
            </div>
          </div>
        )}

        {/* TRIP HERO & SUMMARY CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
            <img
              src={content.heroImage || "/images/banner.jpg"}
              alt={quotation.title}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.includes("1598091383021")) {
                  target.src =
                    "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80";
                }
              }}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-blue-600/90 text-white">
                    Official Quotation #{quotation.quotationNumber}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                    {quotation.destination}
                  </span>
                </div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white">
                  {quotation.title}
                </h1>
                <p className="text-xs text-slate-300 mt-0.5">
                  Curated {quotation.durationNights} Nights / {quotation.durationDays} Days Itinerary
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-right shrink-0">
                <span className="text-[10px] text-slate-300 block">Total Package Value</span>
                <span className="font-heading font-bold text-xl text-white tabular-nums">
                  ₹{totalTripAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="p-5 sm:p-6 bg-slate-50/60 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Client / Guest
              </span>
              <span className="font-heading font-bold text-slate-900 block truncate">
                {clientName || quotation.customer?.name || "Client"}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {clientPhone || quotation.customer?.phone || ""}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Duration & Travelers
              </span>
              <span className="font-heading font-bold text-slate-900 block">
                {quotation.durationNights}N / {quotation.durationDays}D
              </span>
              <span className="text-[11px] text-slate-500">
                {quotation.paxCount || 2} Travelers
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Travel Date
              </span>
              <span className="font-heading font-bold text-slate-900 block">
                {quotation.travelDate
                  ? new Date(quotation.travelDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Dates Flexible"}
              </span>
              <span className="text-[11px] text-slate-500">Confirmed on Booking</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Quotation Dossier
              </span>
              <a
                href={`/quote/${quotation.shareSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>View Full Plan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[11px] text-slate-500">430px Mobile PDF</span>
            </div>
          </div>

          {/* ITINERARY & STAYS SNAPSHOT (From Quotation Content) */}
          <div className="p-5 sm:p-6 space-y-5">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Planned Journey Highlights</span>
              </h3>

              {content.quickDayWiseSummary && content.quickDayWiseSummary.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {content.quickDayWiseSummary.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-2.5"
                    >
                      <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-heading font-bold text-[11px] flex items-center justify-center shrink-0">
                        D{idx + 1}
                      </span>
                      <div>
                        <span className="font-heading font-bold text-slate-800 block">
                          {item.day || `Day ${idx + 1}`}
                        </span>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">
                  Comprehensive multi-day holiday with curated attractions and transfers.
                </div>
              )}
            </div>

            {/* Stay & Hotel Snapshot */}
            {content.staySummary && (
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-sky-800 block">
                      Featured Accommodation
                    </span>
                    <h4 className="font-heading font-bold text-sm text-slate-900">
                      {content.staySummary.hotelName || "4-Star Deluxe Resort"}
                    </h4>
                    <span className="text-xs text-slate-600">
                      {content.staySummary.roomType || "Superior Room with Daily Breakfast"}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <span className="text-[10px] text-slate-500 block">Rating</span>
                  <span className="font-bold text-amber-500">
                    ★ {content.staySummary.rating || 4.5} Star Certified
                  </span>
                </div>
              </div>
            )}

            {/* Key Inclusions Preview */}
            {content.inclusions && content.inclusions.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  What&apos;s Included In This Booking
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {content.inclusions.slice(0, 6).map((inc: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-tight">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FINANCIAL LEDGER & RAZORPAY PAYMENT CARD */}
        <div className="bg-white rounded-3xl border-2 border-blue-600 shadow-xl overflow-hidden">
          <div className="bg-blue-600 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-sky-200 block mb-1">
                Secure Client Checkout
              </span>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
                Payment Settlement & Reservation Lock
              </h2>
              <p className="text-xs text-sky-100 mt-0.5">
                Instant confirmation powered by Razorpay. Zero concealed handling charges.
              </p>
            </div>

            <div className="bg-white text-slate-900 px-5 py-3 rounded-2xl shadow-md text-right shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Amount Payable Now
              </span>
              <span className="font-heading font-bold text-2xl text-blue-600 tabular-nums">
                ₹{amountToPay.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Financial Breakdown Table */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5">
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Quotation Package Amount:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  ₹{totalTripAmount.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-900 font-semibold border-t border-slate-200 pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Amount Payable Today (Deposit / Settlement):</span>
                </span>
                <span className="text-blue-600 text-sm font-bold tabular-nums">
                  ₹{amountToPay.toLocaleString("en-IN")}
                </span>
              </div>

              {remainingBalance > 0 && (
                <div className="flex items-center justify-between text-slate-500 text-[11px] border-t border-slate-200 pt-1.5">
                  <span>Balance Payable Prior to Departure:</span>
                  <span className="font-medium text-slate-700 tabular-nums">
                    ₹{remainingBalance.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            {/* Note from Advisor if exists */}
            {quotation.paymentNote && (
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Concierge Note:</strong>
                  <span>{quotation.paymentNote}</span>
                </div>
              </div>
            )}

            {/* Payment Button CTA */}
            {quotation.paymentStatus === "PAID" ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-emerald-800 font-heading font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>This Quotation Has Been Fully Settled!</span>
                </div>
                <p className="text-xs text-emerald-700">
                  Thank you! No further payments are pending on this itinerary.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleStartPayment}
                  disabled={processingPayment}
                  className="w-full min-h-[48px] py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-heading font-bold text-sm sm:text-base uppercase tracking-wider transition-[background-color,transform,box-shadow] duration-150 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>
                    Pay <span className="tabular-nums">₹{amountToPay.toLocaleString("en-IN")}</span> Securely via Razorpay
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Supported Payment Logos / Badges */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="text-[11px] font-medium text-slate-400">Accepted:</span>
                  <span className="font-semibold text-slate-700">Google Pay</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">PhonePe</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">Paytm UPI</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">All Debit & Credit Cards</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">Netbanking</span>
                </div>
              </div>
            )}

            {/* Concierge Help Hotline */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Need support? Call Concierge: <strong>+91 98765 43210</strong></span>
              </span>

              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(
                  `Hi, I am viewing payment link for ${quotation.title} (${quotation.quotationNumber}). I have a question before paying.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline font-semibold flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chat with advisor on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Razorpay Simulator Modal for Dummy / Sandbox Testing */}
      <RazorpayModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderId={currentOrderId || `order_dummy_${Date.now()}`}
        amount={amountToPay}
        customerName={clientName || quotation.customer?.name || "Client"}
        customerEmail={clientEmail || quotation.customer?.email || ""}
        customerPhone={clientPhone || quotation.customer?.phone || ""}
        description={`Payment for ${quotation.title}`}
        onSuccess={handlePaymentSuccess}
        onFailure={(msg) => alert(`Payment declined: ${msg}`)}
      />
    </div>
  );
}
