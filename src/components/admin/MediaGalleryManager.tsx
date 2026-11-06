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

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
            TripMaster Media Vault
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-0.5">
            Centralized library of reusable travel photography, stay rooms, attractions, and banners
          </p>
        </div>

        <button
          onClick={() => setPickerOpen(true)}
          className="px-4 py-2.5 text-xs font-heading font-bold uppercase tracking-wider bg-[#0D2C24] hover:bg-[#133E33] text-white rounded-xl transition-colors shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>+ Upload New Asset</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4E2DD] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchMedia()}
            placeholder="Search by title or landmark..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#E4E2DD] rounded-xl text-zinc-900 focus:outline-hidden focus:border-[#0D2C24]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="text-xs border border-[#E4E2DD] rounded-xl px-3 py-2 bg-white text-zinc-900 focus:outline-hidden focus:border-[#0D2C24]"
          >
            <option value="ALL">All Destinations</option>
            <option value="Singapore">Singapore</option>
            <option value="Bali">Bali</option>
            <option value="Dubai">Dubai</option>
            <option value="Thailand">Thailand</option>
            <option value="Europe">Europe</option>
            <option value="Kashmir">Kashmir</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border border-[#E4E2DD] rounded-xl px-3 py-2 bg-white text-zinc-900 focus:outline-hidden focus:border-[#0D2C24]"
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
          <p className="text-xs text-zinc-400 mt-1">
            Upload high-res photos to make them available across all quotation plans.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E4E2DD] shadow-xs overflow-hidden group hover:shadow-elevation transition-all flex flex-col"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-zinc-100">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 text-[9px] uppercase font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-heading font-bold text-xs text-zinc-900 truncate">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">
                    {item.destination || "General"} • {item.fileSize || "Web Asset"}
                  </span>
                </div>

                <div className="pt-2 mt-2 border-t border-[#E4E2DD] flex items-center justify-between">
                  <button
                    onClick={() => handleCopyUrl(item.url, item.id)}
                    className="text-[10px] font-medium text-zinc-600 hover:text-[#0D2C24] flex items-center gap-1"
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

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-black p-1"
                    title="Open Full Image"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
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
