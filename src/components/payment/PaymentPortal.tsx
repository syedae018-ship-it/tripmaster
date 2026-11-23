"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  QrCode,
  Building,
  Copy,
  Download,
  FileText,
  Printer,
  ChevronRight,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Lock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { RazorpayModal } from "@/components/payment/RazorpayModal";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentPortalProps {
  bookingRef: string;
}

export function PaymentPortal({ bookingRef }: PaymentPortalProps) {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active payment tab: Razorpay vs UPI/Bank
  const [paymentTab, setPaymentTab] = useState<"razorpay" | "bank">("razorpay");

  // UTR submission state
  const [utrNumber, setUtrNumber] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [submittingUtr, setSubmittingUtr] = useState(false);
  const [utrSuccessMsg, setUtrSuccessMsg] = useState<string | null>(null);

  // Razorpay processing state
  const [processingRazorpay, setProcessingRazorpay] = useState(false);
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);
  const [dummyOrderId, setDummyOrderId] = useState("");

  // Copy feedback
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/bookings/${bookingRef}`);
      const data = await res.json();
      if (data.success && data.booking) {
        setBooking(data.booking);
      } else {
        setError(data.error || "Booking not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingRef]);

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // 1-Click Razorpay Checkout for balance
  const handleRazorpayBalancePayment = async () => {
    if (!booking) return;

    try {
      setProcessingRazorpay(true);

      // 1. Create Razorpay Order
      const orderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: booking.balanceAmount,
          currency: "INR",
          receipt: `bal_${booking.bookingReference}`,
          notes: {
            bookingReference: booking.bookingReference,
            customerId: booking.customerId,
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to initiate payment gateway");
      }

      const order = orderData.order;
      const isDummy =
        order.isDummy ||
        order.isSimulated ||
        orderData.keyId?.includes("dummy") ||
        process.env.NEXT_PUBLIC_RAZORPAY_DUMMY_MODE === "true";

      if (isDummy) {
        setDummyOrderId(order.id);
        setRazorpayModalOpen(true);
        setProcessingRazorpay(false);
        return;
      }

      // 2. Load script if not already loaded
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      // 3. Configure Razorpay Options
      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Trip Master Travel",
        description: `Balance Settlement for ${booking.bookingReference}`,
        image: "/logo.png",
        order_id: orderData.order.id,
        prefill: {
          name: booking.customer?.name || "",
          email: booking.customer?.email || "",
          contact: booking.customer?.phone || "",
        },
        theme: {
          color: "#0F172A",
        },
        handler: async function (response: any) {
          await handleVerifyPaymentSuccess(response);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(`Payment Error: ${err.message || "Failed to launch payment"}`);
    } finally {
      setProcessingRazorpay(false);
    }
  };

  const handleVerifyPaymentSuccess = async (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    try {
      setProcessingRazorpay(true);
      const verifyRes = await fetch("/api/payments/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          bookingData: {
            existingBookingReference: booking.bookingReference,
            amountPaid: booking.balanceAmount,
          },
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setRazorpayModalOpen(false);
        await fetchBooking();
      } else {
        alert(verifyData.error || "Payment verification failed. Please contact concierge.");
      }
    } catch (e: any) {
      alert(`Verification Error: ${e.message}`);
    } finally {
      setProcessingRazorpay(false);
    }
  };

  // Submit UTR
  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      alert("Please enter the 12-digit transaction UTR / Reference number");
      return;
    }

    try {
      setSubmittingUtr(true);
      const res = await fetch("/api/payments/submit-utr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingReference: booking.bookingReference,
          utrNumber: utrNumber.trim(),
          paymentProofUrl: proofUrl.trim() || undefined,
          amountSubmitted: booking.balanceAmount,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUtrSuccessMsg("UTR reference submitted successfully! Our accounts desk will verify and unlock your tax invoice shortly.");
        await fetchBooking();
      } else {
        alert(data.error || "Failed to submit reference");
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    } finally {
      setSubmittingUtr(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-slate-600 font-sans text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-800" />
          <span>Loading client payment dossier...</span>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-xs">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-3" />
          <h2 className="font-heading font-bold text-xl text-slate-900 mb-1">
            Booking Dossier Not Found
          </h2>
          <p className="text-xs text-slate-500 font-sans mb-5">
            We could not find an active itinerary record matching reference <code className="font-mono font-bold text-slate-800">{bookingRef}</code>.
          </p>
          <Link
            href="/"
            className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 active:scale-[0.98] transition-[background-color,transform] duration-150"
          >
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    );
  }

  const isFullySettled = booking.balanceAmount <= 0;
  const isPendingVerification = booking.bookingStatus === "PENDING_VERIFICATION";
  const tripTitle = booking.package?.title || booking.customPackageTitle || "Custom Itinerary";
  const destination = booking.package?.destination || booking.customDestination || "Curated Destination";
  const upiId = "tripmaster@okaxis";
  const upiQrData = `upi://pay?pa=${upiId}&pn=Trip%20Master&am=${booking.balanceAmount}&cu=INR&tn=Booking_${booking.bookingReference}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Brand Header */}
        <div className="bg-white rounded-2xl p-5 border border-[#E4E4E7] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center p-2 shrink-0">
              <img
                src="/logo.png"
                alt="TripMaster"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.includes("/images/logo.png")) {
                    target.src = "/images/logo.png";
                  }
                }}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg tracking-tight text-slate-950">
                  TRIP MASTER
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Verified Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                Official Client Payment Gateway & Verified Tax Invoice Hub
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Booking Ref:</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono font-bold text-slate-800 tabular-nums">
              <span>{booking.bookingReference}</span>
              <button
                onClick={() => copyToClipboard(booking.bookingReference, "ref")}
                className="text-slate-400 hover:text-slate-700 p-0.5"
                title="Copy Reference"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            {copiedText === "ref" && (
              <span className="text-[10px] text-emerald-600 font-semibold">Copied!</span>
            )}
          </div>
        </div>

        {/* Financial Ledger & Status Card */}
        <div className="bg-white rounded-2xl border border-[#E4E4E7] overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 block mb-1">
                Traveler Itinerary Dossier
              </span>
              <h1 className="text-2xl font-heading font-bold text-slate-950 tracking-tight">
                {tripTitle}
              </h1>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span>Guest: <strong>{booking.customer?.name}</strong></span>
                <span>•</span>
                <span>Destination: <strong>{destination}</strong></span>
                <span>•</span>
                <span>Pax: <strong>{booking.numAdults} Adults{booking.numChildren > 0 ? `, ${booking.numChildren} Children` : ""}</strong></span>
              </p>
            </div>

            <div className="shrink-0">
              {isFullySettled ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Fully Paid & Confirmed</span>
                </div>
              ) : isPendingVerification ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>Verification in Progress</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <span>Payment Balance Due</span>
                </div>
              )}
            </div>
          </div>

          {/* 3-Column Financial Numbers Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-slate-50/60 p-6">
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                Total Agreed Package
              </span>
              <div className="text-2xl font-heading font-bold text-slate-900 tabular-nums">
                ₹{booking.totalAmount.toLocaleString("en-IN")}
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                All taxes & inclusions covered
              </span>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6">
              <span className="text-[11px] text-emerald-800 uppercase tracking-wider font-semibold block mb-1">
                Amount Paid to Date
              </span>
              <div className="text-2xl font-heading font-bold text-emerald-700 tabular-nums">
                ₹{booking.amountPaid.toLocaleString("en-IN")}
              </div>
              <span className="text-[11px] text-emerald-700/80 mt-0.5 block">
                Recorded in official ledger
              </span>
            </div>

            <div className="pt-4 md:pt-0 md:pl-6">
              <span className="text-[11px] text-rose-800 uppercase tracking-wider font-bold block mb-1">
                Outstanding Balance Due
              </span>
              <div className="text-2xl font-heading font-bold text-rose-600 tabular-nums">
                ₹{Math.max(0, booking.balanceAmount).toLocaleString("en-IN")}
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                {isFullySettled ? "Zero outstanding balance" : "Pay below to unlock instant tax invoice"}
              </span>
            </div>
          </div>
        </div>

        {/* UNLOCKED TAX INVOICE SECTION (Only when verified / fully settled) */}
        {booking.isVerified && booking.taxInvoiceNumber ? (
          <div className="bg-white rounded-2xl border-2 border-emerald-600 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-base text-slate-900">
                      Official Tax Invoice & Payment Receipt
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 font-mono">
                      {booking.taxInvoiceNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authorized document issued by Trip Master Concierge. Valid for GST & reimbursement.
                  </p>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950 text-white text-xs font-semibold hover:bg-emerald-900 shadow-xs shrink-0"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Print / Save Tax Invoice</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Invoice Ref</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">{booking.taxInvoiceNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Billed To</span>
                <span className="font-semibold text-slate-900">{booking.customer?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Mode</span>
                <span className="font-semibold text-slate-900">{booking.paymentMethod || "Verified Transfer"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Amount Cleared</span>
                <span className="font-heading font-bold text-emerald-700 tabular-nums">
                  ₹{booking.amountPaid.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* LOCKED TAX INVOICE TEASER */
          <div className="bg-slate-100 rounded-2xl border border-dashed border-slate-300 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-700">
                  Official Tax Invoice & GST Voucher (Locked)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your formal GST tax invoice and trip voucher will unlock immediately upon settlement of the pending balance.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-400 font-mono tabular-nums">
              Awaiting Verification
            </span>
          </div>
        )}

        {/* PAYMENT SETTLEMENT CONTROLS (Only when balance remains) */}
        {!isFullySettled && (
          <div className="bg-white rounded-2xl border border-[#E4E4E7] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-base text-slate-900 tracking-tight">
                  Settle Pending Balance (<span className="tabular-nums">₹{booking.balanceAmount.toLocaleString("en-IN")}</span>)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose your preferred payment route below for instant automated confirmation.
                </p>
              </div>

              {/* Payment Method Switcher */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  onClick={() => setPaymentTab("razorpay")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    paymentTab === "razorpay"
                      ? "bg-emerald-950 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Razorpay Checkout</span>
                </button>
                <button
                  onClick={() => setPaymentTab("bank")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    paymentTab === "bank"
                      ? "bg-emerald-950 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI QR & Bank</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* TAB 1: RAZORPAY INSTANT CHECKOUT */}
              {paymentTab === "razorpay" && (
                <div className="space-y-5">
                  <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-emerald-950">
                          Instant Online Settlement
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                          Zero Convenience Fee
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800/90 leading-relaxed font-sans">
                        Pay securely with UPI (GPay, PhonePe, Paytm), Credit Cards, Debit Cards, or NetBanking. Instant automated receipt generation.
                      </p>
                    </div>

                    <button
                      onClick={handleRazorpayBalancePayment}
                      disabled={processingRazorpay}
                      className="min-h-[44px] px-6 py-3 rounded-xl bg-emerald-950 text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 active:scale-[0.98] shadow-sm transition-[background-color,transform,box-shadow] duration-150 flex items-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
                    >
                      {processingRazorpay ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <CreditCard className="w-4 h-4 text-emerald-400" />
                      )}
                      <span>Pay <span className="tabular-nums">₹{booking.balanceAmount.toLocaleString("en-IN")}</span> via Razorpay</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-6 text-slate-400 text-xs pt-2">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>256-Bit SSL Encrypted</span>
                    </span>
                    <span>•</span>
                    <span>RBI Regulated Gateway</span>
                    <span>•</span>
                    <span>Instant HMAC Signature Verification</span>
                  </div>
                </div>
              )}

              {/* TAB 2: UPI QR & DIRECT BANK TRANSFER */}
              {paymentTab === "bank" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Left: Dynamic UPI QR */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-[#FAF9F6] text-center space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block">
                        Scan & Pay via Any UPI App
                      </span>
                      <div className="w-48 h-48 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                            upiQrData
                          )}`}
                          alt="TripMaster UPI QR"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-slate-800">
                        <span>UPI ID: {upiId}</span>
                        <button
                          onClick={() => copyToClipboard(upiId, "upi")}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {copiedText === "upi" && (
                        <span className="text-[10px] text-emerald-600 font-semibold block">Copied UPI ID!</span>
                      )}
                      <p className="text-[11px] text-slate-500">
                        Supported: Google Pay, PhonePe, Paytm, BHIM, Cred
                      </p>
                    </div>

                    {/* Right: Bank Details */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 text-xs">
                      <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-sm">
                        <Building className="w-4 h-4 text-emerald-800" />
                        <span>Trip Master Current Account Details</span>
                      </div>

                      <div className="space-y-2 pt-1 font-sans">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Beneficiary:</span>
                          <span className="font-semibold text-slate-900">TRIP MASTER TRAVEL SERVICES PVT LTD</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Bank Name:</span>
                          <span className="font-semibold text-slate-900">HDFC Bank Limited</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Account Number:</span>
                          <div className="flex items-center gap-1 font-mono font-bold text-slate-900 tabular-nums">
                            <span>50200084920194</span>
                            <button
                              onClick={() => copyToClipboard("50200084920194", "acc")}
                              className="text-slate-400 hover:text-slate-700"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">IFSC Code:</span>
                          <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                            <span>HDFC0001234</span>
                            <button
                              onClick={() => copyToClipboard("HDFC0001234", "ifsc")}
                              className="text-slate-400 hover:text-slate-700"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Account Type:</span>
                          <span className="font-semibold text-slate-900">Current Account</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* UTR Submission Form */}
                  <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-800" />
                      <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-950">
                        Paid via UPI or Bank Transfer? Submit Your UTR Reference:
                      </h4>
                    </div>

                    {utrSuccessMsg ? (
                      <div className="p-3 bg-emerald-100 rounded-lg text-xs font-semibold text-emerald-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span>{utrSuccessMsg}</span>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitUtr} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">
                              12-Digit UTR / Transaction Reference Number
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 423984029384"
                              value={utrNumber}
                              onChange={(e) => setUtrNumber(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-slate-900 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 font-semibold mb-1">
                              Payment Proof Screenshot URL (Optional)
                            </label>
                            <input
                              type="url"
                              placeholder="https://..."
                              value={proofUrl}
                              onChange={(e) => setProofUrl(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={submittingUtr}
                          className="px-4 py-2 rounded-lg bg-emerald-950 text-white font-semibold text-xs hover:bg-emerald-900 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {submittingUtr ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>Submit UTR for Verification</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Support */}
        <div className="text-center text-xs text-slate-400 space-y-1">
          <p>Questions about your balance or booking? Contact your Trip Master Travel Concierge at <a href="mailto:concierge@tripmaster.in" className="text-emerald-800 font-semibold underline">concierge@tripmaster.in</a> or WhatsApp <a href="https://wa.me/919876543210" className="text-emerald-800 font-semibold underline">+91 98765 43210</a>.</p>
          <p className="text-[11px] text-slate-400">Trip Master Travel Services Private Limited • Singapore & India Offices</p>
        </div>
      </div>

      {/* Razorpay Simulation / Sandbox Modal */}
      {booking && (
        <RazorpayModal
          isOpen={razorpayModalOpen}
          onClose={() => {
            setRazorpayModalOpen(false);
            setProcessingRazorpay(false);
          }}
          orderId={dummyOrderId || `order_bal_${booking.bookingReference}`}
          amount={booking.balanceAmount}
          customerName={booking.customer?.name || "Client"}
          customerEmail={booking.customer?.email || ""}
          customerPhone={booking.customer?.phone || ""}
          description={`Balance Settlement for ${booking.bookingReference}`}
          onSuccess={handleVerifyPaymentSuccess}
          onFailure={(msg) => alert(`Payment declined: ${msg}`)}
        />
      )}
    </div>
  );
}

