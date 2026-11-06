"use client";

import { useState, useEffect } from "react";
import { X, Send, CheckCircle2, ShieldCheck, Sparkles, Phone } from "lucide-react";

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
    whatsappNumber: "",
    destination: defaultPackageTitle || "Bali, Indonesia",
    travelDate: "",
    paxCount: "2",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleOpen = (e?: Event) => {
      const customEvent = e as CustomEvent<{ destination?: string }>;
      if (customEvent?.detail?.destination) {
        setFormData((prev) => ({
          ...prev,
          destination: customEvent.detail.destination || prev.destination,
        }));
      }
      setIsOpen(true);
    };

    window.addEventListener("open-plan-trip-modal", handleOpen);
    return () => window.removeEventListener("open-plan-trip-modal", handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
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
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setSubmitted(true);
      setInquiryId(data.inquiryId);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E4E2DD] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header */}
        <div className="bg-[#0D2C24] text-white px-6 py-5 flex items-center justify-between border-b border-[#1A453B]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400 text-[#0D2C24] flex items-center justify-center font-heading font-bold text-xs">
              TM
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold tracking-tight text-white leading-none">
                Plan Your Holiday Experience
              </h3>
              <span className="text-[10px] text-amber-300 uppercase tracking-widest font-semibold mt-0.5 block">
                Bespoke Guest Consultation
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 max-h-[85vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">
                Your Holiday Plan Is In Motion!
              </h4>
              <p className="text-[#52525B] text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-[#111111]">{formData.name}</strong>. Reference ID:{" "}
                <span className="font-semibold text-[#0D2C24] bg-[#F3F1ED] px-2 py-0.5 rounded-md border border-[#E4E2DD] tabular-nums">
                  {inquiryId}
                </span>
                . Our travel specialists will prepare a customized proposal and contact you via WhatsApp / Phone shortly.
              </p>
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-primary px-6 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-xl"
                >
                  Close & Continue Exploring
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#52525B] pb-2 border-b border-[#E4E2DD]">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#0D2C24]" />
                  Zero login required · Strict guest privacy
                </span>
                <span className="text-amber-800 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Free custom quote
                </span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                        whatsappNumber: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-sm tabular-nums text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. priya@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                    Destination *
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData({ ...formData, destination: e.target.value })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24] bg-white cursor-pointer"
                  >
                    <option value="Bali, Indonesia">Bali, Indonesia (5D / 4N)</option>
                    <option value="Dubai, UAE">Dubai, UAE (6D / 5N)</option>
                    <option value="Thailand">Thailand Islands (5D / 4N)</option>
                    <option value="Europe Highlights">Europe Highlights (10D / 9N)</option>
                    <option value="Kashmir, India">Kashmir Sanctuaries (6D / 5N)</option>
                    <option value="Kerala, India">Kerala Backwaters (6D / 5N)</option>
                    <option value="Andaman Islands">Andaman Islands (6D / 5N)</option>
                    <option value="Rajasthan, India">Rajasthan Palaces (6D / 5N)</option>
                    <option value="Custom Multi-City">Custom Multi-City Escape</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                    Preferred Travel Date
                  </label>
                  <input
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) =>
                      setFormData({ ...formData, travelDate: e.target.value })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-sm tabular-nums text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                    Number of Travellers
                  </label>
                  <select
                    value={formData.paxCount}
                    onChange={(e) =>
                      setFormData({ ...formData, paxCount: e.target.value })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24] bg-white cursor-pointer"
                  >
                    <option value="1">1 Traveller (Solo)</option>
                    <option value="2">2 Travellers (Couple)</option>
                    <option value="3">3 Travellers</option>
                    <option value="4">4 Travellers (Family)</option>
                    <option value="5">5+ Travellers (Group)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                  Trip Notes / Special Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Honeymoon suite, private pool villa, vegetarian meals, airport transfers..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-[#E4E2DD] text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full h-12 text-xs uppercase tracking-wider font-semibold rounded-xl justify-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <span>Submitting Your Request...</span>
                  ) : (
                    <>
                      <span>Submit Holiday Enquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] text-[#52525B] pt-1">
                Prefer to call? Speak directly with our team at{" "}
                <a href="tel:+919876543210" className="text-[#0D2C24] font-semibold underline">
                  +91 98765 43210
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

