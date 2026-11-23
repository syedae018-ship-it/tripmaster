"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  PlusCircle,
  Phone,
  Mail,
  Calendar,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  MessageSquare,
  ArrowRight,
  User,
  LayoutGrid,
  List,
  ChevronRight,
  Send,
  CreditCard,
  FileText,
  MapPin,
} from "lucide-react";

export interface InquiryItem {
  id: string;
  customerId: string;
  packageId: string | null;
  destination: string;
  travelDate: string | null;
  paxCount: number;
  status: "NEW" | "CONTACTED" | "QUOTED" | "CONVERTED" | "LOST";
  followUpDate: string | null;
  followUpNote: string | null;
  internalNotes: string[];
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
  package?: {
    id: string;
    title: string;
    slug: string;
    destination: string;
    basePrice: number;
    discountedPrice: number | null;
    durationDays: number;
  } | null;
}

export function InquiriesHub() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [followUpFilter, setFollowUpFilter] = useState("all");

  // Drawer & Modal States
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // New Note state in drawer
  const [newNoteText, setNewNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  // Follow-up edit in drawer
  const [editFollowUpDate, setEditFollowUpDate] = useState("");
  const [editFollowUpNote, setEditFollowUpNote] = useState("");
  const [updatingFollowUp, setUpdatingFollowUp] = useState(false);

  // Add Manual Inquiry Form
  const [manualForm, setManualForm] = useState({
    name: "",
    phone: "",
    whatsappNumber: "",
    email: "",
    city: "",
    destination: "Kashmir Luxury Escape",
    travelDate: "",
    paxCount: "2",
    status: "NEW",
    notes: "",
    followUpDate: "",
    followUpNote: "",
  });
  const [submittingManual, setSubmittingManual] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (followUpFilter !== "all") params.set("followUpFilter", followUpFilter);

      const res = await fetch(`/api/admin/inquiries?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.error("Error loading inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, followUpFilter]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInquiries();
  };

  // Quick Status Update
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Inquiry status updated to ${newStatus}`);
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: newStatus as any } : i))
        );
        if (selectedInquiry?.id === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null));
        }
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  // Add Note Handler in Drawer
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedInquiry) return;
    setSubmittingNote(true);

    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newNote: newNoteText.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Note logged into timeline");
        setSelectedInquiry(data.inquiry);
        setInquiries((prev) =>
          prev.map((i) => (i.id === selectedInquiry.id ? data.inquiry : i))
        );
        setNewNoteText("");
      }
    } catch {
      showToast("Error adding note", "error");
    } finally {
      setSubmittingNote(false);
    }
  };

  // Update Follow-up Schedule
  const handleSaveFollowUp = async () => {
    if (!selectedInquiry) return;
    setUpdatingFollowUp(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followUpDate: editFollowUpDate || null,
          followUpNote: editFollowUpNote || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Follow-up schedule updated");
        setSelectedInquiry(data.inquiry);
        setInquiries((prev) =>
          prev.map((i) => (i.id === selectedInquiry.id ? data.inquiry : i))
        );
      }
    } catch {
      showToast("Failed to save follow-up", "error");
    } finally {
      setUpdatingFollowUp(false);
    }
  };

  // Convert to Booking in 1 Click
  const handleConvertToBooking = (inquiry: InquiryItem) => {
    router.push(`/admin/bookings?convertInquiryId=${inquiry.id}`);
  };

  // Submit Manual Inquiry
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingManual(true);

    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to log lead");
      }

      showToast("Manual lead logged successfully!");
      setShowAddModal(false);
      setManualForm({
        name: "",
        phone: "",
        whatsappNumber: "",
        email: "",
        city: "",
        destination: "Kashmir Luxury Escape",
        travelDate: "",
        paxCount: "2",
        status: "NEW",
        notes: "",
        followUpDate: "",
        followUpNote: "",
      });
      fetchInquiries();
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert("Failed to log lead");
    } finally {
      setSubmittingManual(false);
    }
  };

  // Follow-up status helper
  const getFollowUpStatus = (dateStr: string | null) => {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    const now = new Date();

    const isToday =
      target.getDate() === now.getDate() &&
      target.getMonth() === now.getMonth() &&
      target.getFullYear() === now.getFullYear();

    const isOverdue = target.getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    if (isOverdue) return { label: "Overdue", color: "bg-rose-100 text-rose-800 border-rose-200" };
    if (isToday) return { label: "Due Today", color: "bg-amber-100 text-amber-800 border-amber-200" };
    return { label: `Due ${target.toLocaleDateString("en-IN")}`, color: "bg-emerald-50 text-emerald-800 border-emerald-200" };
  };

  const statusList = ["NEW", "CONTACTED", "QUOTED", "CONVERTED", "LOST"] as const;

  const statusColors: Record<string, string> = {
    NEW: "bg-blue-50 text-blue-700 border-blue-200",
    CONTACTED: "bg-slate-100 text-slate-700 border-slate-200",
    QUOTED: "bg-blue-50 text-blue-800 border-blue-200",
    CONVERTED: "bg-emerald-50 text-emerald-800 border-emerald-200",
    LOST: "bg-rose-50 text-rose-800 border-rose-200",
  };

  const newLeadsCount = inquiries.filter((i) => i.status === "NEW").length;
  const inPipelineCount = inquiries.filter((i) => ["CONTACTED", "QUOTED"].includes(i.status)).length;
  const convertedCount = inquiries.filter((i) => i.status === "CONVERTED").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
            toast.type === "success"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-rose-900 text-rose-100 border-rose-700"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast.text}</span>
        </div>
      )}

      {/* 1. Standardized Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          {/* Breadcrumb Tag / Module Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold uppercase tracking-wider mb-1.5 border border-blue-100">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Lead Tracking & Pipeline</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Inquiries Management & Travel CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage incoming guest leads, schedule follow-ups, and convert inquiries to confirmed bookings.
          </p>
        </div>

        {/* Top-Right Action Button */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>+ Add Manual Inquiry</span>
          </button>
        </div>
      </div>

      {/* 2. TOP KPI SUMMARY STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
            Total Inquiries
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {inquiries.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Logged customer leads</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-blue-600 block">
            New Leads
          </span>
          <div className="text-2xl font-bold text-blue-700 mt-1 font-mono tabular-nums">
            {newLeadsCount}
          </div>
          <span className="text-[11px] text-blue-600/80 mt-0.5 block">Awaiting advisor response</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 block">
            Active Follow-ups
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {inPipelineCount}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">In contact or custom quote</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-700 block">
            Confirmed Bookings
          </span>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono tabular-nums">
            {convertedCount}
          </div>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">
            {inquiries.length > 0 ? ((convertedCount / inquiries.length) * 100).toFixed(1) : 0}% win rate
          </span>
        </div>
      </div>

      {/* 3. FILTER & SEARCH TOOLBAR */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </form>

          {/* View Mode Toggle & Status Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Follow-up schedule dropdown */}
            <select
              value={followUpFilter}
              onChange={(e) => setFollowUpFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="all">All Follow-ups</option>
              <option value="today">Follow-ups Due Today</option>
              <option value="overdue">Overdue Follow-ups</option>
              <option value="upcoming">Upcoming This Week</option>
            </select>

            {/* View Mode Toggles */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === "table"
                    ? "bg-white text-slate-900 shadow-sm font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === "kanban"
                    ? "bg-white text-slate-900 shadow-sm font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Kanban Pipeline"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Kanban</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
            Status:
          </span>
          {["ALL", ...statusList].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-sm font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: TABLE VIEW */}
      {viewMode === "table" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              Loading inquiries pipeline...
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm space-y-2">
              <p>No inquiries found matching the filters.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setFollowUpFilter("all");
                  fetchInquiries();
                }}
                className="text-xs font-bold text-slate-900 underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-50/95 backdrop-blur z-10 text-[11px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Guest Profile</th>
                    <th className="py-3 px-4">Package / Destination</th>
                    <th className="py-3 px-4">Pax & Travel Date</th>
                    <th className="py-3 px-4">Pipeline Status</th>
                    <th className="py-3 px-4">Follow-Up Schedule</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((inq) => {
                    const followUpInfo = getFollowUpStatus(inq.followUpDate);

                    return (
                      <tr
                        key={inq.id}
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => {
                          setSelectedInquiry(inq);
                          setEditFollowUpDate(
                            inq.followUpDate ? inq.followUpDate.slice(0, 16) : ""
                          );
                          setEditFollowUpNote(inq.followUpNote || "");
                        }}
                      >
                        {/* Guest Profile */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 group-hover:text-[#0F2E26] transition-colors">
                            {inq.customer.name}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 font-mono tabular-nums">
                            <span>{inq.customer.phone}</span>
                            <span>•</span>
                            <span className="font-sans">{inq.customer.email}</span>
                          </div>
                        </td>

                        {/* Package / Destination */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-[#0F2E26]">
                            {inq.package?.title || inq.destination}
                          </div>
                          {inq.customer.city && (
                            <div className="text-[11px] text-slate-400">
                              City: {inq.customer.city}
                            </div>
                          )}
                        </td>

                        {/* Pax & Travel Date */}
                        <td className="py-3 px-4 text-slate-600">
                          <div className="font-medium">{inq.paxCount} Guests (Pax)</div>
                          <div className="text-slate-400 font-mono tabular-nums text-[11px]">
                            {inq.travelDate
                              ? new Date(inq.travelDate).toLocaleDateString("en-IN")
                              : "Flexible"}
                          </div>
                        </td>

                        {/* Status Dropdown with StopPropagation */}
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={inq.status}
                            onChange={(e) => updateStatus(inq.id, e.target.value)}
                            className={`text-[11px] font-medium tracking-wide px-2.5 py-0.5 rounded-full border focus:outline-none cursor-pointer ${
                              statusColors[inq.status]
                            }`}
                          >
                            {statusList.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Follow-Up Schedule */}
                        <td className="py-3 px-4">
                          {followUpInfo ? (
                            <div>
                              <span
                                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${followUpInfo.color} font-mono tabular-nums`}
                              >
                                {followUpInfo.label}
                              </span>
                              {inq.followUpNote && (
                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 max-w-[180px]">
                                  {inq.followUpNote}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">Not Scheduled</span>
                          )}
                        </td>

                        {/* Quick Actions */}
                        <td
                          className="py-4 px-6 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp link */}
                            <a
                              href={`https://wa.me/${inq.customer.phone.replace(
                                /\D/g,
                                ""
                              )}?text=Hello%20${encodeURIComponent(
                                inq.customer.name
                              )},%20this%20is%20Trip%20Master%20Concierge%20regarding%20your%20inquiry%20for%20${encodeURIComponent(
                                inq.package?.title || inq.destination
                              )}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            {/* Convert to Booking */}
                            {inq.status !== "CONVERTED" && (
                              <button
                                type="button"
                                onClick={() => handleConvertToBooking(inq)}
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-blue-600 transition-colors"
                                title="Convert to Booking"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* View Details Drawer */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInquiry(inq);
                                setEditFollowUpDate(
                                  inq.followUpDate ? inq.followUpDate.slice(0, 16) : ""
                                );
                                setEditFollowUpNote(inq.followUpNote || "");
                              }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="Open Detail Drawer"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: KANBAN PIPELINE VIEW */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {statusList.map((st) => {
            const columnInquiries = inquiries.filter((i) => i.status === st);

            return (
              <div
                key={st}
                className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        st === "NEW"
                          ? "bg-rose-500"
                          : st === "CONTACTED"
                          ? "bg-amber-500"
                          : st === "QUOTED"
                          ? "bg-blue-500"
                          : st === "CONVERTED"
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      {st}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    {columnInquiries.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnInquiries.map((inq) => {
                    const followUpInfo = getFollowUpStatus(inq.followUpDate);

                    return (
                      <div
                        key={inq.id}
                        onClick={() => {
                          setSelectedInquiry(inq);
                          setEditFollowUpDate(
                            inq.followUpDate ? inq.followUpDate.slice(0, 16) : ""
                          );
                          setEditFollowUpNote(inq.followUpNote || "");
                        }}
                        className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer space-y-2.5 group"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-slate-900 line-clamp-1">
                            {inq.customer.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {inq.paxCount} Pax
                          </span>
                        </div>

                        <p className="text-[11px] font-semibold text-slate-900 line-clamp-1">
                          {inq.package?.title || inq.destination}
                        </p>

                        {/* Follow-up info badge */}
                        {followUpInfo && (
                          <div className="pt-1">
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${followUpInfo.color}`}
                            >
                              {followUpInfo.label}
                            </span>
                          </div>
                        )}

                        {/* Footer & Move actions */}
                        <div
                          className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-slate-400">
                            {new Date(inq.createdAt).toLocaleDateString("en-IN")}
                          </span>

                          <select
                            value={inq.status}
                            onChange={(e) => updateStatus(inq.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-700"
                          >
                            {statusList.map((s) => (
                              <option key={s} value={s}>
                                Move: {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SLIDE-OVER INQUIRY DETAIL & FOLLOW-UP DRAWER */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-emerald-900">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-sky-300">
                  Inquiry #{selectedInquiry.id.slice(-6)}
                </span>
                <h2 className="font-heading text-2xl font-bold">
                  {selectedInquiry.customer.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-lg text-emerald-300 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Quick Action Ribbon */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`https://wa.me/${selectedInquiry.customer.phone.replace(
                    /\D/g,
                    ""
                  )}?text=Hello%20${encodeURIComponent(
                    selectedInquiry.customer.name
                  )},%20this%20is%20Trip%20Master%20Concierge%20following%20up%20on%20your%20inquiry%20for%20${encodeURIComponent(
                    selectedInquiry.package?.title || selectedInquiry.destination
                  )}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-slate-900 py-2.5 px-3 rounded-xl text-xs font-bold shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 fill-slate-900" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`tel:${selectedInquiry.customer.phone}`}
                  className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 px-3 rounded-xl text-xs font-bold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Guest</span>
                </a>

                <Link
                  href={`/admin/customers/${selectedInquiry.customerId}`}
                  className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-sky-300 py-2.5 px-3 rounded-xl text-xs font-bold"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>360° Profile</span>
                </Link>
              </div>

              {/* Lead Details Card */}
              <div className="p-5 rounded-2xl bg-slate-50/50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Lead Summary
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      statusColors[selectedInquiry.status]
                    }`}
                  >
                    {selectedInquiry.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Phone / WhatsApp</span>
                    <span className="font-bold text-slate-800">
                      {selectedInquiry.customer.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Email Address</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {selectedInquiry.customer.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Destination</span>
                    <span className="font-bold text-slate-900">
                      {selectedInquiry.package?.title || selectedInquiry.destination}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Pax & Travel Date</span>
                    <span className="font-bold text-slate-800">
                      {selectedInquiry.paxCount} Pax •{" "}
                      {selectedInquiry.travelDate
                        ? new Date(selectedInquiry.travelDate).toLocaleDateString("en-IN")
                        : "Flexible"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Follow-up Scheduler Section */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Next Follow-Up Schedule
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveFollowUp}
                    disabled={updatingFollowUp}
                    className="text-xs font-bold uppercase text-slate-900 hover:underline"
                  >
                    {updatingFollowUp ? "Saving..." : "Save Schedule"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={editFollowUpDate}
                      onChange={(e) => setEditFollowUpDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Reminder Note
                    </label>
                    <input
                      type="text"
                      value={editFollowUpNote}
                      onChange={(e) => setEditFollowUpNote(e.target.value)}
                      placeholder="e.g. Call back to confirm suite..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Internal Notes & Activity Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Activity Timeline & Notes ({selectedInquiry.internalNotes.length})
                </h3>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Log call discussion, client requirement..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="submit"
                    disabled={submittingNote}
                    className="bg-blue-600 text-white hover:bg-[#0c4031] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Log</span>
                  </button>
                </form>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {selectedInquiry.internalNotes.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No notes logged yet.</p>
                  ) : (
                    selectedInquiry.internalNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50/50 border border-slate-200 text-xs text-slate-700 leading-relaxed"
                      >
                        {note}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Conversion CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleConvertToBooking(selectedInquiry)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#dfbd75] to-[#c5a059] text-slate-900 font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Convert This Inquiry To Booking</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD MANUAL INQUIRY */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-heading text-2xl font-bold text-slate-900">
                  Log Walk-In / Phone Lead
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct lead capture linking to customer profile.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualForm.name}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, name: e.target.value })
                    }
                    placeholder="e.g. Vikramaditya Singhania"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={manualForm.phone}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        phone: e.target.value,
                        whatsappNumber: e.target.value,
                      })
                    }
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={manualForm.email}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, email: e.target.value })
                    }
                    placeholder="guest@luxury.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Target Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualForm.destination}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, destination: e.target.value })
                    }
                    placeholder="e.g. Kashmir Luxury Escape"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Guests (Pax)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={manualForm.paxCount}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, paxCount: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={manualForm.travelDate}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, travelDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={manualForm.status}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, status: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 bg-white cursor-pointer"
                  >
                    {statusList.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Schedule Follow-Up Date
                  </label>
                  <input
                    type="datetime-local"
                    value={manualForm.followUpDate}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        followUpDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Follow-Up Task Note
                  </label>
                  <input
                    type="text"
                    value={manualForm.followUpNote}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        followUpNote: e.target.value,
                      })
                    }
                    placeholder="e.g. Call regarding houseboat..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Special Inclusions / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={manualForm.notes}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, notes: e.target.value })
                    }
                    placeholder="Guest requirements, suite preferences..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingManual}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {submittingManual ? "Logging Lead..." : "Log Manual Inquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

