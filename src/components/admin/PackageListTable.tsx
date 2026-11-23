"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  Filter,
  Copy,
  Edit3,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle2,
  Clock,
  Eye,
  Sparkles,
  MapPin,
} from "lucide-react";

interface AdminPackageItem {
  id: string;
  title: string;
  slug: string;
  destination: string;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  discountedPrice: number | null;
  featuredImage: string;
  isFeatured: boolean;
  isPublished: boolean;
  viewsCount: number;
  itinerary: Array<{
    id: string;
    dayNumber: number;
    title: string;
    accommodationName: string | null;
    accommodationRating: number | null;
    accommodationPhoto: string | null;
  }>;
  _count?: {
    bookings: number;
    inquiries: number;
  };
}

export function PackageListTable() {
  const [packages, setPackages] = useState<AdminPackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [actionMessage, setActionMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/admin/packages");
      const data = await res.json();
      if (data.success) {
        setPackages(data.packages);
      }
    } catch (err) {
      console.error("Failed to load packages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // 1-Click Toggle for Published or Featured
  const handleToggle = async (id: string, field: "isPublished" | "isFeatured") => {
    try {
      const res = await fetch(`/api/admin/packages/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setPackages((prev) =>
          prev.map((pkg) =>
            pkg.id === id ? { ...pkg, [field]: !pkg[field] } : pkg
          )
        );
      } else {
        showToast(data.error || "Failed to update", "error");
      }
    } catch (err) {
      showToast("Network error updating status", "error");
    }
  };

  // 1-Click Duplicate Package
  const handleDuplicate = async (id: string) => {
    if (!confirm("Duplicate this package and all its day-wise itineraries?")) return;

    try {
      const res = await fetch(`/api/admin/packages/${id}/duplicate`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Package duplicated successfully as Draft");
        fetchPackages();
      } else {
        showToast(data.error || "Failed to duplicate", "error");
      }
    } catch (err) {
      showToast("Network error duplicating package", "error");
    }
  };

  // Delete Package
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Package deleted successfully");
        setPackages((prev) => prev.filter((p) => p.id !== id));
      } else {
        showToast(data.error || "Failed to delete", "error");
      }
    } catch (err) {
      showToast("Network error deleting package", "error");
    }
  };

  // Filtering
  const filtered = packages.filter((pkg) => {
    if (statusFilter === "published" && !pkg.isPublished) return false;
    if (statusFilter === "draft" && pkg.isPublished) return false;
    if (destinationFilter !== "all" && !pkg.destination.includes(destinationFilter)) {
      return false;
    }
    if (
      search &&
      !pkg.title.toLowerCase().includes(search.toLowerCase()) &&
      !pkg.destination.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {actionMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
            actionMessage.type === "success"
              ? "bg-blue-600 text-white border-slate-700"
              : "bg-rose-900 text-rose-100 border-rose-700"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">
            Packages & Reusable Asset Library
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage luxury itineraries, stay highlights, activity photography, and pricing.
          </p>
        </div>

        <Link
          href="/admin/packages/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Build New Package</span>
        </Link>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or destination..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>

          {/* Destination Filter */}
          <select
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            <option value="all">All Destinations</option>
            <option value="Kashmir">Kashmir</option>
            <option value="Kerala">Kerala</option>
            <option value="Andaman">Andaman</option>
            <option value="Rajasthan">Rajasthan</option>
          </select>
        </div>
      </div>

      {/* Packages Listing Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Loading luxury package catalog...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm space-y-3">
            <p>No packages match your search or filter criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setDestinationFilter("all");
              }}
              className="text-xs font-bold uppercase text-slate-900 underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-50/95 backdrop-blur z-10 text-[11px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Package Overview</th>
                  <th className="py-3 px-4">Destination & Duration</th>
                  <th className="py-3 px-4 text-right">Starting Price</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Homepage Featured</th>
                  <th className="py-3 px-4 text-center">Days / Stays</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((pkg) => {
                  const currentPrice = pkg.discountedPrice || pkg.basePrice;

                  return (
                    <tr
                      key={pkg.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Photo & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={pkg.featuredImage}
                            alt={pkg.title}
                            className="w-12 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                          />
                          <div className="max-w-xs">
                            <Link
                              href={`/admin/packages/${pkg.id}/edit`}
                              className="font-semibold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-1 text-xs"
                            >
                              {pkg.title}
                            </Link>
                            <span className="text-[10px] font-mono text-slate-400 block">
                              /packages/{pkg.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Destination & Duration */}
                      <td className="py-3 px-4 text-xs text-slate-600">
                        <div className="font-medium text-slate-900 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{pkg.destination}</span>
                        </div>
                        <div className="text-slate-500 mt-0.5 flex items-center gap-1 font-mono tabular-nums text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {pkg.durationDays}D / {pkg.durationNights}N
                          </span>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-semibold text-slate-900 font-mono tabular-nums">
                          ₹{currentPrice.toLocaleString("en-IN")}
                        </div>
                        {pkg.discountedPrice && (
                          <div className="text-[10px] line-through text-slate-400 font-mono tabular-nums">
                            ₹{pkg.basePrice.toLocaleString("en-IN")}
                          </div>
                        )}
                      </td>

                      {/* 1-Click Publish Status Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(pkg.id, "isPublished")}
                          className={`text-[11px] font-medium tracking-wide px-2.5 py-0.5 rounded-full border transition-all inline-flex items-center gap-1.5 ${
                            pkg.isPublished
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              pkg.isPublished ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          {pkg.isPublished ? "Published" : "Draft"}
                        </button>
                      </td>

                      {/* 1-Click Featured Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(pkg.id, "isFeatured")}
                          className={`p-1.5 rounded-lg transition-colors ${
                            pkg.isFeatured
                              ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                              : "text-slate-300 hover:text-slate-400 bg-slate-50"
                          }`}
                          title="Toggle Featured on Homepage"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              pkg.isFeatured ? "fill-amber-500" : ""
                            }`}
                          />
                        </button>
                      </td>

                      {/* Itinerary Count */}
                      <td className="py-3 px-4 text-center text-xs font-semibold text-slate-600">
                        <span className="bg-slate-100 text-slate-700 font-mono tabular-nums px-2 py-0.5 rounded text-[11px]">
                          {pkg.itinerary.length} Days Mapped
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Live preview */}
                          <Link
                            href={`/packages/${pkg.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Edit Studio */}
                          <Link
                            href={`/admin/packages/${pkg.id}/edit`}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            title="Edit Package & Itinerary"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          {/* Duplicate */}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(pkg.id)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-amber-50 transition-colors"
                            title="Duplicate Package"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(pkg.id, pkg.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Package"
                          >
                            <Trash2 className="w-4 h-4" />
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
    </div>
  );
}

