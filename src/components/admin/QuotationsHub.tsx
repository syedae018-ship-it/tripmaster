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
} from "lucide-react";

export function QuotationsHub() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "ACCEPTED":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "CONVERTED":
        return "bg-purple-50 text-purple-800 border-purple-200";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
            Mobile Quotations & Plans
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-0.5">
            Generate 100% mobile-optimized vertical itinerary PDFs and WhatsApp shareable dossiers
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/quotations/new"
            className="px-4 py-2.5 text-xs font-heading font-bold uppercase tracking-wider bg-[#0D2C24] hover:bg-[#133E33] text-white rounded-xl transition-colors shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Build New Quotation</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4E2DD] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by quote #, client, or destination..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E4E2DD] rounded-xl text-zinc-900 focus:outline-hidden focus:border-[#0D2C24]"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-zinc-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-[#E4E2DD] rounded-xl px-3 py-2 bg-white text-zinc-900 focus:outline-hidden focus:border-[#0D2C24]"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent to Client</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="CONVERTED">Converted to Booking</option>
          </select>
        </div>
      </div>

      {/* Quotations List */}
      <div className="bg-white rounded-2xl border border-[#E4E2DD] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#0D2C24]" />
            <span className="text-xs">Loading quotations...</span>
          </div>
        ) : quotations.length === 0 ? (
          <div className="py-20 text-center text-zinc-400">
            <FileText className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
            <p className="text-sm font-medium">No quotations created yet</p>
            <p className="text-xs text-zinc-400 mt-1 mb-4">
              Click below to build your first Singapore or customized mobile plan.
            </p>
            <Link
              href="/admin/quotations/new"
              className="px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider bg-[#0D2C24] text-white rounded-xl"
            >
              Build First Quotation
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-[#E4E2DD]">
              <thead className="bg-[#FAF9F6] text-zinc-500 font-heading font-bold text-[10px] uppercase tracking-wider">
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
              <tbody className="divide-y divide-[#E4E2DD]">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-zinc-900 block">
                        {q.quotationNumber}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {q.durationNights}N / {q.durationDays}D
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-zinc-900 block">
                        {q.customer?.name || "Guest Traveller"}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">
                        {q.customer?.phone || "No phone"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-heading font-bold text-zinc-900 block truncate max-w-xs">
                        {q.title}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {q.destination}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-heading font-bold text-[#0D2C24]">
                      INR {q.pricePerPerson.toLocaleString("en-IN")}
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
                      {new Date(q.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
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

                      {/* Edit Studio */}
                      <Link
                        href={`/admin/quotations/${q.id}`}
                        className="p-1.5 inline-block text-zinc-600 hover:text-[#0D2C24] rounded-lg hover:bg-zinc-100 transition-colors"
                        title="Edit Plan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>

                      {/* WhatsApp share */}
                      <a
                        href={`https://wa.me/${q.customer?.phone?.replace(/[^0-9]/g, "") || ""}?text=${encodeURIComponent(
                          `Hi ${q.customer?.name || ""}! Here is your custom itinerary & quotation: ${window.location.origin}/quote/${q.shareSlug}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 inline-block text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
                        title="Send via WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>

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
    </div>
  );
}
