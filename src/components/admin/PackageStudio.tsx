"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Calendar,
  Building,
  MapPin,
  CheckCircle2,
  Image as ImageIcon,
  DollarSign,
  FileText,
  Star,
  Sparkles,
  Utensils,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface PackageFormData {
  id?: string;
  title: string;
  slug: string;
  destination: string;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  discountedPrice: number | null;
  featuredImage: string;
  galleryImages: string[];
  overview: string;
  mapCoordinates: Array<{
    name: string;
    lat: number;
    lng: number;
    dayNumber?: number;
  }>;
  inclusions: string[];
  exclusions: string[];
  paymentPolicy: string;
  cancellationPolicy: string;
  isFeatured: boolean;
  isPublished: boolean;
  itinerary: Array<{
    dayNumber: number;
    title: string;
    description: string;
    mealsIncluded: string[];
    activityPhotos: string[];
    accommodationName: string;
    accommodationPhoto: string;
    accommodationRating: number;
    accommodationCategory: string;
    accommodationDetails: string;
  }>;
}

const DEFAULT_INCLUSIONS = [
  "5-Star luxury hotel / palace accommodation throughout the journey",
  "Daily gourmet breakfast & 4-course royal dinners",
  "Private chauffeur-driven luxury SUV for all transfers and sightseeing",
  "All monument entries, VIP boat/gondola tickets, and local permit fees",
  "24/7 dedicated personal trip concierge accessible via WhatsApp",
];

const DEFAULT_EXCLUSIONS = [
  "Domestic or international airfares to/from destination airport",
  "Personal expenses, laundry, phone calls, and alcoholic beverages",
  "Optional adventure sports or helicopter transfers not listed in itinerary",
  "Travel and medical insurance (available upon request)",
];

const DEFAULT_PAYMENT_POLICY =
  "30% advance deposit required upon itinerary booking confirmation. Balance 70% payable 15 days prior to arrival date. Major credit/debit cards, Net Banking, and UPI accepted.";

const DEFAULT_CANCELLATION_POLICY =
  "100% full refund for cancellations up to 21 days before departure. 50% refund between 20 to 10 days before travel. Non-refundable within 9 days of travel.";

