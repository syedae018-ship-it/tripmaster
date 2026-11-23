"use client";

import { useState, useEffect, useId } from "react";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Phone,
  MessageCircle,
  User,
  Mail,
  MapPin,
  Calendar,
  Users,
  FileText,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";

interface DestinationOption {
  value: string;
  label: string;
}

interface DestinationGroup {
  category: string;
  options: DestinationOption[];
}

const DESTINATION_GROUPS: DestinationGroup[] = [
  {
    category: "International Escapes",
    options: [
      { value: "Bali, Indonesia", label: "Bali, Indonesia" },
      { value: "Dubai & Abu Dhabi, UAE", label: "Dubai & Abu Dhabi, UAE" },
      { value: "Singapore & Sentosa", label: "Singapore & Sentosa" },
      { value: "Thailand Islands", label: "Thailand & Phuket" },
      { value: "Europe Highlights", label: "Europe Highlights (Swiss Alps, Paris, Riviera)" },
      { value: "Maldives Private Atolls", label: "Maldives Private Atolls" },
      { value: "Vietnam & Cambodia", label: "Vietnam & Cambodia" },
      { value: "Japan Cultural Journey", label: "Japan Cultural Journey" },
    ],
  },
  {
    category: "Domestic Sanctuaries",
    options: [
      { value: "Kashmir Sanctuaries", label: "Kashmir — Srinagar & Pahalgam" },
      { value: "Kerala Backwaters", label: "Kerala Backwaters & Vembanad" },
      { value: "Rajasthan Palaces", label: "Rajasthan — Udaipur & Jaipur Palaces" },
      { value: "Andaman Islands", label: "Andaman & Nicobar Islands" },
      { value: "Himachal & Spiti", label: "Himachal & Alpine Sanctuaries" },
      { value: "Goa Coastal Villas", label: "Goa — South Goa Private Villas" },
    ],
  },
  {
    category: "Bespoke",
    options: [
      { value: "Custom Multi-Destination Journey", label: "Custom Multi-Destination Private Itinerary" },
      { value: "Private Villa & Yacht Charter", label: "Private Villa & Yacht Charter" },
      { value: "Executive & Corporate Retreat", label: "Executive Delegation & Corporate Retreat" },
    ],
  },
];

const GUEST_COUNT_OPTIONS = [
  { value: "1", label: "1 Guest" },
  { value: "2", label: "2 Guests" },
  { value: "3", label: "3 Guests" },
  { value: "4", label: "4 Guests" },
  { value: "5", label: "5 - 8 Guests" },
  { value: "9", label: "9+ Guests" },
];

