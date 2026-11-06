"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  Search,
  Filter,
  PlusCircle,
  Calendar,
  Users,
  Send,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Receipt,
  Clock,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  DollarSign,
} from "lucide-react";

interface BookingItem {
  id: string;
  bookingReference: string;
  travelStartDate: string;
  travelEndDate: string;
  paxCount: number;
  adultsCount: number;
  childrenCount: number;
  specialRequests: string | null;
  totalAmount: number;
  amountPaid: number;
  balanceAmount: number;
  bookingStatus: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    whatsappNumber: string | null;
    city: string | null;
  };
  package: {
    id: string;
    title: string;
    slug: string;
    destination: string;
    basePrice: number;
    discountedPrice: number | null;
  };
  paymentTransactions: Array<{
    id: string;
    amount: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
  }>;
  customerDocuments: Array<{
    id: string;
    title: string;
    type: string;
  }>;
  inquiry: {
    id: string;
    status: string;
  } | null;
}

interface KPIs {
  totalBookings: number;
  confirmedCount: number;
  totalBookingValue: number;
  totalRevenueCollected: number;
  totalOutstandingBalance: number;
}

export function BookingsHub() {
  const searchParams = useSearchParams();
  const convertInquiryId = searchParams.get("convertInquiryId");

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [kpis, setKpis] = useState<KPIs>({
    totalBookings: 0,
    confirmedCount: 0,
    totalBookingValue: 0,
    totalRevenueCollected: 0,
    totalOutstandingBalance: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [balanceFilter, setBalanceFilter] = useState("ALL");

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [packagesList, setPackagesList] = useState<
    Array<{ id: string; title: string; basePrice: number; discountedPrice: number | null }>
  >([]);
  const [customersList, setCustomersList] = useState<
    Array<{ id: string; name: string; phone: string; email: string }>
  >([]);

  // Create Form
  const [form, setForm] = useState({
    customerId: "",
    newCustomerName: "",
    newCustomerEmail: "",
    newCustomerPhone: "",
    newCustomerWhatsapp: "",
    newCustomerCity: "",
    packageId: "",
    inquiryId: "",
    travelStartDate: "",
    travelEndDate: "",
    adultsCount: 2,
    childrenCount: 0,
    specialRequests: "",
    totalAmount: "",
    initialAmountPaid: "",
    paymentMethod: "BANK_TRANSFER",
    paymentNotes: "",
    bookingStatus: "PARTIALLY_PAID",
  });
  const [submitting, setSubmitting] = useState(false);

  // Quick Payment Modal
  const [quickPayBooking, setQuickPayBooking] = useState<BookingItem | null>(null);
  const [quickPayForm, setQuickPayForm] = useState({
    amount: "",
    paymentMethod: "UPI",
    notes: "",
  });
  const [quickPaySubmitting, setQuickPaySubmitting] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchBookings = async () => {
    try {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      if (statusFilter !== "ALL") q.set("status", statusFilter);
      if (balanceFilter !== "ALL") q.set("balance", balanceFilter);

      const res = await fetch(`/api/admin/bookings?${q.toString()}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
        if (data.kpis) setKpis(data.kpis);
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load dropdown resources
  useEffect(() => {
    fetch("/api/admin/packages")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPackagesList(d.packages || []);
      })
      .catch(console.error);

    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCustomersList(d.customers || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [search, statusFilter, balanceFilter]);

  // Check if inquiry conversion was requested via URL query
  useEffect(() => {
    if (convertInquiryId) {
      fetch(`/api/admin/inquiries/${convertInquiryId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.inquiry) {
            const inq = d.inquiry;
            setForm((prev) => ({
              ...prev,
              customerId: inq.customerId || "",
              inquiryId: inq.id,
              packageId: inq.packageId || "",
              travelStartDate: inq.travelDate
                ? new Date(inq.travelDate).toISOString().split("T")[0]
                : "",
              adultsCount: inq.paxCount || 2,
              specialRequests: inq.followUpNote
                ? `Inquiry Request: ${inq.followUpNote}`
                : "",
              totalAmount: inq.package?.discountedPrice
                ? String(inq.package.discountedPrice * (inq.paxCount || 2))
                : inq.package?.basePrice
                ? String(inq.package.basePrice * (inq.paxCount || 2))
                : "",
            }));
            setShowCreateModal(true);
            showToast("Inquiry loaded for conversion to booking");
          }
        })
        .catch(console.error);
    }
  }, [convertInquiryId]);

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paxCount: Number(form.adultsCount) + Number(form.childrenCount),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Booking ${data.booking.bookingReference} created successfully!`);
        setShowCreateModal(false);
        fetchBookings();
      } else {
        alert(data.error || "Failed to create booking");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error submitting booking");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPayBooking) return;
    setQuickPaySubmitting(true);

    try {
      const res = await fetch(`/api/admin/bookings/${quickPayBooking.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quickPayForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Payment recorded & ledger updated");
        setQuickPayBooking(null);
        setQuickPayForm({ amount: "", paymentMethod: "UPI", notes: "" });
        fetchBookings();
      } else {
        alert(data.error || "Payment record failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error recording payment");
    } finally {
      setQuickPaySubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#082F24] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#dfbd75]/40 text-sm font-medium animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#dfbd75]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header & New Booking Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#dfbd75]" />
            <span>Phase 4 Bookings & Financial Ledger</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-[#082F24]">
            Bookings & Financial Ledger
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage confirmed trips, collect balances, verify Razorpay payments, and record offline transactions.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#082F24] text-white font-medium text-sm hover:bg-[#0c4434] transition-all shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#dfbd75]" />
          <span>+ New Booking / Convert Lead</span>
        </button>
      </div>

      {/* TOP KPI SUMMARY STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
            Total Bookings
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {kpis.totalBookings}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">All registered trips</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
            Confirmed Trips
          </span>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono tabular-nums">
            {kpis.confirmedCount}
          </div>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">Ready for departure</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
            Total Booking Value
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            ₹{kpis.totalBookingValue.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Contracted trip tariff</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-800 block">
            Revenue Collected
          </span>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono tabular-nums">
            ₹{kpis.totalRevenueCollected.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">Captured in bank/Razorpay</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[11px] uppercase font-bold tracking-wider text-amber-800 block">
            Outstanding Balance
          </span>
          <div className="text-2xl font-bold text-amber-700 mt-1 font-mono tabular-nums">
            ₹{kpis.totalOutstandingBalance.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-amber-600 mt-0.5 block">Pending installment</span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Reference, Customer, Package..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#082F24]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:border-[#082F24]"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PARTIALLY_PAID">Partially Paid</option>
              <option value="PENDING">Pending Payment</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Balance:</span>
            <select
              value={balanceFilter}
              onChange={(e) => setBalanceFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:border-[#082F24]"
            >
              <option value="ALL">All Balances</option>
              <option value="HAS_BALANCE">Has Outstanding Balance</option>
              <option value="FULLY_PAID">Fully Settled (₹0 Due)</option>
              <option value="REFUNDED">Refund Processed</option>
            </select>
          </div>
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 animate-pulse text-sm">
            Loading bookings and ledger...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-heading text-lg font-bold text-slate-700">No Bookings Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No reservation records match the current filters. Create a new booking or clear search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-50/95 backdrop-blur z-10 text-slate-500 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Guest Contact</th>
                  <th className="py-3 px-4">Package & Travel Window</th>
                  <th className="py-3 px-4 text-right">Financial Ledger</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => {
                  const percentPaid = Math.min(
                    100,
                    Math.round((b.amountPaid / (b.totalAmount || 1)) * 100)
                  );
                  const rawPhone = (
                    b.customer.whatsappNumber ||
                    b.customer.phone ||
                    ""
                  ).replace(/\D/g, "");
                  const waUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
                    `Hello ${b.customer.name}, greetings from Trip Master regarding your booking ${b.bookingReference} for ${b.package.title}.`
                  )}`;

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Booking Reference */}
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="font-mono font-bold text-[#0F2E26] hover:text-[#C59B27] hover:underline flex items-center gap-1.5 tabular-nums"
                        >
                          <span>{b.bookingReference}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono tabular-nums">
                          {new Date(b.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>

                      {/* Customer Contact */}
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/customers/${b.customer.id}`}
                          className="font-semibold text-slate-900 hover:text-[#0F2E26] hover:underline"
                        >
                          {b.customer.name}
                        </Link>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 font-mono tabular-nums"
                            title="Chat on WhatsApp"
                          >
                            <Send className="w-3 h-3 text-emerald-600" />
                            {b.customer.phone}
                          </a>
                        </div>
                      </td>

                      {/* Package & Window */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 line-clamp-1">
                          {b.package.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span className="font-mono tabular-nums">
                            {new Date(b.travelStartDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}{" "}
                            -{" "}
                            {new Date(b.travelEndDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span>• {b.paxCount} Pax</span>
                        </div>
                      </td>

                      {/* Financial Ledger & Progress */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-baseline justify-end gap-1.5 text-xs font-mono tabular-nums">
                          <span className="font-semibold text-emerald-700">
                            ₹{b.amountPaid.toLocaleString("en-IN")}
                          </span>
                          <span className="text-slate-400">
                            / ₹{b.totalAmount.toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden ml-auto mt-1">
                          <div
                            className={`h-full rounded-full ${
                              b.balanceAmount === 0 ? "bg-emerald-500" : "bg-[#C59B27]"
                            }`}
                            style={{ width: `${percentPaid}%` }}
                          />
                        </div>

                        <div className="text-[10px] mt-1 flex items-center justify-end font-mono tabular-nums">
                          {b.balanceAmount > 0 ? (
                            <span className="font-semibold text-amber-700">
                              Bal Due: ₹{b.balanceAmount.toLocaleString("en-IN")}
                            </span>
                          ) : (
                            <span className="font-semibold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Fully Settled
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Booking Status Badge with 6px status dot */}
                      <td className="py-3 px-4">
                        {b.bookingStatus === "CONFIRMED" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Confirmed
                          </span>
                        ) : b.bookingStatus === "PARTIALLY_PAID" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Partially Paid
                          </span>
                        ) : b.bookingStatus === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Completed
                          </span>
                        ) : b.bookingStatus === "CANCELLED" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Cancelled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {b.balanceAmount > 0 && (
                          <button
                            onClick={() => {
                              setQuickPayBooking(b);
                              setQuickPayForm({
                                amount: String(b.balanceAmount),
                                paymentMethod: "UPI",
                                notes: "",
                              });
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                          >
                            + Collect Pay
                          </button>
                        )}
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-[#082F24] hover:text-white transition-colors inline-flex items-center gap-1"
                        >
                          Manage
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE NEW BOOKING / CONVERT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-heading text-xl font-bold text-[#082F24]">
                  {form.inquiryId ? "Convert Inquiry to Booking" : "Create New Trip Booking"}
                </h3>
                <p className="text-xs text-slate-500">
                  Record confirmed guest reservation, negotiated pricing, and advance payments.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="mt-5 space-y-4">
              {/* Customer Selector or Inline Add */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Select Existing Customer
                </label>
                <select
                  value={form.customerId}
                  onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#082F24] bg-white"
                >
                  <option value="">-- Choose Existing Customer or Add New Below --</option>
                  {customersList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - {c.email}
                    </option>
                  ))}
                </select>
              </div>

              {!form.customerId && (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 space-y-3">
                  <span className="text-xs font-bold uppercase text-[#082F24]">
                    New Customer Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required={!form.customerId}
                      placeholder="Full Name *"
                      value={form.newCustomerName}
                      onChange={(e) =>
                        setForm({ ...form, newCustomerName: e.target.value })
                      }
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                    <input
                      type="email"
                      required={!form.customerId}
                      placeholder="Email Address *"
                      value={form.newCustomerEmail}
                      onChange={(e) =>
                        setForm({ ...form, newCustomerEmail: e.target.value })
                      }
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                    <input
                      type="tel"
                      required={!form.customerId}
                      placeholder="Phone Number *"
                      value={form.newCustomerPhone}
                      onChange={(e) =>
                        setForm({ ...form, newCustomerPhone: e.target.value })
                      }
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                    <input
                      type="text"
                      placeholder="City / Country"
                      value={form.newCustomerCity}
                      onChange={(e) =>
                        setForm({ ...form, newCustomerCity: e.target.value })
                      }
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Package Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Luxury Package *
                </label>
                <select
                  required
                  value={form.packageId}
                  onChange={(e) => {
                    const selPkg = packagesList.find((p) => p.id === e.target.value);
                    const rate = selPkg?.discountedPrice || selPkg?.basePrice || 0;
                    setForm({
                      ...form,
                      packageId: e.target.value,
                      totalAmount: rate ? String(rate * form.adultsCount) : form.totalAmount,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#082F24] bg-white"
                >
                  <option value="">-- Select Travel Package --</option>
                  {packagesList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (₹{(p.discountedPrice || p.basePrice).toLocaleString("en-IN")})
                    </option>
                  ))}
                </select>
              </div>

              {/* Travel Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Travel Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.travelStartDate}
                    onChange={(e) => setForm({ ...form, travelStartDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#082F24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Travel Concludes Date
                  </label>
                  <input
                    type="date"
                    value={form.travelEndDate}
                    onChange={(e) => setForm({ ...form, travelEndDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#082F24]"
                  />
                </div>
              </div>

              {/* Pax */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Adults Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.adultsCount}
                    onChange={(e) =>
                      setForm({ ...form, adultsCount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#082F24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Children Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.childrenCount}
                    onChange={(e) =>
                      setForm({ ...form, childrenCount: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#082F24]"
                  />
                </div>
              </div>

              {/* Pricing & Advance Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Total Agreed Package Tariff (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 196000"
                    value={form.totalAmount}
                    onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#082F24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Initial Advance Paid (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 50000 (0 if unpaid)"
                    value={form.initialAmountPaid}
                    onChange={(e) => setForm({ ...form, initialAmountPaid: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#082F24]"
                  />
                </div>
              </div>

              {Number(form.initialAmountPaid) > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-emerald-50 rounded-xl">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-emerald-800 mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={form.paymentMethod}
                      onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 text-xs bg-white"
                    >
                      <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS/IMPS)</option>
                      <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                      <option value="RAZORPAY_ONLINE">Razorpay Online</option>
                      <option value="CARD">Credit / Debit Card</option>
                      <option value="CASH">Cash Deposit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-emerald-800 mb-1">
                      UTR / Bank Ref Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UTR: HDFC9921004"
                      value={form.paymentNotes}
                      onChange={(e) => setForm({ ...form, paymentNotes: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Special Notes & Guest Preferences
                </label>
                <textarea
                  rows={2}
                  value={form.specialRequests}
                  onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                  placeholder="e.g. Houseboat room upgrade, airport chauffeur pickup requested..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#082F24]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#082F24] text-white text-xs font-semibold hover:bg-[#0c4434] transition-all disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Confirm & Create Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK OFFLINE PAYMENT RECORDER MODAL */}
      {quickPayBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#082F24]">
                  Record Payment / Installment
                </h3>
                <p className="text-xs text-slate-500">
                  Ref: <strong className="font-mono text-slate-800">{quickPayBooking.bookingReference}</strong>
                </p>
              </div>
              <button
                onClick={() => setQuickPayBooking(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center text-xs">
              <span className="text-amber-800 font-semibold">Current Outstanding:</span>
              <span className="font-heading font-bold text-amber-900 text-base">
                ₹{quickPayBooking.balanceAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <form onSubmit={handleQuickPay} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Amount Received (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={quickPayForm.amount}
                  onChange={(e) => setQuickPayForm({ ...quickPayForm, amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#082F24]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Payment Method *
                </label>
                <select
                  value={quickPayForm.paymentMethod}
                  onChange={(e) =>
                    setQuickPayForm({ ...quickPayForm, paymentMethod: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#082F24]"
                >
                  <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                  <option value="BANK_TRANSFER">Bank Transfer (NEFT / RTGS / IMPS)</option>
                  <option value="RAZORPAY_ONLINE">Razorpay Online Payment</option>
                  <option value="CARD">Credit / Debit Card</option>
                  <option value="CASH">Cash Handover</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  UTR / Reference / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR: 592810294 Bank of Baroda"
                  value={quickPayForm.notes}
                  onChange={(e) => setQuickPayForm({ ...quickPayForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#082F24]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setQuickPayBooking(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={quickPaySubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50"
                >
                  {quickPaySubmitting ? "Recording..." : "Save to Ledger"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