export function PackageStudio({
  initialData,
  isEdit = false,
}: {
  initialData?: PackageFormData;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"basic" | "itinerary" | "map" | "policies">("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<PackageFormData>(
    initialData || {
      title: "",
      slug: "",
      destination: "Kashmir, India",
      durationDays: 6,
      durationNights: 5,
      basePrice: 120000,
      discountedPrice: 95000,
      featuredImage:
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1600&q=85",
      galleryImages: [
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=85",
      ],
      overview:
        "An artisanal luxury journey showcasing breathtaking landscapes, exclusive heritage retreats, and private dining experiences.",
      mapCoordinates: [
        { name: "Arrival Airport", lat: 34.0837, lng: 74.7973, dayNumber: 1 },
      ],
      inclusions: DEFAULT_INCLUSIONS,
      exclusions: DEFAULT_EXCLUSIONS,
      paymentPolicy: DEFAULT_PAYMENT_POLICY,
      cancellationPolicy: DEFAULT_CANCELLATION_POLICY,
      isFeatured: false,
      isPublished: true,
      itinerary: [
        {
          dayNumber: 1,
          title: "VIP Arrival & Sunset Welcome Experience",
          description:
            "Private chauffeur welcome at the airport followed by luxury suite check-in and evening cocktail reception.",
          mealsIncluded: ["Dinner"],
          activityPhotos: [
            "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
          ],
          accommodationName: "The Grand Heritage Sanctuary",
          accommodationPhoto:
            "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80",
          accommodationRating: 5.0,
          accommodationCategory: "Heritage Palace",
          accommodationDetails:
            "Luxury suite with private garden views, heated plunge pool, and 24-hour butler service.",
        },
      ],
    }
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Auto-generate slug when title changes
  const handleTitleChange = (val: string) => {
    const updated = { ...formData, title: val };
    if (!isEdit && (!formData.slug || formData.slug === formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"))) {
      updated.slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    setFormData(updated);
  };

  // Day handlers
  const addDay = () => {
    const nextDayNum = formData.itinerary.length + 1;
    setFormData({
      ...formData,
      itinerary: [
        ...formData.itinerary,
        {
          dayNumber: nextDayNum,
          title: `Day ${nextDayNum} Discovery & Sightseeing`,
          description:
            "Explore signature cultural sights, artisan workshops, and savor curated gourmet culinary delicacies.",
          mealsIncluded: ["Breakfast", "Dinner"],
          activityPhotos: [],
          accommodationName: "Signature 5-Star Boutique Resort",
          accommodationPhoto:
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
          accommodationRating: 5.0,
          accommodationCategory: "Luxury Resort",
          accommodationDetails:
            "Executive deluxe suite featuring panoramic vistas and spa privileges.",
        },
      ],
    });
  };

  const removeDay = (index: number) => {
    const updated = formData.itinerary
      .filter((_, idx) => idx !== index)
      .map((d, idx) => ({ ...d, dayNumber: idx + 1 }));
    setFormData({ ...formData, itinerary: updated });
  };

  const updateDay = (index: number, updates: Partial<(typeof formData.itinerary)[0]>) => {
    const updated = [...formData.itinerary];
    updated[index] = { ...updated[index], ...updates };
    setFormData({ ...formData, itinerary: updated });
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isEdit
        ? `/api/admin/packages/${initialData?.id}`
        : "/api/admin/packages";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save package");
      }

      showToast(isEdit ? "Package updated successfully!" : "Package created successfully!");
      setTimeout(() => {
        router.push("/admin/packages");
        router.refresh();
      }, 800);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to save package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-[#082F24] text-[#dfbd75] border border-[#dfbd75]/40 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/packages"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#082F24] hover:border-[#082F24] transition-all"
            title="Back to Packages"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#082F24]">
              {isEdit ? "Edit Luxury Package & Assets" : "Create New Luxury Escape"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Build no-code itineraries, reusable stay cards, and map waypoints.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-[#082F24] text-[#dfbd75] hover:bg-[#0c4031] hover:text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md self-start sm:self-center disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Saving Package..." : isEdit ? "Update Package" : "Publish Package"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Tab Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-1.5 flex flex-wrap gap-1 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("basic")}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === "basic"
              ? "bg-[#082F24] text-[#dfbd75] shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1. Basic & Pricing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("itinerary")}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === "itinerary"
              ? "bg-[#082F24] text-[#dfbd75] shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>2. Itinerary & Stays ({formData.itinerary.length} Days)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("map")}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === "map"
              ? "bg-[#082F24] text-[#dfbd75] shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>3. Route Pins ({formData.mapCoordinates.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("policies")}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === "policies"
              ? "bg-[#082F24] text-[#dfbd75] shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>4. Inclusions & Policies</span>
        </button>
      </div>

      {/* TAB 1: BASIC INFO & PRICING */}
      {activeTab === "basic" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-heading text-xl font-bold text-[#082F24]">
              Basic Package Information & Luxury Pricing
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Title, SEO slug, duration, prices in INR (₹), and hero cover image.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Package Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Kashmir Celestial Serenade: Gulmarg Gondola & Dal Houseboat"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                SEO-Friendly URL Slug *
              </label>
              <div className="flex items-center">
                <span className="bg-slate-100 px-3 py-3 border border-r-0 border-slate-200 rounded-l-xl text-xs text-slate-500 font-mono">
                  /packages/
                </span>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="kashmir-celestial-serenade"
                  className="w-full px-4 py-3 rounded-r-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Destination *
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                placeholder="e.g. Kashmir, India or Kerala Backwaters"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
              />
            </div>

            {/* Duration Days */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Duration (Days) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.durationDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationDays: parseInt(e.target.value, 10),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
              />
            </div>

            {/* Duration Nights */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Duration (Nights) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.durationNights}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationNights: parseInt(e.target.value, 10),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
              />
            </div>

            {/* Base Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Base Price (₹ INR Per Person) *
              </label>
              <input
                type="number"
                min="1000"
                required
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basePrice: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
              />
            </div>

            {/* Discounted Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Discounted Offer Price (₹ INR Per Person)
              </label>
              <input
                type="number"
                min="1000"
                value={formData.discountedPrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountedPrice: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                placeholder="Leave blank if no discount"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
              />
            </div>

            {/* Featured Image */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Featured Cover Image URL *
              </label>
              <input
                type="url"
                required
                value={formData.featuredImage}
                onChange={(e) =>
                  setFormData({ ...formData, featuredImage: e.target.value })
                }
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
              />
              {formData.featuredImage && (
                <div className="mt-3 relative h-40 w-full max-w-md rounded-2xl overflow-hidden border border-slate-200">
                  <img
                    src={formData.featuredImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Gallery Images List */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Gallery Photos (Add high-res URLs)
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      galleryImages: [
                        ...formData.galleryImages,
                        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                      ],
                    })
                  }
                  className="text-xs font-bold uppercase text-[#082F24] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Gallery Image</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.galleryImages.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => {
                        const copy = [...formData.galleryImages];
                        copy[idx] = e.target.value;
                        setFormData({ ...formData, galleryImages: copy });
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const copy = formData.galleryImages.filter((_, i) => i !== idx);
                        setFormData({ ...formData, galleryImages: copy });
                      }}
                      className="p-2 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Overview */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Package Overview & Narrative *
              </label>
              <textarea
                rows={4}
                required
                value={formData.overview}
                onChange={(e) =>
                  setFormData({ ...formData, overview: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 md:col-span-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#082F24]"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Publish to Public Website
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#082F24]"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Feature on Homepage
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DAY-WISE ITINERARY & STAY BUILDER (REUSABLE ASSET LIBRARY FOR PDFS) */}
      {activeTab === "itinerary" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div>
              <h2 className="font-heading text-xl font-bold text-[#082F24]">
                Day-by-Day Itinerary & Stay Asset Engine
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Each day has verified activity photos and a dedicated stay highlight card reused for 1-click quotations and PDF exports.
              </p>
            </div>

            <button
              type="button"
              onClick={addDay}
              className="inline-flex items-center gap-1.5 bg-[#082F24] text-[#dfbd75] hover:bg-[#0c4031] hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Day {formData.itinerary.length + 1}</span>
            </button>
          </div>

          {/* Days Accordion Cards */}
          <div className="space-y-6">
            {formData.itinerary.map((day, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6"
              >
                {/* Header row */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-[#082F24] text-[#dfbd75] font-heading font-bold text-base flex items-center justify-center shrink-0">
                      D{day.dayNumber}
                    </span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#c5a059] block">
                        Day {day.dayNumber} Sequence
                      </span>
                      <h3 className="font-heading text-lg font-bold text-slate-900">
                        {day.title || `Day ${day.dayNumber}`}
                      </h3>
                    </div>
                  </div>

                  {formData.itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDay(idx)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete Day</span>
                    </button>
                  )}
                </div>

                {/* Day Title & Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Day Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={day.title}
                      onChange={(e) => updateDay(idx, { title: e.target.value })}
                      placeholder="e.g. Ascent to Gulmarg: Meadow of Flowers & Phase II Gondola"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Activity Narrative / Daily Highlights *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={day.description}
                      onChange={(e) => updateDay(idx, { description: e.target.value })}
                      placeholder="Detail the experiences, monuments visited, and timings..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                    />
                  </div>
                </div>

                {/* Meals Checkboxes */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Meals Included (Check all that apply)
                  </label>
                  <div className="flex flex-wrap items-center gap-4">
                    {["Breakfast", "Lunch", "Dinner", "Welcome Drink", "High Tea"].map(
                      (meal) => {
                        const checked = day.mealsIncluded.includes(meal);
                        return (
                          <label
                            key={meal}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                              checked
                                ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const newMeals = e.target.checked
                                  ? [...day.mealsIncluded, meal]
                                  : day.mealsIncluded.filter((m) => m !== meal);
                                updateDay(idx, { mealsIncluded: newMeals });
                              }}
                              className="accent-[#082F24]"
                            />
                            <span>{meal}</span>
                          </label>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Activity Photos for this Day */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Day Activity Photos (Used in Quotations)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newPhotos = [
                          ...day.activityPhotos,
                          "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
                        ];
                        updateDay(idx, { activityPhotos: newPhotos });
                      }}
                      className="text-xs font-bold uppercase text-[#082F24] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Activity Photo URL</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {day.activityPhotos.map((photo, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2">
                        <input
                          type="url"
                          value={photo}
                          onChange={(e) => {
                            const copy = [...day.activityPhotos];
                            copy[pIdx] = e.target.value;
                            updateDay(idx, { activityPhotos: copy });
                          }}
                          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = day.activityPhotos.filter((_, i) => i !== pIdx);
                            updateDay(idx, { activityPhotos: copy });
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DEDICATED STAY CARD BUILDER FOR THIS DAY */}
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#c5a059]/40 space-y-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#c5a059]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#082F24]">
                      Dedicated Stay Card (Day {day.dayNumber})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Hotel Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Hotel / Resort Name
                      </label>
                      <input
                        type="text"
                        value={day.accommodationName}
                        onChange={(e) =>
                          updateDay(idx, { accommodationName: e.target.value })
                        }
                        placeholder="e.g. The Khyber Himalayan Resort & Spa"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#082F24] bg-white"
                      />
                    </div>

                    {/* Star Rating */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Star Rating
                      </label>
                      <select
                        value={day.accommodationRating}
                        onChange={(e) =>
                          updateDay(idx, {
                            accommodationRating: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#082F24] bg-white cursor-pointer"
                      >
                        <option value="5.0">5.0 ★ Luxury 5-Star</option>
                        <option value="4.9">4.9 ★ Heritage Palace</option>
                        <option value="4.8">4.8 ★ Premium Boutique</option>
                        <option value="4.5">4.5 ★ Deluxe Sanctuary</option>
                      </select>
                    </div>

                    {/* Stay Category */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Stay Category
                      </label>
                      <select
                        value={day.accommodationCategory}
                        onChange={(e) =>
                          updateDay(idx, { accommodationCategory: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#082F24] bg-white cursor-pointer"
                      >
                        <option value="Luxury Resort">Luxury Resort</option>
                        <option value="Heritage Palace">Heritage Palace</option>
                        <option value="Private Houseboat">Private Houseboat</option>
                        <option value="Beach Villa">Beach Villa</option>
                        <option value="Tea Estate Cottage">Tea Estate Cottage</option>
                      </select>
                    </div>

                    {/* Stay Photo URL */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Stay Photo URL
                      </label>
                      <input
                        type="url"
                        value={day.accommodationPhoto}
                        onChange={(e) =>
                          updateDay(idx, { accommodationPhoto: e.target.value })
                        }
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#082F24] bg-white"
                      />
                    </div>

                    {/* Stay Description */}
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Suite & Amenity Highlights
                      </label>
                      <input
                        type="text"
                        value={day.accommodationDetails}
                        onChange={(e) =>
                          updateDay(idx, { accommodationDetails: e.target.value })
                        }
                        placeholder="e.g. Floor-to-ceiling pine views, heated indoor infinity pool, L'Occitane luxury bath essentials."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#082F24] bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MAP COORDINATES & ROUTE PINS */}
      {activeTab === "map" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-[#082F24]">
                Interactive Map Waypoints & Route Pins
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Configure destination coordinates for route previews and interactive maps.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  mapCoordinates: [
                    ...formData.mapCoordinates,
                    {
                      name: `Checkpoint ${formData.mapCoordinates.length + 1}`,
                      lat: 34.05,
                      lng: 74.4,
                      dayNumber: formData.mapCoordinates.length + 1,
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1.5 bg-[#082F24] text-[#dfbd75] hover:bg-[#0c4031] hover:text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Waypoint</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.mapCoordinates.map((pin, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 flex flex-col sm:flex-row items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#082F24] text-[#dfbd75] text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>

                <div className="flex-1 w-full sm:w-auto">
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">
                    Checkpoint Name
                  </label>
                  <input
                    type="text"
                    value={pin.name}
                    onChange={(e) => {
                      const copy = [...formData.mapCoordinates];
                      copy[idx].name = e.target.value;
                      setFormData({ ...formData, mapCoordinates: copy });
                    }}
                    placeholder="e.g. Gulmarg Meadows"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                  />
                </div>

                <div className="w-full sm:w-36">
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={pin.lat}
                    onChange={(e) => {
                      const copy = [...formData.mapCoordinates];
                      copy[idx].lat = parseFloat(e.target.value);
                      setFormData({ ...formData, mapCoordinates: copy });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                  />
                </div>

                <div className="w-full sm:w-36">
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={pin.lng}
                    onChange={(e) => {
                      const copy = [...formData.mapCoordinates];
                      copy[idx].lng = parseFloat(e.target.value);
                      setFormData({ ...formData, mapCoordinates: copy });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                  />
                </div>

                {formData.mapCoordinates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const copy = formData.mapCoordinates.filter((_, i) => i !== idx);
                      setFormData({ ...formData, mapCoordinates: copy });
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg shrink-0 mt-3 sm:mt-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INCLUSIONS, EXCLUSIONS & POLICIES */}
      {activeTab === "policies" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inclusions */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  What Is Included
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      inclusions: [
                        ...formData.inclusions,
                        "Complimentary private airport transfers",
                      ],
                    })
                  }
                  className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold text-xs">✓</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const copy = [...formData.inclusions];
                        copy[idx] = e.target.value;
                        setFormData({ ...formData, inclusions: copy });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const copy = formData.inclusions.filter((_, i) => i !== idx);
                        setFormData({ ...formData, inclusions: copy });
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusions */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  What Is Excluded
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      exclusions: [
                        ...formData.exclusions,
                        "Domestic/International airfare",
                      ],
                    })
                  }
                  className="text-xs font-bold text-slate-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.exclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-rose-500 font-bold text-xs">✕</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const copy = [...formData.exclusions];
                        copy[idx] = e.target.value;
                        setFormData({ ...formData, exclusions: copy });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const copy = formData.exclusions.filter((_, i) => i !== idx);
                        setFormData({ ...formData, exclusions: copy });
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment & Cancellation Policies */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-heading text-xl font-bold text-[#082F24]">
              Payment & Cancellation Terms
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Payment Policy
                </label>
                <textarea
                  rows={4}
                  value={formData.paymentPolicy}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentPolicy: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Cancellation & Refund Policy
                </label>
                <textarea
                  rows={4}
                  value={formData.cancellationPolicy}
                  onChange={(e) =>
                    setFormData({ ...formData, cancellationPolicy: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Save Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-lg flex items-center justify-between max-w-7xl mx-auto px-6">
        <div className="text-xs text-slate-500">
          Status: <strong className="text-slate-900">{formData.isPublished ? "Ready to Publish" : "Draft"}</strong> • {formData.itinerary.length} Days Mapped
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-[#082F24] text-[#dfbd75] hover:bg-[#0c4031] hover:text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Saving..." : isEdit ? "Update Package" : "Publish Package"}</span>
        </button>
      </div>
    </div>
  );
}