export function PlanTripModal({
  defaultPackageTitle = "",
}: {
  defaultPackageTitle?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: defaultPackageTitle || "",
    travelDate: "",
    paxCount: "2",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState("");
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(false);

  const titleId = useId();
  const descId = useId();

  // Listen for custom trigger event
  useEffect(() => {
    const handleOpen = (e?: Event) => {
      const customEvent = e as CustomEvent<{ destination?: string }>;
      if (customEvent?.detail?.destination) {
        setFormData((prev) => ({
          ...prev,
          destination: customEvent.detail.destination || prev.destination,
        }));
      }
      setSubmitted(false);
      setError("");
      setIsOpen(true);
    };

    window.addEventListener("open-plan-trip-modal", handleOpen);
    return () => window.removeEventListener("open-plan-trip-modal", handleOpen);
  }, []);

  // Sync defaultPackageTitle if updated externally
  useEffect(() => {
    if (defaultPackageTitle) {
      setFormData((prev) => ({ ...prev, destination: defaultPackageTitle }));
    }
  }, [defaultPackageTitle]);

  // Lock scroll and handle escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          whatsappNumber: formData.phone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit consultation request");
      }

      setSubmitted(true);
      setInquiryId(data.inquiryId || `TM-INQ-${Date.now().toString().slice(-6)}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInquiryId = () => {
    if (!inquiryId) return;
    navigator.clipboard.writeText(inquiryId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2200);
  };

  const isKnownDestination = DESTINATION_GROUPS.some((group) =>
    group.options.some((opt) => opt.value === formData.destination)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md transition-opacity duration-200 font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div
        className="relative w-full max-w-[540px] bg-white rounded-2xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        {/* =========================================================
            HEADER: Luxury British Racing Green
           ========================================================= */}
        <div className="relative bg-[#0D2C24] text-white px-5 sm:px-6 py-4 shrink-0 border-b border-white/10">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C59B27]/40 to-transparent" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src="/images/logo-white.png"
                alt="Trip Master"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (!target.src.includes("/logo.png")) {
                    target.src = "/logo.png";
                  }
                }}
                className="h-7 w-auto object-contain shrink-0"
              />
              <div className="border-l border-white/15 pl-3 min-w-0">
                <h3
                  id={titleId}
                  className="font-heading text-base sm:text-lg font-bold tracking-tight text-white leading-tight"
                >
                  Plan Your Journey
                </h3>
                <p
                  id={descId}
                  className="text-[11px] text-stone-300/90 mt-0.5 leading-snug font-normal truncate"
                >
                  Curated itineraries by destination specialists
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-stone-200 hover:text-white flex items-center justify-center transition-[background-color,transform,color] duration-150 border border-white/10 shrink-0 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================
            MINIMAL TRUST BAR
           ========================================================= */}
        <div className="bg-[#FAF9F6] border-b border-stone-200/80 px-5 sm:px-6 py-2 flex items-center justify-between text-[11px] text-stone-500 font-medium shrink-0">
          <div className="flex items-center gap-1.5 text-[#0D2C24]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0D2C24] shrink-0" />
            <span>Direct Concierge Service · Strictly Confidential</span>
          </div>
          <span className="hidden sm:inline-block text-stone-400">Response within 24h</span>
        </div>

        {/* =========================================================
            MODAL BODY
           ========================================================= */}
        <div className="px-5 sm:px-6 py-5 overflow-y-auto flex-1 overscroll-contain bg-white">
          {submitted ? (
            /* =========================================================
               CONFIRMATION STATE
               ========================================================= */
            <div className="text-center py-4 space-y-5 max-w-md mx-auto">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#0D2C24]/5 text-[#0D2C24] flex items-center justify-center border border-[#0D2C24]/15">
                <CheckCircle2 className="w-6 h-6 text-[#0D2C24]" />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-heading text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                  Consultation Request Received
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Thank you, <strong className="text-stone-900">{formData.name}</strong>. Your inquiry has been dispatched to our concierge team.
                </p>
              </div>

              {/* Consultation Reference Card */}
              <div className="p-4 bg-[#FAF9F6] rounded-xl border border-stone-200 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                    Consultation Reference
                  </span>
                  <span className="text-[9.5px] font-semibold uppercase tracking-wider text-[#0D2C24] bg-[#0D2C24]/5 border border-[#0D2C24]/15 px-2 py-0.5 rounded">
                    Active Priority
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 bg-white px-3 py-2 rounded-lg border border-stone-200">
                  <span className="font-mono text-sm sm:text-base font-bold text-[#0D2C24] tracking-wider tabular-nums">
                    {inquiryId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyInquiryId}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                  >
                    {copiedId ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-700" />
                        <span className="text-emerald-700 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-stone-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200/80 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block tracking-wider">
                      Destination
                    </span>
                    <span className="font-semibold text-stone-800 line-clamp-1 mt-0.5">
                      {formData.destination}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block tracking-wider">
                      Party Size
                    </span>
                    <span className="font-semibold text-stone-800 line-clamp-1 mt-0.5">
                      {formData.paxCount} Guests
                    </span>
                  </div>
                  {formData.travelDate && (
                    <div className="col-span-2 pt-1">
                      <span className="text-[10px] uppercase font-semibold text-stone-400 block tracking-wider">
                        Target Date
                      </span>
                      <span className="font-semibold text-stone-800 mt-0.5">
                        {formData.travelDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(
                    `Hello Trip Master Concierge. I have submitted consultation request ${inquiryId} for ${formData.destination}. I would like to discuss my itinerary.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D2C24] hover:bg-[#133E33] active:scale-[0.98] text-white font-medium text-xs tracking-wide shadow-sm transition-[background-color,transform] duration-150 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#C59B27]" />
                  <span>Connect with Concierge on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-[0.98] text-stone-700 font-semibold text-xs transition-[background-color,transform] duration-150 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* =========================================================
               ULTRA-MINIMAL & EFFORTLESS FORM
               ========================================================= */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 flex items-center gap-2.5">
                  <X className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Guest Details: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Full Name <span className="text-[#C59B27]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0D2C24] focus:border-[#0D2C24] transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Phone Number <span className="text-[#C59B27]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm tabular-nums text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0D2C24] focus:border-[#0D2C24] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Email Address <span className="text-[#C59B27]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0D2C24] focus:border-[#0D2C24] transition-all"
                  />
                </div>
              </div>

              {/* Destination Dropdown */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Destination <span className="text-[#C59B27]">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    required
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData({ ...formData, destination: e.target.value })
                    }
                    className="w-full h-10 pl-9 pr-8 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0D2C24] focus:border-[#0D2C24] transition-all cursor-pointer appearance-none font-medium"
                  >
                    <option value="" disabled>
                      Select destination
                    </option>
                    {formData.destination && !isKnownDestination && (
                      <option value={formData.destination}>
                        {formData.destination}
                      </option>
                    )}
                    {DESTINATION_GROUPS.map((group) => (
                      <optgroup
                        key={group.category}
                        label={group.category}
                        className="font-bold text-stone-800 bg-stone-50"
                      >
                        {group.options.map((opt) => (
                          <option
                            key={opt.value}
                            value={opt.value}
                            className="font-normal text-stone-800 bg-white py-1"
                          >
                            {opt.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Travel Date & Party Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Travel Date */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Estimated Travel Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={formData.travelDate}
                      onChange={(e) =>
                        setFormData({ ...formData, travelDate: e.target.value })
                      }
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm tabular-nums text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0D2C24] focus:border-[#0D2C24] transition-all cursor-pointer"
                    />
                  </div>
                </div>

                {/* Party Size */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Party Size
                  </label>
                  <div className="relative">
                    <Users className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={formData.paxCount}
                      onChange={(e) =>
                        setFormData({ ...formData, paxCount: e.target.value })
                      }
                      className="w-full h-10 pl-9 pr-8 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#0D2C24] focus:border-[#0D2C24] transition-all cursor-pointer appearance-none font-medium"
                    >
                      {GUEST_COUNT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Special Requests <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <FileText className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                  <textarea
                    rows={2}
                    placeholder="Special requests or preferences..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0D2C24] focus:border-[#0D2C24] transition-all leading-relaxed"
                  />
                </div>
              </div>

              {/* Primary CTA */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[44px] h-11 rounded-xl bg-[#0D2C24] hover:bg-[#133E33] active:scale-[0.98] text-white font-medium text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm transition-[background-color,transform,box-shadow] duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Transmitting Consultation Request...</span>
                    </div>
                  ) : (
                    <>
                      <span>Request Bespoke Consultation</span>
                      <ArrowRight className="w-4 h-4 text-[#C59B27]" />
                    </>
                  )}
                </button>

                <p className="text-center text-[10.5px] text-stone-400">
                  Your contact details remain strictly confidential.
                </p>
              </div>

              {/* Support / Direct Advisory Footer: Logos + Clean Click Here Button */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <Phone className="w-4 h-4 text-[#0D2C24] shrink-0" />
                </div>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-lg bg-stone-50 hover:bg-[#0D2C24] hover:text-white active:scale-[0.98] text-stone-800 font-medium text-xs border border-stone-200 transition-[background-color,color,transform] duration-150 cursor-pointer"
                >
                  <span>Chat with Concierge</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C59B27]" />
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
