"use client";

import { useState, useEffect } from "react";
import {
  Save,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  Star,
  FileText,
  Phone,
  HelpCircle,
  MessageSquare,
  Building,
  CreditCard,
  Edit2,
} from "lucide-react";

interface Testimonial {
  id: string;
  customerName: string;
  tripDestination: string;
  rating: number;
  reviewText: string;
  customerPhoto: string | null;
  isPublished: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
}

export function CmsManager() {
  const [activeTab, setActiveTab] = useState<
    "hero" | "stats" | "testimonials" | "faqs" | "contact"
  >("hero");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Settings State
  const [settings, setSettings] = useState({
    companyName: "Trip Master",
    tagline: "Curating Bespoke Luxury Journeys Across India & Beyond",
    aboutText: "",
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    email: "concierge@tripmaster.in",
    phone: "+91 98765 43210",
    whatsappNumber: "+91 98765 43210",
    address: "",
    gstNumber: "29AABCU9603R1ZX",
    bankDetails: {
      bankName: "HDFC Bank Ltd",
      accountNumber: "50200088991122",
      ifsc: "HDFC0000123",
      accountName: "Trip Master Luxury Journeys Ltd",
      upiId: "tripmaster@hdfcbank",
    },
    features: [] as Array<{ title: string; description: string; icon: string }>,
    stats: [] as Array<{
      label: string;
      value: string;
      icon: string;
      description: string;
    }>,
  });

  // Testimonials & FAQs
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Modal / Form state for Testimonial
  const [newTestimonial, setNewTestimonial] = useState({
    customerName: "",
    tripDestination: "",
    rating: 5,
    reviewText: "",
    customerPhoto: "",
    isPublished: true,
  });
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  // Modal / Form state for FAQ
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    category: "General",
    order: 0,
    isPublished: true,
  });
  const [showFaqModal, setShowFaqModal] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      const [cmsRes, testRes, faqRes] = await Promise.all([
        fetch("/api/admin/cms"),
        fetch("/api/admin/testimonials"),
        fetch("/api/admin/faqs"),
      ]);

      const cmsData = await cmsRes.json();
      if (cmsData.success && cmsData.settings) {
        setSettings((prev) => ({
          ...prev,
          ...cmsData.settings,
          bankDetails: cmsData.settings.bankDetails || prev.bankDetails,
        }));
      }

      const testData = await testRes.json();
      if (testData.success) {
        setTestimonials(testData.testimonials);
      }

      const faqData = await faqRes.json();
      if (faqData.success) {
        setFaqs(faqData.faqs);
      }
    } catch (err) {
      console.error("Error loading CMS data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Save Settings
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Website content and settings saved successfully!");
      } else {
        alert(data.error || "Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  // Create Testimonial
  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTestimonial),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Testimonial added successfully!");
        setTestimonials([data.testimonial, ...testimonials]);
        setShowTestimonialModal(false);
        setNewTestimonial({
          customerName: "",
          tripDestination: "",
          rating: 5,
          reviewText: "",
          customerPhoto: "",
          isPublished: true,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Testimonial Publish
  const handleToggleTestimonial = async (t: Testimonial) => {
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: t.id, isPublished: !t.isPublished }),
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials((prev) =>
          prev.map((item) =>
            item.id === t.id ? { ...item, isPublished: !item.isPublished } : item
          )
        );
        showToast("Testimonial visibility updated");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Testimonial
  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Delete this customer review?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        showToast("Testimonial deleted");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create FAQ
  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFaq),
      });
      const data = await res.json();
      if (data.success) {
        showToast("FAQ added successfully!");
        setFaqs([...faqs, data.faq]);
        setShowFaqModal(false);
        setNewFaq({
          question: "",
          answer: "",
          category: "General",
          order: faqs.length + 1,
          isPublished: true,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        showToast("FAQ deleted");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm">
        Loading CMS Content Manager...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-[#082F24] text-[#dfbd75] border border-[#dfbd75]/40 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#082F24]">
            Website Content & CMS Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Dynamically update hero visuals, "Why Choose Us", company statistics, reviews, FAQs, and invoicing details.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#082F24] text-[#dfbd75] hover:bg-[#0c4031] hover:text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md self-start sm:self-center disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Updates..." : "Save All CMS Changes"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-1.5 flex flex-wrap gap-1 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === "hero"
              ? "bg-[#082F24] text-[#dfbd75] shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>1. Hero & Highlights</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("stats")}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === "stats"
              ? "bg-[#082F24] text-[#dfbd75] shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>2. Stats & About Us</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("testimonials")}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === "testimonials"
              ? "bg-[#082F24] text-[#dfbd75] shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>3. Guest Reviews ({testimonials.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("faqs")}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === "faqs"
              ? "bg-[#082F24] text-[#dfbd75] shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>4. FAQs ({faqs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`flex-1 min-w-[130px] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeTab === "contact"
              ? "bg-[#082F24] text-[#dfbd75] shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>5. Contact & Invoicing</span>
        </button>
      </div>

      {/* TAB 1: HERO & HOMEPAGE HIGHLIGHTS */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-heading text-xl font-bold text-[#082F24]">
              Homepage Hero Visual & "Why Choose Us" Propositions
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Changes here update the primary public landing visual immediately.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Hero Headline (Serif Heading)
              </label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) =>
                  setSettings({ ...settings, heroTitle: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Hero Subtitle
              </label>
              <textarea
                rows={2}
                value={settings.heroSubtitle}
                onChange={(e) =>
                  setSettings({ ...settings, heroSubtitle: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Hero Background Photography URL
              </label>
              <input
                type="url"
                value={settings.heroImage}
                onChange={(e) =>
                  setSettings({ ...settings, heroImage: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
              />
            </div>

            {/* Why Choose Us Cards Builder */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base font-bold text-[#082F24]">
                  "Why Choose Us" Value Cards
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      features: [
                        ...settings.features,
                        {
                          title: "New Distinction Proposition",
                          description:
                            "Tailored service with dedicated private vehicles and vetted guides.",
                          icon: "Sparkles",
                        },
                      ],
                    })
                  }
                  className="text-xs font-bold uppercase text-[#082F24] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feature Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {settings.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 space-y-2 relative"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSettings({
                          ...settings,
                          features: settings.features.filter((_, i) => i !== idx),
                        })
                      }
                      className="absolute top-3 right-3 text-rose-500 hover:text-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <label className="block text-[10px] font-bold uppercase text-slate-500">
                      Card Title
                    </label>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => {
                        const copy = [...settings.features];
                        copy[idx].title = e.target.value;
                        setSettings({ ...settings, features: copy });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                    />

                    <label className="block text-[10px] font-bold uppercase text-slate-500">
                      Card Description
                    </label>
                    <textarea
                      rows={2}
                      value={feat.description}
                      onChange={(e) => {
                        const copy = [...settings.features];
                        copy[idx].description = e.target.value;
                        setSettings({ ...settings, features: copy });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#082F24]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STATS & ABOUT US */}
      {activeTab === "stats" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-heading text-xl font-bold text-[#082F24]">
              Company Metrics Counter & "About Us" Narrative
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Social proof facts and company history shown on the homepage and footer.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Brand Story / About Us Content
            </label>
            <textarea
              rows={4}
              value={settings.aboutText}
              onChange={(e) =>
                setSettings({ ...settings, aboutText: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#082F24]"
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-heading text-base font-bold text-[#082F24] mb-3">
              KPI Metrics Counters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {settings.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 space-y-2"
                >
                  <label className="block text-[10px] font-bold uppercase text-slate-500">
                    Stat Label
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const copy = [...settings.stats];
                      copy[idx].label = e.target.value;
                      setSettings({ ...settings, stats: copy });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />

                  <label className="block text-[10px] font-bold uppercase text-slate-500">
                    Value (e.g. 14,500+)
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const copy = [...settings.stats];
                      copy[idx].value = e.target.value;
                      setSettings({ ...settings, stats: copy });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#082F24] bg-white"
                  />

                  <label className="block text-[10px] font-bold uppercase text-slate-500">
                    Subtext
                  </label>
                  <input
                    type="text"
                    value={stat.description}
                    onChange={(e) => {
                      const copy = [...settings.stats];
                      copy[idx].description = e.target.value;
                      setSettings({ ...settings, stats: copy });
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TESTIMONIALS MANAGER */}
      {activeTab === "testimonials" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-[#082F24]">
                Customer Testimonials & Verified Reviews
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Add, toggle publishing, and manage guest experiences displayed in the review carousel.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTestimonialModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#082F24] text-[#dfbd75] hover:bg-[#0c4031] hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Guest Review</span>
            </button>
          </div>

          {/* Testimonial Form Modal / Card */}
          {showTestimonialModal && (
            <form
              onSubmit={handleCreateTestimonial}
              className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#c5a059]/40 space-y-4"
            >
              <h3 className="font-heading text-base font-bold text-[#082F24]">
                Add New Traveller Testimonial
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Customer Name(s) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTestimonial.customerName}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        customerName: e.target.value,
                      })
                    }
                    placeholder="e.g. Vikramaditya & Radhika Singhania"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Trip / Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTestimonial.tripDestination}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        tripDestination: e.target.value,
                      })
                    }
                    placeholder="e.g. Kashmir Celestial Serenade"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Rating (Stars)
                  </label>
                  <select
                    value={newTestimonial.rating}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        rating: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="5">5 Stars (Flawless)</option>
                    <option value="4">4 Stars (Excellent)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Customer Avatar / Photo URL
                  </label>
                  <input
                    type="url"
                    value={newTestimonial.customerPhoto}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        customerPhoto: e.target.value,
                      })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Review Text *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newTestimonial.reviewText}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        reviewText: e.target.value,
                      })
                    }
                    placeholder="Write the guest feedback..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-[#082F24] text-[#dfbd75] hover:bg-[#0c4031] px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Save Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowTestimonialModal(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Testimonial List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-[#FAF8F5] border border-slate-200/80 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 text-[#c5a059] fill-[#c5a059]"
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleTestimonial(t)}
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        t.isPublished
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-slate-200 text-slate-600 border-slate-300"
                      }`}
                    >
                      {t.isPublished ? "Published" : "Hidden"}
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{t.reviewText}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <div className="flex items-center gap-2.5">
                    {t.customerPhoto ? (
                      <img
                        src={t.customerPhoto}
                        alt={t.customerName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#082F24] text-[#dfbd75] flex items-center justify-center font-bold text-xs">
                        {t.customerName[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {t.customerName}
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        {t.tripDestination}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteTestimonial(t.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FAQS MANAGER */}
      {activeTab === "faqs" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-[#082F24]">
                Frequently Asked Questions (FAQs)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage accordion questions shown on the public homepage.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowFaqModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#082F24] text-[#dfbd75] hover:bg-[#0c4031] hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ Question</span>
            </button>
          </div>

          {showFaqModal && (
            <form
              onSubmit={handleCreateFaq}
              className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#c5a059]/40 space-y-4"
            >
              <h3 className="font-heading text-base font-bold text-[#082F24]">
                Create New FAQ Entry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Question *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFaq.question}
                    onChange={(e) =>
                      setNewFaq({ ...newFaq, question: e.target.value })
                    }
                    placeholder="e.g. Can we customize dates and hotel room categories?"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newFaq.category}
                    onChange={(e) =>
                      setNewFaq({ ...newFaq, category: e.target.value })
                    }
                    placeholder="Customization / Payments"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Answer *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newFaq.answer}
                    onChange={(e) =>
                      setNewFaq({ ...newFaq, answer: e.target.value })
                    }
                    placeholder="Provide clear, transparent guidelines..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-[#082F24] text-[#dfbd75] hover:bg-[#0c4031] px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Save Question
                </button>
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="p-5 rounded-2xl bg-[#FAF8F5] border border-slate-200 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {faq.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {faq.question}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {faq.answer}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded shrink-0"
                  title="Delete Question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CONTACT & INVOICING SETTINGS */}
      {activeTab === "contact" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-heading text-xl font-bold text-[#082F24]">
              Contact Details, GST & Bank Invoicing Information
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Used across the public website footer, quotation PDFs, and Razorpay receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Official Company Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) =>
                  setSettings({ ...settings, companyName: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Concierge Telephone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                WhatsApp Hotline Number
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) =>
                  setSettings({ ...settings, whatsappNumber: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Concierge Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                GST Registration Number
              </label>
              <input
                type="text"
                value={settings.gstNumber}
                onChange={(e) =>
                  setSettings({ ...settings, gstNumber: e.target.value })
                }
                placeholder="29AABCU9603R1ZX"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Corporate Office Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
              />
            </div>
          </div>

          {/* Bank / UPI Invoicing Details */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-heading text-base font-bold text-[#082F24] mb-3">
              Official Bank / UPI Remittance Details (For Guest Quotations)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={settings.bankDetails.bankName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bankDetails: {
                        ...settings.bankDetails,
                        bankName: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Beneficiary Account Name
                </label>
                <input
                  type="text"
                  value={settings.bankDetails.accountName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bankDetails: {
                        ...settings.bankDetails,
                        accountName: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={settings.bankDetails.accountNumber}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bankDetails: {
                        ...settings.bankDetails,
                        accountNumber: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={settings.bankDetails.ifsc}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bankDetails: {
                        ...settings.bankDetails,
                        ifsc: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Official Merchant UPI ID
                </label>
                <input
                  type="text"
                  value={settings.bankDetails.upiId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      bankDetails: {
                        ...settings.bankDetails,
                        upiId: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

