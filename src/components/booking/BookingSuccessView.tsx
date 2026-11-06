"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Calendar,
  Users,
  CreditCard,
  Printer,
  Send,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  MapPin,
  Clock,
  Download,
  AlertCircle,
} from "lucide-react";

interface BookingDetail {
  id: string;
  bookingReference: string;
  travelStartDate: string;
  travelEndDate: string;
  paxCount: number;
  adultsCount: number;
  childrenCount: number;
  specialRequests: string | null;
  totalAmount: number;
  amountPaid: number;
  balanceAmount: number;
  bookingStatus: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string | null;
  };
  package: {
    id: string;
    title: string;
    slug: string;
    destination: string;
    durationDays: number;
    durationNights: number;
    featuredImage: string;
    inclusions: string[];
  };
  paymentTransactions: Array<{
    id: string;
    amount: number;
    paymentMethod: string;
    razorpayPaymentId: string | null;
    status: string;
    createdAt: string;
  }>;
  customerDocuments: Array<{
    id: string;
    title: string;
    type: string;
    fileUrl: string;
    fileSize: string | null;
  }>;
}

export function BookingSuccessView({ bookingRef }: { bookingRef: string }) {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/bookings/${bookingRef}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBooking(data.booking);
        } else {
          setError(data.error || "Booking not found");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to retrieve booking information");
      })
      .finally(() => setLoading(false));
  }, [bookingRef]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-24 flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-[#0D2C24] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-heading font-bold text-lg text-[#0D2C24]">
            Retrieving Confirmed Reservation Ledger...
          </p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-24 px-4 font-sans">
        <div className="max-w-md mx-auto text-center space-y-4 bg-white p-8 rounded-2xl border border-[#E4E2DD] shadow-card">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="font-heading font-bold text-2xl text-[#111111]">Booking Not Found</h2>
          <p className="text-sm text-[#52525B]">
            We could not locate booking reference <code className="bg-[#F3F1ED] px-1.5 py-0.5 rounded-md border border-[#E4E2DD] tabular-nums font-semibold">{bookingRef}</code>.
          </p>
          <Link
            href="/"
            className="btn btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const primaryTx = booking.paymentTransactions[0];
  const waConciergeNumber = "919876543210";
  const waUrl = `https://wa.me/${waConciergeNumber}?text=${encodeURIComponent(
    `Hello Trip Master Team, I have just booked reservation ${booking.bookingReference} for ${booking.package.title}. My name is ${booking.customer.name}. Excited for this journey!`
  )}`;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-28 pb-20 px-4 sm:px-6 lg:px-8 print:bg-white print:pt-4 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Celebration Header Banner */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#E4E2DD] shadow-card text-center relative overflow-hidden">
          <div className="w-20 h-20 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center mb-5 border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Reservation Confirmed & Logged</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
            Your Journey Awaits, {booking.customer.name.split(" ")[0]}!
          </h1>
          <p className="text-[#52525B] text-sm max-w-xl mx-auto mt-2">
            A confirmation voucher and receipt have been dispatched to{" "}
            <span className="font-semibold text-[#111111]">{booking.customer.email}</span>. Your private Trip Master concierge will reach out via WhatsApp shortly.
          </p>

          {/* Booking Reference Stamp */}
          <div className="mt-6 inline-block bg-[#0D2C24] text-amber-300 px-7 py-3.5 rounded-xl shadow-md border border-[#1A453B]">
            <span className="text-[11px] uppercase tracking-wider text-white/80 block font-semibold">
              Booking Reference Number
            </span>
            <span className="font-heading text-xl sm:text-2xl font-bold tracking-wider tabular-nums">
              {booking.bookingReference}
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 print:hidden">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase tracking-wider font-semibold transition-colors inline-flex items-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" /> Message Concierge on WhatsApp
            </a>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-[#52525B]" /> Print / Save Voucher
            </button>
            <Link
              href="/packages"
              className="btn btn-secondary px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-1.5"
            >
              Explore Other Packages <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* TRIP & ITINERARY SUMMARY CARD */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E4E2DD] shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E2DD]">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 shadow-xs border border-[#E4E2DD]">
                <Image
                  src={booking.package.featuredImage}
                  alt={booking.package.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-[#0D2C24] px-2.5 py-0.5 rounded-full inline-block">
                  {booking.package.destination}
                </span>
                <h3 className="font-heading font-bold text-lg text-[#111111] mt-1.5 leading-snug">
                  {booking.package.title}
                </h3>
                <span className="text-xs text-[#52525B] font-medium">
                  {booking.package.durationDays} Days / {booking.package.durationNights} Nights Expedition
                </span>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  booking.bookingStatus === "CONFIRMED"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {booking.bookingStatus === "CONFIRMED" ? "Confirmed" : "Deposit Paid (Partially Paid)"}
              </span>
            </div>
          </div>

          {/* 3-Column Trip Logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-4 rounded-xl bg-[#F3F1ED] border border-[#E4E2DD]">
              <span className="text-[#52525B] font-semibold uppercase tracking-wider block mb-1">
                Travel Window
              </span>
              <div className="font-semibold text-[#111111] tabular-nums">
                {new Date(booking.travelStartDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="text-[#52525B] tabular-nums">
                to{" "}
                {new Date(booking.travelEndDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F3F1ED] border border-[#E4E2DD]">
              <span className="text-[#52525B] font-semibold uppercase tracking-wider block mb-1">
                Travel Party
              </span>
              <div className="font-semibold text-[#111111]">
                {booking.adultsCount} Adults {booking.childrenCount > 0 ? `, ${booking.childrenCount} Children` : ""}
              </div>
              <div className="text-[#52525B]">{booking.paxCount} Total Travelers</div>
            </div>

            <div className="p-4 rounded-xl bg-[#F3F1ED] border border-[#E4E2DD]">
              <span className="text-[#52525B] font-semibold uppercase tracking-wider block mb-1">
                Primary Contact
              </span>
              <div className="font-semibold text-[#111111]">{booking.customer.name}</div>
              <div className="text-[#52525B] tabular-nums">{booking.customer.phone}</div>
            </div>
          </div>

          {booking.specialRequests && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 font-sans">
              <span className="font-semibold">Special Concierge Requests:</span>{" "}
              {booking.specialRequests}
            </div>
          )}
        </div>

        {/* PAYMENT LEDGER & RECEIPT CARD */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E4E2DD] shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E4E2DD]">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#0D2C24]" />
              <h3 className="font-heading text-lg font-bold text-[#111111]">
                Financial Ledger & Receipt
              </h3>
            </div>
            <span className="text-xs text-[#52525B] tabular-nums">
              Transaction Date:{" "}
              {primaryTx
                ? new Date(primaryTx.createdAt).toLocaleDateString("en-IN")
                : new Date().toLocaleDateString("en-IN")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
            <div className="bg-[#F3F1ED] p-4 rounded-xl border border-[#E4E2DD]">
              <span className="text-xs text-[#52525B] font-semibold uppercase">
                Total Package Tariff
              </span>
              <div className="price-display font-heading text-2xl font-bold text-[#111111] mt-1 tabular-nums">
                ₹{booking.totalAmount.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-200/80">
              <span className="text-xs text-emerald-800 font-semibold uppercase">
                Amount Paid Today
              </span>
              <div className="price-display font-heading text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
                ₹{booking.amountPaid.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="bg-[#F3F1ED] p-4 rounded-xl border border-[#E4E2DD]">
              <span className="text-xs text-[#52525B] font-semibold uppercase">
                Outstanding Balance Due
              </span>
              <div
                className={`price-display font-heading text-2xl font-bold mt-1 tabular-nums ${
                  booking.balanceAmount > 0 ? "text-amber-800" : "text-emerald-700"
                }`}
              >
                ₹{booking.balanceAmount.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* Payment Method & Transaction ID details */}
          {primaryTx && (
            <div className="p-4 rounded-xl bg-[#F3F1ED] border border-[#E4E2DD] text-xs flex flex-wrap items-center justify-between gap-4 font-sans">
              <div>
                <span className="text-[#52525B]">Payment Channel:</span>{" "}
                <span className="font-semibold text-[#111111]">
                  {primaryTx.paymentMethod || "Razorpay Online"}
                </span>
              </div>
              <div>
                <span className="text-[#52525B]">Razorpay Payment ID:</span>{" "}
                <span className="font-semibold text-[#111111] tabular-nums">
                  {primaryTx.razorpayPaymentId || "Verified Online"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Captured & Verified</span>
              </div>
            </div>
          )}
        </div>

        {/* ATTACHED DOCUMENTS & VOUCHERS */}
        {booking.customerDocuments && booking.customerDocuments.length > 0 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E4E2DD] shadow-card space-y-4 font-sans">
            <h3 className="font-heading text-lg font-bold text-[#111111] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0D2C24]" />
              Generated Travel Documents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {booking.customerDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-[#E4E2DD] flex items-center justify-between hover:border-[#0D2C24] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F3F1ED] flex items-center justify-center text-[#0D2C24]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#111111] text-xs line-clamp-1">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-[#52525B]">
                        {doc.type} • {doc.fileSize || "PDF"}
                      </div>
                    </div>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[#F3F1ED] text-[#111111] hover:bg-[#0D2C24] hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

