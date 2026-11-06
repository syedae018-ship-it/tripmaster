import { Suspense } from "react";
import { Metadata } from "next";
import { BookingsHub } from "@/components/admin/BookingsHub";

export const metadata: Metadata = {
  title: "Bookings & Financial Ledger | Trip Master Admin",
  description: "Monitor guest reservations, Razorpay order states, and outstanding balances.",
};

export default function AdminBookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-slate-400 animate-pulse text-sm">
          Loading Bookings & Financial Ledger...
        </div>
      }
    >
      <BookingsHub />
    </Suspense>
  );
}
