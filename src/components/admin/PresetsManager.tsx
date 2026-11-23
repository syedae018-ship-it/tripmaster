"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Building2,
  Car,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Star,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Layers,
  ArrowRight,
  Globe2,
  CheckCircle2,
  XCircle,
  FileText,
  Save,
  RotateCcw,
} from "lucide-react";
import { ImagePickerModal } from "@/components/admin/ImagePickerModal";

interface MasterPlace {
  id: string;
  name: string;
  locationSubtitle: string | null;
  description: string;
  durationDay: number;
  category: string;
  photos: string[];
}

interface MasterHotel {
  id: string;
  name: string;
  placeName: string | null;
  starRating: number;
  roomCategory: string;
  description: string;
  mealPlans: string[];
  photos: string[];
}

interface MasterTransfer {
  id: string;
  title: string;
  vehicleType: string;
  description: string;
  photo: string | null;
}

interface MasterCountry {
  id: string;
  name: string;
  slug: string;
  bannerImage: string;
  overview: string | null;
  inclusions?: string[];
  exclusions?: string[];
  paymentTerms?: string[];
  places: MasterPlace[];
  hotels: MasterHotel[];
  transfers: MasterTransfer[];
}

export function PresetsManager() {
  const [countries, setCountries] = useState<MasterCountry[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"places" | "hotels" | "transfers" | "terms">("places");
  const [loading, setLoading] = useState(true);

  // Inclusions & Exclusions local state for editing
  const [editInclusions, setEditInclusions] = useState<string[]>([]);
  const [editExclusions, setEditExclusions] = useState<string[]>([]);
  const [editTerms, setEditTerms] = useState<string[]>([]);
  const [newInclusionText, setNewInclusionText] = useState("");
  const [newExclusionText, setNewExclusionText] = useState("");
  const [newTermText, setNewTermText] = useState("");
  const [savingTerms, setSavingTerms] = useState(false);
  const [termsSavedToast, setTermsSavedToast] = useState(false);

  // Modals state
  const [isAddCountryOpen, setIsAddCountryOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<string>("");

  // Country form
  const [newCountryName, setNewCountryName] = useState("");
  const [newCountryBanner, setNewCountryBanner] = useState("");
  const [newCountryOverview, setNewCountryOverview] = useState("");

  // Place form
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceSubtitle, setNewPlaceSubtitle] = useState("");
  const [newPlaceDesc, setNewPlaceDesc] = useState("");
  const [newPlaceCategory, setNewPlaceCategory] = useState("ATTRACTION");
  const [newPlaceDay, setNewPlaceDay] = useState(1);
  const [newPlacePhotos, setNewPlacePhotos] = useState<string[]>([]);

  // Hotel form
  const [newHotelName, setNewHotelName] = useState("");
  const [newHotelPlace, setNewHotelPlace] = useState("");
  const [newHotelStars, setNewHotelStars] = useState(4.5);
  const [newHotelRoom, setNewHotelRoom] = useState("Deluxe Room");
  const [newHotelMeals, setNewHotelMeals] = useState("Buffet Breakfast Included");
  const [newHotelDesc, setNewHotelDesc] = useState("");
  const [newHotelPhotos, setNewHotelPhotos] = useState<string[]>([]);

  // Transfer form
  const [newTransferTitle, setNewTransferTitle] = useState("");
  const [newTransferVehicle, setNewTransferVehicle] = useState("Private AC Coach");
  const [newTransferDesc, setNewTransferDesc] = useState("");
  const [newTransferPhoto, setNewTransferPhoto] = useState("");

  const [saving, setSaving] = useState(false);

  // Fetch presets
  const fetchPresets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/presets");
      const data = await res.json();
      if (data.success && data.countries) {
        setCountries(data.countries);
        if (data.countries.length > 0) {
          const targetId = selectedCountryId || data.countries[0].id;
          setSelectedCountryId(targetId);
          const c = data.countries.find((item: MasterCountry) => item.id === targetId) || data.countries[0];
          setEditInclusions(c.inclusions || []);
          setEditExclusions(c.exclusions || []);
          setEditTerms(c.paymentTerms || []);
        }
      }
    } catch (err) {
      console.error("Failed to load presets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresets();
  }, []);

  const activeCountry = countries.find((c) => c.id === selectedCountryId) || countries[0];

  useEffect(() => {
    if (activeCountry) {
      setEditInclusions(activeCountry.inclusions || []);
      setEditExclusions(activeCountry.exclusions || []);
      setEditTerms(activeCountry.paymentTerms || []);
    }
  }, [selectedCountryId]);

  // Save new country
  const handleCreateCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountryName || !newCountryBanner) {
      alert("Please provide country name and a banner image");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/admin/presets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCountryName,
          bannerImage: newCountryBanner,
          overview: newCountryOverview,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddCountryOpen(false);
        setNewCountryName("");
        setNewCountryBanner("");
        setNewCountryOverview("");
        await fetchPresets();
        if (data.country?.id) {
          setSelectedCountryId(data.country.id);
        }
      } else {
        alert(data.error || "Failed to create country");
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    } finally {
      setSaving(false);
    }
  };

  // Save updated inclusions & policies
  const handleSaveTermsAndInclusions = async () => {
    if (!activeCountry) return;
    try {
      setSavingTerms(true);
      const res = await fetch("/api/admin/presets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeCountry.id,
          inclusions: editInclusions,
          exclusions: editExclusions,
          paymentTerms: editTerms,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTermsSavedToast(true);
        setTimeout(() => setTermsSavedToast(false), 3000);
        await fetchPresets();
      } else {
        alert(data.error || "Failed to update inclusions & terms");
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    } finally {
      setSavingTerms(false);
    }
  };

  // Save preset item (Place, Hotel, Transfer)
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCountry) return;

    try {
      setSaving(true);
      let payload: any = { countryId: activeCountry.id };

      if (activeTab === "places") {
        if (!newPlaceName) return alert("Place name is required");
        payload = {
          ...payload,
          type: "PLACE",
          name: newPlaceName,
          locationSubtitle: newPlaceSubtitle,
          description: newPlaceDesc,
          category: newPlaceCategory,
          durationDay: Number(newPlaceDay) || 1,
          photos: newPlacePhotos,
        };
      } else if (activeTab === "hotels") {
        if (!newHotelName) return alert("Hotel name is required");
        payload = {
          ...payload,
          type: "HOTEL",
          name: newHotelName,
          placeName: newHotelPlace,
          starRating: Number(newHotelStars) || 4,
          roomCategory: newHotelRoom,
          mealPlans: newHotelMeals ? [newHotelMeals] : ["Breakfast Included"],
          description: newHotelDesc,
          photos: newHotelPhotos,
        };
      } else if (activeTab === "transfers") {
        if (!newTransferTitle) return alert("Transfer title is required");
        payload = {
          ...payload,
          type: "TRANSFER",
          title: newTransferTitle,
          vehicleType: newTransferVehicle,
          description: newTransferDesc,
          photo: newTransferPhoto,
        };
      }

      const res = await fetch("/api/admin/presets/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddItemOpen(false);
        setNewPlaceName("");
        setNewPlaceSubtitle("");
        setNewPlaceDesc("");
        setNewPlacePhotos([]);
        setNewHotelName("");
        setNewHotelPlace("");
        setNewHotelPhotos([]);
        setNewTransferTitle("");
        setNewTransferDesc("");
        setNewTransferPhoto("");
        await fetchPresets();
      } else {
        alert(data.error || "Failed to add item");
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    } finally {
      setSaving(false);
    }
  };

  // Delete item
  const handleDeleteItem = async (type: string, id: string) => {
    if (!confirm("Are you sure you want to remove this preset?")) return;
    try {
      const res = await fetch(`/api/admin/presets/item?type=${type}&id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        await fetchPresets();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  };

  const handleImagePicked = (url: string) => {
    if (imagePickerTarget === "countryBanner") {
      setNewCountryBanner(url);
    } else if (imagePickerTarget === "placePhoto") {
      setNewPlacePhotos((prev) => [...prev, url]);
    } else if (imagePickerTarget === "hotelPhoto") {
      setNewHotelPhotos((prev) => [...prev, url]);
    } else if (imagePickerTarget === "transferPhoto") {
      setNewTransferPhoto(url);
    }
    setIsImagePickerOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700 mb-1">
            <Globe2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Master Presets & Component Vault</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">
            Destinations & Master Presets
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Configure countries, sightseeing blocks, luxury hotels, transfers, and default inclusions once. Assemble zero-typing client quotations in seconds.
          </p>
        </div>

        <button
          onClick={() => setIsAddCountryOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Country Preset</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          Loading master presets...
        </div>
      ) : countries.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <Globe2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-heading font-bold text-slate-800 text-sm">No Countries Configured Yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create your first destination preset like Singapore or Africa to unlock zero-typing quotation assembly.
          </p>
          <button
            onClick={() => setIsAddCountryOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
          >
            Add Destination
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Country Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {countries.map((country) => {
              const isSelected = country.id === activeCountry?.id;
              return (
                <button
                  key={country.id}
                  onClick={() => setSelectedCountryId(country.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-sky-50/60 hover:text-blue-700"
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-400"}`} />
                  <span>{country.name}</span>
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded font-mono tabular-nums ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {country.places.length + country.hotels.length + country.transfers.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Country Overview Card */}
          {activeCountry && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="relative h-40 w-full bg-slate-900">
                <img
                  src={activeCountry.bannerImage}
                  alt={activeCountry.name}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.src.includes("1598091383021")) {
                      target.src =
                        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80";
                    }
                  }}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between w-full gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
                        Preset Destination Hub
                      </span>
                      <h2 className="text-xl font-heading font-bold text-white tracking-tight">
                        {activeCountry.name}
                      </h2>
                      <p className="text-xs text-white/80 line-clamp-1 max-w-xl font-sans">
                        {activeCountry.overview || "Complete modular catalog of verified attractions, hotels, transfers, and inclusions."}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-[11px] font-sans">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        <span className="tabular-nums font-semibold">{activeCountry.places.length}</span> Places
                      </div>
                      <span className="text-white/30">•</span>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                        <span className="tabular-nums font-semibold">{activeCountry.hotels.length}</span> Hotels
                      </div>
                      <span className="text-white/30">•</span>
                      <div className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-sky-400" />
                        <span className="tabular-nums font-semibold">{activeCountry.transfers.length}</span> Transfers
                      </div>
                      <span className="text-white/30">•</span>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="tabular-nums font-semibold">{editInclusions.length}</span> Inclusions
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Tabs: Places / Hotels / Transfers / Terms */}
              <div className="border-b border-slate-200 bg-slate-50/70 px-5 flex items-center justify-between">
                <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setActiveTab("places")}
                    className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                      activeTab === "places"
                        ? "border-blue-600 text-blue-700"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Places & Sightseeing</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 tabular-nums">
                      {activeCountry.places.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("hotels")}
                    className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                      activeTab === "hotels"
                        ? "border-blue-600 text-blue-700"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Hotels & Accommodations</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 tabular-nums">
                      {activeCountry.hotels.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("transfers")}
                    className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                      activeTab === "transfers"
                        ? "border-blue-600 text-blue-700"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Taxis & Airport Transfers</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 tabular-nums">
                      {activeCountry.transfers.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("terms")}
                    className={`py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                      activeTab === "terms"
                        ? "border-blue-600 text-blue-700 font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Inclusions, Exclusions & Policies</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-sky-100 text-sky-800 font-mono tabular-nums">
                      {editInclusions.length + editExclusions.length}
                    </span>
                  </button>
                </div>

                {activeTab !== "terms" && (
                  <button
                    onClick={() => setIsAddItemOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-semibold hover:bg-sky-50/60 hover:text-blue-700 hover:border-sky-300 shadow-2xs flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      Add {activeTab === "places" ? "Place" : activeTab === "hotels" ? "Hotel" : "Transfer"}
                    </span>
                  </button>
                )}
              </div>

              {/* Sub-Tab Contents */}
              <div className="p-5">
                {/* 1. PLACES TAB */}
                {activeTab === "places" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeCountry.places.map((place) => (
                      <div
                        key={place.id}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-sky-300 transition-all shadow-2xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-40 bg-slate-100">
                            {place.photos && place.photos.length > 0 ? (
                              <img
                                src={place.photos[0]}
                                alt={place.name}
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  if (!target.src.includes("1598091383021")) {
                                    target.src =
                                      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80";
                                  }
                                }}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                No Photo
                              </div>
                            )}
                            <div className="absolute top-2 left-2 flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider text-white">
                                {place.category}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-blue-600/90 backdrop-blur-xs text-[10px] font-semibold text-white tabular-nums">
                                Day {place.durationDay}
                              </span>
                            </div>
                            {place.photos && place.photos.length > 1 && (
                              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] tabular-nums font-mono">
                                +{place.photos.length - 1} photos
                              </div>
                            )}
                          </div>

                          <div className="p-3.5">
                            <h4 className="font-heading font-bold text-sm text-slate-900 tracking-tight">
                              {place.name}
                            </h4>
                            {place.locationSubtitle && (
                              <p className="text-[11px] text-slate-500 font-sans flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{place.locationSubtitle}</span>
                              </p>
                            )}
                            <p className="text-xs text-slate-600 font-sans mt-2 line-clamp-2 leading-relaxed">
                              {place.description}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-sky-700 font-medium">Preset Ready</span>
                          <button
                            onClick={() => handleDeleteItem("PLACE", place.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                            title="Delete Place"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {activeCountry.places.length === 0 && (
                      <div className="col-span-full p-8 text-center text-slate-400 text-xs">
                        No preset places added yet. Click &quot;Add Place&quot; to populate.
                      </div>
                    )}
                  </div>
                )}

                {/* 2. HOTELS TAB */}
                {activeTab === "hotels" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeCountry.hotels.map((hotel) => (
                      <div
                        key={hotel.id}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-sky-300 transition-all shadow-2xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-40 bg-slate-100">
                            {hotel.photos && hotel.photos.length > 0 ? (
                              <img
                                src={hotel.photos[0]}
                                alt={hotel.name}
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  if (!target.src.includes("1566837945700")) {
                                    target.src =
                                      "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80";
                                  }
                                }}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                No Photo
                              </div>
                            )}
                            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[10px] font-bold text-sky-300">
                              <Star className="w-3 h-3 fill-sky-400 text-sky-400" />
                              <span className="tabular-nums">{hotel.starRating} Stars</span>
                            </div>
                          </div>

                          <div className="p-3.5">
                            <h4 className="font-heading font-bold text-sm text-slate-900 tracking-tight">
                              {hotel.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                              {hotel.placeName || activeCountry.name}
                            </p>
                            <div className="mt-2.5 inline-block px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-medium">
                              {hotel.roomCategory}
                            </div>
                            {hotel.mealPlans && hotel.mealPlans.length > 0 && (
                              <p className="text-[11px] text-slate-500 font-sans mt-1.5 flex items-center gap-1">
                                <Check className="w-3 h-3 text-blue-600 shrink-0" />
                                <span>{hotel.mealPlans.join(", ")}</span>
                              </p>
                            )}
                            {hotel.description && (
                              <p className="text-xs text-slate-600 font-sans mt-2 line-clamp-2 leading-relaxed">
                                {hotel.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-sky-700 font-medium">Preset Ready</span>
                          <button
                            onClick={() => handleDeleteItem("HOTEL", hotel.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                            title="Delete Hotel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {activeCountry.hotels.length === 0 && (
                      <div className="col-span-full p-8 text-center text-slate-400 text-xs">
                        No preset hotels added yet. Click &quot;Add Hotel&quot; to populate.
                      </div>
                    )}
                  </div>
                )}

                {/* 3. TRANSFERS TAB */}
                {activeTab === "transfers" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeCountry.transfers.map((transfer) => (
                      <div
                        key={transfer.id}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-sky-300 transition-all shadow-2xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-36 bg-slate-100">
                            {transfer.photo ? (
                              <img
                                src={transfer.photo}
                                alt={transfer.title}
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  if (!target.src.includes("1598091383021")) {
                                    target.src =
                                      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80";
                                  }
                                }}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                <Car className="w-8 h-8 text-slate-300" />
                              </div>
                            )}
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider">
                              {transfer.vehicleType}
                            </div>
                          </div>

                          <div className="p-3.5">
                            <h4 className="font-heading font-bold text-sm text-slate-900 tracking-tight">
                              {transfer.title}
                            </h4>
                            <p className="text-xs text-slate-600 font-sans mt-2 line-clamp-3 leading-relaxed">
                              {transfer.description}
                            </p>
                          </div>
                        </div>

                        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-sky-700 font-medium">Preset Ready</span>
                          <button
                            onClick={() => handleDeleteItem("TRANSFER", transfer.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                            title="Delete Transfer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {activeCountry.transfers.length === 0 && (
                      <div className="col-span-full p-8 text-center text-slate-400 text-xs">
                        No preset transfers added yet. Click &quot;Add Transfer&quot; to populate.
                      </div>
                    )}
                  </div>
                )}

                {/* 4. INCLUSIONS, EXCLUSIONS & POLICIES TAB */}
                {activeTab === "terms" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <h3 className="font-heading font-bold text-sm text-slate-900">
                          Default Inclusions, Exclusions & Policies for {activeCountry.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-sans mt-0.5">
                          These items automatically pre-populate client quotations whenever {activeCountry.name} is selected.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {termsSavedToast && (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Saved!
                          </span>
                        )}
                        <button
                          onClick={handleSaveTermsAndInclusions}
                          disabled={savingTerms}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{savingTerms ? "Saving..." : "Save Changes"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Master Inclusions Column */}
                      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Master Inclusions ({editInclusions.length})</span>
                          </span>
                        </div>

                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {editInclusions.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                              <span className="text-emerald-600 font-bold text-xs shrink-0">✓</span>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const updated = [...editInclusions];
                                  updated[idx] = e.target.value;
                                  setEditInclusions(updated);
                                }}
                                className="flex-1 text-xs text-slate-800 bg-transparent focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => setEditInclusions((prev) => prev.filter((_, i) => i !== idx))}
                                className="text-slate-400 hover:text-rose-600 p-0.5"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Inclusion Input */}
                        <div className="pt-2 flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Add inclusion..."
                            value={newInclusionText}
                            onChange={(e) => setNewInclusionText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && newInclusionText.trim()) {
                                setEditInclusions((prev) => [...prev, newInclusionText.trim()]);
                                setNewInclusionText("");
                              }
                            }}
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newInclusionText.trim()) {
                                setEditInclusions((prev) => [...prev, newInclusionText.trim()]);
                                setNewInclusionText("");
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Master Exclusions Column */}
                      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span>Master Exclusions ({editExclusions.length})</span>
                          </span>
                        </div>

                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {editExclusions.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                              <span className="text-rose-600 font-bold text-xs shrink-0">✕</span>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const updated = [...editExclusions];
                                  updated[idx] = e.target.value;
                                  setEditExclusions(updated);
                                }}
                                className="flex-1 text-xs text-slate-800 bg-transparent focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => setEditExclusions((prev) => prev.filter((_, i) => i !== idx))}
                                className="text-slate-400 hover:text-rose-600 p-0.5"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Exclusion Input */}
                        <div className="pt-2 flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Add exclusion..."
                            value={newExclusionText}
                            onChange={(e) => setNewExclusionText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && newExclusionText.trim()) {
                                setEditExclusions((prev) => [...prev, newExclusionText.trim()]);
                                setNewExclusionText("");
                              }
                            }}
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newExclusionText.trim()) {
                                setEditExclusions((prev) => [...prev, newExclusionText.trim()]);
                                setNewExclusionText("");
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-semibold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Payment Terms Column */}
                      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-sky-600" />
                            <span>Payment & Cancellation ({editTerms.length})</span>
                          </span>
                        </div>

                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {editTerms.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                              <span className="text-sky-600 font-bold text-xs shrink-0">•</span>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const updated = [...editTerms];
                                  updated[idx] = e.target.value;
                                  setEditTerms(updated);
                                }}
                                className="flex-1 text-xs text-slate-800 bg-transparent focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => setEditTerms((prev) => prev.filter((_, i) => i !== idx))}
                                className="text-slate-400 hover:text-rose-600 p-0.5"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Term Input */}
                        <div className="pt-2 flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Add policy term..."
                            value={newTermText}
                            onChange={(e) => setNewTermText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && newTermText.trim()) {
                                setEditTerms((prev) => [...prev, newTermText.trim()]);
                                setNewTermText("");
                              }
                            }}
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newTermText.trim()) {
                                setEditTerms((prev) => [...prev, newTermText.trim()]);
                                setNewTermText("");
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-sky-700 text-white text-xs font-semibold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD COUNTRY */}
      {isAddCountryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Add Destination Country
              </h3>
              <button
                onClick={() => setIsAddCountryOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCountry} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Country / Destination Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bali, Indonesia or Dubai, UAE"
                  value={newCountryName}
                  onChange={(e) => setNewCountryName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Banner Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newCountryBanner}
                    onChange={(e) => setNewCountryBanner(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePickerTarget("countryBanner");
                      setIsImagePickerOpen(true);
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 text-xs font-semibold shrink-0"
                  >
                    Vault
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Overview / Tagline
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Tropical paradise with lush jungles, serene beaches, and rich temples."
                  value={newCountryOverview}
                  onChange={(e) => setNewCountryOverview(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCountryOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Save Country"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRESET ITEM (PLACE, HOTEL, TRANSFER) */}
      {isAddItemOpen && activeCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Add New {activeTab === "places" ? "Place" : activeTab === "hotels" ? "Hotel" : "Transfer"} to {activeCountry.name}
              </h3>
              <button
                onClick={() => setIsAddItemOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="p-5 space-y-4 overflow-y-auto">
              {/* PLACE FIELDS */}
              {activeTab === "places" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Place Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Universal Studios Singapore"
                      value={newPlaceName}
                      onChange={(e) => setNewPlaceName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={newPlaceCategory}
                        onChange={(e) => setNewPlaceCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                      >
                        <option value="ATTRACTION">ATTRACTION</option>
                        <option value="TRANSFER">TRANSFER</option>
                        <option value="SHOW">SHOW</option>
                        <option value="SIGHTSEEING">SIGHTSEEING</option>
                        <option value="HOTEL">HOTEL</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Recommended Day
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={newPlaceDay}
                        onChange={(e) => setNewPlaceDay(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs tabular-nums"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Location Subtitle
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sentosa Island, Singapore"
                      value={newPlaceSubtitle}
                      onChange={(e) => setNewPlaceSubtitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Provide vivid descriptions for client itinerary..."
                      value={newPlaceDesc}
                      onChange={(e) => setNewPlaceDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Photos ({newPlacePhotos.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePickerTarget("placePhoto");
                          setIsImagePickerOpen(true);
                        }}
                        className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Select from Vault
                      </button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {newPlacePhotos.map((p, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-lg border shrink-0 overflow-hidden group">
                          <img src={p} alt="thumb" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNewPlacePhotos((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-0 right-0 bg-red-600 text-white text-[9px] p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {newPlacePhotos.length === 0 && (
                        <span className="text-[11px] text-slate-400">No photos added yet</span>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* HOTEL FIELDS */}
              {activeTab === "hotels" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hotel Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marina Bay Sands"
                      value={newHotelName}
                      onChange={(e) => setNewHotelName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Star Rating
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="5"
                        value={newHotelStars}
                        onChange={(e) => setNewHotelStars(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Room Category
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Deluxe City View"
                        value={newHotelRoom}
                        onChange={(e) => setNewHotelRoom(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Meal Plan & Inclusions
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Buffet Breakfast Included, Free High-Speed WiFi"
                      value={newHotelMeals}
                      onChange={(e) => setNewHotelMeals(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Hotel amenities, view, comfort details..."
                      value={newHotelDesc}
                      onChange={(e) => setNewHotelDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Photos ({newHotelPhotos.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePickerTarget("hotelPhoto");
                          setIsImagePickerOpen(true);
                        }}
                        className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Select from Vault
                      </button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {newHotelPhotos.map((p, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-lg border shrink-0 overflow-hidden group">
                          <img src={p} alt="thumb" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNewHotelPhotos((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-0 right-0 bg-red-600 text-white text-[9px] p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {newHotelPhotos.length === 0 && (
                        <span className="text-[11px] text-slate-400">No photos added yet</span>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* TRANSFER FIELDS */}
              {activeTab === "transfers" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Transfer Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Airport Meet & Greet Private Transfer"
                      value={newTransferTitle}
                      onChange={(e) => setNewTransferTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vehicle Type
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Luxury AC Van / Mercedes Coach"
                      value={newTransferVehicle}
                      onChange={(e) => setNewTransferVehicle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Chauffeur greeting, luggage assistance details..."
                      value={newTransferDesc}
                      onChange={(e) => setNewTransferDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Vehicle Photo
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePickerTarget("transferPhoto");
                          setIsImagePickerOpen(true);
                        }}
                        className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Select from Vault
                      </button>
                    </div>
                    {newTransferPhoto ? (
                      <div className="relative w-24 h-16 rounded-lg border overflow-hidden">
                        <img src={newTransferPhoto} alt="transfer" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewTransferPhoto("")}
                          className="absolute top-0 right-0 bg-red-600 text-white text-[9px] p-0.5"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">No vehicle photo selected</span>
                    )}
                  </div>
                </>
              )}

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Add to Presets"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REUSABLE IMAGE PICKER MODAL */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelectImage={handleImagePicked}
        destinationHint={activeCountry?.name || "ALL"}
        categoryHint={activeTab === "places" ? "PLACE" : activeTab === "hotels" ? "HOTEL" : "TRANSFER"}
      />
    </div>
  );
}
