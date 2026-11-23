"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Send,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Trash2,
  ExternalLink,
  Edit,
  X,
  FileCheck,
  Receipt,
  FilePlus,
  Compass,
} from "lucide-react";

interface InquiryItem {
  id: string;
  destination: string;
  travelDate: string | null;
  paxCount: number;
  status: string;
  followUpDate: string | null;
  followUpNote: string | null;
  internalNotes: string[];
  createdAt: string;
  package: {
    id: string;
    title: string;
    slug: string;
    destination: string;
    basePrice: number;
    discountedPrice: number | null;
  } | null;
}

interface PaymentTx {
  id: string;
  amount: number;
  paymentMethod: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  status: string;
  createdAt: string;
}

interface BookingItem {
  id: string;
  bookingReference: string;
  travelStartDate: string;
  travelEndDate: string;
  paxCount: number;
  totalAmount: number;
  amountPaid: number;
  balanceAmount: number;
  bookingStatus: string;
  createdAt: string;
  customPackageTitle?: string | null;
  customDestination?: string | null;
  package: {
    id: string;
    title: string;
    destination: string;
  } | null;
  paymentTransactions: PaymentTx[];
}

interface DocumentItem {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
  fileSize: string | null;
  bookingId: string | null;
  createdAt: string;
}

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsappNumber: string | null;
  city: string | null;
  notes: string | null;
  createdAt: string;
  metrics: {
    totalSpend: number;
    totalBalance: number;
    totalInquiries: number;
    totalBookings: number;
  };
  inquiries: InquiryItem[];
  bookings: BookingItem[];
  documents: DocumentItem[];
}

