"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Save,
  Download,
  Copy,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  MapPin,
  MessageSquare,
  Loader2,
  Building,
  SlidersHorizontal,
  Printer,
  Eye,
  EyeOff,
  ShieldCheck,
  X,
  ExternalLink,
  CreditCard,
  Link2,
  Check,
  User,
} from "lucide-react";
import {
  MobileQuotationDossier,
  QuotationContentData,
} from "@/components/quotation/MobileQuotationDossier";
import { ImagePickerModal } from "@/components/admin/ImagePickerModal";
import { generateMobilePdf, printVectorMobileDossier } from "@/lib/pdfGenerator";

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
  const [masterCountries, setMasterCountries] = useState<any[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  // Registered Customer Profile State
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [loadingCustomers, setLoadingCustomers] = useState<boolean>(false);

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

  // Payment Link State
  const [showPaymentLinkModal, setShowPaymentLinkModal] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<"ADVANCE" | "FULL" | "CUSTOM">("ADVANCE");
  const [paymentAmountDue, setPaymentAmountDue] = useState<number | null>(null);
  const [customPaymentAmount, setCustomPaymentAmount] = useState<string>("");
  const [paymentNote, setPaymentNote] = useState<string>("");
  const [paymentLinkActive, setPaymentLinkActive] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<string>("UNPAID");
  const [generatingPaymentLink, setGeneratingPaymentLink] = useState(false);
  const [copiedPaymentLink, setCopiedPaymentLink] = useState(false);

  // Section Visibility Panel State
  const [showVisibilityPanel, setShowVisibilityPanel] = useState(false);

  // Granular Inclusions & Exclusions Inputs
  const [newInclusionInput, setNewInclusionInput] = useState("");
  const [saveInclusionToMaster, setSaveInclusionToMaster] = useState(false);
  const [newExclusionInput, setNewExclusionInput] = useState("");
  const [saveExclusionToMaster, setSaveExclusionToMaster] = useState(false);

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
      totalCostFormatted: "INR 77,500 for 2 Travellers",
      paxCount: 2,
    },
    sectionSettings: {
      showMapIntro: true,
      showCostBreakdown: true,
      showStaySummary: true,
      showQuickSummary: true,
      showMomentsThatMatter: true,
      showInclusionsExclusions: true,
      showPaymentPolicy: true,
      showReviews: true,
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

  // Load Packages, Presets, Leads and existing Quotation
  useEffect(() => {
    loadPackages();
    loadPresetsAndLeads();
    loadCustomers();
    if (initialQuotationId) {
      loadQuotation(initialQuotationId);
    } else {
      loadTemplateBySlug("singapore-explorer-3n4d");
    }
  }, [initialQuotationId]);

  const loadCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (data.success && data.customers) {
        setCustomers(data.customers);
      }
    } catch (e) {
      console.error("Failed to load customers:", e);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    if (!id) return;
    const c = customers.find((cust) => cust.id === id);
    if (c) {
      setCustomerName(c.name || "");
      setCustomerPhone(c.phone || "");
      setCustomerEmail(c.email || "");
      setCustomerCity(c.city || "");
      showToast(`Linked customer profile: ${c.name}`);
    }
  };

  const loadPresetsAndLeads = async () => {
    try {
      const [presetsRes, leadsRes] = await Promise.all([
        fetch("/api/admin/presets"),
        fetch("/api/admin/inquiries?limit=50"),
      ]);
      const presetsData = await presetsRes.json();
      if (presetsData.success && presetsData.countries) {
        setMasterCountries(presetsData.countries);
        if (presetsData.countries.length > 0 && !selectedCountryId) {
          const first = presetsData.countries[0];
          setSelectedCountryId(first.id);
          applyCountryData(first);
        }
      }
      const leadsData = await leadsRes.json();
      if (leadsData.success && leadsData.inquiries) {
        setLeads(leadsData.inquiries);
      }
    } catch (e) {
      console.error("Failed to load presets or leads:", e);
    }
  };

  const applyCountryData = (c: any) => {
    setContent((prev) => {
      const updated = { ...prev };
      updated.summary = { ...prev.summary, destination: c.name };
      updated.title = `${c.name} Explorer`;
      if (c.overview) updated.mapIntro = c.overview;
      if (c.bannerImage) updated.heroImage = c.bannerImage;
      if (c.inclusions && c.inclusions.length > 0) updated.inclusions = [...c.inclusions];
      if (c.exclusions && c.exclusions.length > 0) updated.exclusions = [...c.exclusions];
      if (c.paymentTerms && c.paymentTerms.length > 0) updated.paymentPolicy = [...c.paymentTerms];
      return updated;
    });
  };

  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    const c = masterCountries.find((item) => item.id === countryId);
    if (!c) return;
    applyCountryData(c);
    showToast(`Switched active preset country to ${c.name}`);
  };

  const handleSelectLead = (inquiryId: string) => {
    setSelectedLeadId(inquiryId);
    if (!inquiryId) return;
    const lead = leads.find((l) => l.id === inquiryId);
    if (!lead) return;
    setCustomerName(lead.name || "");
    setCustomerPhone(lead.phone || lead.whatsappNumber || "");
    setCustomerEmail(lead.email || "");
    if (lead.destination) {
      const matched = masterCountries.find(
        (c) =>
          c.name.toLowerCase().includes(lead.destination.toLowerCase()) ||
          lead.destination.toLowerCase().includes(c.name.toLowerCase())
      );
      if (matched) {
        handleCountryChange(matched.id);
      }
    }
    showToast(`Loaded details for lead: ${lead.name}`);
  };

  const activeCountry = masterCountries.find((c) => c.id === selectedCountryId);

  const handleAddPresetPlaceToDay = (dayIndex: number, placeId: string) => {
    if (!activeCountry) return;
    const place = activeCountry.places.find((p: any) => p.id === placeId);
    if (!place) return;
    setContent((prev) => {
      const updated = [...prev.days];
      updated[dayIndex].places.push({
        title: place.name,
        subtitle: place.locationSubtitle || activeCountry.name,
        category: place.category,
        photos: place.photos || [],
        description: place.description,
      });
      return { ...prev, days: updated };
    });
    showToast(`Added ${place.name} to Day ${dayIndex + 1}`);
  };

  const handleSetPresetHotelForDay = (dayIndex: number, hotelId: string) => {
    if (!activeCountry) return;
    const hotel = activeCountry.hotels.find((h: any) => h.id === hotelId);
    if (!hotel) return;
    setContent((prev) => {
      const updated = [...prev.days];
      updated[dayIndex].hotel = {
        name: hotel.name,
        roomType: hotel.roomCategory || "Deluxe Room",
        rating: hotel.starRating || 4.5,
        photo: (hotel.photos && hotel.photos[0]) || "",
        description: hotel.description || "Luxury accommodation with modern amenities and daily breakfast.",
      };
      return { ...prev, days: updated };
    });
    showToast(`Set ${hotel.name} for Day ${dayIndex + 1}`);
  };

  const loadPackages = async () => {
    try {
      const res = await fetch("/api/packages");
      const data = await res.json();
      if (data.packages) {
        setPackages(data.packages);
      }
    } catch (e) {
      console.error("Failed to load packages:", e);
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
        setQuotationNumber(q.quotationNumber || "QT-DRAFT");
        setShareSlug(q.shareSlug || "");
        setStatus(q.status);
        if (q.customerId || q.customer?.id) {
          setSelectedCustomerId(q.customerId || q.customer?.id);
        }
        setCustomerName(q.customer?.name || q.customerName || "");
        setCustomerPhone(q.customer?.phone || q.customerPhone || "");
        setCustomerEmail(q.customer?.email || q.customerEmail || "");
        setCustomerCity(q.customer?.city || "");
        setPaymentStatus(q.paymentStatus || "UNPAID");
        if (q.paymentPlan === "FULL" || q.paymentPlan === "full_payment") {
          setPaymentPlan("FULL");
        } else if (q.paymentPlan === "CUSTOM" || q.paymentPlan === "custom") {
          setPaymentPlan("CUSTOM");
        } else {
          setPaymentPlan("ADVANCE");
        }
        setPaymentAmountDue(q.paymentAmountDue ?? null);
        setPaymentNote(q.paymentNote || "");
        setPaymentLinkActive(!!q.paymentLinkActive);
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

  const loadTemplateBySlug = (slug: string) => {
    setSelectedTemplate(slug);
    if (slug === "singapore-explorer-3n4d") {
      setContent((prev) => ({
        ...prev,
        title: "Singapore Explorer",
        subtitle: "Curated 3 Nights / 4 Days Itinerary Plan",
        heroImage:
          "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
        summary: {
          duration: "3 Nights, 4 Days",
          destination: "Singapore",
          pricePerPersonFormatted: "INR 38,750 per person",
          pricePerPerson: 38750,
          totalCostFormatted: "INR 77,500 for 2 Travellers",
          paxCount: 2,
        },
        days: [
          {
            dayNumber: 1,
            dayTitle: "Arrival in Singapore & Gardens by the Bay",
            places: [
              {
                title: "Airport Transfer",
                subtitle: "Changi Airport, Singapore",
                category: "TRANSFER",
                photos: [
                  "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=600&q=80",
                ],
                description:
                  "Meet and greet at Singapore Changi Airport. Transfer comfortably in an air-conditioned coach to your city hotel. Check-in and relax before your evening excursion.",
              },
              {
                title: "Gardens by the Bay",
                subtitle: "18 Marina Gardens Dr, Singapore",
                category: "ATTRACTION",
                photos: [
                  "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=600&q=80",
                ],
                description:
                  "The Gardens by the Bay is a nature park spanning 101 hectares in the Central Region of Singapore. Walk beneath the majestic illuminated Supertrees that tower up to 50 meters into the twilight sky.",
              },
              {
                title: "Cloud Forest",
                subtitle: "18 Marina Gardens Dr, Singapore",
                category: "ATTRACTION",
                photos: [
                  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
                ],
                description:
                  "A mist-filled conservatory showcasing one of the world's tallest indoor waterfalls. Discover exotic plants from tropical highlands and an unforgettable aerial treetop walkway.",
              },
            ],
            hotel: {
              name: "Hotel Boss Singapore / Similar 4-Star",
              roomType: "Superior City View Room",
              rating: 4.5,
              photo:
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
              description:
                "Modern amenities, swimming pool, and central connectivity in Jalan Sultan.",
            },
          },
          {
            dayNumber: 2,
            dayTitle: "Universal Studios Singapore Full Day Adventure",
            places: [
              {
                title: "Universal Studios Singapore",
                subtitle: "8 Sentosa Gateway, Sentosa Island",
                category: "ATTRACTION",
                photos: [
                  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
                ],
                description:
                  "Universal Studios Singapore is a theme park located within Resorts World Sentosa. It features 28 rides, shows, and attractions in seven themed zones including Sci-Fi City, Ancient Egypt, and Far Far Away.",
              },
              {
                title: "Jurassic Park Rapids Adventure",
                subtitle: "Sentosa Island, Singapore",
                category: "ATTRACTION",
                photos: [
                  "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80",
                ],
                description:
                  "Encounter life-sized roaring dinosaurs in an unforgettable interactive walkthrough experience that delights wonderers of all ages.",
              },
            ],
            hotel: {
              name: "Hotel Boss Singapore / Similar 4-Star",
              roomType: "Superior City View Room",
              rating: 4.5,
              photo:
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
              description: "Centrally located with city skyline vistas.",
            },
          },
          {
            dayNumber: 3,
            dayTitle: "Sentosa Cable Car, Madame Tussauds & Wings of Time",
            places: [
              {
                title: "Mount Faber Cable Car",
                subtitle: "109 Mount Faber Rd, Singapore",
                category: "ATTRACTION",
                photos: [
                  "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80",
                ],
                description:
                  "Panoramic 360-degree aerial views as you glide across the scenic harbour from Mount Faber to Sentosa Island.",
              },
              {
                title: "Madame Tussauds & Images of Singapore",
                subtitle: "40 Imbiah Rd, Sentosa, Singapore",
                category: "ATTRACTION",
                photos: [
                  "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
                ],
                description:
                  "Pose with world-famous celebrities, movie icons, sports legends, and take the historic Spirit of Singapore boat ride.",
              },
              {
                title: "Wings of Time Spectacular Night Show",
                subtitle: "Siloso Beach, Sentosa Island",
                category: "SHOW",
                photos: [
                  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
                ],
                description:
                  "An award-winning outdoor night spectacle set against the open sea, featuring dazzling water, laser, fire effects, and evocative music.",
              },
            ],
            hotel: {
              name: "Hotel Boss Singapore / Similar 4-Star",
              roomType: "Superior City View Room",
              rating: 4.5,
              photo:
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
              description: "Comfortable overnight stay with breakfast.",
            },
          },
          {
            dayNumber: 4,
            dayTitle: "Singapore City Tour, Merlion Park & Departure",
            places: [
              {
                title: "Half-Day Guided City Tour",
                subtitle: "Civic District & Merlion Park, Singapore",
                category: "ATTRACTION",
                photos: [
                  "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=600&q=80",
                ],
                description:
                  "Drive through the historic Civic District, Padang, Cricket Club, Historic Parliament House, and stop for memorable photographs at the iconic Merlion spouting water into the bay.",
              },
              {
                title: "Private Airport Departure Transfer",
                subtitle: "Hotel to Changi Airport",
                category: "TRANSFER",
                photos: [
                  "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=600&q=80",
                ],
                description:
                  "Driver will pick you up from your hotel lobby 3 hours prior to scheduled departure. Transfer safely to Singapore Changi Airport with sweet memories.",
              },
            ],
          },
        ],
        momentsThatMatter: [
          {
            caption: "Supertrees Light Symphony - Sensory Garden Evening",
            url:
              "https://images.unsplash.com/photo-1506351421178-63b52a2d2562?auto=format&fit=crop&w=600&q=80",
          },
          {
            caption: "Sentosa Golden Hour - Cable Car Vista Over Horizon",
            url:
              "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80",
          },
          {
            caption: "Resorts World Adrenaline - Thrilling Rides & Coasters",
            url:
              "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80",
          },
          {
            caption: "Wings of Time Fireworks - Pyrotechnic Spectacle Over Sea",
            url:
              "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
          },
        ],
        inclusions: [
          "03 Nights accommodation at Hotel Boss Singapore or similar 4-Star",
          "Daily international breakfast buffet at hotel restaurant",
          "Meet & Greet assistance upon arrival at Singapore Changi Airport",
          "Return airport transfers on private air-conditioned coach basis",
          "Universal Studios Singapore 1-Day Pass with all rides & shows",
          "Gardens by the Bay Double Conservatories (Flower Dome & Cloud Forest)",
          "Singapore Cable Car Sky Pass (Mount Faber & Sentosa Line)",
          "Madame Tussauds 4-in-1 Combo (Spirit of Singapore Boat Ride included)",
          "Wings of Time Night Show standard sea-view seating",
          "Half-Day Singapore guided city orientation tour & Merlion Park",
          "24x7 TripMaster dedicated WhatsApp Concierge & Local Ground Support",
          "All state taxes, tourism service fees, and GST included",
        ],
        exclusions: [
          "International flight tickets & airport transit taxes",
          "Singapore Tourist eVisa processing fees",
          "Travel Insurance (available as recommended add-on at INR 1,200)",
          "Lunch and Dinner meals unless specifically stated as included",
          "Personal expenses like laundry, minibar, excess baggage, and tips",
          "Early check-in and late checkout charges at hotel",
          "Surcharges applicable during Singapore F1 Grand Prix or Peak Holidays",
        ],
        paymentPolicy: [
          "Booking Confirmation: 30% advance deposit to lock hotel & attraction tickets",
          "Pre-Departure Balance: 70% payable 15 days prior to arrival",
          "Zero cancellation fee up to 21 days before travel date",
          "Instant Razorpay UPI, Net Banking, and Credit Card payment links generated",
          "Official GST invoice with tax credit delivered on final settlement",
        ],
        reviews: [
          {
            customerName: "Rohan & Sneha Kapoor",
            tripDestination: "Singapore Explorer (Oct 2024)",
            rating: 5,
            reviewText:
              "The Singapore trip planned by TripMaster was 10/10 flawless! Universal Studios tickets, cable car, and airport transfers were spot-on. Zero waiting anywhere.",
          },
          {
            customerName: "Dr. Anirudh Sen & Family",
            tripDestination: "Singapore Holiday (Dec 2024)",
            rating: 5,
            reviewText:
              "The mobile itinerary was so convenient to show our drivers and guides in Singapore. Hotel Boss was clean and central. Excellent pricing!",
          },
        ],
      }));
      showToast("Loaded Singapore Explorer Reference Plan!");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Image Picker Logic
  const handleOpenPicker = (target: {
    type: "hero" | "staySummary" | "placePhoto" | "hotelPhoto" | "moment";
    dayIndex?: number;
    placeIndex?: number;
    photoIndex?: number;
    momentIndex?: number;
  }) => {
    setPickerTarget(target);
    setPickerOpen(true);
  };

  const handleImageSelected = (url: string) => {
    if (!pickerTarget) return;

    setContent((prev) => {
      const updated = { ...prev };
      if (pickerTarget.type === "hero") {
        updated.heroImage = url;
      } else if (pickerTarget.type === "staySummary") {
        updated.staySummary = { ...updated.staySummary, photo: url };
      } else if (
        pickerTarget.type === "placePhoto" &&
        pickerTarget.dayIndex !== undefined &&
        pickerTarget.placeIndex !== undefined
      ) {
        const d = [...updated.days];
        const p = d[pickerTarget.dayIndex].places[pickerTarget.placeIndex];
        if (pickerTarget.photoIndex !== undefined) {
          p.photos[pickerTarget.photoIndex] = url;
        } else {
          p.photos.push(url);
        }
        updated.days = d;
      } else if (
        pickerTarget.type === "hotelPhoto" &&
        pickerTarget.dayIndex !== undefined
      ) {
        const d = [...updated.days];
        if (d[pickerTarget.dayIndex].hotel) {
          d[pickerTarget.dayIndex].hotel!.photo = url;
        }
        updated.days = d;
      } else if (
        pickerTarget.type === "moment" &&
        pickerTarget.momentIndex !== undefined
      ) {
        const m = [...updated.momentsThatMatter];
        m[pickerTarget.momentIndex].url = url;
        updated.momentsThatMatter = m;
      }
      return updated;
    });

    setPickerOpen(false);
    setPickerTarget(null);
    showToast("Image updated from TripMaster Gallery!");
  };

  // Section Visibility Toggles
  const toggleSection = (sectionKey: keyof NonNullable<QuotationContentData["sectionSettings"]>) => {
    setContent((prev) => {
      const current = prev.sectionSettings || {
        showInclusionsExclusions: true,
        showMapIntro: true,
        showCostBreakdown: true,
        showStaySummary: true,
        showQuickSummary: true,
        showMomentsThatMatter: true,
        showPaymentPolicy: true,
        showReviews: true,
      };
      return {
        ...prev,
        sectionSettings: {
          ...current,
          [sectionKey]: current[sectionKey] === false ? true : false,
        },
      };
    });
  };

  // Granular Inclusions & Exclusions Handlers
  const handleAddInclusion = async () => {
    if (!newInclusionInput.trim()) return;
    const item = newInclusionInput.trim();
    const updatedInclusions = [...content.inclusions, item];
    setContent((prev) => ({ ...prev, inclusions: updatedInclusions }));
    setNewInclusionInput("");

    if (saveInclusionToMaster && selectedCountryId) {
      try {
        const country = masterCountries.find((c) => c.id === selectedCountryId);
        const existing = country?.inclusions || [];
        const merged = Array.from(new Set([...existing, item]));
        await fetch("/api/admin/presets", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ countryId: selectedCountryId, inclusions: merged }),
        });
        setMasterCountries((prev) =>
          prev.map((c) => (c.id === selectedCountryId ? { ...c, inclusions: merged } : c))
        );
        showToast("Inclusion added & saved to Master Country Preset!");
      } catch (e) {
        console.error("Failed saving to master country:", e);
      }
    } else {
      showToast("Inclusion added to quotation.");
    }
  };

  const handleRemoveInclusion = (index: number) => {
    setContent((prev) => {
      const updated = [...prev.inclusions];
      updated.splice(index, 1);
      return { ...prev, inclusions: updated };
    });
  };

  const handleAddExclusion = async () => {
    if (!newExclusionInput.trim()) return;
    const item = newExclusionInput.trim();
    const updatedExclusions = [...content.exclusions, item];
    setContent((prev) => ({ ...prev, exclusions: updatedExclusions }));
    setNewExclusionInput("");

    if (saveExclusionToMaster && selectedCountryId) {
      try {
        const country = masterCountries.find((c) => c.id === selectedCountryId);
        const existing = country?.exclusions || [];
        const merged = Array.from(new Set([...existing, item]));
        await fetch("/api/admin/presets", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ countryId: selectedCountryId, exclusions: merged }),
        });
        setMasterCountries((prev) =>
          prev.map((c) => (c.id === selectedCountryId ? { ...c, exclusions: merged } : c))
        );
        showToast("Exclusion added & saved to Master Country Preset!");
      } catch (e) {
        console.error("Failed saving to master country:", e);
      }
    } else {
      showToast("Exclusion added to quotation.");
    }
  };

  const handleRemoveExclusion = (index: number) => {
    setContent((prev) => {
      const updated = [...prev.exclusions];
      updated.splice(index, 1);
      return { ...prev, exclusions: updated };
    });
  };

  // Day Management
  const handleAddDay = () => {
    setContent((prev) => {
      const newDayNum = prev.days.length + 1;
      return {
        ...prev,
        days: [
          ...prev.days,
          {
            dayNumber: newDayNum,
            dayTitle: `Day ${newDayNum} Exploration`,
            places: [],
          },
        ],
      };
    });
  };

  const handleRemoveDay = (dayIndex: number) => {
    setContent((prev) => {
      const updated = [...prev.days];
      updated.splice(dayIndex, 1);
      const renumbered = updated.map((d, idx) => ({
        ...d,
        dayNumber: idx + 1,
      }));
      return { ...prev, days: renumbered };
    });
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
        paymentStatus,
        paymentPlan,
        paymentAmountDue:
          paymentAmountDue !== null
            ? Number(paymentAmountDue)
            : Math.round(
                Number(content.summary.pricePerPerson * (content.summary.paxCount || 2)) * 0.3
              ),
        paymentNote,
        paymentLinkActive,
        customerId: selectedCustomerId || undefined,
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
      showToast(`Quotation ${data.quotation.quotationNumber} saved successfully!`);
    } catch (e: any) {
      alert(`Error saving quotation: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  // 1-Click Mobile PDF Download (Retina 3.5x Lossless)
  const handleDownloadPdf = async () => {
    if (!dossierRef.current) return;
    try {
      setDownloadingPdf(true);
      const fileName = `${content.title.replace(/[^a-zA-Z0-9]/g, "_")}_Mobile_Plan_${quotationNumber}.pdf`;
      const res = await generateMobilePdf(dossierRef.current, {
        fileName,
        scale: 3.5,
      });

      if (!res.success) {
        throw new Error(res.error || "Could not generate PDF");
      }
      showToast("Retina Mobile PDF downloaded successfully!");
    } catch (e: any) {
      alert(`PDF Error: ${e.message || "Failed to generate PDF"}`);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Vector Print (True Vector Fonts, 0 Blur)
  const handlePrintVectorPdf = () => {
    if (!dossierRef.current) return;
    printVectorMobileDossier(
      dossierRef.current,
      `${content.title} - ${quotationNumber}`
    );
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

  // Open Payment Link Modal (auto-saves draft if not saved yet)
  const handleOpenPaymentLinkModal = async () => {
    if (!quotationId) {
      showToast("Saving quotation first to activate payment link...");
      await handleSaveQuotation();
    }
    const totalAmount =
      Number(content.summary.pricePerPerson || 0) * Number(content.summary.paxCount || 2);
    if (!paymentAmountDue) {
      setPaymentAmountDue(Math.round(totalAmount * 0.3));
    }
    setShowPaymentLinkModal(true);
  };

  // Save / Update Payment Link via API
  const handleSavePaymentLink = async () => {
    try {
      setGeneratingPaymentLink(true);
      let targetId = quotationId;
      if (!targetId) {
        // Auto-save quotation first
        const totalAmount =
          Number(content.summary.pricePerPerson || 0) * Number(content.summary.paxCount || 2);
        const payload = {
          title: content.title,
          destination: content.summary.destination,
          durationDays: parseInt(content.summary.duration.split(",")[1]?.trim()) || 4,
          durationNights: parseInt(content.summary.duration.split(",")[0]?.trim()) || 3,
          pricePerPerson: content.summary.pricePerPerson,
          totalAmount,
          travelDate: travelDate || null,
          paxCount: content.summary.paxCount || 2,
          status,
          content,
          paymentStatus,
          paymentPlan,
          paymentAmountDue:
            paymentAmountDue !== null ? Number(paymentAmountDue) : Math.round(totalAmount * 0.3),
          paymentNote,
          paymentLinkActive: true,
          customerId: selectedCustomerId || undefined,
          customerData: {
            name: customerName,
            phone: customerPhone,
            email: customerEmail,
            city: customerCity,
          },
        };
        const res = await fetch("/api/admin/quotations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to save quotation");
        setQuotationId(data.quotation.id);
        setQuotationNumber(data.quotation.quotationNumber);
        setShareSlug(data.quotation.shareSlug);
        setPaymentLinkActive(true);
        showToast("Razorpay client payment link activated & plan saved!");
        setShowPaymentLinkModal(false);
        return;
      }

      const res = await fetch(`/api/admin/quotations/${targetId}/payment-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentPlan,
          paymentAmountDue: Number(paymentAmountDue),
          paymentNote,
          paymentLinkActive: true,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update payment link");
      }
      setPaymentLinkActive(true);
      showToast("Razorpay client payment link activated successfully!");
      setShowPaymentLinkModal(false);
    } catch (e: any) {
      alert(`Error updating payment link: ${e.message}`);
    } finally {
      setGeneratingPaymentLink(false);
    }
  };

  // WhatsApp Payment Link Share
  const handleSharePaymentWhatsApp = () => {
    const clientPhone = customerPhone.replace(/[^0-9]/g, "");
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const paymentUrl = `${base}/pay/quote/${shareSlug || quotationNumber}`;
    const totalAmount =
      Number(content.summary.pricePerPerson || 0) * Number(content.summary.paxCount || 2);
    const amountDue =
      paymentAmountDue !== null && paymentAmountDue !== undefined
        ? Number(paymentAmountDue)
        : Math.round(totalAmount * 0.3);
    const remaining = Math.max(0, totalAmount - amountDue);

    const text = `Hello ${customerName || "there"}, here is your secure Trip Master payment link for *${content.title}*:\n\n*Amount Due Today:* ₹${amountDue.toLocaleString("en-IN")}\n*Total Trip Value:* ₹${totalAmount.toLocaleString("en-IN")}\n*Remaining Balance:* ₹${remaining.toLocaleString("en-IN")}\n\n*Secure Payment Link:*\n${paymentUrl}\n\nYou can complete this settlement seamlessly via UPI, Credit/Debit Cards, or Net Banking with instant reservation confirmation.`;

    const waUrl = clientPhone
      ? `https://wa.me/${clientPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(waUrl, "_blank");
  };

  // Copy Direct Payment Link
  const handleCopyPaymentLink = () => {
    const paymentUrl = `${window.location.origin}/pay/quote/${shareSlug || quotationNumber}`;
    navigator.clipboard.writeText(paymentUrl);
    showToast("Direct Razorpay payment link copied to clipboard!");
  };

  const secSettings = content.sectionSettings || {
    showInclusionsExclusions: true,
    showMapIntro: true,
    showCostBreakdown: true,
    showStaySummary: true,
    showQuickSummary: true,
    showMomentsThatMatter: true,
    showPaymentPolicy: true,
    showReviews: true,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-sky-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Studio Action Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Title & Quick Template Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-heading font-bold text-sm shadow-xs">
            QT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-base text-slate-900">
                Instant Mobile Quotation & Plan Builder
              </h2>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                {quotationNumber}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              430px continuous mobile dossier layout • exact reference replica
            </p>
          </div>
        </div>

        {/* Center: Pre-Defined Package Quick-Load */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-500 pl-1.5">
            Load Template:
          </span>
          <select
            value={selectedTemplate}
            onChange={(e) => loadTemplateBySlug(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:outline-hidden focus:border-blue-600"
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
          {/* Razorpay Payment Link Generator */}
          <button
            onClick={handleOpenPaymentLinkModal}
            className={`px-3 py-2 text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 shadow-xs border ${
              paymentStatus === "PAID"
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                : paymentStatus === "PARTIALLY_PAID"
                ? "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                : paymentLinkActive
                ? "bg-sky-50 text-blue-700 border-blue-300 hover:bg-blue-100"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
            title="Create or Share Razorpay Payment Link with Quotation Details"
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>Payment Link</span>
            {paymentStatus === "PAID" ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            ) : paymentLinkActive ? (
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            ) : null}
          </button>

          {/* Section Visibility Drawer Button */}
          <button
            onClick={() => setShowVisibilityPanel(!showVisibilityPanel)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
              showVisibilityPanel
                ? "bg-sky-50 text-blue-700 border-sky-300"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
            title="Configure Visible Sections"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Sections</span>
          </button>

          {/* Vector Print (True Vector Fonts, 0 Blur) */}
          <button
            onClick={handlePrintVectorPdf}
            className="px-3 py-2 text-xs font-heading font-bold uppercase tracking-wider bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            title="Print or Save as True Vector PDF with crisp vector text"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">Vector Print</span>
          </button>

          {/* Download Mobile PDF (Retina 3.5x Lossless) */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="px-3.5 py-2 text-xs font-heading font-bold uppercase tracking-wider bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {downloadingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Retina PDF</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-3 py-2 text-xs font-heading font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="p-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            title="Copy Shareable Link"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleSaveQuotation}
            disabled={saving}
            className="px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
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

      {/* Section Visibility Drawer Panel */}
      {showVisibilityPanel && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h4 className="font-heading font-bold text-sm text-slate-900">
                  Quotation Settings & Section Visibility
                </h4>
                <span className="text-[11px] text-slate-500">
                  Toggle sections on or off for this client dossier
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowVisibilityPanel(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 active:scale-95 flex items-center justify-center transition-[background-color,transform,color] duration-150 cursor-pointer"
                aria-label="Close visibility settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4 text-xs">
              {[
                { key: "showMapIntro", label: "Map & Route Stops" },
                { key: "showCostBreakdown", label: "Cost Breakdown" },
                { key: "showStaySummary", label: "Stay Summary" },
                { key: "showQuickSummary", label: "Day-Wise Quick Summary" },
                { key: "showMomentsThatMatter", label: "Moments That Matter" },
                { key: "showInclusionsExclusions", label: "Inclusions & Exclusions" },
                { key: "showPaymentPolicy", label: "Payment Policy" },
                { key: "showReviews", label: "Client Reviews" },
              ].map(({ key, label }) => {
                const isVisible = secSettings[key as keyof typeof secSettings] !== false;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSection(key as any)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
                      isVisible
                        ? "bg-sky-50/70 border-sky-200 text-sky-900"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <span className="font-medium truncate">{label}</span>
                    {isVisible ? (
                      <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Studio Workspace: Split Screen Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =====================================================================
            LEFT COLUMN (7 cols): STRUCTURED FORM BUILDER
            ===================================================================== */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Client & Trip Information */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>1. Client & Trip Basics</span>
              </h3>

              <div className="flex flex-wrap items-center gap-2">
                {/* Registered Customer Profile Selector */}
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[11px] text-slate-500 font-medium">Customer:</span>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleSelectCustomer(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-hidden focus:border-emerald-600 max-w-[190px] sm:max-w-[220px] truncate"
                  >
                    <option value="">-- Registered Customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.phone ? `(${c.phone})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lead Autofill Selector */}
                {leads.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 font-medium">Lead:</span>
                    <select
                      value={selectedLeadId}
                      onChange={(e) => handleSelectLead(e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-hidden focus:border-blue-600 max-w-[150px] truncate"
                    >
                      <option value="">-- Choose Lead --</option>
                      {leads.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name} ({l.destination || "General"})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Linked Customer Profile Pill */}
            {selectedCustomerId && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
                <div className="flex items-center gap-2 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Linked to Registered Profile: <strong className="font-semibold">{customerName}</strong>
                  </span>
                </div>
                <a
                  href={`/admin/customers/${selectedCustomerId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1"
                >
                  <span>View Customer Ledger</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Master Country Preset Selector */}
            {masterCountries.length > 0 && (
              <div className="bg-sky-50/60 p-3 rounded-xl border border-sky-200">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-sky-950 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Master Country & Destination Preset:</span>
                </label>
                <select
                  value={selectedCountryId}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full text-xs bg-white border border-sky-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-semibold focus:outline-hidden focus:border-blue-600"
                >
                  {masterCountries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.places?.length || 0} Places, {c.hotels?.length || 0} Hotels, {c.transfers?.length || 0} Transfers)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Customer / Client Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Jainam Mehta"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. jainam@example.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Travel Start Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-medium mb-1">
                  Quotation Title
                </label>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) =>
                    setContent((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-heading font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 font-heading font-bold tabular-nums focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            {/* Prominent, Large, and Clean Payment Link & Settlement Control Panel */}
            {(() => {
              const totalTripCost =
                Number(content.summary.pricePerPerson || 0) *
                Number(content.summary.paxCount || 2);
              const activeAmountDue =
                paymentAmountDue !== null && paymentAmountDue !== undefined
                  ? Number(paymentAmountDue)
                  : Math.round(totalTripCost * 0.3);
              const remainingBalanceDue = Math.max(0, totalTripCost - activeAmountDue);

              return (
                <div className="bg-gradient-to-br from-emerald-50/90 via-sky-50/40 to-white border-2 border-emerald-600/30 rounded-2xl p-4.5 sm:p-5 shadow-xs space-y-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-slate-900 tracking-tight">
                          Payment Link & Client Settlement Portal
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Direct Razorpay client portal with live verification, ledger updates, and tax receipts
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          paymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : paymentStatus === "PARTIALLY_PAID"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : paymentLinkActive
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {paymentStatus === "PAID"
                          ? "100% Paid"
                          : paymentStatus === "PARTIALLY_PAID"
                          ? "Advance Paid"
                          : paymentLinkActive
                          ? "✓ Link Active"
                          : "Link Pending Activation"}
                      </span>
                    </div>
                  </div>

                  {/* Advance vs Full vs Custom Plan Selector */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Settlement Structure & Amount Due
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentPlan("ADVANCE");
                          setPaymentAmountDue(Math.round(totalTripCost * 0.3));
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          paymentPlan === "ADVANCE"
                            ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-xs uppercase tracking-wider">
                            30% Advance Token
                          </span>
                          {paymentPlan === "ADVANCE" && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span
                          className={`font-heading font-bold text-sm block mt-1 tabular-nums ${
                            paymentPlan === "ADVANCE" ? "text-emerald-100" : "text-slate-900"
                          }`}
                        >
                          ₹{Math.round(totalTripCost * 0.3).toLocaleString("en-IN")}
                        </span>
                        <span
                          className={`text-[10px] block mt-0.5 ${
                            paymentPlan === "ADVANCE" ? "text-emerald-200" : "text-slate-400"
                          }`}
                        >
                          Booking token to block hotel & flights
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentPlan("FULL");
                          setPaymentAmountDue(totalTripCost);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          paymentPlan === "FULL"
                            ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-xs uppercase tracking-wider">
                            100% Full Payment
                          </span>
                          {paymentPlan === "FULL" && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span
                          className={`font-heading font-bold text-sm block mt-1 tabular-nums ${
                            paymentPlan === "FULL" ? "text-emerald-100" : "text-slate-900"
                          }`}
                        >
                          ₹{totalTripCost.toLocaleString("en-IN")}
                        </span>
                        <span
                          className={`text-[10px] block mt-0.5 ${
                            paymentPlan === "FULL" ? "text-emerald-200" : "text-slate-400"
                          }`}
                        >
                          Complete journey settlement
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentPlan("CUSTOM");
                          if (paymentAmountDue === null)
                            setPaymentAmountDue(Math.round(totalTripCost * 0.5));
                        }}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          paymentPlan === "CUSTOM"
                            ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-xs uppercase tracking-wider">
                            Custom Amount
                          </span>
                          {paymentPlan === "CUSTOM" && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span
                          className={`font-heading font-bold text-sm block mt-1 tabular-nums ${
                            paymentPlan === "CUSTOM" ? "text-emerald-100" : "text-slate-900"
                          }`}
                        >
                          ₹{Number(paymentAmountDue || 0).toLocaleString("en-IN")}
                        </span>
                        <span
                          className={`text-[10px] block mt-0.5 ${
                            paymentPlan === "CUSTOM" ? "text-emerald-200" : "text-slate-400"
                          }`}
                        >
                          Flexible client due figure
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Custom Amount Input & Quick Test */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-8">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Amount Due for Client (INR ₹)
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentPlan("CUSTOM");
                            setPaymentAmountDue(1);
                          }}
                          className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-md border border-amber-300 transition-colors"
                        >
                          ⚡ Set ₹1 Live Test
                        </button>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={paymentAmountDue ?? ""}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPaymentAmountDue(val);
                            if (paymentPlan !== "CUSTOM") setPaymentPlan("CUSTOM");
                          }}
                          placeholder="Enter amount due"
                          className="w-full pl-8 pr-3 py-2.5 text-sm font-heading font-bold border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-hidden focus:border-emerald-600 tabular-nums shadow-xs"
                        />
                      </div>
                    </div>

                    {/* Auto Calculated Balance Due Tile */}
                    <div className="sm:col-span-4 p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Remaining Balance
                      </span>
                      <span
                        className={`font-heading font-bold text-sm tabular-nums mt-0.5 ${
                          remainingBalanceDue > 0 ? "text-amber-700" : "text-emerald-700"
                        }`}
                      >
                        ₹{remainingBalanceDue.toLocaleString("en-IN")}
                        {remainingBalanceDue === 0 && (
                          <span className="text-[10px] ml-1 text-emerald-600 font-sans font-medium">
                            (Settled)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Payment Notes Input */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Payment Instructions & Notes for Client
                    </label>
                    <input
                      type="text"
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      placeholder="e.g. Non-refundable advance token required to block current flight fare and 4-star hotel inventory."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white text-slate-800 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* Action Toolbar: WhatsApp, Copy, Test, Activate */}
                  <div className="p-3 bg-white rounded-xl border border-emerald-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Live Payment Portal Link
                      </span>
                      <span className="text-[10px] text-emerald-700 font-mono font-medium truncate max-w-[280px]">
                        /pay/quote/{shareSlug || quotationNumber}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Direct WhatsApp Share Button */}
                      <button
                        type="button"
                        onClick={handleSharePaymentWhatsApp}
                        className="flex-1 min-w-[160px] py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
                        title="Send Payment Link via WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send via WhatsApp</span>
                      </button>

                      {/* 1-Click Copy Link Button */}
                      <button
                        type="button"
                        onClick={handleCopyPaymentLink}
                        className="py-2 px-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
                        title="Copy Payment Link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </button>

                      {/* Test Payment Portal in New Tab */}
                      <a
                        href={`/pay/quote/${shareSlug || quotationNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                        title="Open Live Payment Portal"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                        <span>Open Portal</span>
                      </a>

                      {/* Save & Activate Link Button */}
                      <button
                        type="button"
                        onClick={handleSavePaymentLink}
                        disabled={generatingPaymentLink}
                        className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs ml-auto"
                        title="Save & Activate Link"
                      >
                        {generatingPaymentLink ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>{paymentLinkActive ? "Update Link" : "Activate Link"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Hero Image Changer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={content.heroImage}
                  alt="Hero"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.includes("1598091383021")) {
                      target.src =
                        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80";
                    }
                  }}
                  className="w-14 h-10 rounded-lg object-cover border border-slate-200"
                />
                <span className="text-xs text-slate-600">
                  Current Hero Banner Image
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPicker({ type: "hero" })}
                className="px-3 py-1.5 text-xs font-heading font-bold uppercase tracking-wider text-blue-600 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Change Image</span>
              </button>
            </div>
          </div>

          {/* Section 2: Detailed Day-by-Day & Place-by-Place Builder */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>2. Itinerary Days & Places Library</span>
              </h3>
              <span className="text-xs text-slate-400">
                {content.days.length} Days Configured
              </span>
            </div>

            {/* Days Loop */}
            <div className="space-y-4">
              {content.days.map((day, dIdx) => (
                <div
                  key={dIdx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-heading font-bold text-xs shrink-0">
                        Day {day.dayNumber}
                      </span>
                      <input
                        type="text"
                        value={day.dayTitle}
                        onChange={(e) => {
                          const val = e.target.value;
                          setContent((prev) => {
                            const updated = [...prev.days];
                            updated[dIdx].dayTitle = val;
                            return { ...prev, days: updated };
                          });
                        }}
                        className="text-xs font-heading font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg w-full max-w-md focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(dIdx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove Day"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add Place Picker Controls */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {/* Add Preset Place from active country */}
                    {activeCountry && activeCountry.places && activeCountry.places.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddPresetPlaceToDay(dIdx, e.target.value);
                            e.target.value = "";
                          }
                        }}
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-medium focus:outline-hidden focus:border-blue-600"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          + Add Place from {activeCountry.name} Preset...
                        </option>
                        {activeCountry.places.map((p: any) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.category})
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Add Hotel from active country */}
                    {activeCountry && activeCountry.hotels && activeCountry.hotels.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleSetPresetHotelForDay(dIdx, e.target.value);
                            e.target.value = "";
                          }
                        }}
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-medium focus:outline-hidden focus:border-blue-600"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          + Set Overnight Hotel ({activeCountry.name})...
                        </option>
                        {activeCountry.hotels.map((h: any) => (
                          <option key={h.id} value={h.id}>
                            {h.name} ({h.roomCategory || "Hotel"})
                          </option>
                        ))}
                      </select>
                    )}

                    <button
                      type="button"
                      onClick={() => handleAddCustomPlace(dIdx)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-blue-600" />
                      <span>Custom Place</span>
                    </button>
                  </div>

                  {/* Places in this Day */}
                  <div className="space-y-2.5 pt-1">
                    {day.places.map((place, pIdx) => (
                      <div
                        key={pIdx}
                        className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 text-xs"
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
                            className="font-heading font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-600 px-1 py-0.5 w-full focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePlace(dIdx, pIdx)}
                            className="text-slate-400 hover:text-rose-600 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
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
                            placeholder="Location / Subtitle"
                            className="text-[11px] px-2 py-1 border border-slate-200 rounded-lg text-slate-700"
                          />

                          <select
                            value={place.category}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              setContent((prev) => {
                                const updated = [...prev.days];
                                updated[dIdx].places[pIdx].category = val;
                                return { ...prev, days: updated };
                              });
                            }}
                            className="text-[11px] px-2 py-1 border border-slate-200 rounded-lg text-slate-700 bg-white"
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
                              className="relative w-14 h-10 rounded-lg overflow-hidden border border-slate-200 cursor-pointer group"
                            >
                              <img
                                src={photoUrl}
                                alt="place"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  if (!target.src.includes("1598091383021")) {
                                    target.src =
                                      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80";
                                  }
                                }}
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
                            className="text-[10px] font-medium text-blue-600 hover:underline"
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
                          className="w-full text-xs p-2 border border-slate-200 rounded-lg text-slate-800"
                        />
                      </div>
                    ))}
                  </div>

                  {/* End of Day Hotel Card */}
                  {day.hotel && (
                    <div className="border border-sky-200 bg-white p-3 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-sky-950">
                        <span className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-blue-600" />
                          <span>End of Day Hotel Stay Card</span>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenPicker({
                              type: "hotelPhoto",
                              dayIndex: dIdx,
                            })
                          }
                          className="text-[10px] font-medium text-blue-600 hover:underline"
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
                          className="px-2 py-1 border border-slate-200 rounded-lg text-slate-900 font-bold"
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
                          className="px-2 py-1 border border-slate-200 rounded-lg text-slate-700"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddDay}
              className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-sky-50/50 text-xs font-heading font-bold uppercase tracking-wider text-slate-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Day {content.days.length + 1}</span>
            </button>
          </div>

          {/* Section 3: Granular Inclusions & Exclusions Line Editor */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>3. Inclusions & Exclusions (Granular Line Editor)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              {/* Inclusions Column */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Inclusions ({content.inclusions.length})</span>
                  </span>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {content.inclusions.map((inc, iIdx) => (
                    <div key={iIdx} className="flex items-center gap-1.5 group">
                      <span className="text-emerald-600 font-bold text-xs shrink-0">✓</span>
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
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(iIdx)}
                        className="text-slate-300 hover:text-rose-600 p-1 shrink-0 transition-colors"
                        title="Delete inclusion"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Inclusion Row */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add custom inclusion line..."
                      value={newInclusionInput}
                      onChange={(e) => setNewInclusionInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddInclusion()}
                      className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddInclusion}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                  {selectedCountryId && (
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveInclusionToMaster}
                        onChange={(e) => setSaveInclusionToMaster(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600"
                      />
                      <span>Also save to Master Country Preset ({activeCountry?.name})</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Exclusions Column */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Exclusions ({content.exclusions.length})</span>
                  </span>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {content.exclusions.map((exc, eIdx) => (
                    <div key={eIdx} className="flex items-center gap-1.5 group">
                      <span className="text-rose-600 font-bold text-xs shrink-0">✕</span>
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
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExclusion(eIdx)}
                        className="text-slate-300 hover:text-rose-600 p-1 shrink-0 transition-colors"
                        title="Delete exclusion"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Exclusion Row */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add custom exclusion line..."
                      value={newExclusionInput}
                      onChange={(e) => setNewExclusionInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddExclusion()}
                      className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddExclusion}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                  {selectedCountryId && (
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveExclusionToMaster}
                        onChange={(e) => setSaveExclusionToMaster(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600"
                      />
                      <span>Also save to Master Country Preset ({activeCountry?.name})</span>
                    </label>
                  )}
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
          <div className="w-full max-w-[430px] flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 rounded-t-2xl text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-heading font-bold uppercase tracking-wider text-[11px] text-slate-200">
                Live 430px Mobile Preview
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(65, z - 10))}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-slate-300"
              >
                -
              </button>
              <span className="font-mono text-[11px] text-slate-400">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(100, z + 10))}
                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-slate-300"
              >
                +
              </button>
            </div>
          </div>

          {/* Scaled Phone Frame Container */}
          <div
            className="w-full max-w-[430px] overflow-hidden bg-slate-950 p-2 rounded-b-2xl shadow-2xl border-x-4 border-b-4 border-slate-900 flex justify-center"
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
              onClick={handlePrintVectorPdf}
              className="py-2.5 px-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
              title="Vector Print Dialog"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Vector Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              {downloadingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Retina PDF (3.5x)</span>
            </button>

            {shareSlug && (
              <a
                href={`/quote/${shareSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-white border border-slate-200 text-slate-800 hover:text-black text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Razorpay Client Payment Link Modal */}
      {showPaymentLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#F8FAFC]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-slate-900 text-sm">
                    Generate Client Payment Link
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Dedicated Razorpay portal displaying full quotation details & transparent breakdown
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentLinkModal(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 active:scale-95 flex items-center justify-center transition-[background-color,transform,color] duration-150 cursor-pointer"
                aria-label="Close payment modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Client & Quotation Snapshot */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Client & Quotation
                  </span>
                  <span className="font-heading font-bold text-slate-900 text-xs block mt-0.5">
                    {customerName || "Valued Client"} ({customerPhone || "No Phone"})
                  </span>
                  <span className="text-[11px] text-slate-600">
                    {content.title} • {content.summary.duration}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Total Quotation Value
                  </span>
                  <span className="font-heading font-bold text-slate-900 text-sm tabular-nums">
                    ₹{((content.summary.pricePerPerson || 0) * (content.summary.paxCount || 2)).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    for {content.summary.paxCount || 2} Travellers
                  </span>
                </div>
              </div>

              {/* Payment Plan Options */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  Choose Payment Structure:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentPlan("ADVANCE");
                      const total = (content.summary.pricePerPerson || 0) * (content.summary.paxCount || 2);
                      setPaymentAmountDue(Math.round(total * 0.3));
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentPlan === "ADVANCE"
                        ? "bg-sky-50/80 border-blue-500 text-blue-900 ring-2 ring-blue-500/20"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-heading font-bold block text-xs">30% Advance Token</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 tabular-nums">
                      ₹{Math.round(((content.summary.pricePerPerson || 0) * (content.summary.paxCount || 2)) * 0.3).toLocaleString("en-IN")}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-1 block">To lock flights & stay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentPlan("FULL");
                      const total = (content.summary.pricePerPerson || 0) * (content.summary.paxCount || 2);
                      setPaymentAmountDue(total);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentPlan === "FULL"
                        ? "bg-sky-50/80 border-blue-500 text-blue-900 ring-2 ring-blue-500/20"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-heading font-bold block text-xs">100% Full Payment</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 tabular-nums">
                      ₹{((content.summary.pricePerPerson || 0) * (content.summary.paxCount || 2)).toLocaleString("en-IN")}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-1 block">Complete trip settlement</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentPlan("CUSTOM")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentPlan === "CUSTOM"
                        ? "bg-sky-50/80 border-blue-500 text-blue-900 ring-2 ring-blue-500/20"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-heading font-bold block text-xs">Custom Amount</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Flexible ₹ Due</span>
                    <span className="text-[9px] text-slate-400 mt-1 block">Enter custom figure</span>
                  </button>
                </div>
              </div>

              {/* Exact Amount Due Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-700 font-medium">
                    Amount Due for Client (INR ₹)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentPlan("CUSTOM");
                      setPaymentAmountDue(1);
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
                  >
                    ⚡ Set ₹1 Live Test
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={paymentAmountDue || ""}
                    onChange={(e) => setPaymentAmountDue(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl font-heading font-bold text-slate-900 tabular-nums focus:outline-hidden focus:border-blue-600 text-sm"
                    placeholder="Enter amount due"
                  />
                </div>
              </div>

              {/* Client Note / Terms */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Payment Note / Instructions for Client
                </label>
                <textarea
                  rows={2}
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="e.g. Non-refundable advance token required to block current flight fare and 4-star hotel inventory."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {/* Live Link & Quick Share Tools */}
              <div className="p-3 bg-sky-50/60 border border-sky-200 rounded-2xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-blue-950 block tracking-wider">
                  Client Direct Payment Link
                </span>
                <div className="flex items-center gap-1.5 bg-white border border-sky-300 rounded-xl px-2.5 py-1.5 text-[11px] font-mono text-slate-700">
                  <span className="truncate flex-1">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/pay/quote/${shareSlug || quotationNumber}`
                      : `/pay/quote/${shareSlug || quotationNumber}`}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPaymentLink}
                    className="p-1 hover:text-blue-600 transition-colors"
                    title="Copy Link"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleSharePaymentWhatsApp}
                    className="p-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                    title="WhatsApp Client"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={`/pay/quote/${shareSlug || quotationNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-slate-500 hover:text-slate-800 transition-colors"
                    title="Open Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPaymentLinkModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSharePaymentWhatsApp}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Link</span>
                </button>

                <button
                  type="button"
                  onClick={handleSavePaymentLink}
                  disabled={generatingPaymentLink}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  {generatingPaymentLink ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Save & Activate Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
