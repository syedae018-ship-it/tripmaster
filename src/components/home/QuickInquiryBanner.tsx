"use client";

import { useState } from "react";
import { Send, CheckCircle2, Phone, ShieldCheck } from "lucide-react";

export function QuickInquiryBanner() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    destination: "Kashmir",
    travelDate: "",
    paxCount: "2",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState("");
  const [error, setError] = useState("");

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
    <section id="quick-inquiry" className="py-20 sm:py-28 bg-[#0D2C24] text-white font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Access Details */}
          <div className="lg:col-span-5 space-y-6">
            <p className="eyebrow text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-400">
              Private Consultation
            </p>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.12] text-balance">
              Design your custom travel dossier.
            </h2>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed text-pretty font-sans">
              Tell us your destination, dates, and party size. A senior travel curator will review room availability at 5-star partner retreats and provide a personalized proposal within 4 business hours.
            </p>

            <div className="pt-2 space-y-3 text-sm text-white/75 font-sans">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Strict traveler privacy. Zero unsolicited marketing.</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Guaranteed suite privileges at partner properties</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+919876543210"
                className="btn bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-full px-5 py-2.5 text-xs uppercase tracking-wider font-semibold tabular-nums inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-300" />
                <span>+91 98765 43210</span>
              </a>
            </div>
          </div>

          {/* Right Column: Grounded Consultation Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 text-[#111111] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] border border-[#E4E2DD]">
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#F3F1ED] text-[#0D2C24] flex items-center justify-center mx-auto border border-[#E4E2DD]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">
                    Inquiry logged successfully.
                  </h3>
                  <p className="text-[#52525B] text-sm max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="font-semibold text-[#111111]">{formData.name}</strong>. Reference ID:{" "}
                    <span className="font-semibold text-[#0D2C24] tabular-nums bg-[#F3F1ED] px-2 py-0.5 rounded-md border border-[#E4E2DD]">
                      {inquiryId}
                    </span>
                    . Our concierge will be in touch shortly.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          whatsappNumber: "",
                          destination: "Kashmir",
                          travelDate: "",
                          paxCount: "2",
                          notes: "",
                        });
                      }}
                      className="text-xs font-semibold uppercase tracking-wider text-[#0D2C24] hover:underline"
                    >
                      Submit Another Inquiry →
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-[#E4E2DD] pb-3">
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                      Request a Travel Dossier
                    </h3>
                    <p className="text-xs text-[#52525B] mt-0.5">
                      No account registration required. All details are kept confidential.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Singhania"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] bg-white text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24]"
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
                        className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] bg-white text-sm tabular-nums text-[#111111] focus:outline-none focus:border-[#0D2C24]"
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
                        placeholder="e.g. aarav@singhania.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] bg-white text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                        Destination
                      </label>
                      <select
                        value={formData.destination}
                        onChange={(e) =>
                          setFormData({ ...formData, destination: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] bg-white text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24] cursor-pointer"
                      >
                        <option value="Kashmir (Gulmarg & Dal)">Kashmir (Gulmarg & Dal)</option>
                        <option value="Kerala (Backwaters & Munnar)">Kerala (Backwaters & Munnar)</option>
                        <option value="Andaman (Havelock Islands)">Andaman (Havelock Islands)</option>
                        <option value="Rajasthan (Palaces & Forts)">Rajasthan (Palaces & Forts)</option>
                        <option value="Custom Multi-City Itinerary">Custom Multi-City Itinerary</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                        Preferred Departure Date
                      </label>
                      <input
                        type="date"
                        value={formData.travelDate}
                        onChange={(e) =>
                          setFormData({ ...formData, travelDate: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] bg-white text-sm tabular-nums text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                        Number of Guests
                      </label>
                      <select
                        value={formData.paxCount}
                        onChange={(e) =>
                          setFormData({ ...formData, paxCount: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-[#E4E2DD] bg-white text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24] cursor-pointer"
                      >
                        <option value="1">1 Guest (Solo)</option>
                        <option value="2">2 Guests (Couple / Private)</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests (Family)</option>
                        <option value="5">5+ Guests (Private Party)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#52525B] mb-1.5">
                      Bespoke Requests & Occasion Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Anniversary celebration, private plunge pool suite, vegetarian dining preferences..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border border-[#E4E2DD] bg-white text-sm text-[#111111] focus:outline-none focus:border-[#0D2C24]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full h-11 text-xs uppercase tracking-wider font-semibold rounded-xl"
                  >
                    {loading ? (
                      <span>Connecting with Concierge...</span>
                    ) : (
                      <>
                        <span>Submit Guest Inquiry</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
