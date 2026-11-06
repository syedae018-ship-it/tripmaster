"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Download,
  Share2,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  Image as ImageIcon,
  Compass,
  Calendar,
  MapPin,
  Utensils,
  Building,
  CheckCircle2,
  XCircle,
  Star,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Loader2,
  FileText,
} from "lucide-react";
import {
  MobileQuotationDossier,
  QuotationContentData,
} from "@/components/quotation/MobileQuotationDossier";
import { ImagePickerModal } from "@/components/admin/ImagePickerModal";
import { generateMobilePdf } from "@/lib/pdfGenerator";

interface QuotationStudioProps {
  initialQuotationId?: string;
}

export function QuotationStudio({ initialQuotationId }: QuotationStudioProps) {
  const router = useRouter();
  const dossierRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Available Packages & Master Places
  const [packages, setPackages] = useState<any[]>([]);
  const [masterPlaces, setMasterPlaces] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  // Customer / Client State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCity, setCustomerCity] = useState("");

  // Quotation Meta
  const [quotationId, setQuotationId] = useState<string | null>(initialQuotationId || null);
  const [quotationNumber, setQuotationNumber] = useState("QT-DRAFT-001");
  const [shareSlug, setShareSlug] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [travelDate, setTravelDate] = useState("");

  // Live Dossier Content State
  const [content, setContent] = useState<QuotationContentData>({
    heroImage:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
    title: "Singapore Explorer",
    subtitle: "Curated 3 Nights / 4 Days Itinerary Plan",
    mapIntro:
      "Singapore, an island city-state off southern Malaysia, is a global financial center with a tropical climate and multicultural population.",
    mapStops: [
      { name: "Changi Airport", label: "Arrival / Departure" },
      { name: "Gardens by the Bay", label: "Supertrees & Domes" },
      { name: "Universal Studios", label: "Full Day Thrills" },
      { name: "Sentosa Island", label: "Cable Car & Beach" },
      { name: "Merlion Park", label: "Marina Bay Landmark" },
    ],
    summary: {
      duration: "3 Nights, 4 Days",
      destination: "Singapore",
      pricePerPersonFormatted: "INR 38,750 per person",
      pricePerPerson: 38750,
      paxCount: 2,
      totalCostFormatted: "INR 77,500 for 2 Travellers",
    },
    costBreakdown: [
      { category: "Accommodations (4-Star Hotel)", cost: "INR 16,500" },
      { category: "Universal Studios & Attractions", cost: "INR 12,250" },
      { category: "Transfers & Transport", cost: "INR 6,000" },
      { category: "Taxes & Local Concierge", cost: "INR 4,000" },
    ],
    staySummary: {
      city: "Singapore",
      hotelName: "Hotel Boss / V Hotel (4-Star)",
      roomType: "Superior Room with Breakfast",
      rating: 4.5,
      photo:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    },
    mealsBanner: {
      title: "Meals Included Throughout Your Journey",
      description:
        "Daily breakfast included at hotel. Lunch & Dinner at leisure or recommended dining spots.",
      tags: [
        "Breakfast Included (Daily)",
        "Lunch At Leisure",
        "Dinner Recommendations",
      ],
    },
    quickDayWiseSummary: [
      { day: "Day 1", summary: "Arrival in Singapore & Gardens by the Bay" },
      { day: "Day 2", summary: "Universal Studios Singapore (Sentosa Island)" },
      { day: "Day 3", summary: "Sentosa Cable Car, Madame Tussauds & Wings of Time" },
      { day: "Day 4", summary: "Singapore City Tour, Merlion Park & Departure" },
    ],
    days: [],
    momentsThatMatter: [],
    inclusions: [],
    exclusions: [],
    paymentPolicy: [],
    reviews: [],
    advisor: {
      name: "Master Concierge Desk",
      phone: "+91 98765 43210",
      whatsappNumber: "+91 98765 43210",
      email: "concierge@tripmaster.in",
      offices: "SINGAPORE AND INDIA",
      companyName: "Trip Master",
    },
  });

  // Image Picker Modal State
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{
    type: "hero" | "staySummary" | "placePhoto" | "hotelPhoto" | "moment";
    dayIndex?: number;
    placeIndex?: number;
    photoIndex?: number;
    momentIndex?: number;
  } | null>(null);

  // Zoom level for preview
  const [zoomLevel, setZoomLevel] = useState<number>(85);

  // Load Packages and existing Quotation
  useEffect(() => {
    loadPackages();
    if (initialQuotationId) {
      loadQuotation(initialQuotationId);
    } else {
      // Default: load Singapore Explorer template
      loadTemplateBySlug("singapore-explorer-3n4d");
    }
  }, [initialQuotationId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadPackages = async () => {
    try {
      const res = await fetch("/api/packages");
      const data = await res.json();
      if (data.success && data.packages) {
        setPackages(data.packages);
      }
    } catch (e) {
      console.error("Failed to load packages list:", e);
    }
  };

  const loadQuotation = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/quotations/${id}`);
      const data = await res.json();
      if (data.success && data.quotation) {
        const q = data.quotation;
        setQuotationId(q.id);
        setQuotationNumber(q.quotationNumber);
        setShareSlug(q.shareSlug);
        setStatus(q.status);
        if (q.customer) {
          setCustomerName(q.customer.name || "");
          setCustomerPhone(q.customer.phone || "");
          setCustomerEmail(q.customer.email || "");
          setCustomerCity(q.customer.city || "");
        }
        if (q.content) {
          setContent(q.content);
        }
      }
    } catch (e) {
      console.error("Failed to load quotation:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplateBySlug = async (slugOrId: string) => {
    if (!slugOrId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/quotations/template/${slugOrId}`);
      const data = await res.json();
      if (data.success && data.templateContent) {
        setContent(data.templateContent);
        setSelectedTemplate(slugOrId);
        if (data.masterPlaces) {
          setMasterPlaces(data.masterPlaces);
        }
        showToast(`Loaded ${data.templateContent.title} template!`);
      }
    } catch (e) {
      console.error("Failed to load template:", e);
    } finally {
      setLoading(false);
    }
  };

  // Image Selection Handler
  const handleOpenPicker = (target: typeof pickerTarget) => {
    setPickerTarget(target);
    setPickerOpen(true);
  };

  const handleImageSelected = (url: string) => {
    if (!pickerTarget) return;

    if (pickerTarget.type === "hero") {
      setContent((prev) => ({ ...prev, heroImage: url }));
    } else if (pickerTarget.type === "staySummary") {
      setContent((prev) => ({
        ...prev,
        staySummary: { ...prev.staySummary, photo: url },
      }));
    } else if (pickerTarget.type === "placePhoto" && pickerTarget.dayIndex !== undefined && pickerTarget.placeIndex !== undefined) {
      setContent((prev) => {
        const updatedDays = [...prev.days];
        const day = updatedDays[pickerTarget.dayIndex!];
        const place = day.places[pickerTarget.placeIndex!];
        const photos = [...(place.photos || [])];
        if (pickerTarget.photoIndex !== undefined) {
          photos[pickerTarget.photoIndex] = url;
        } else {
          photos.push(url);
        }
        place.photos = photos;
        return { ...prev, days: updatedDays };
      });
    } else if (pickerTarget.type === "hotelPhoto" && pickerTarget.dayIndex !== undefined) {
      setContent((prev) => {
        const updatedDays = [...prev.days];
        const day = updatedDays[pickerTarget.dayIndex!];
        if (day.hotel) {
          day.hotel.photo = url;
        }
        return { ...prev, days: updatedDays };
      });
    } else if (pickerTarget.type === "moment") {
      setContent((prev) => {
        const moments = [...(prev.momentsThatMatter || [])];
        if (pickerTarget.momentIndex !== undefined) {
          moments[pickerTarget.momentIndex].url = url;
        } else {
          moments.push({ url, caption: "Special Memory" });
        }
        return { ...prev, momentsThatMatter: moments };
      });
    }

    setPickerOpen(false);
    setPickerTarget(null);
  };

  // Add Place to Day
  const handleAddPlaceFromLibrary = (dayIndex: number, masterPlaceId: string) => {
    const master = masterPlaces.find((p) => p.id === masterPlaceId);
    if (!master) return;

    setContent((prev) => {
      const updatedDays = [...prev.days];
      updatedDays[dayIndex].places.push({
        title: master.placeTitle,
        subtitle: master.locationSubtitle || `${prev.summary.destination}`,
        category: master.category,
        photos: master.photos || [],
        description: master.description,
      });
      return { ...prev, days: updatedDays };
    });
    showToast(`Added ${master.placeTitle} to Day ${dayIndex + 1}`);
  };

  const handleAddCustomPlace = (dayIndex: number) => {
    setContent((prev) => {
      const updatedDays = [...prev.days];
      updatedDays[dayIndex].places.push({
        title: "New Attraction / Activity",
        subtitle: `${prev.summary.destination}`,
        category: "ATTRACTION",
        photos: [prev.heroImage],
        description:
          "Experience this signature excursion with private transfers and priority tickets.",
      });
      return { ...prev, days: updatedDays };
    });
  };

  const handleRemovePlace = (dayIndex: number, placeIndex: number) => {
    setContent((prev) => {
      const updatedDays = [...prev.days];
      updatedDays[dayIndex].places.splice(placeIndex, 1);
      return { ...prev, days: updatedDays };
    });
  };

  // Save Quotation
  const handleSaveQuotation = async () => {
    try {
      setSaving(true);

      const payload = {
        title: content.title,
        destination: content.summary.destination,
        durationDays: parseInt(content.summary.duration.split(",")[1]?.trim()) || 4,
        durationNights: parseInt(content.summary.duration.split(",")[0]?.trim()) || 3,
        pricePerPerson: content.summary.pricePerPerson,
        totalAmount:
          content.summary.pricePerPerson * (content.summary.paxCount || 2),
        travelDate: travelDate || null,
        paxCount: content.summary.paxCount || 2,
        status,
        content,
        customerData: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          city: customerCity,
        },
      };

      const endpoint = quotationId
        ? `/api/admin/quotations/${quotationId}`
        : "/api/admin/quotations";
      const method = quotationId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to save quotation");
      }

      setQuotationId(data.quotation.id);
      setQuotationNumber(data.quotation.quotationNumber);
      setShareSlug(data.quotation.shareSlug);
      showToast("Quotation saved successfully!");
    } catch (err: any) {
      alert(`Save error: ${err.message || "Failed to save quotation"}`);
    } finally {
      setSaving(false);
    }
  };

  // 1-Click Mobile PDF Download
  const handleDownloadPdf = async () => {
    if (!dossierRef.current) return;
    try {
      setDownloadingPdf(true);
      const fileName = `${content.title.replace(/[^a-zA-Z0-9]/g, "_")}_Mobile_Plan_${quotationNumber}.pdf`;
      const res = await generateMobilePdf(dossierRef.current, {
        fileName,
        scale: 2.5,
      });

      if (!res.success) {
        throw new Error(res.error || "Could not generate PDF");
      }
      showToast("Mobile PDF downloaded successfully!");
    } catch (e: any) {
      alert(`PDF Error: ${e.message || "Failed to generate PDF"}`);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // WhatsApp Share Link
  const handleShareWhatsApp = () => {
    const clientPhone = customerPhone.replace(/[^0-9]/g, "");
    const shareUrl = `${window.location.origin}/quote/${shareSlug || "singapore-explorer-3n4d-quote"}`;
    const text = `Hi ${customerName || "there"}! Here is your personalized mobile-optimized itinerary & quotation for *${content.title}* (${content.summary.duration}):\n\n${shareUrl}\n\nFeel free to review your complete day-wise plan and let me know if you would like any customizations!`;

    const waUrl = clientPhone
      ? `https://wa.me/${clientPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(waUrl, "_blank");
  };

  // Copy share link
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/quote/${shareSlug || "singapore-explorer-3n4d-quote"}`;
    navigator.clipboard.writeText(shareUrl);
    showToast("Shareable client link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] font-sans pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D2C24] text-white px-5 py-3 rounded-2xl shadow-elevation border border-emerald-800 text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Studio Action Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#E4E2DD] shadow-xs px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Title & Quick Template Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0D2C24] text-white flex items-center justify-center font-heading font-bold text-sm shadow-xs">
            QT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-base text-[#111111]">
                Instant Mobile Quotation & Plan Builder
              </h2>
              <span className="text-[10px] font-mono bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded border border-zinc-200">
                {quotationNumber}
              </span>
            </div>
            <p className="text-[11px] text-[#52525B]">
              430px continuous mobile dossier layout • exact reference replica
            </p>
          </div>
        </div>

        {/* Center: Pre-Defined Package Quick-Load */}
        <div className="flex items-center gap-2 bg-[#FAF9F6] border border-[#E4E2DD] p-1.5 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-zinc-500 pl-1.5">
            Load Template:
          </span>
          <select
            value={selectedTemplate}
            onChange={(e) => loadTemplateBySlug(e.target.value)}
            className="text-xs bg-white border border-[#E4E2DD] rounded-lg px-2.5 py-1 text-zinc-800 font-medium focus:outline-hidden focus:border-[#0D2C24]"
          >
            <option value="singapore-explorer-3n4d">
              Singapore Explorer (3N, 4D) — Preset Replica
            </option>
            {packages.map((p) => (
              <option key={p.id} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="px-3.5 py-2 text-xs font-heading font-bold uppercase tracking-wider bg-white border border-[#0D2C24] text-[#0D2C24] hover:bg-[#0D2C24]/5 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {downloadingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download Mobile PDF</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-3 py-2 text-xs font-heading font-bold uppercase tracking-wider bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="p-2 text-zinc-600 hover:text-zinc-900 border border-[#E4E2DD] rounded-xl hover:bg-zinc-100 transition-colors"
            title="Copy Shareable Link"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleSaveQuotation}
            disabled={saving}
            className="px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider bg-[#0D2C24] hover:bg-[#133E33] text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Plan</span>
          </button>
        </div>
      </div>

      {/* Studio Workspace: Split Screen Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =====================================================================
            LEFT COLUMN (7 cols): STRUCTURED FORM BUILDER
            ===================================================================== */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Client & Trip Information */}
          <div className="bg-white rounded-2xl p-5 border border-[#E4E2DD] shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#0D2C24] uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>1. Client & Trip Basics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">
                  Customer / Client Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Jainam Mehta"
                  className="w-full px-3 py-2 border border-[#E4E2DD] rounded-xl text-zinc-900 focus:outline-hidden focus:border-[#0D2C24]"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-medium mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 border border-[#E4E2DD] rounded-xl text-zinc-900 focus:outline-hidden focus:border-[#0D2C24]"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. jainam@example.com"
                  className="w-full px-3 py-2 border border-[#E4E2DD] rounded-xl text-zinc-900 focus:outline-hidden focus:border-[#0D2C24]"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-medium mb-1">
                  Travel Start Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E4E2DD] rounded-xl text-zinc-900 focus:outline-hidden focus:border-[#0D2C24]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-600 font-medium mb-1">
                  Quotation Title
                </label>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) =>
                    setContent((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-[#E4E2DD] rounded-xl font-heading font-bold text-zinc-900 focus:outline-hidden focus:border-[#0D2C24]"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-medium mb-1">
                  Duration Label
                </label>
                <input
                  type="text"
                  value={content.summary.duration}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      summary: { ...prev.summary, duration: e.target.value },
                    }))
                  }
                  placeholder="e.g. 3 Nights, 4 Days"
                  className="w-full px-3 py-2 border border-[#E4E2DD] rounded-xl text-zinc-900 focus:outline-hidden focus:border-[#0D2C24]"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-medium mb-1">
                  Price Per Person (INR)
                </label>
                <input
                  type="number"
                  value={content.summary.pricePerPerson}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setContent((prev) => ({
                      ...prev,
                      summary: {
                        ...prev.summary,
                        pricePerPerson: val,
                        pricePerPersonFormatted: `INR ${val.toLocaleString("en-IN")} per person`,
                        totalCostFormatted: `INR ${(val * 2).toLocaleString("en-IN")} for 2 Travellers`,
                      },
                    }));
                  }}
                  className="w-full px-3 py-2 border border-[#E4E2DD] rounded-xl text-zinc-900 font-heading font-bold focus:outline-hidden focus:border-[#0D2C24]"
                />
              </div>
            </div>

            {/* Hero Image Changer */}
            <div className="pt-2 border-t border-[#E4E2DD] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={content.heroImage}
                  alt="Hero"
                  className="w-14 h-10 rounded-lg object-cover border border-[#E4E2DD]"
                />
                <span className="text-xs text-zinc-600">
                  Current Hero Banner Image
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPicker({ type: "hero" })}
                className="px-3 py-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[#0D2C24] bg-[#0D2C24]/10 hover:bg-[#0D2C24]/20 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Change Image</span>
              </button>
            </div>
          </div>

          {/* Section 2: Detailed Day-by-Day & Place-by-Place Builder */}
          <div className="bg-white rounded-2xl p-5 border border-[#E4E2DD] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-[#0D2C24] uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>2. Itinerary Days & Places Library</span>
              </h3>
              <span className="text-xs text-zinc-400">
                {content.days.length} Days Configured
              </span>
            </div>

            <div className="space-y-6">
              {content.days.map((day, dIdx) => (
                <div
                  key={dIdx}
                  className="border border-[#E4E2DD] rounded-2xl p-4 bg-[#FAF9F6] space-y-4"
                >
                  {/* Day Header Inputs */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E4E2DD]">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-xs bg-[#0D2C24] text-white px-2.5 py-1 rounded-lg">
                        Day {day.dayNumber}
                      </span>
                      <input
                        type="text"
                        value={day.dateLabel || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setContent((prev) => {
                            const updated = [...prev.days];
                            updated[dIdx].dateLabel = val;
                            return { ...prev, days: updated };
                          });
                        }}
                        placeholder="Day Subtitle / Focus"
                        className="text-xs font-medium border border-[#E4E2DD] rounded-lg px-2.5 py-1 bg-white text-zinc-900 w-60"
                      />
                    </div>

                    {/* Add Place Options */}
                    <div className="flex items-center gap-2">
                      {masterPlaces.length > 0 && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddPlaceFromLibrary(dIdx, e.target.value);
                              e.target.value = "";
                            }
                          }}
                          className="text-xs bg-white border border-[#E4E2DD] rounded-lg px-2 py-1 text-zinc-700"
                        >
                          <option value="">+ Add Place from Library...</option>
                          {masterPlaces.map((mp) => (
                            <option key={mp.id} value={mp.id}>
                              {mp.placeTitle} ({mp.category})
                            </option>
                          ))}
                        </select>
                      )}

                      <button
                        type="button"
                        onClick={() => handleAddCustomPlace(dIdx)}
                        className="px-2.5 py-1 text-xs font-medium bg-[#0D2C24] text-white rounded-lg hover:bg-[#133E33]"
                      >
                        + Custom Place
                      </button>
                    </div>
                  </div>

                  {/* Day Places List */}
                  <div className="space-y-3.5">
                    {day.places.map((place, pIdx) => (
                      <div
                        key={pIdx}
                        className="bg-white p-3.5 rounded-xl border border-[#E4E2DD] space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={place.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const updated = [...prev.days];
                                updated[dIdx].places[pIdx].title = val;
                                return { ...prev, days: updated };
                              });
                            }}
                            className="font-heading font-bold text-xs text-zinc-900 border-b border-transparent hover:border-zinc-300 focus:border-[#0D2C24] px-1 py-0.5 w-full"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePlace(dIdx, pIdx)}
                            className="text-zinc-400 hover:text-rose-600 p-1"
                            title="Remove Place"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <input
                            type="text"
                            value={place.subtitle}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const updated = [...prev.days];
                                updated[dIdx].places[pIdx].subtitle = val;
                                return { ...prev, days: updated };
                              });
                            }}
                            placeholder="Location subtitle"
                            className="text-[11px] px-2 py-1 border border-[#E4E2DD] rounded-lg text-zinc-700"
                          />
                          <select
                            value={place.category || "ATTRACTION"}
                            onChange={(e) => {
                              const val = e.target.value;
                              setContent((prev) => {
                                const updated = [...prev.days];
                                updated[dIdx].places[pIdx].category = val;
                                return { ...prev, days: updated };
                              });
                            }}
                            className="text-[11px] px-2 py-1 border border-[#E4E2DD] rounded-lg text-zinc-700 bg-white"
                          >
                            <option value="ATTRACTION">ATTRACTION</option>
                            <option value="TRANSFER">TRANSFER</option>
                            <option value="SHOW">SHOW</option>
                            <option value="HOTEL">HOTEL</option>
                          </select>
                        </div>

                        {/* Photos preview & Change */}
                        <div className="flex items-center gap-2">
                          {place.photos?.map((photoUrl, photoIdx) => (
                            <div
                              key={photoIdx}
                              onClick={() =>
                                handleOpenPicker({
                                  type: "placePhoto",
                                  dayIndex: dIdx,
                                  placeIndex: pIdx,
                                  photoIndex: photoIdx,
                                })
                              }
                              className="relative w-14 h-10 rounded-lg overflow-hidden border border-[#E4E2DD] cursor-pointer group"
                            >
                              <img
                                src={photoUrl}
                                alt="place"
                                className="w-full h-full object-cover group-hover:opacity-75"
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenPicker({
                                type: "placePhoto",
                                dayIndex: dIdx,
                                placeIndex: pIdx,
                              })
                            }
                            className="text-[10px] font-medium text-[#0D2C24] hover:underline"
                          >
                            + Add/Change Photo
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={place.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setContent((prev) => {
                              const updated = [...prev.days];
                              updated[dIdx].places[pIdx].description = val;
                              return { ...prev, days: updated };
                            });
                          }}
                          className="w-full text-xs p-2 border border-[#E4E2DD] rounded-lg text-zinc-800"
                        />
                      </div>
                    ))}
                  </div>

                  {/* End of Day Hotel Card Toggle */}
                  {day.hotel && (
                    <div className="border border-emerald-200 bg-white p-3 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                        <span>End of Day Hotel Stay Card</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenPicker({
                              type: "hotelPhoto",
                              dayIndex: dIdx,
                            })
                          }
                          className="text-[10px] font-medium text-[#0D2C24] hover:underline"
                        >
                          Change Hotel Photo
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          value={day.hotel.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setContent((prev) => {
                              const updated = [...prev.days];
                              if (updated[dIdx].hotel) {
                                updated[dIdx].hotel!.name = val;
                              }
                              return { ...prev, days: updated };
                            });
                          }}
                          placeholder="Hotel Name"
                          className="px-2 py-1 border border-[#E4E2DD] rounded-lg text-zinc-900 font-bold"
                        />
                        <input
                          type="text"
                          value={day.hotel.roomType}
                          onChange={(e) => {
                            const val = e.target.value;
                            setContent((prev) => {
                              const updated = [...prev.days];
                              if (updated[dIdx].hotel) {
                                updated[dIdx].hotel!.roomType = val;
                              }
                              return { ...prev, days: updated };
                            });
                          }}
                          placeholder="Room Type"
                          className="px-2 py-1 border border-[#E4E2DD] rounded-lg text-zinc-700"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Inclusions & Exclusions */}
          <div className="bg-white rounded-2xl p-5 border border-[#E4E2DD] shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#0D2C24] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>3. Inclusions & Exclusions</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-emerald-800 block mb-2">
                  Inclusions ({content.inclusions.length})
                </span>
                <div className="space-y-1.5">
                  {content.inclusions.map((inc, iIdx) => (
                    <div key={iIdx} className="flex items-center gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <input
                        type="text"
                        value={inc}
                        onChange={(e) => {
                          const val = e.target.value;
                          setContent((prev) => {
                            const updated = [...prev.inclusions];
                            updated[iIdx] = val;
                            return { ...prev, inclusions: updated };
                          });
                        }}
                        className="w-full text-xs px-2 py-1 border border-[#E4E2DD] rounded-lg text-zinc-800"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-rose-800 block mb-2">
                  Exclusions ({content.exclusions.length})
                </span>
                <div className="space-y-1.5">
                  {content.exclusions.map((exc, eIdx) => (
                    <div key={eIdx} className="flex items-center gap-1.5">
                      <span className="text-rose-600 font-bold">✕</span>
                      <input
                        type="text"
                        value={exc}
                        onChange={(e) => {
                          const val = e.target.value;
                          setContent((prev) => {
                            const updated = [...prev.exclusions];
                            updated[eIdx] = val;
                            return { ...prev, exclusions: updated };
                          });
                        }}
                        className="w-full text-xs px-2 py-1 border border-[#E4E2DD] rounded-lg text-zinc-800"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN (5 cols): LIVE STICKY MOBILE PDF PREVIEW
            ===================================================================== */}
        <div className="lg:col-span-5 sticky top-20 flex flex-col items-center">
          {/* Mockup Frame Header with Zoom Controls */}
          <div className="w-full max-w-[430px] flex items-center justify-between bg-zinc-900 text-white px-4 py-2.5 rounded-t-2xl text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-heading font-bold uppercase tracking-wider text-[11px] text-zinc-200">
                Live 430px Mobile Preview
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(65, z - 10))}
                className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center font-bold text-zinc-300"
              >
                -
              </button>
              <span className="font-mono text-[11px] text-zinc-400">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(100, z + 10))}
                className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center font-bold text-zinc-300"
              >
                +
              </button>
            </div>
          </div>

          {/* Scaled Phone Frame Container */}
          <div
            className="w-full max-w-[430px] overflow-hidden bg-zinc-950 p-2 rounded-b-2xl shadow-2xl border-x-4 border-b-4 border-zinc-900 flex justify-center"
            style={{
              maxHeight: "82vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
                marginBottom: `${(1 - zoomLevel / 100) * -1200}px`,
              }}
            >
              <MobileQuotationDossier
                ref={dossierRef}
                data={content}
                quotationNumber={quotationNumber}
                clientName={customerName}
              />
            </div>
          </div>

          {/* Quick Floating Actions below preview */}
          <div className="w-full max-w-[430px] mt-3 flex items-center justify-between gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="flex-1 py-2.5 px-3 bg-[#0D2C24] hover:bg-[#133E33] text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Mobile PDF</span>
            </button>

            {shareSlug && (
              <a
                href={`/quote/${shareSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-white border border-[#E4E2DD] text-zinc-800 hover:text-black text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Link</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* TripMaster Reusable Media Picker Modal */}
      <ImagePickerModal
        isOpen={pickerOpen}
        onClose={() => {
          setPickerOpen(false);
          setPickerTarget(null);
        }}
        onSelectImage={handleImageSelected}
        destinationHint={content.summary.destination}
      />
    </div>
  );
}
