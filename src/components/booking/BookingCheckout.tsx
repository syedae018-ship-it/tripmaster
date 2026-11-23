"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Calendar,
  Users,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  HelpCircle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { RazorpayModal } from "@/components/payment/RazorpayModal";

interface PackageData {
  id: string;
  title: string;
  slug: string;
  destination: string;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  discountedPrice: number | null;
  featuredImage: string;
  inclusions: string[];
}

export function BookingCheckout({ packageSlug }: { packageSlug: string }) {
  const router = useRouter();
  const [pkg, setPkg] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [city, setCity] = useState("");
  const [travelStartDate, setTravelStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // 2 weeks out default
    return d.toISOString().split("T")[0];
  });
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [specialRequests, setSpecialRequests] = useState("");

  // Payment plan: "FULL" (100%) or "ADVANCE" (30%)
  const [paymentPlan, setPaymentPlan] = useState<"FULL" | "ADVANCE">("FULL");

  // Razorpay & Processing state
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Simulation modal state
  const [simModalOpen, setSimModalOpen] = useState(false);
  const [simOrderData, setSimOrderData] = useState<{
    orderId: string;
    amount: number;
    amountDue: number;
  } | null>(null);

  // Mobile order summary accordion state
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/packages/${packageSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPkg(data.package);
        } else {
          setErrorMsg(data.error || "Failed to load package");
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("Failed to load package details");
      })
      .finally(() => setLoading(false));
  }, [packageSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-24 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-[#0D2C24] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-heading font-bold text-lg text-[#0D2C24]">
            Preparing Your Luxury Reservation Portal...
          </p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-24 px-4 font-sans">
        <div className="max-w-md mx-auto text-center space-y-4 bg-white p-8 rounded-2xl border border-[#E4E2DD] shadow-card">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="font-heading font-bold text-2xl text-[#111111]">Package Not Found</h2>
          <p className="text-sm text-[#52525B]">
            The travel package you are attempting to book is unavailable or has been archived.
          </p>
          <Link
            href="/packages"
            className="btn btn-primary min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold active:scale-[0.98] transition-transform"
          >
            Explore Other Journeys
          </Link>
        </div>
      </div>
    );
  }

  // Calculations
  const unitPrice = pkg.discountedPrice || pkg.basePrice;
  const paxCount = adultsCount + childrenCount;
  // If unitPrice is 1 (test package), total is 1, and advance is 1
  const isTestOneRupee = unitPrice === 1;
  const totalAmount = isTestOneRupee
    ? 1
    : Math.round(unitPrice * adultsCount + unitPrice * 0.6 * childrenCount);
  const advanceAmount = isTestOneRupee
    ? 1
    : totalAmount <= 100
    ? totalAmount
    : Math.min(totalAmount, Math.max(25000, Math.round(totalAmount * 0.3)));
  const amountDueToday = paymentPlan === "FULL" ? totalAmount : advanceAmount;
  const remainingBalance = Math.max(0, totalAmount - amountDueToday);

  // Calculate return date safely avoiding timezone day boundary drifts
  const startDateObj = travelStartDate.includes("T")
    ? new Date(travelStartDate)
    : new Date(`${travelStartDate}T00:00:00`);
  const returnDateObj = new Date(startDateObj);
  returnDateObj.setDate(returnDateObj.getDate() + (pkg.durationDays - 1));
  const returnDateStr = returnDateObj.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Handle Checkout initiation
  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name || !email || !phone || !travelStartDate) {
      setErrorMsg("Please fill in all mandatory traveler contact and date fields.");
      return;
    }

    setProcessing(true);

    try {
      // Step 1: Create Order via backend API
      const orderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountDueToday,
          currency: "INR",
          receipt: `rcpt_${pkg.slug.slice(0, 8)}_${Date.now()}`,
          notes: {
            packageSlug: pkg.slug,
            guestName: name,
            guestEmail: email,
            plan: paymentPlan,
          },
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create payment order");
      }

      const order = orderData.order;

      // If simulated mode is active (or keys not present)
      if (order.isSimulated) {
        setSimOrderData({
          orderId: order.id,
          amount: order.amount,
          amountDue: amountDueToday,
        });
        setSimModalOpen(true);
        setProcessing(false);
        return;
      }

      // Step 2: Open official Razorpay Checkout Modal
      const loadRazorpayScript = () => {
        return new Promise((resolve) => {
          if ((window as any).Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to connect to Razorpay secure payment gateway");
      }

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Trip Master Luxury Concierge",
        description: `Booking for ${pkg.title}`,
        image: "https://tripmaster.in/icon.png",
        order_id: order.id,
        handler: async function (response: any) {
          await completeVerification({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        prefill: {
          name,
          email,
          contact: phone,
        },
        theme: {
          color: "#0A2E23",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setProcessing(false);
        setErrorMsg(
          `Payment authorization failed: ${response.error.description || "Transaction declined"}`
        );
      });
      rzp.open();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to initialize payment");
      setProcessing(false);
    }
  };

  // Complete backend verification
  const completeVerification = async (paymentAuth: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    setProcessing(true);
    try {
      const verifyRes = await fetch("/api/payments/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...paymentAuth,
          bookingData: {
            packageId: pkg.id,
            name,
            email,
            phone,
            whatsappNumber: whatsappNumber || phone,
            city,
            travelStartDate,
            travelEndDate: returnDateObj.toISOString(),
            startDate: travelStartDate,
            endDate: returnDateObj.toISOString(),
            paxCount,
            adultsCount,
            childrenCount,
            specialRequests,
            totalAmount,
            amountPaid: amountDueToday,
            paymentMethod: "RAZORPAY_ONLINE",
          },
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        router.push(`/booking-success/${verifyData.bookingReference}`);
      } else {
        throw new Error(verifyData.error || "Verification rejected by server");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to verify transaction");
      setProcessing(false);
    }
  };

  // Handle simulated checkout success
  const handleSimulateSuccess = async () => {
    if (!simOrderData) return;
    setSimModalOpen(false);
    const simulatedPaymentId = `pay_sim_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
    const simulatedSignature = `sim_sig_${Date.now()}`;

    await completeVerification({
      razorpay_order_id: simOrderData.orderId,
      razorpay_payment_id: simulatedPaymentId,
      razorpay_signature: simulatedSignature,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/packages/${pkg.slug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#52525B] hover:text-[#0D2C24] transition-colors min-h-[44px] py-2 px-1"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Package Overview
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            256-Bit SSL Encrypted Guest Checkout
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* MOBILE ORDER SUMMARY ACCORDION (Visible on Mobile only: lg:hidden) */}
        <div className="lg:hidden mb-6 bg-white rounded-2xl border border-[#E4E2DD] shadow-card overflow-hidden">
          <div
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="p-4 flex items-center justify-between cursor-pointer active:bg-[#FAF9F6] transition-colors"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-[#E4E2DD]">
                <Image
                  src={pkg.featuredImage}
                  alt={pkg.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.includes("1598091383021")) {
                      target.srcset = "";
                      target.src =
                        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=600&q=80";
                    }
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-[#0D2C24] px-2 py-0.5 rounded-full inline-block">
                    {pkg.destination}
                  </span>
                  <span className="text-[11px] text-[#52525B] tabular-nums font-medium">
                    {pkg.durationDays}D / {pkg.durationNights}N
                  </span>
                </div>
                <h3 className="font-heading font-bold text-sm text-[#111111] truncate mt-1">
                  {pkg.title}
                </h3>
                <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1 mt-0.5">
                  <span>Due today:</span>
                  <span className="price-display font-bold tabular-nums text-sm text-[#0D2C24]">
                    ₹{amountDueToday.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-[11px] font-semibold text-[#0D2C24]">
                {mobileSummaryOpen ? "Hide" : "Details"}
              </span>
              <div
                className={`w-7 h-7 rounded-full bg-[#FAF9F6] border border-[#E4E2DD] flex items-center justify-center transition-transform duration-200 ${
                  mobileSummaryOpen ? "rotate-180" : ""
                }`}
              >
                <ChevronDown className="w-3.5 h-3.5 text-[#52525B]" />
              </div>
            </div>
          </div>

          {/* Expanded Breakdown on Mobile */}
          {mobileSummaryOpen && (
            <div className="px-4 pb-4 pt-2 border-t border-[#E4E2DD] bg-[#FAF9F6] space-y-3 text-xs">
              {/* Dates and Guests */}
              <div className="p-3 bg-white rounded-xl border border-[#E4E2DD] space-y-1.5 text-xs text-[#52525B]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#0D2C24]" /> Departure:
                  </span>
                  <span className="font-semibold text-[#111111]">
                    {startDateObj.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#0D2C24]" /> Return:
                  </span>
                  <span className="font-semibold text-[#111111]">{returnDateStr}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#E4E2DD]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-[#0D2C24]" /> Guests:
                  </span>
                  <span className="font-semibold text-[#111111]">
                    {adultsCount} Adults {childrenCount > 0 ? `, ${childrenCount} Children` : ""}
                  </span>
                </div>
              </div>

              {/* Pricing itemization */}
              <div className="p-3 bg-white rounded-xl border border-[#E4E2DD] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#52525B]">
                  <span>Adult Tariff ({adultsCount} × ₹{unitPrice.toLocaleString("en-IN")})</span>
                  <span className="tabular-nums font-semibold text-[#111111]">₹{(adultsCount * unitPrice).toLocaleString("en-IN")}</span>
                </div>
                {childrenCount > 0 && (
                  <div className="flex items-center justify-between text-[#52525B]">
                    <span>Children Tariff ({childrenCount} × ₹{Math.round(unitPrice * 0.6).toLocaleString("en-IN")})</span>
                    <span className="tabular-nums font-semibold text-[#111111]">₹{Math.round(childrenCount * unitPrice * 0.6).toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-emerald-800 font-medium">
                  <span>Luxury Concierge & Taxes</span>
                  <span>Included</span>
                </div>
                <div className="pt-2 border-t border-[#E4E2DD] flex items-center justify-between font-bold text-[#111111]">
                  <span>Total Package Cost:</span>
                  <span className="tabular-nums">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-900">
                    {paymentPlan === "FULL" ? "Full Settle (100%):" : "Advance Due Today (30%):"}
                  </span>
                  <span className="price-display font-bold text-base text-amber-900 tabular-nums">
                    ₹{amountDueToday.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: GUEST & PAYMENT FORM (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleInitiatePayment} className="space-y-6">
              {/* STEP 1: TRAVELER INFORMATION */}
              <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#E4E2DD] shadow-card">
                <div className="flex items-center gap-3 pb-4 border-b border-[#E4E2DD]">
                  <div className="w-8 h-8 rounded-lg bg-[#0D2C24] text-amber-300 flex items-center justify-center font-heading font-bold text-sm shrink-0">
                    1
                  </div>
                  <div>
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-[#111111]">
                      Guest & Travel Details
                    </h2>
                    <p className="text-xs text-[#52525B] mt-0.5">
                      No customer account needed. All updates sent via WhatsApp and Email.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                      Full Name of Primary Traveler *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Malhotra"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#E4E2DD] text-base sm:text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rohan@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#E4E2DD] text-base sm:text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (!whatsappNumber) setWhatsappNumber(e.target.value);
                        }}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#E4E2DD] text-base sm:text-sm tabular-nums text-[#111111] focus:outline-none focus:border-[#0D2C24] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                        Home City / Country
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai, India"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#E4E2DD] text-base sm:text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                        Departure Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={travelStartDate}
                        onChange={(e) => setTravelStartDate(e.target.value)}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#E4E2DD] text-base sm:text-sm tabular-nums text-[#111111] focus:outline-none focus:border-[#0D2C24] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                        Adults (12+ yrs)
                      </label>
                      <select
                        value={adultsCount}
                        onChange={(e) => setAdultsCount(Number(e.target.value))}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#E4E2DD] text-base sm:text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24] bg-white transition-all cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "Adult" : "Adults"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                        Children (Under 12)
                      </label>
                      <select
                        value={childrenCount}
                        onChange={(e) => setChildrenCount(Number(e.target.value))}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#E4E2DD] text-base sm:text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24] bg-white transition-all cursor-pointer"
                      >
                        {[0, 1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "Child" : "Children"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                      Bespoke Requests & Occasion Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Celebrating 10th anniversary, king bed preference, vegetarian meals, airport wheelchair assistance..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E4E2DD] text-base sm:text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 2: FLEXIBLE PAYMENT OPTIONS */}
              <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#E4E2DD] shadow-card">
                <div className="flex items-center gap-3 pb-4 border-b border-[#E4E2DD]">
                  <div className="w-8 h-8 rounded-lg bg-[#0D2C24] text-amber-300 flex items-center justify-center font-heading font-bold text-sm shrink-0">
                    2
                  </div>
                  <div>
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-[#111111]">
                      Payment Plan Selection
                    </h2>
                    <p className="text-xs text-[#52525B] mt-0.5">
                      Choose how you wish to settle this luxury reservation.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Plan Option 1: Full Payment */}
                  <div
                    onClick={() => setPaymentPlan("FULL")}
                    className={`cursor-pointer rounded-xl p-4 sm:p-5 border-2 active:scale-[0.99] transition-[background-color,border-color,transform] duration-150 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 ${
                      paymentPlan === "FULL"
                        ? "border-[#0D2C24] bg-[#0D2C24]/5"
                        : "border-[#E4E2DD] hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-3.5">
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          paymentPlan === "FULL"
                            ? "border-[#0D2C24] bg-[#0D2C24]"
                            : "border-slate-300"
                        }`}
                      >
                        {paymentPlan === "FULL" && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-heading font-bold text-[#111111] text-sm sm:text-base">
                            Pay Full Amount (100%)
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            Instant Confirmation
                          </span>
                        </div>
                        <p className="text-xs text-[#52525B] mt-1 leading-relaxed">
                          Zero pending balances. Complete peace of mind with instant vouchers issued.
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right pl-8 sm:pl-0 pt-2 sm:pt-0 border-t border-[#E4E2DD]/60 sm:border-0 shrink-0">
                      <div className="font-heading font-bold text-base sm:text-lg text-[#111111] tabular-nums">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </div>
                      <span className="text-[11px] text-[#52525B]">Total payable</span>
                    </div>
                  </div>

                  {/* Plan Option 2: Advance Deposit */}
                  <div
                    onClick={() => setPaymentPlan("ADVANCE")}
                    className={`cursor-pointer rounded-xl p-4 sm:p-5 border-2 active:scale-[0.99] transition-[background-color,border-color,transform] duration-150 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 ${
                      paymentPlan === "ADVANCE"
                        ? "border-[#0D2C24] bg-[#0D2C24]/5"
                        : "border-[#E4E2DD] hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-3.5">
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          paymentPlan === "ADVANCE"
                            ? "border-[#0D2C24] bg-[#0D2C24]"
                            : "border-slate-300"
                        }`}
                      >
                        {paymentPlan === "ADVANCE" && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-heading font-bold text-[#111111] text-sm sm:text-base">
                            Pay Booking Token Advance (30%)
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                            Lock Dates Now
                          </span>
                        </div>
                        <p className="text-xs text-[#52525B] mt-1 leading-relaxed">
                          Lock your luxury retreat slots today. Balance of{" "}
                          <span className="tabular-nums font-semibold">
                            ₹{remainingBalance.toLocaleString("en-IN")}
                          </span>{" "}
                          payable 15 days before arrival.
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right pl-8 sm:pl-0 pt-2 sm:pt-0 border-t border-[#E4E2DD]/60 sm:border-0 shrink-0">
                      <div className="font-heading font-bold text-base sm:text-lg text-[#111111] tabular-nums">
                        ₹{advanceAmount.toLocaleString("en-IN")}
                      </div>
                      <span className="text-[11px] text-[#52525B]">Due today</span>
                    </div>
                  </div>
                </div>

                {/* Razorpay Guaranteed Badge */}
                <div className="mt-6 pt-5 border-t border-[#E4E2DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#52525B]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0D2C24] shrink-0" />
                    <span>Protected by Razorpay Payment Gateway & 100% Refund Policy</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 bg-[#F3F1ED] rounded-md border border-[#E4E2DD]">UPI</span>
                    <span className="px-2 py-0.5 bg-[#F3F1ED] rounded-md border border-[#E4E2DD]">Cards</span>
                    <span className="px-2 py-0.5 bg-[#F3F1ED] rounded-md border border-[#E4E2DD]">NetBanking</span>
                  </div>
                </div>
              </div>

              {/* Pre-Payment Review Box */}
              <div className="p-4 rounded-xl bg-white border border-[#E4E2DD] shadow-xs flex items-center justify-between font-sans">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#52525B] font-semibold block">
                    {paymentPlan === "FULL" ? "Full Settle (100%)" : "Advance Deposit (30%)"}
                  </span>
                  <span className="text-xs text-[#111111] font-medium">
                    {adultsCount} {adultsCount === 1 ? "Adult" : "Adults"}
                    {childrenCount > 0 ? `, ${childrenCount} Child` : ""} • {pkg.durationDays}D Journey
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-semibold block">
                    Total Due Now
                  </span>
                  <span className="price-display font-heading font-bold text-xl text-[#0D2C24] tabular-nums">
                    ₹{amountDueToday.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={processing}
                className="btn btn-primary w-full min-h-[50px] py-3.5 sm:py-4 rounded-xl text-sm font-semibold uppercase tracking-wider justify-center gap-2.5 shadow-md active:scale-[0.98] transition-[background-color,transform,box-shadow] duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Initiating Razorpay Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Pay <span className="tabular-nums">₹{amountDueToday.toLocaleString("en-IN")}</span></span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: PACKAGE SUMMARY CARD (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E4E2DD] shadow-card space-y-6 sticky top-28 font-sans">
              {/* Package Header Card */}
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-xs border border-[#E4E2DD]">
                  <Image
                    src={pkg.featuredImage}
                    alt={pkg.title}
                    fill
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.src.includes("1598091383021")) {
                        target.srcset = "";
                        target.src =
                          "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80";
                      }
                    }}
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-[#0D2C24] px-2.5 py-0.5 rounded-full inline-block">
                    {pkg.destination}
                  </span>
                  <h3 className="font-heading font-bold text-[#111111] text-base line-clamp-2 mt-1.5 leading-snug">
                    {pkg.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#52525B] mt-1 tabular-nums font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#0D2C24]" />
                      {pkg.durationDays}D / {pkg.durationNights}N
                    </span>
                  </div>
                </div>
              </div>

              {/* Itinerary Dates Strip */}
              <div className="p-4 rounded-xl bg-[#F3F1ED] border border-[#E4E2DD] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#52525B]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#0D2C24]" /> Travel Starts:
                  </span>
                  <span className="font-semibold text-[#111111]">
                    {startDateObj.toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#52525B]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#0D2C24]" /> Journey Concludes:
                  </span>
                  <span className="font-semibold text-[#111111]">{returnDateStr}</span>
                </div>
                <div className="flex items-center justify-between text-[#52525B] pt-1.5 border-t border-[#E4E2DD]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-[#0D2C24]" /> Travelers:
                  </span>
                  <span className="font-semibold text-[#111111]">
                    {adultsCount} Adults {childrenCount > 0 ? `, ${childrenCount} Children` : ""}
                  </span>
                </div>
              </div>

              {/* Key Inclusions Preview */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-2.5">
                  Trip Master Signature Inclusions
                </h4>
                <div className="space-y-1.5 text-xs text-[#52525B]">
                  {(Array.isArray(pkg.inclusions) ? pkg.inclusions : []).slice(0, 4).map((inc, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0D2C24] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="pt-4 border-t border-[#E4E2DD] space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[#52525B]">
                  <span>
                    Adult Tariff ({adultsCount} × ₹{unitPrice.toLocaleString("en-IN")})
                  </span>
                  <span className="tabular-nums font-semibold text-[#111111]">₹{(adultsCount * unitPrice).toLocaleString("en-IN")}</span>
                </div>

                {childrenCount > 0 && (
                  <div className="flex items-center justify-between text-[#52525B]">
                    <span>
                      Children Tariff ({childrenCount} × ₹
                      {Math.round(unitPrice * 0.6).toLocaleString("en-IN")})
                    </span>
                    <span className="tabular-nums font-semibold text-[#111111]">
                      ₹{Math.round(childrenCount * unitPrice * 0.6).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-emerald-800 font-semibold">
                  <span>Luxury Concierge & Taxes</span>
                  <span>Included</span>
                </div>

                <div className="pt-2 border-t border-[#E4E2DD] flex items-baseline justify-between text-[#111111]">
                  <span className="font-heading font-bold text-sm">Total Package Cost:</span>
                  <span className="price-display font-heading font-bold text-lg text-[#111111] tabular-nums">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Amount Due Today Highlight */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                      Payable Now via Razorpay
                    </span>
                    {paymentPlan === "ADVANCE" && (
                      <p className="text-[10px] text-amber-800">
                        Remaining <span className="tabular-nums font-semibold">₹{remainingBalance.toLocaleString("en-IN")}</span> due before travel
                      </p>
                    )}
                  </div>
                  <div className="price-display font-heading font-bold text-xl text-amber-900 tabular-nums">
                    ₹{amountDueToday.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* 24/7 Hotline Support Card */}
              <div className="bg-[#0D2C24] text-white p-4 rounded-xl flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-300" />
                  <div>
                    <div className="text-xs font-semibold">Need Help With Your Booking?</div>
                    <div className="text-[11px] text-white/80 tabular-nums font-medium">
                      Call our 24/7 Concierge: +91 98765 43210
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AUTHENTIC RAZORPAY CHECKOUT & SIMULATOR MODAL */}
      <RazorpayModal
        isOpen={simModalOpen && !!simOrderData}
        onClose={() => {
          setSimModalOpen(false);
          setProcessing(false);
        }}
        orderId={simOrderData?.orderId || ""}
        amount={amountDueToday}
        customerName={name}
        customerEmail={email}
        customerPhone={phone}
        description={`Booking for ${pkg.title}`}
        onSuccess={async (paymentAuth) => {
          setSimModalOpen(false);
          await completeVerification(paymentAuth);
        }}
        onFailure={(msg) => {
          setErrorMsg(msg);
          setProcessing(false);
        }}
      />
    </div>
  );
}

