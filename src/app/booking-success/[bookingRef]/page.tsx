import { Metadata } from "next";
import { BookingSuccessView } from "@/components/booking/BookingSuccessView";

export const metadata: Metadata = {
  title: "Booking Confirmation & Payment Receipt | Trip Master",
  description: "Your luxury journey has been reserved. View booking summary, payment receipt and vouchers.",
};

export default async function BookingSuccessPage({
  params,
}: {
  params: Promise<{ bookingRef: string }>;
}) {
  const { bookingRef } = await params;
  return <BookingSuccessView bookingRef={bookingRef} />;
}

