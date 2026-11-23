"use client";

import React, { useState } from "react";
import {
  CreditCard,
  QrCode,
  Building2,
  Smartphone,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  X,
  Lock,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number; // in rupees
  currency?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
  onSuccess: (paymentAuth: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => Promise<void> | void;
  onFailure?: (error: string) => void;
}

export function RazorpayModal({
  isOpen,
  onClose,
  orderId,
  amount,
  currency = "INR",
  customerName = "Guest Traveler",
  customerEmail = "guest@example.com",
  customerPhone = "+91 98765 43210",
  description = "Trip Master Luxury Travel Reservation",
  onSuccess,
  onFailure,
}: RazorpayModalProps) {
  const [activeTab, setActiveTab] = useState<"upi" | "card" | "netbanking" | "wallet">("upi");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>("gpay");
  const [selectedBank, setSelectedBank] = useState<string>("HDFC");
  const [upiId, setUpiId] = useState("traveler@okaxis");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv, setCvv] = useState("789");
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  if (!isOpen) return null;

  const handleSimulatePayment = async (success = true) => {
    setProcessing(true);
    setStatusMessage("Connecting to Razorpay Banking Gateway...");

    setTimeout(() => {
      setStatusMessage("Authorizing payment token with issuing bank...");
    }, 700);

    setTimeout(async () => {
      if (success) {
        setStatusMessage("Payment authorized! Generating digital receipt...");
        const simulatedPaymentId = `pay_dummy_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
        const simulatedSignature = `dummy_sig_${Date.now()}`;

        try {
          await onSuccess({
            razorpay_order_id: orderId,
            razorpay_payment_id: simulatedPaymentId,
            razorpay_signature: simulatedSignature,
          });
        } catch (e) {
          console.error("Payment success callback error:", e);
        } finally {
          setProcessing(false);
        }
      } else {
        setProcessing(false);
        if (onFailure) {
          onFailure("Payment was declined or cancelled by the customer in simulator.");
        }
        onClose();
      }
    }, 1500);
  };

  const formattedAmount = `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Razorpay Brand Header */}
        <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold font-mono text-sm shadow-md">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm tracking-wide text-white">
                  Razorpay Checkout
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Sandbox / Dummy Mode
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate max-w-xs">
                Trip Master • {description}
              </p>
            </div>
          </div>

          <div className="text-right relative z-10 flex items-center gap-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Total Payable
              </span>
              <span className="font-heading text-lg font-bold text-white tabular-nums">
                {formattedAmount}
              </span>
            </div>

            <button
              onClick={onClose}
              disabled={processing}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Client & Order Meta Sub-strip */}
        <div className="bg-slate-50 px-5 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
          <span className="truncate">
            Paying for: <strong className="text-slate-900">{customerName}</strong> ({customerPhone})
          </span>
          <span className="font-mono text-slate-500 shrink-0">
            Order: {orderId.slice(0, 16)}...
          </span>
        </div>

        {/* Modal Main Body: 2 Columns */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-12 min-h-[300px]">
          {/* Left Column: Payment Method Tabs (4 cols) */}
          <div className="sm:col-span-4 bg-slate-50/80 border-r border-slate-200 p-2 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 block">
              Payment Options
            </span>

            {[
              { id: "upi", label: "UPI & QR", icon: Smartphone, subtitle: "GPay, PhonePe, Paytm" },
              { id: "card", label: "Cards", icon: CreditCard, subtitle: "Visa, Mastercard, RuPay" },
              { id: "netbanking", label: "Netbanking", icon: Building2, subtitle: "All Indian Banks" },
              { id: "wallet", label: "Wallets", icon: Wallet, subtitle: "Paytm, Mobikwik" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full p-2.5 rounded-xl text-left flex items-start gap-2.5 transition-all ${
                    isActive
                      ? "bg-white shadow-xs border border-slate-200 text-blue-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100/80 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <div>
                    <span className="text-xs block leading-tight">{tab.label}</span>
                    <span className="text-[10px] text-slate-400 block font-normal leading-tight">
                      {tab.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}

            <div className="mt-4 pt-3 border-t border-slate-200 px-3 space-y-1.5 text-[10px] text-slate-500">
              <div className="flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <Lock className="w-3 h-3" />
                <span>Instant Bank Reconciliation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Active Method Details & Simulator Controls (8 cols) */}
          <div className="sm:col-span-8 p-5 flex flex-col justify-between space-y-4">
            {activeTab === "upi" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Instant UPI Transfer
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Zero Surcharges
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "gpay", name: "Google Pay" },
                    { id: "phonepe", name: "PhonePe" },
                    { id: "paytm", name: "Paytm UPI" },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id)}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        selectedUpiApp === app.id
                          ? "border-blue-600 bg-sky-50 text-blue-700 shadow-xs"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      {app.name}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Enter UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="mobile@upi or username@okaxis"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    A collect request will be approved in simulation mode.
                  </span>
                </div>
              </div>
            )}

            {activeTab === "card" && (
              <div className="space-y-3.5">
                <h4 className="font-heading font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Debit / Credit Card
                </h4>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={4}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-900"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-slate-400">
                  Pre-filled with Razorpay test card. OTP verification is auto-simulated.
                </p>
              </div>
            )}

            {activeTab === "netbanking" && (
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Popular Indian Banks
                </h4>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Bank", "Punjab National Bank"].map(
                    (bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2 rounded-xl border text-left font-medium transition-all ${
                          selectedBank === bank
                            ? "border-blue-600 bg-sky-50 text-blue-700 font-semibold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {bank}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {activeTab === "wallet" && (
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Digital Wallets
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {["Paytm Wallet", "Mobikwik", "Amazon Pay", "Airtel Money"].map((wallet) => (
                    <button
                      key={wallet}
                      type="button"
                      className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-left"
                    >
                      {wallet}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Simulator Action Controls */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              {processing ? (
                <div className="py-3 px-4 rounded-xl bg-blue-50 border border-blue-200 text-center space-y-1.5 animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-blue-700 font-heading font-bold text-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>{statusMessage || "Processing Payment..."}</span>
                  </div>
                  <p className="text-[10px] text-blue-600">
                    Executing real database booking settlement & digital invoice generation.
                  </p>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleSimulatePayment(true)}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group"
                  >
                    <span>Pay {formattedAmount} (Simulate Success)</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <div className="flex items-center justify-between text-[11px] px-1 text-slate-500 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSimulatePayment(false)}
                      className="text-rose-600 hover:text-rose-700 hover:underline font-medium"
                    >
                      Simulate Declined / Failed Transaction
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="text-slate-400 hover:text-slate-600 hover:underline"
                    >
                      Cancel Payment
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="bg-slate-100/80 px-5 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-[10px] text-slate-500">
          <span>Razorpay Trusted Merchant: <strong>Trip Master Travel LLP</strong></span>
          <span className="font-mono">GST Verified: 29AABCU9603R1ZX</span>
        </div>
      </div>
    </div>
  );
}
