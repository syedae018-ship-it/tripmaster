import { Metadata } from "next";
import { PaymentPortal } from "@/components/payment/PaymentPortal";

export const metadata: Metadata = {
  title: "Client Payment & Verified Tax Invoice Portal | Trip Master",
  description: "Secure payment settlement and official tax invoice downloads for Trip Master bookings.",
};

export default async function PayBookingPage({
  params,
}: {
  params: Promise<{ bookingRef: string }>;
}) {
  const { bookingRef } = await params;
  return <PaymentPortal bookingRef={bookingRef} />;
}

