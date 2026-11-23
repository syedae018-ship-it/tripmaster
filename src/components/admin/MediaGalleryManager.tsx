"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  Image as ImageIcon,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Plus,
  Loader2,
  FolderOpen,
  X,
  Eye,
  Sparkles,
} from "lucide-react";
import { ImagePickerModal } from "@/components/admin/ImagePickerModal";

export function MediaGalleryManager() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMedia();
  }, [selectedDestination, selectedCategory]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedDestination !== "ALL") params.set("destination", selectedDestination);
      if (selectedCategory !== "ALL") params.set("category", selectedCategory);
      if (searchQuery) params.set("q", searchQuery);

      const res = await fetch(`/api/admin/media?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setMediaItems(data.media || []);
      }
    } catch (e) {
      console.error("Failed to load media:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDeleteMedia = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this media asset?")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/media?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMediaItems((prev) => prev.filter((item) => item.id !== id));
        if (previewItem?.id === id) setPreviewItem(null);
      } else {
        alert(data.error || "Failed to delete asset");
      }
    } catch (err) {
      alert("Network error deleting asset");
    } finally {
      setDeletingId(null);
    }
  };

  // Metric aggregates
  const totalAssets = mediaItems.length;
  const placesCount = mediaItems.filter((m) => m.category === "PLACE").length;
  const hotelsCount = mediaItems.filter((m) => m.category === "HOTEL").length;
  const bannersCount = mediaItems.filter((m) => m.category === "BANNER" || m.category === "MOMENT").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* 1. Standardized Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          {/* Breadcrumb Tag / Module Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold uppercase tracking-wider mb-1.5 border border-blue-100">
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Digital Assets Engine</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            TripMaster Media Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Centralized library of reusable luxury travel photography, boutique stays, attractions, and hero banners.
          </p>
        </div>

        <button
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Upload className="w-4 h-4 text-white" />
          <span>+ Upload New Asset</span>
        </button>
      </div>

      {/* 2. Vault KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Vault Assets
          </span>
          <div className="text-2xl font-heading font-bold text-slate-900 tabular-nums">
            {totalAssets}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            High-res media files
          </span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Attractions & Places
          </span>
          <div className="text-2xl font-heading font-bold text-blue-700 tabular-nums">
            {placesCount}
          </div>
          <span className="text-[11px] text-blue-600/80 mt-0.5 block">
            Sightseeing & landmarks
          </span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
            Hotels & Resorts
          </span>
          <div className="text-2xl font-heading font-bold text-blue-700 tabular-nums">
            {hotelsCount}
          </div>
          <span className="text-[11px] text-blue-600/80 mt-0.5 block">
            Stay suites & villas
          </span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Banners & Moments
          </span>
          <div className="text-2xl font-heading font-bold text-slate-900 tabular-nums">
            {bannersCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Hero covers & highlights
          </span>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchMedia()}
            placeholder="Search by title or landmark..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-hidden focus:border-blue-600"
          >
            <option value="ALL">All Destinations</option>
            <option value="Singapore">Singapore</option>
            <option value="Bali">Bali</option>
            <option value="Dubai">Dubai</option>
            <option value="Thailand">Thailand</option>
            <option value="Europe">Europe</option>
            <option value="Kashmir">Kashmir</option>
            <option value="Maldives">Maldives</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-hidden focus:border-blue-600"
          >
            <option value="ALL">All Categories</option>
            <option value="PLACE">Places & Attractions</option>
            <option value="HOTEL">Hotels & Stays</option>
            <option value="TRANSFER">Transfers & Airports</option>
            <option value="MOMENT">Moments That Matter</option>
            <option value="BANNER">Hero Banners</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-zinc-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#0D2C24]" />
          <span className="text-xs">Loading media vault...</span>
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="py-24 text-center text-zinc-400 bg-white rounded-2xl border border-[#E4E2DD]">
          <FolderOpen className="w-12 h-12 mx-auto text-zinc-300 mb-2" />
          <p className="text-sm font-medium">No assets found</p>
          <p className="text-xs text-zinc-400 mt-1 mb-4">
            Upload high-res photos to make them available across all quotation plans and packages.
          </p>
          <button
            onClick={() => setPickerOpen(true)}
            className="px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider bg-[#0D2C24] text-white rounded-xl"
          >
            Upload First Asset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setPreviewItem(item)}
              className="bg-white rounded-2xl border border-[#E4E2DD] shadow-xs overflow-hidden group hover:shadow-md hover:border-slate-300 transition-all flex flex-col cursor-pointer"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-zinc-100">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Graceful fallback for broken image URLs
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <span className="absolute top-2 left-2 text-[9px] uppercase font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                  {item.category}
                </span>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="p-1.5 rounded-lg bg-white/90 text-slate-900 shadow-xs">
                    <Eye className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-heading font-bold text-xs text-zinc-900 truncate" title={item.title}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">
                    {item.destination || "General"} • {item.fileSize || "Web Asset"}
                  </span>
                </div>

                <div className="pt-2 mt-2 border-t border-[#E4E2DD] flex items-center justify-between">
                  <button
                    onClick={(e) => handleCopyUrl(item.url, item.id, e)}
                    className="text-[10px] font-medium text-zinc-600 hover:text-[#0D2C24] flex items-center gap-1"
                    title="Copy Image URL"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-zinc-400 hover:text-black p-1 rounded-md hover:bg-zinc-100 transition-colors"
                      title="Open Original"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={(e) => handleDeleteMedia(item.id, e)}
                      disabled={deletingId === item.id}
                      className="text-zinc-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Asset Detail Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900 truncate">
                  {previewItem.title}
                </h3>
                <span className="text-[11px] text-slate-500">
                  {previewItem.destination || "General Destination"} • Category: {previewItem.category}
                </span>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={previewItem.url}
                alt={previewItem.title}
                className="max-h-[60vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
              <div className="text-xs text-slate-500 font-mono break-all max-w-md truncate">
                {previewItem.url}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyUrl(previewItem.url, previewItem.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copiedId === previewItem.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <a
                  href={previewItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Full View</span>
                </a>

                <button
                  onClick={() => handleDeleteMedia(previewItem.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Upload Modal */}
      <ImagePickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectImage={() => fetchMedia()}
      />
    </div>
  );
}


