"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  PlusCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  ChevronRight,
  Sparkles,
  UserCheck,
  X,
  CheckCircle2,
} from "lucide-react";

export interface CustomerDirectoryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsappNumber: string | null;
  city: string | null;
  notes: string | null;
  createdAt: string;
  totalInquiries: number;
  totalBookings: number;
  confirmedBookingsCount: number;
  lifetimeSpend: number;
  documentCount: number;
  lastInteraction: string;
}

export function CustomerDirectory() {
  const [customers, setCustomers] = useState<CustomerDirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    whatsappNumber: "",
    email: "",
    city: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create profile");
      }

      showToast("Customer profile created successfully!");
      setShowAddModal(false);
      setForm({
        name: "",
        phone: "",
        whatsappNumber: "",
        email: "",
        city: "",
        notes: "",
      });
      fetchCustomers();
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert("Error creating customer");
    } finally {
      setSubmitting(false);
    }
  };

  const totalLifetimeSpend = customers.reduce((sum, c) => sum + (c.lifetimeSpend || 0), 0);
  const customersWithBookings = customers.filter((c) => c.totalBookings > 0).length;
  const activeInquirers = customers.filter((c) => c.totalInquiries > 0).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 bg-slate-900 text-white border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* 1. Standardized Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          {/* Breadcrumb Tag / Module Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold uppercase tracking-wider mb-1.5 border border-blue-100">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Master Guest Directory</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Unified Customer Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Single 360° view of every traveller with lifetime spend, booking history, and attached documents vault.
          </p>
        </div>

        {/* Top-Right Action Button */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>+ New Customer Profile</span>
          </button>
        </div>
      </div>

      {/* 2. TOP KPI SUMMARY STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
            Total Profiles
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {customers.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Registered guests & leads</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-blue-600 block">
            Active Leads
          </span>
          <div className="text-2xl font-bold text-blue-700 mt-1 font-mono tabular-nums">
            {activeInquirers}
          </div>
          <span className="text-[11px] text-blue-600/80 mt-0.5 block">Logged travel inquiries</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-700 block">
            Confirmed Travellers
          </span>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono tabular-nums">
            {customersWithBookings}
          </div>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">Guests with booked trips</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-700 block">
            Lifetime Realized Spend
          </span>
          <div className="text-2xl font-bold text-emerald-700 mt-1 font-mono tabular-nums">
            ₹{totalLifetimeSpend.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">Aggregated guest transactions</span>
        </div>
      </div>

      {/* 3. Search Toolbar */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-xs flex items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, email, or city..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
          />
        </form>

        <span className="text-[11px] font-mono tabular-nums text-slate-500 hidden sm:block">
          Total Records: {customers.length}
        </span>
      </div>

      {/* 4. Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            Loading customer profiles...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <p>No customer records found.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                fetchCustomers();
              }}
              className="text-xs font-semibold text-slate-900 underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-50/95 backdrop-blur z-10 text-[11px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Customer Profile</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4 text-center">Inquiries</th>
                  <th className="py-3 px-4 text-center">Bookings</th>
                  <th className="py-3 px-4 text-right">Lifetime Spend</th>
                  <th className="py-3 px-4 text-right">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Name & Contact */}
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="font-semibold text-slate-900 hover:text-emerald-700 transition-colors block text-xs"
                      >
                        {c.name}
                      </Link>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 font-mono tabular-nums">
                        <span>{c.phone}</span>
                        <span>•</span>
                        <span className="font-sans">{c.email}</span>
                      </div>
                    </td>

                    {/* City */}
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {c.city ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{c.city}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Inquiries */}
                    <td className="py-3 px-4 text-center">
                      <span className="bg-slate-100 text-slate-700 font-mono tabular-nums px-2 py-0.5 rounded text-[11px]">
                        {c.totalInquiries}
                      </span>
                    </td>

                    {/* Bookings */}
                    <td className="py-3 px-4 text-center">
                      <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono tabular-nums px-2 py-0.5 rounded text-[11px]">
                        {c.totalBookings}
                      </span>
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-3 px-4 text-right">
                      <div className="font-semibold text-slate-900 font-mono tabular-nums">
                        ₹{c.lifetimeSpend.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                        {c.documentCount} docs
                      </div>
                    </td>

                    {/* Last Activity */}
                    <td className="py-3 px-4 text-right text-slate-500 font-mono tabular-nums text-[11px]">
                      {new Date(c.lastInteraction).toLocaleDateString("en-IN")}
                    </td>

                    {/* Action link */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${c.phone.replace(
                            /\D/g,
                            ""
                          )}?text=Hello%20${encodeURIComponent(
                            c.name
                          )},%20this%20is%20Trip%20Master%20Concierge.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors"
                          title="WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          href={`/admin/customers/${c.id}`}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 text-[11px] font-medium transition-colors"
                          title="Open 360° Profile"
                        >
                          <span>Profile</span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: ADD CUSTOMER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Create Customer Profile
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct master CRM contact entry.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Vikramaditya Singhania"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                      whatsappNumber: e.target.value,
                    })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono tabular-nums focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="guest@domain.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. Mumbai / New Delhi"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  General Preferences / VIP Notes
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Prefers heritage palace suites, private SUV transfers..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#0C1116] text-white hover:bg-slate-800 px-4 py-2 rounded-lg text-xs font-medium disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
