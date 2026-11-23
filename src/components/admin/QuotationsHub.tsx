"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Share2,
  ExternalLink,
  Trash2,
  Edit2,
  MessageSquare,
  Sparkles,
  Calendar,
  DollarSign,
  Loader2,
  Eye,
  CreditCard,
  Link2,
  Check,
  X,
  User,
  Copy,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export function QuotationsHub() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [origin, setOrigin] = useState("");

  // Quick Payment Link Modal State
  const [showQuickPayModal, setShowQuickPayModal] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Quick Payment Link Form Fields
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerWhatsApp, setCustomerWhatsApp] = useState("");
  const [tripTitle, setTripTitle] = useState("Singapore Luxury Escape (4D/3N)");
  const [destination, setDestination] = useState("Singapore");
  const [totalAmount, setTotalAmount] = useState<number | string>(75000);
  const [amountDueToday, setAmountDueToday] = useState<number | string>(25000);
  const [paymentNotes, setPaymentNotes] = useState(
    "Booking advance token to lock hotel inventory and private transfers."
  );

  // Modal Submission & Success State
  const [generatingLink, setGeneratingLink] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<{
    quoteId: string;
    quoteNumber: string;
    shareSlug: string;
    paymentUrl: string;
    customerName: string;
    customerPhone: string;
    totalAmount: number;
    amountDue: number;
    remainingBalance: number;
    destination: string;
    tripTitle: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers || []);
      }
    } catch (e) {
      console.error("Failed to load customers:", e);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleOpenQuickPayModal = () => {
    setGeneratedResult(null);
    setModalError(null);
    setShowQuickPayModal(true);
    if (customers.length === 0) {
      fetchCustomers();
    }
  };

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    if (!id) return;
    const c = customers.find((cust) => cust.id === id);
    if (c) {
      setCustomerName(c.name || "");
      setCustomerPhone(c.phone || "");
      setCustomerEmail(c.email || "");
      setCustomerWhatsApp(c.whatsappNumber || c.phone || "");
    }
  };

  const setAmountDuePercentage = (pct: number) => {
    const total = Number(totalAmount) || 0;
    if (total <= 0) return;
    setAmountDueToday(Math.round((total * pct) / 100));
  };

  const remainingBalance = Math.max(
    0,
    Number(totalAmount || 0) - Number(amountDueToday || 0)
  );

  const handleGeneratePaymentLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!tripTitle.trim()) {
      setModalError("Please provide a Trip / Service Title");
      return;
    }
    if (!destination.trim()) {
      setModalError("Please specify a Destination");
      return;
    }
    const numTotal = Number(totalAmount) || 0;
    const numDue = Number(amountDueToday) || 0;
    if (numTotal <= 0) {
      setModalError("Total Trip Amount must be greater than 0");
      return;
    }
    if (numDue <= 0) {
      setModalError("Amount Due Today must be greater than 0");
      return;
    }
    if (numDue > numTotal) {
      setModalError("Amount Due Today cannot exceed Total Amount");
      return;
    }
    if (!customerName.trim()) {
      setModalError("Customer Name is required");
      return;
    }

    try {
      setGeneratingLink(true);
      const remaining = Math.max(0, numTotal - numDue);

      const payload = {
        title: tripTitle.trim(),
        destination: destination.trim(),
        totalAmount: numTotal,
        pricePerPerson: numDue,
        paxCount: 2,
        durationDays: 4,
        durationNights: 3,
        status: "SENT",
        paymentAmountDue: numDue,
        paymentStatus: "UNPAID",
        paymentPlan: numDue >= numTotal ? "FULL" : "ADVANCE",
        paymentNote: paymentNotes.trim(),
        paymentLinkActive: true, // Direct active link, no activation hurdle!
        customerId: selectedCustomerId || undefined,
        customerData: !selectedCustomerId
          ? {
              name: customerName.trim(),
              phone: customerPhone.trim(),
              email: customerEmail.trim(),
              whatsappNumber: customerWhatsApp.trim() || customerPhone.trim(),
            }
          : undefined,
        content: {
          heroImage:
            "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
          title: tripTitle.trim(),
          subtitle: `${destination.trim()} • Verified Concierge Payment Link`,
          mapIntro: `Direct reservation and verified settlement dossier for ${customerName.trim()}.`,
          mapStops: [
            { name: destination.trim(), label: "Concierge & Private Tour Services" },
          ],
          summary: {
            duration: "4 Days, 3 Nights",
            destination: destination.trim(),
            pricePerPersonFormatted: `INR ${numDue.toLocaleString("en-IN")} due today`,
            pricePerPerson: numDue,
            totalCostFormatted: `INR ${numTotal.toLocaleString("en-IN")} Total Value`,
            paxCount: 2,
          },
          sectionSettings: {
            showMapIntro: false,
            showCostBreakdown: true,
            showStaySummary: false,
            showQuickSummary: false,
            showMomentsThatMatter: false,
            showInclusionsExclusions: true,
            showPaymentPolicy: true,
            showReviews: false,
          },
          costBreakdown: [
            {
              category: "Trip Package Total Value",
              cost: `INR ${numTotal.toLocaleString("en-IN")}`,
            },
            {
              category: "Initial Settlement Due Today",
              cost: `INR ${numDue.toLocaleString("en-IN")}`,
            },
            {
              category: "Remaining Balance to Settle",
              cost: `INR ${remaining.toLocaleString("en-IN")}`,
            },
          ],
          staySummary: {
            city: destination.trim(),
            hotelName: "Curated 4-Star / 5-Star Accommodations",
            roomType: "Deluxe Room with Daily Breakfast",
            rating: 4.8,
            photo:
              "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
          },
          mealsBanner: {
            title: "Concierge Inclusions & Support",
            description:
              "Daily breakfast included, airport transfers & 24/7 dedicated travel concierge.",
            tags: ["Breakfast Included", "Dedicated Concierge", "GST Invoice"],
          },
          quickDayWiseSummary: [
            {
              day: "Day 1",
              summary: `Arrival in ${destination.trim()} & Private VIP Transfer`,
            },
            {
              day: "Day 2",
              summary: "Signature Curated Sightseeing & Leisure",
            },
            { day: "Day 3", summary: "Attractions & Premium Experiences" },
            { day: "Day 4", summary: "Leisure & VIP Airport Transfer" },
          ],
          days: [],
          momentsThatMatter: [],
          inclusions: [
            `Guaranteed reservation for ${tripTitle.trim()}`,
            "Instant Razorpay UPI, Net Banking, and Credit/Debit Card verification",
            "Official GST tax invoice delivered immediately upon payment",
            "Dedicated 24/7 travel concierge desk support",
          ],
          exclusions: [
            "Personal expenses and incidental hotel charges",
            "International flight tickets unless explicitly invoiced",
          ],
          paymentPolicy: [
            `Amount Due Today: INR ${numDue.toLocaleString("en-IN")}`,
            `Remaining Balance: INR ${remaining.toLocaleString("en-IN")}`,
            paymentNotes.trim() ||
              "Payment is secured via 256-bit SSL encrypted Razorpay checkout.",
            "Official Tax Invoice and Payment Receipt issued automatically upon successful authorization.",
          ],
          reviews: [],
          advisor: {
            name: "Trip Master Luxury Concierge",
            phone: "+91 99000 00000",
            whatsappNumber: "+91 99000 00000",
            email: "concierge@tripmaster.in",
            offices: "New Delhi • Mumbai • Bangalore",
            companyName: "TripMaster Concierge Services Private Limited",
          },
        },
      };

      const res = await fetch("/api/admin/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to generate payment link");
      }

      const q = data.quotation;
      const base = origin || window.location.origin;
      const paymentUrl = `${base}/pay/quote/${q.shareSlug}`;

      setGeneratedResult({
        quoteId: q.id,
        quoteNumber: q.quotationNumber,
        shareSlug: q.shareSlug,
        paymentUrl,
        customerName: q.customer?.name || customerName.trim(),
        customerPhone: q.customer?.phone || customerPhone.trim(),
        totalAmount: q.totalAmount || numTotal,
        amountDue: q.paymentAmountDue || numDue,
        remainingBalance: remaining,
        destination: q.destination,
        tripTitle: q.title,
      });

      // Refresh table immediately so the quotation appears
      fetchQuotations();
      showToast("Payment Link created & activated successfully!");
    } catch (err: any) {
      setModalError(err.message || "Failed to generate payment link");
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleSendWhatsAppMessage = (info: {
    customerName: string;
    customerPhone: string;
    tripTitle: string;
    destination: string;
    totalAmount: number;
    amountDue: number;
    remainingBalance: number;
    paymentUrl: string;
  }) => {
    const cleanPhone = (info.customerPhone || "").replace(/[^0-9]/g, "");
    const text = `Hello ${info.customerName || "there"}, here is your secure Trip Master payment link for *${info.tripTitle}* (${info.destination}):\n\n*Total Package Value:* ₹${Number(info.totalAmount).toLocaleString("en-IN")}\n*Amount Due Today:* ₹${Number(info.amountDue).toLocaleString("en-IN")}\n*Remaining Balance:* ₹${Number(info.remainingBalance).toLocaleString("en-IN")}\n\n*Secure Payment Link:*\n${info.paymentUrl}\n\nYou can complete payment securely via UPI, Credit/Debit Cards, or Net Banking with instant reservation confirmation. Let us know if you need any assistance!`;

    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(waUrl, "_blank");
  };

  const handleCopyPaymentLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast("Payment link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    fetchQuotations();
  }, [statusFilter]);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (searchQuery) params.set("q", searchQuery);

      const res = await fetch(`/api/admin/quotations?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setQuotations(data.quotations || []);
      }
    } catch (e) {
      console.error("Failed to fetch quotations:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuotations();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quotation?")) return;
    try {
      const res = await fetch(`/api/admin/quotations/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setQuotations((prev) => prev.filter((q) => q.id !== id));
      }
    } catch (e) {
      alert("Failed to delete quotation");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SENT":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "ACCEPTED":
      case "CONVERTED":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* 1. Standardized Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          {/* Breadcrumb Tag / Module Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold uppercase tracking-wider mb-1.5 border border-blue-100">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Quotation Engine</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Mobile Quotations & Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Generate 100% mobile-optimized vertical itinerary dossiers, pricing breakdowns, and WhatsApp proposals.
          </p>
        </div>

        {/* Top-Right Action Button */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleOpenQuickPayModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-all shadow-xs"
          >
            <CreditCard className="w-4 h-4 text-white" />
            <span>+ New Payment Link</span>
          </button>

          <Link
            href="/admin/quotations/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Build New Quotation</span>
          </Link>
        </div>
      </div>

      {/* 2. Quick Executive KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Quotations
          </span>
          <div className="text-2xl font-heading font-bold text-slate-900 tabular-nums">
            {quotations.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Generated client plans
          </span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Active Proposals
          </span>
          <div className="text-2xl font-heading font-bold text-blue-700 tabular-nums">
            {quotations.filter((q) => q.status === "SENT").length}
          </div>
          <span className="text-[11px] text-blue-600/80 mt-0.5 block">
            Shared with guests
          </span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
            Converted / Accepted
          </span>
          <div className="text-2xl font-heading font-bold text-emerald-700 tabular-nums">
            {quotations.filter((q) => q.status === "CONVERTED" || q.status === "ACCEPTED").length}
          </div>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">
            Confirmed itineraries
          </span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Quotation Pipeline
          </span>
          <div className="text-2xl font-heading font-bold text-slate-900 tabular-nums">
            ₹
            {quotations
              .reduce(
                (sum, q) =>
                  sum + (q.totalAmount || (q.pricePerPerson || 0) * (q.paxCount || 2)),
                0
              )
              .toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Estimated proposals value
          </span>
        </div>
      </div>

      {/* 3. Filter & Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by quote #, client, or destination..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-600"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-hidden focus:border-blue-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent to Client</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="CONVERTED">Converted to Booking</option>
          </select>
        </div>
      </div>

      {/* 4. Quotations List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-xs">Loading quotations...</span>
          </div>
        ) : quotations.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-700">No quotations created yet</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Click below to build your first luxury customized mobile plan.
            </p>
            <Link
              href="/admin/quotations/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Build First Quotation
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-500 font-heading font-semibold text-[11px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Quotation #</th>
                  <th className="py-3 px-4">Client & Contact</th>
                  <th className="py-3 px-4">Package & Destination</th>
                  <th className="py-3 px-4">Price Per Pax</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 block">
                        {q.quotationNumber}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {q.durationNights}N / {q.durationDays}D
                        </span>
                        {q.paymentLinkActive && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CreditCard className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Link Active</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">
                        {q.customer?.name || "Guest Traveller"}
                      </span>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        {q.customer?.phone || "No phone"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-heading font-semibold text-slate-900 block truncate max-w-xs">
                        {q.title}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {q.destination}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{(q.pricePerPerson ?? 0).toLocaleString("en-IN")}
                      {q.paymentAmountDue && q.paymentAmountDue > 0 && (
                        <span className="text-[10px] text-emerald-600 block font-sans font-medium">
                          Due: ₹{q.paymentAmountDue.toLocaleString("en-IN")}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                          q.status
                        )}`}
                      >
                        {q.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-500 text-[11px]">
                      {q.createdAt
                        ? new Date(q.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {/* Live Mobile Dossier */}
                      <a
                        href={`/quote/${q.shareSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 inline-block text-zinc-600 hover:text-black rounded-lg hover:bg-zinc-100 transition-colors"
                        title="View Live Mobile Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>

                      {/* Client Payment Portal Link */}
                      <a
                        href={`/pay/quote/${q.shareSlug || q.quotationNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 inline-block text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Open Client Payment Portal"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                      </a>

                      {/* Copy Direct Payment Link */}
                      <button
                        type="button"
                        onClick={() => {
                          const base =
                            origin ||
                            (typeof window !== "undefined"
                              ? window.location.origin
                              : "");
                          const link = `${base}/pay/quote/${
                            q.shareSlug || q.quotationNumber
                          }`;
                          handleCopyPaymentLink(link);
                        }}
                        className="p-1.5 inline-block text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Copy Payment Portal Link"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Studio */}
                      <Link
                        href={`/admin/quotations/${q.id}`}
                        className="p-1.5 inline-block text-zinc-600 hover:text-[#0D2C24] rounded-lg hover:bg-zinc-100 transition-colors"
                        title="Edit Plan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>

                      {/* WhatsApp share */}
                      {(() => {
                        const cleanPhone = (
                          q.customer?.whatsappNumber ||
                          q.customer?.phone ||
                          ""
                        ).replace(/[^0-9]/g, "");
                        const shareBase =
                          origin ||
                          (typeof window !== "undefined"
                            ? window.location.origin
                            : "");
                        const fullQuoteUrl = shareBase
                          ? `${shareBase}/quote/${q.shareSlug}`
                          : `/quote/${q.shareSlug}`;
                        const paymentUrl = shareBase
                          ? `${shareBase}/pay/quote/${q.shareSlug}`
                          : `/pay/quote/${q.shareSlug}`;

                        const msg = q.paymentLinkActive
                          ? `Hello ${
                              q.customer?.name || "there"
                            }, here is your secure Trip Master payment link for *${
                              q.title
                            }*:\n\n*Payment Link:* ${paymentUrl}\n*Itinerary Dossier:* ${fullQuoteUrl}\n\nYou can complete your reservation deposit securely with instant verification.`
                          : `Hi ${
                              q.customer?.name || "there"
                            }! Here is your personalized TripMaster itinerary & quotation: ${fullQuoteUrl}`;

                        return (
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                              msg
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 inline-block text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
                            title="Send via WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        );
                      })()}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sleek Quick Payment Link Creation Modal */}
      {showQuickPayModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/80 to-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-slate-900 text-base">
                    Quick Payment Link Generator
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Instantly create an active payment link with zero activation hurdles
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickPayModal(false)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            {generatedResult ? (
              /* Success Card View */
              <div className="p-6 space-y-5 bg-white">
                <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-bold text-emerald-950 text-sm">
                      Payment Link Created & Immediately Active!
                    </h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Quote <span className="font-mono font-bold">{generatedResult.quoteNumber}</span> has been published. The client can pay via UPI, Credit/Debit cards, or Net Banking right away.
                    </p>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Client
                      </span>
                      <span className="font-bold text-slate-900">
                        {generatedResult.customerName}
                      </span>
                      {generatedResult.customerPhone && (
                        <span className="text-slate-500 text-[11px] block font-mono">
                          {generatedResult.customerPhone}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Trip / Service
                      </span>
                      <span className="font-semibold text-slate-900 max-w-[200px] truncate block">
                        {generatedResult.tripTitle}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {generatedResult.destination}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">
                        Total Value
                      </span>
                      <span className="font-heading font-bold text-xs text-slate-900 tabular-nums">
                        ₹{Number(generatedResult.totalAmount).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-200">
                      <span className="text-[9px] uppercase font-bold text-emerald-700 block">
                        Due Today
                      </span>
                      <span className="font-heading font-bold text-xs text-emerald-900 tabular-nums">
                        ₹{Number(generatedResult.amountDue).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200">
                      <span className="text-[9px] uppercase font-bold text-amber-700 block">
                        Remaining
                      </span>
                      <span className="font-heading font-bold text-xs text-amber-900 tabular-nums">
                        ₹{Number(generatedResult.remainingBalance).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Link Box with 1-Click Copy */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Secure Client Payment Link
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-2 pl-3">
                    <span className="text-xs font-mono text-slate-700 truncate flex-1">
                      {generatedResult.paymentUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyPaymentLink(generatedResult.paymentUrl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 ${
                        copiedLink
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-900 hover:bg-black text-white"
                      }`}
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Executive Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppMessage(generatedResult)}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send via WhatsApp</span>
                  </button>

                  <a
                    href={generatedResult.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                    <span>Open Payment Portal</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setGeneratedResult(null);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    + Generate Another Payment Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQuickPayModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Done & View in Hub
                  </button>
                </div>
              </div>
            ) : (
              /* Payment Link Form View */
              <form onSubmit={handleGeneratePaymentLink} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                {modalError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
                    {modalError}
                  </div>
                )}

                {/* Customer Dropdown (Loads /api/admin/customers) */}
                <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>Select Registered Customer (Auto-Populate)</span>
                    </label>
                    {loadingCustomers && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Loading...</span>
                      </span>
                    )}
                  </div>

                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleSelectCustomer(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="">-- Choose from Registered Customer Directory --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.phone ? `(${c.phone})` : ""} {c.city ? `• ${c.city}` : ""}
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Vikram Singhania"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value);
                          if (!customerWhatsApp) setCustomerWhatsApp(e.target.value);
                        }}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="e.g. client@example.com"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={customerWhatsApp}
                        onChange={(e) => setCustomerWhatsApp(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Trip & Destination Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Trip / Service Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={tripTitle}
                      onChange={(e) => setTripTitle(e.target.value)}
                      placeholder="e.g. Singapore Luxury Escape (4D/3N)"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-hidden focus:border-emerald-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Destination *
                    </label>
                    <input
                      type="text"
                      required
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Singapore, Bali, Dubai"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-hidden focus:border-emerald-600 font-medium"
                    />
                  </div>
                </div>

                {/* Pricing & Deposit Configuration */}
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-950 mb-1">
                        Total Trip Value (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-heading font-bold border border-emerald-300 rounded-xl bg-white text-slate-900 focus:outline-hidden focus:border-emerald-600 tabular-nums"
                        placeholder="e.g. 75000"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-950 mb-1">
                        Amount Due Today (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={amountDueToday}
                        onChange={(e) => setAmountDueToday(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-heading font-bold border border-emerald-300 rounded-xl bg-white text-slate-900 focus:outline-hidden focus:border-emerald-600 tabular-nums"
                        placeholder="e.g. 25000"
                      />
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mr-1">
                      Quick Ratio:
                    </span>
                    <button
                      type="button"
                      onClick={() => setAmountDuePercentage(100)}
                      className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition-colors"
                    >
                      100% Full
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmountDuePercentage(50)}
                      className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition-colors"
                    >
                      50% Deposit
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmountDuePercentage(30)}
                      className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition-colors"
                    >
                      30% Token
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmountDuePercentage(25)}
                      className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition-colors"
                    >
                      25% Token
                    </button>
                    <button
                      type="button"
                      onClick={() => setAmountDueToday(1)}
                      className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-amber-100 border border-amber-300 text-amber-900 hover:bg-amber-200 transition-colors ml-auto"
                    >
                      ⚡ ₹1 Test
                    </button>
                  </div>

                  {/* Auto-Calculated Remaining Balance Banner */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-200 text-xs">
                    <span className="font-medium text-slate-600">
                      Auto-Calculated Remaining Balance:
                    </span>
                    <span
                      className={`font-heading font-bold text-sm tabular-nums ${
                        remainingBalance > 0 ? "text-amber-800" : "text-emerald-700"
                      }`}
                    >
                      ₹{remainingBalance.toLocaleString("en-IN")}
                      {remainingBalance === 0 && (
                        <span className="text-[10px] ml-1 text-emerald-600 font-sans font-medium">
                          (Fully Settled)
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Payment Notes */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Payment Notes / Client Terms
                  </label>
                  <textarea
                    rows={2}
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="e.g. Non-refundable advance token required to block current flight fare and 4-star hotel inventory."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                {/* Form Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setShowQuickPayModal(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={generatingLink}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-2"
                  >
                    {generatingLink ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating Active Link...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Create & Activate Payment Link</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D2C24] text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-700 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

