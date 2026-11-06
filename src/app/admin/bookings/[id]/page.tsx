import { Metadata } from "next";
import { BookingDetailView } from "@/components/admin/BookingDetailView";

export const metadata: Metadata = {
  title: "Booking Detail & Financial Ledger | Trip Master Admin",
  description: "Manage reservation status, payment transactions, and customer documents.",
};

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookingDetailView bookingId={id} />;
}

