"use client";

import { useState, useEffect } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Search,
  Filter,
  Check,
  Loader2,
  FolderOpen,
} from "lucide-react";

interface MediaItem {
  id: string;
  title: string;
  url: string;
  destination: string | null;
  category: string;
  fileSize: string | null;
}

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string, title?: string) => void;
  destinationHint?: string;
  categoryHint?: string;
  title?: string;
}

export function ImagePickerModal({
  isOpen,
  onClose,
  onSelectImage,
  destinationHint,
  categoryHint,
  title = "Select Image from TripMaster Vault",
}: ImagePickerModalProps) {
  const [activeTab, setActiveTab] = useState<"gallery" | "upload">("gallery");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<string>(
    destinationHint || "ALL"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryHint || "ALL"
  );
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDestination, setUploadDestination] = useState(destinationHint || "Singapore");
  const [uploadCategory, setUploadCategory] = useState(categoryHint || "PLACE");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, selectedDestination, selectedCategory]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedDestination && selectedDestination !== "ALL") {
        params.set("destination", selectedDestination);
      }
      if (selectedCategory && selectedCategory !== "ALL") {
        params.set("category", selectedCategory);
      }
      if (searchQuery) {
        params.set("q", searchQuery);
      }

      const res = await fetch(`/api/admin/media?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setMediaItems(data.media || []);
      }
    } catch (err) {
      console.error("Failed to load media:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedia();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (!uploadTitle) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setUploadTitle(cleanName);
      }
    }
  };

  const handleUploadAndSelect = async () => {
    if (!uploadFile) return;

    try {
      setUploading(true);

      // 1. Upload file via /api/admin/upload (to Supabase Storage)
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("bucket", "packages");
      formData.append("folder", uploadDestination.toLowerCase().replace(/[^a-z0-9]/g, "_"));

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success || !uploadData.url) {
        throw new Error(uploadData.error || "File upload failed");
      }

      const uploadedUrl = uploadData.url;

      // 2. Register into Media Vault database
      const mediaRes = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: uploadTitle || uploadFile.name,
          url: uploadedUrl,
          destination: uploadDestination,
          category: uploadCategory,
          fileSize: `${Math.round(uploadFile.size / 1024)} KB`,
          mimeType: uploadFile.type,
        }),
      });

      const mediaData = await mediaRes.json();

      // 3. Select image and close modal
      onSelectImage(uploadedUrl, uploadTitle);
      onClose();
    } catch (err: any) {
      alert(`Upload error: ${err.message || "Failed to upload image"}`);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-elevation border border-[#E4E2DD] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E2DD]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0D2C24]/10 text-[#0D2C24] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#111111]">
                {title}
              </h3>
              <p className="text-xs text-[#52525B]">
                Pick high-res travel photography from the vault or upload from your device
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E4E2DD] px-6 bg-[#FAF9F6]">
          <button
            onClick={() => setActiveTab("gallery")}
            className={`py-3 px-4 text-xs font-heading font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "gallery"
                ? "border-[#0D2C24] text-[#0D2C24]"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            TripMaster Media Vault
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`py-3 px-4 text-xs font-heading font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "upload"
                ? "border-[#0D2C24] text-[#0D2C24]"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload from Local Device
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "gallery" ? (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex-1 relative"
                >
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search photos by title, landmark, or place..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#E4E2DD] rounded-xl focus:outline-hidden focus:border-[#0D2C24] bg-white text-zinc-900"
                  />
                </form>

                <div className="flex items-center gap-2">
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

              {/* Photo Grid */}
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0D2C24]" />
                  <span className="text-xs">Loading media vault assets...</span>
                </div>
              ) : mediaItems.length === 0 ? (
                <div className="py-20 text-center text-zinc-400">
                  <ImageIcon className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
                  <p className="text-sm font-medium">No photos found</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Try switching filters or upload a photo directly from your device.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {mediaItems.map((item) => {
                    const isSelected = selectedUrl === item.url;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedUrl(item.url)}
                        className={`group relative aspect-4/3 rounded-xl overflow-hidden border cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#0D2C24] ring-3 ring-[#0D2C24]/20 shadow-md"
                            : "border-[#E4E2DD] hover:border-zinc-400 shadow-xs"
                        }`}
                      >
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                          <span className="text-[11px] font-medium leading-tight truncate">
                            {item.title}
                          </span>
                          <div className="flex items-center justify-between text-[9px] text-zinc-300 mt-0.5">
                            <span>{item.destination || "General"}</span>
                            <span className="uppercase text-amber-300">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#0D2C24] text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-xl mx-auto space-y-5">
              {/* Dropzone */}
              <div className="border-2 border-dashed border-[#E4E2DD] hover:border-[#0D2C24] rounded-2xl p-8 text-center transition-colors bg-[#FAF9F6]">
                {previewUrl ? (
                  <div className="space-y-3">
                    <img
                      src={previewUrl}
                      alt="Upload preview"
                      className="max-h-48 mx-auto rounded-xl object-cover shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUploadFile(null);
                        setPreviewUrl(null);
                      }}
                      className="text-xs text-rose-600 hover:underline font-medium"
                    >
                      Remove and choose another
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 mx-auto text-[#0D2C24] mb-3" />
                    <label className="cursor-pointer inline-block">
                      <span className="font-heading font-bold text-xs uppercase tracking-wider bg-[#0D2C24] text-white px-4 py-2.5 rounded-xl hover:bg-[#133E33] transition-colors shadow-xs">
                        Browse Local Files
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-[#52525B] mt-3">
                      PNG, JPG, WEBP up to 10MB. High-res horizontal photos recommended.
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Meta Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Photo Title / Landmark Name *
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Marina Bay Sands Infinity Pool"
                    className="w-full text-xs px-3.5 py-2.5 border border-[#E4E2DD] rounded-xl focus:outline-hidden focus:border-[#0D2C24] bg-white text-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-heading font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Destination
                    </label>
                    <input
                      type="text"
                      value={uploadDestination}
                      onChange={(e) => setUploadDestination(e.target.value)}
                      placeholder="e.g. Singapore"
                      className="w-full text-xs px-3.5 py-2.5 border border-[#E4E2DD] rounded-xl focus:outline-hidden focus:border-[#0D2C24] bg-white text-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-heading font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border border-[#E4E2DD] rounded-xl focus:outline-hidden focus:border-[#0D2C24] bg-white text-zinc-900"
                    >
                      <option value="PLACE">Place / Attraction</option>
                      <option value="HOTEL">Hotel / Stay</option>
                      <option value="TRANSFER">Transfer / Airport</option>
                      <option value="MOMENT">Moments That Matter</option>
                      <option value="BANNER">Hero Banner</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E4E2DD] bg-[#FAF9F6]">
          <span className="text-xs text-zinc-500">
            {activeTab === "gallery"
              ? selectedUrl
                ? "1 photo selected from vault"
                : "Select a photo to proceed"
              : uploadFile
              ? `Selected file: ${uploadFile.name}`
              : "Choose a file to upload"}
          </span>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-200 rounded-xl transition-colors"
            >
              Cancel
            </button>

            {activeTab === "gallery" ? (
              <button
                disabled={!selectedUrl}
                onClick={() => {
                  if (selectedUrl) {
                    onSelectImage(selectedUrl);
                    onClose();
                  }
                }}
                className="px-5 py-2 text-xs font-heading font-bold uppercase tracking-wider bg-[#0D2C24] hover:bg-[#133E33] text-white rounded-xl disabled:opacity-50 transition-colors shadow-xs"
              >
                Insert Selected Photo
              </button>
            ) : (
              <button
                disabled={!uploadFile || uploading}
                onClick={handleUploadAndSelect}
                className="px-5 py-2 text-xs font-heading font-bold uppercase tracking-wider bg-[#0D2C24] hover:bg-[#133E33] text-white rounded-xl disabled:opacity-50 transition-colors shadow-xs flex items-center gap-2"
              >
                {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Upload & Insert Photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

