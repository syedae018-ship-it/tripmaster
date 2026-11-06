"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  Users,
  Send,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Clock,
  Sparkles,
  Receipt,
  FileText,
  DollarSign,
  Edit,
  Trash2,
  ExternalLink,
  RotateCcw,
  X,
  FilePlus,
  ShieldCheck,
  Copy,
} from "lucide-react";

interface PaymentTx {
  id: string;
  amount: number;
  paymentMethod: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  status: string;
  refundStatus: string | null;
  refundAmount: number | null;
  notes: string | null;
  createdAt: string;
}

interface DocumentItem {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
  fileSize: string | null;
  createdAt: string;
}

interface BookingFullDetail {
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
    notes: string | null;
  };
  package: {
    id: string;
    title: string;
    slug: string;
    destination: string;
    durationDays: number;
    durationNights: number;
    basePrice: number;
    discountedPrice: number | null;
    featuredImage: string;
  };
  paymentTransactions: PaymentTx[];
  customerDocuments: DocumentItem[];
  inquiry: {
    id: string;
    status: string;
  } | null;
}

export function BookingDetailView({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingFullDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Status updating state
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Edit Tariff Modal
  const [showTariffModal, setShowTariffModal] = useState(false);
  const [newTotalAmount, setNewTotalAmount] = useState("");
  const [updatingTariff, setUpdatingTariff] = useState(false);

  // Record Payment Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMethod: "BANK_TRANSFER",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [recordingPayment, setRecordingPayment] = useState(false);

  // Refund Modal
  const [refundTargetTx, setRefundTargetTx] = useState<PaymentTx | null>(null);
  const [refundForm, setRefundForm] = useState({
    refundAmount: "",
    refundReason: "",
    refundStatus: "FULL_REFUND",
  });
  const [processingRefund, setProcessingRefund] = useState(false);

  // Attach Document Modal
  const [showDocModal, setShowDocModal] = useState(false);
  const [docForm, setDocForm] = useState({
    title: "",
    type: "CONFIRMATION",
    fileUrl: "",
    fileSize: "1.0 MB",
  });
  const [attachingDoc, setAttachingDoc] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`);
      const data = await res.json();
      if (data.success) {
        setBooking(data.booking);
        setNewTotalAmount(String(data.booking.totalAmount));
      } else {
        showToast("Error loading booking: " + data.error);
      }
    } catch (err) {
      console.error(err);
      showToast("Network error fetching booking details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  // Handle status update
  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Status updated to ${newStatus}`);
        setBooking(data.booking);
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle total tariff update
  const handleUpdateTariff = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingTariff(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalAmount: Number(newTotalAmount) }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Agreed tariff updated in financial ledger");
        setShowTariffModal(false);
        setBooking(data.booking);
      } else {
        alert(data.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating tariff");
    } finally {
      setUpdatingTariff(false);
    }
  };

  // Handle recording manual offline payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecordingPayment(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Payment recorded and ledger updated");
        setShowPaymentModal(false);
        setPaymentForm({
          amount: "",
          paymentMethod: "BANK_TRANSFER",
          notes: "",
          date: new Date().toISOString().split("T")[0],
        });
        setBooking(data.booking);
      } else {
        alert(data.error || "Payment recording failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error recording payment");
    } finally {
      setRecordingPayment(false);
    }
  };

  // Handle refund
  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTargetTx) return;
    setProcessingRefund(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/refunds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: refundTargetTx.id,
          refundAmount: Number(refundForm.refundAmount),
          refundReason: refundForm.refundReason,
          refundStatus: refundForm.refundStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Refund logged in ledger successfully");
        setRefundTargetTx(null);
        setBooking(data.booking);
      } else {
        alert(data.error || "Refund processing failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing refund");
    } finally {
      setProcessingRefund(false);
    }
  };

  // Handle attach document
  const handleAttachDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    setAttachingDoc(true);
    try {
      const res = await fetch(`/api/admin/customers/${booking.customer.id}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...docForm,
          bookingId: booking.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Document attached to booking vault");
        setShowDocModal(false);
        setDocForm({
          title: "",
          type: "CONFIRMATION",
          fileUrl: "",
          fileSize: "1.0 MB",
        });
        fetchBooking();
      } else {
        alert(data.error || "Failed to attach document");
      }
    } catch (err) {
      console.error(err);
      alert("Error attaching document");
    } finally {
      setAttachingDoc(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48" />
        <div className="h-44 bg-slate-200 rounded-3xl" />
        <div className="h-64 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Booking Not Found</h2>
        <p className="text-slate-500 text-sm">
          The booking record could not be found or may have been deleted.
        </p>
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#082F24] text-white rounded-xl text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Bookings
        </Link>
      </div>
    );
  }

  const rawPhone = (booking.customer.whatsappNumber || booking.customer.phone || "").replace(
    /\D/g,
    ""
  );
  const waUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    `Hello ${booking.customer.name}, warm greetings from Trip Master Concierge regarding your reservation ${booking.bookingReference} for ${booking.package.title}.`
  )}`;

  const paymentShareUrl = `https://tripmaster.in/pay/${booking.bookingReference}`;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#082F24] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#dfbd75]/40 text-sm font-medium animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#dfbd75]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#082F24] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Bookings Ledger
        </Link>

        {/* Status Dropdown Controller */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">Booking Status:</span>
          <select
            disabled={updatingStatus}
            value={booking.bookingStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none transition-colors ${
              booking.bookingStatus === "CONFIRMED"
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : booking.bookingStatus === "PARTIALLY_PAID"
                ? "bg-amber-50 text-amber-800 border-amber-300"
                : booking.bookingStatus === "COMPLETED"
                ? "bg-blue-50 text-blue-800 border-blue-300"
                : booking.bookingStatus === "CANCELLED"
                ? "bg-red-50 text-red-800 border-red-300"
                : "bg-slate-100 text-slate-700 border-slate-300"
            }`}
          >
            <option value="PENDING">PENDING</option>
            <option value="PARTIALLY_PAID">PARTIALLY_PAID</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* COMMAND CENTER HEADER CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xl sm:text-2xl font-bold bg-[#082F24] text-[#dfbd75] px-3.5 py-1 rounded-xl">
                {booking.bookingReference}
              </span>
              <span className="text-xs text-slate-400">
                Created on{" "}
                {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#082F24]">
              {booking.package.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-slate-400" />
                {new Date(booking.travelStartDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                -{" "}
                {new Date(booking.travelEndDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-4 h-4 text-slate-400" />
                {booking.adultsCount} Adults {booking.childrenCount > 0 ? `, ${booking.childrenCount} Children` : ""} ({booking.paxCount} Total)
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400" />
                {booking.package.destination}
              </span>
            </div>
          </div>

          {/* Guest Contact Action Buttons */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200/80 space-y-3 min-w-[280px]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Primary Guest
                </span>
                <Link
                  href={`/admin/customers/${booking.customer.id}`}
                  className="font-heading font-bold text-slate-800 text-sm hover:underline hover:text-[#082F24]"
                >
                  {booking.customer.name}
                </Link>
              </div>
              <Link
                href={`/admin/customers/${booking.customer.id}`}
                className="text-[11px] text-[#082F24] font-semibold hover:underline"
              >
                View 360° Profile
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200/60">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <Send className="w-3 h-3" /> WhatsApp
              </a>
              <a
                href={`tel:${booking.customer.phone}`}
                className="flex-1 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3 h-3 text-slate-500" /> Call
              </a>
            </div>
          </div>
        </div>

        {booking.specialRequests && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900">
            <span className="font-semibold">Special Concierge Requests:</span>{" "}
            {booking.specialRequests}
          </div>
        )}
      </div>

      {/* FINANCIAL LEDGER COMMAND CENTER */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#082F24] text-[#dfbd75] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-[#082F24]">
                Financial Ledger & Balance Tracking
              </h2>
              <p className="text-xs text-slate-500">
                Auto-recomputed against all verified online and recorded offline transactions.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowTariffModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5 text-slate-500" />
              Adjust Total Tariff
            </button>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              + Record Offline Payment
            </button>
          </div>
        </div>

        {/* 3 Large KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Total Tariff */}
          <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-slate-200/80">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block font-sans">
              Total Contract Tariff
            </span>
            <div className="text-3xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
              ₹{booking.totalAmount.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Agreed package price for {booking.paxCount} travelers
            </span>
          </div>

          {/* Amount Paid */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 block font-sans">
              Total Amount Collected
            </span>
            <div className="text-3xl font-bold text-emerald-700 mt-2 font-mono tabular-nums">
              ₹{booking.amountPaid.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-emerald-700 mt-1 block flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Across {booking.paymentTransactions.filter((t) => t.status === "SUCCESS").length}{" "}
              successful transactions
            </span>
          </div>

          {/* Outstanding Balance */}
          <div
            className={`p-5 rounded-2xl border ${
              booking.balanceAmount > 0
                ? "bg-amber-50/60 border-amber-200/80"
                : "bg-emerald-50/40 border-emerald-200/60"
            }`}
          >
            <span
              className={`text-xs uppercase font-bold tracking-wider block font-sans ${
                booking.balanceAmount > 0 ? "text-amber-800" : "text-emerald-800"
              }`}
            >
              Outstanding Balance Due
            </span>
            <div
              className={`text-3xl font-bold mt-2 font-mono tabular-nums ${
                booking.balanceAmount > 0 ? "text-amber-700" : "text-emerald-700"
              }`}
            >
              ₹{booking.balanceAmount.toLocaleString("en-IN")}
            </div>
            <div className="mt-2">
              {booking.balanceAmount > 0 ? (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(paymentShareUrl);
                    showToast("Payment link copied to clipboard!");
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline"
                >
                  <Copy className="w-3 h-3" />
                  Copy Razorpay Balance Link
                </button>
              ) : (
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 100% Fully Settled
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT TRANSACTIONS LEDGER */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#082F24]" />
            <h3 className="font-heading text-lg font-bold text-[#082F24]">
              Payment Transactions & Receipt History ({booking.paymentTransactions.length})
            </h3>
          </div>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="text-xs text-[#082F24] font-semibold hover:underline inline-flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Add Payment
          </button>
        </div>

        {booking.paymentTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No payment transactions recorded for this reservation yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-50/95 backdrop-blur z-10 text-[11px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Date & Time</th>
                  <th className="py-3 px-4 font-semibold">Payment Mode</th>
                  <th className="py-3 px-4 font-semibold">Transaction / UTR Ref</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount (₹)</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Refund Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {booking.paymentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-xs text-slate-600 font-mono tabular-nums">
                      {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 text-[11px] px-2 py-0.5 rounded bg-slate-100">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-xs text-slate-700 tabular-nums">
                        {tx.razorpayPaymentId || tx.razorpayOrderId || "Manual Entry"}
                      </div>
                      {tx.notes && (
                        <div className="text-[11px] text-slate-500 mt-0.5 italic">
                          {tx.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-xs text-right tabular-nums">
                      ₹{tx.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          tx.status === "SUCCESS"
                            ? "bg-emerald-100 text-emerald-800"
                            : tx.status === "REFUNDED"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {tx.status} {tx.refundStatus ? `(${tx.refundStatus})` : ""}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {tx.status === "SUCCESS" ? (
                        <button
                          onClick={() => {
                            setRefundTargetTx(tx);
                            setRefundForm({
                              refundAmount: String(tx.amount),
                              refundReason: "",
                              refundStatus: "FULL_REFUND",
                            });
                          }}
                          className="px-3 py-1 rounded-lg border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-50 transition-colors inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Refund
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Refund Processed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ATTACHED DOCUMENTS & PHASE 5 VOUCHER PANEL */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-heading text-lg font-bold text-[#082F24] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#dfbd75]" />
              Booking Documents & Vouchers ({booking.customerDocuments.length})
            </h3>
            <p className="text-xs text-slate-500">
              Generated vouchers, payment receipts, and travel quotations ready for client sharing.
            </p>
          </div>
          <button
            onClick={() => setShowDocModal(true)}
            className="px-3.5 py-2 rounded-xl bg-[#082F24] text-white text-xs font-semibold hover:bg-[#0c4434] transition-colors inline-flex items-center gap-1.5"
          >
            <FilePlus className="w-3.5 h-3.5 text-[#dfbd75]" />
            Attach Document
          </button>
        </div>

        {booking.customerDocuments.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No documents attached yet. Click "Attach Document" to link quotation or voucher PDFs.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {booking.customerDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between hover:border-[#dfbd75] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {doc.type}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {doc.fileSize || "1.0 MB"}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-800 text-xs mt-3 line-clamp-1">
                    {doc.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {new Date(doc.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#082F24] hover:text-[#dfbd75] inline-flex items-center gap-1"
                  >
                    View / Download
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADJUST TARIFF MODAL */}
      {showTariffModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading text-lg font-bold text-[#082F24]">
                Adjust Agreed Package Tariff
              </h3>
              <button
                onClick={() => setShowTariffModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTariff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Total Tariff Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={newTotalAmount}
                  onChange={(e) => setNewTotalAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#082F24]"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Outstanding balance will automatically adjust against the ₹
                  {booking.amountPaid.toLocaleString("en-IN")} already collected.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTariffModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingTariff}
                  className="px-5 py-2 rounded-xl bg-[#082F24] text-white text-xs font-semibold hover:bg-[#0c4434] transition-all disabled:opacity-50"
                >
                  {updatingTariff ? "Updating..." : "Save New Tariff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD OFFLINE PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading text-lg font-bold text-[#082F24]">
                Record Offline / Installment Payment
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 flex justify-between">
              <span>Outstanding Balance Due:</span>
              <span className="font-bold">₹{booking.balanceAmount.toLocaleString("en-IN")}</span>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Amount Received (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 50000"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-[#082F24]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Payment Mode *
                </label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#082F24]"
                >
                  <option value="BANK_TRANSFER">Bank Transfer (NEFT / RTGS / IMPS)</option>
                  <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                  <option value="RAZORPAY_ONLINE">Razorpay Online</option>
                  <option value="CARD">Credit / Debit Card</option>
                  <option value="CASH">Cash Deposit</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentForm.date}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, date: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#082F24]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Bank Reference / UTR Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. HDFC UTR #9921441829"
                  value={paymentForm.notes}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, notes: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#082F24]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recordingPayment}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50"
                >
                  {recordingPayment ? "Saving..." : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROCESS REFUND MODAL */}
      {refundTargetTx && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading text-lg font-bold text-red-700">
                Process Transaction Refund
              </h3>
              <button
                onClick={() => setRefundTargetTx(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-red-50 rounded-xl text-xs text-red-900 flex justify-between">
              <span>Original Transaction Amount:</span>
              <span className="font-bold">₹{refundTargetTx.amount.toLocaleString("en-IN")}</span>
            </div>

            <form onSubmit={handleProcessRefund} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Refund Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  max={refundTargetTx.amount}
                  value={refundForm.refundAmount}
                  onChange={(e) =>
                    setRefundForm({ ...refundForm, refundAmount: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Refund Scope
                </label>
                <select
                  value={refundForm.refundStatus}
                  onChange={(e) =>
                    setRefundForm({ ...refundForm, refundStatus: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-red-600"
                >
                  <option value="FULL_REFUND">Full Refund (100%)</option>
                  <option value="PARTIAL_REFUND">Partial Refund</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Refund Reason / Bank Reference *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Flight cancelled due to weather, token refunded via original payment gateway"
                  value={refundForm.refundReason}
                  onChange={(e) =>
                    setRefundForm({ ...refundForm, refundReason: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRefundTargetTx(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingRefund}
                  className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {processingRefund ? "Processing..." : "Confirm Refund"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ATTACH DOCUMENT MODAL */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading text-lg font-bold text-[#082F24]">
                Attach Document to Booking
              </h3>
              <button
                onClick={() => setShowDocModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAttachDocument} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Confirmed Taj Lake Palace Voucher"
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#082F24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Document Category
                  </label>
                  <select
                    value={docForm.type}
                    onChange={(e) => setDocForm({ ...docForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="CONFIRMATION">Booking Voucher</option>
                    <option value="RECEIPT">Payment Receipt</option>
                    <option value="QUOTATION">Quotation PDF</option>
                    <option value="TICKET">Flight/Train Ticket</option>
                    <option value="ID_PROOF">Passport / ID</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    File Size Label
                  </label>
                  <input
                    type="text"
                    value={docForm.fileSize}
                    onChange={(e) => setDocForm({ ...docForm, fileSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  File URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://tripmaster.in/vouchers/..."
                  value={docForm.fileUrl}
                  onChange={(e) => setDocForm({ ...docForm, fileUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#082F24]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={attachingDoc}
                  className="px-5 py-2 rounded-xl bg-[#082F24] text-white text-xs font-semibold hover:bg-[#0c4434] transition-all disabled:opacity-50"
                >
                  {attachingDoc ? "Attaching..." : "Attach Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