export function CustomerProfileView({ customerId }: { customerId: string }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"inquiries" | "bookings" | "documents">("inquiries");

  // Edit Profile Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    city: "",
    notes: "",
  });
  const [updating, setUpdating] = useState(false);

  // Attach Document Modal
  const [showDocModal, setShowDocModal] = useState(false);
  const [docForm, setDocForm] = useState({
    title: "",
    type: "QUOTATION",
    fileUrl: "",
    fileSize: "1.2 MB",
    bookingId: "",
  });
  const [attachingDoc, setAttachingDoc] = useState(false);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`);
      const data = await res.json();
      if (data.success) {
        setCustomer(data.customer);
        setEditForm({
          name: data.customer.name || "",
          email: data.customer.email || "",
          phone: data.customer.phone || "",
          whatsappNumber: data.customer.whatsappNumber || "",
          city: data.customer.city || "",
          notes: data.customer.notes || "",
        });
      } else {
        showToast("Error loading customer: " + (data.error || "Not found"));
      }
    } catch (err) {
      console.error(err);
      showToast("Network error fetching customer details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchProfile();
    }
  }, [customerId]);

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Customer profile updated successfully");
        setShowEditModal(false);
        fetchProfile();
      } else {
        alert(data.error || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleAttachDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title || !docForm.fileUrl) {
      alert("Title and File URL are required");
      return;
    }
    setAttachingDoc(true);
    try {
      const res = await fetch(`/api/admin/customers/${customerId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Document attached to vault");
        setShowDocModal(false);
        setDocForm({
          title: "",
          type: "QUOTATION",
          fileUrl: "",
          fileSize: "1.2 MB",
          bookingId: "",
        });
        fetchProfile();
      } else {
        alert(data.error || "Attachment failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to attach document");
    } finally {
      setAttachingDoc(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document from the vault?")) return;
    try {
      const res = await fetch(
        `/api/admin/customers/${customerId}/documents?docId=${docId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        showToast("Document deleted successfully");
        fetchProfile();
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48" />
        <div className="h-48 bg-slate-200 rounded-3xl" />
        <div className="h-64 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Customer Not Found</h2>
        <p className="text-slate-500 text-sm">
          The requested customer profile could not be located in the CRM.
        </p>
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Customer Directory
        </Link>
      </div>
    );
  }

  const rawPhone = (customer.whatsappNumber || customer.phone || "").replace(/\D/g, "");
  const waUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    `Hello ${customer.name}, greetings from Trip Master Luxury Concierge!`
  )}`;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 text-sm font-medium animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-sky-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Navigation & Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Customer Directory
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors shadow-xs"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" />
            Edit Profile
          </button>
          <button
            onClick={() => setShowDocModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-sky-400" />
            Attach Document
          </button>
        </div>
      </div>

      {/* CUSTOMER 360° SUMMARY CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-sky-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-700 text-white flex items-center justify-center font-heading text-2xl sm:text-3xl font-bold shadow-md shrink-0">
              {customer.name ? customer.name.charAt(0).toUpperCase() : "G"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                  {customer.name}
                </h1>
                {customer.metrics.totalBookings > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Verified VIP Traveler
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-600">
                <a
                  href={`tel:${customer.phone}`}
                  className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
                >
                  <Phone className="w-4 h-4 text-slate-400" />
                  {customer.phone}
                </a>

                {customer.whatsappNumber && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 font-medium transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp: {customer.whatsappNumber}
                  </a>
                )}

                <a
                  href={`mailto:${customer.email}`}
                  className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
                >
                  <Mail className="w-4 h-4 text-slate-400" />
                  {customer.email}
                </a>

                {customer.city && (
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {customer.city}
                  </span>
                )}

                <span className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Member since {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {customer.notes && (
                <div className="mt-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Concierge VIP Note:</span> {customer.notes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Contact & Action Buttons */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors inline-flex items-center gap-2 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" /> Direct WhatsApp
            </a>
            <a
              href={`tel:${customer.phone}`}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium hover:bg-slate-200 transition-colors inline-flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" /> Call Client
            </a>
            <a
              href={`mailto:${customer.email}`}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium hover:bg-slate-200 transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-3.5 h-3.5 text-slate-500" /> Send Email
            </a>
          </div>
        </div>

        {/* 4 Financial & Engagement KPI Chips */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-slate-200/60">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-sans">
              Lifetime Spend
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
              ₹{customer.metrics.totalSpend.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-slate-200/60">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-sans">
              Pending Balance
            </span>
            <div
              className={`text-xl sm:text-2xl font-bold mt-1 font-mono tabular-nums ${
                customer.metrics.totalBalance > 0 ? "text-amber-700" : "text-emerald-700"
              }`}
            >
              ₹{customer.metrics.totalBalance.toLocaleString("en-IN")}
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-slate-200/60">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-sans">
              Inquiries Submitted
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
              {customer.metrics.totalInquiries}
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-slate-200/60">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold font-sans">
              Confirmed Bookings
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
              {customer.metrics.totalBookings}
            </div>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-slate-200/80 gap-6">
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 ${
            activeTab === "inquiries"
              ? "text-slate-900 border-b-2 border-blue-600"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <Compass className="w-4 h-4" />
          Inquiry History ({customer.inquiries.length})
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 ${
            activeTab === "bookings"
              ? "text-slate-900 border-b-2 border-blue-600"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Bookings & Payment Ledger ({customer.bookings.length})
        </button>

        <button
          onClick={() => setActiveTab("documents")}
          className={`pb-3 text-sm font-semibold transition-all relative flex items-center gap-2 ${
            activeTab === "documents"
              ? "text-slate-900 border-b-2 border-blue-600"
              : "text-slate-400 hover:text-slate-700"
          }`}
        >
          <FileText className="w-4 h-4" />
          Document & Quotation Vault ({customer.documents.length})
        </button>
      </div>

      {/* TAB 1: INQUIRY HISTORY */}
      {activeTab === "inquiries" && (
        <div className="space-y-4">
          {customer.inquiries.length > 0 ? (
            customer.inquiries.map((inq) => (
              <div
                key={inq.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 hover:border-blue-300 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-400">
                        #{inq.id.slice(-6)}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-slate-900">
                        {inq.package?.title || inq.destination}
                      </h3>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          inq.status === "NEW"
                            ? "bg-blue-100 text-blue-800"
                            : inq.status === "CONTACTED"
                            ? "bg-amber-100 text-amber-800"
                            : inq.status === "QUOTED"
                            ? "bg-purple-100 text-purple-800"
                            : inq.status === "CONVERTED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {inq.destination}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {inq.travelDate || "Flexible Dates"}
                      </span>
                      <span>• {inq.paxCount} Guests</span>
                      <span>
                        • Submitted on{" "}
                        {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/admin/inquiries?id=${inq.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all self-start md:self-center"
                  >
                    View in Pipeline
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Follow-up Note & Internal Timeline */}
                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {inq.followUpDate && (
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60">
                      <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        Scheduled Follow-Up:{" "}
                        {new Date(inq.followUpDate).toLocaleDateString("en-IN")}
                      </div>
                      <p className="text-amber-800 mt-1 italic">
                        {inq.followUpNote || "No specific follow-up memo recorded."}
                      </p>
                    </div>
                  )}

                  {inq.internalNotes && inq.internalNotes.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="font-semibold text-slate-700 mb-1">
                        Concierge Notes ({inq.internalNotes.length}):
                      </div>
                      <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                        {inq.internalNotes.map((note, idx) => (
                          <p key={idx} className="text-slate-600 text-xs">
                            • {note}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
              <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-medium">No inquiries recorded for this guest.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BOOKING & PAYMENT LEDGER */}
      {activeTab === "bookings" && (
        <div className="space-y-6">
          {customer.bookings.length > 0 ? (
            customer.bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FAF8F5]/60">
                  <div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white hover:underline inline-flex items-center gap-1"
                      >
                        <span>{b.bookingReference}</span>
                        <ExternalLink className="w-3 h-3 text-sky-300" />
                      </Link>
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="font-heading text-lg font-bold text-slate-900 hover:underline"
                      >
                        {b.package?.title || b.customPackageTitle || "Custom Private Itinerary"}
                      </Link>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          b.bookingStatus === "CONFIRMED"
                            ? "bg-emerald-100 text-emerald-800"
                            : b.bookingStatus === "PARTIALLY_PAID"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(b.travelStartDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        to{" "}
                        {new Date(b.travelEndDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span>• {b.paxCount} Travelers</span>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-semibold">
                        Total
                      </div>
                      <div className="font-heading font-bold text-slate-800 text-base">
                        ₹{b.totalAmount.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-semibold">
                        Paid
                      </div>
                      <div className="font-heading font-bold text-emerald-700 text-base">
                        ₹{b.amountPaid.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-semibold">
                        Balance
                      </div>
                      <div
                        className={`font-heading font-bold text-base ${
                          b.balanceAmount > 0 ? "text-amber-700" : "text-slate-400"
                        }`}
                      >
                        ₹{b.balanceAmount.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Linked Payment Transactions */}
                <div className="p-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" />
                    Payment Transactions ({b.paymentTransactions.length})
                  </h4>

                  {b.paymentTransactions.length > 0 ? (
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                      {b.paymentTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="p-3.5 flex items-center justify-between text-xs bg-slate-50/50 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <div>
                              <div className="font-semibold text-slate-800">
                                ₹{tx.amount.toLocaleString("en-IN")} via {tx.paymentMethod}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                Razorpay Ref: {tx.razorpayPaymentId || tx.razorpayOrderId || "Direct / Bank"}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 text-[10px]">
                              {tx.status}
                            </span>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No payment transactions logged for this booking yet.
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
              <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-medium">No bookings logged for this customer yet.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DOCUMENT VAULT */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Upload and store customer passport IDs, formal quotation PDFs, booking vouchers, and payment receipts.
            </p>
            <button
              onClick={() => setShowDocModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all"
            >
              <FilePlus className="w-3.5 h-3.5 text-sky-400" />
              Add Document
            </button>
          </div>

          {customer.documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customer.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                        <FileText className="w-5 h-5 text-slate-900" />
                      </div>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          doc.type === "QUOTATION"
                            ? "bg-purple-100 text-purple-800"
                            : doc.type === "CONFIRMATION"
                            ? "bg-blue-100 text-blue-800"
                            : doc.type === "RECEIPT"
                            ? "bg-emerald-100 text-emerald-800"
                            : doc.type === "ID_PROOF"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {doc.type}
                      </span>
                    </div>

                    <h4 className="font-semibold text-slate-800 text-sm mt-3 line-clamp-1">
                      {doc.title}
                    </h4>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <span>{doc.fileSize || "1.0 MB"}</span>
                      <span>•</span>
                      <span>
                        {new Date(doc.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-900 hover:text-blue-600 inline-flex items-center gap-1"
                    >
                      View File
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-medium">No documents attached to this customer vault.</p>
              <button
                onClick={() => setShowDocModal(true)}
                className="mt-3 inline-flex items-center gap-2 text-xs text-slate-900 font-semibold hover:underline"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Attach Quotation or Passport Copy
              </button>
            </div>
          )}
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Edit Customer Profile
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 flex items-center justify-center transition-[background-color,transform,color] duration-150 cursor-pointer"
                aria-label="Close edit modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={editForm.whatsappNumber}
                    onChange={(e) =>
                      setEditForm({ ...editForm, whatsappNumber: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    City / Country
                  </label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Concierge VIP Preferences & Internal Notes
                </label>
                <textarea
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="e.g. High net worth client, prefers suites with valley view and private chauffeur..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ATTACH DOCUMENT MODAL */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Attach Document to Vault
              </h3>
              <button
                type="button"
                onClick={() => setShowDocModal(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 flex items-center justify-center transition-[background-color,transform,color] duration-150 cursor-pointer"
                aria-label="Close document modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAttachDocument} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Signed Quotation - Kashmir Luxury Escape"
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Document Category *
                  </label>
                  <select
                    value={docForm.type}
                    onChange={(e) => setDocForm({ ...docForm, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="QUOTATION">Quotation PDF</option>
                    <option value="CONFIRMATION">Booking Confirmation / Voucher</option>
                    <option value="RECEIPT">Payment Receipt</option>
                    <option value="ID_PROOF">Passport / ID Proof</option>
                    <option value="TICKET">Flight / Train Ticket</option>
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
                    placeholder="e.g. 2.4 MB"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Document File URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={docForm.fileUrl}
                  onChange={(e) => setDocForm({ ...docForm, fileUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              {customer.bookings.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Link to Specific Booking (Optional)
                  </label>
                  <select
                    value={docForm.bookingId}
                    onChange={(e) => setDocForm({ ...docForm, bookingId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="">-- General Customer Document --</option>
                    {customer.bookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.bookingReference} - {b.package?.title || b.customPackageTitle || "Custom Itinerary"}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={attachingDoc}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
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

