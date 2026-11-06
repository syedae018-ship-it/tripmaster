import { Metadata } from "next";
import { BookingCheckout } from "@/components/booking/BookingCheckout";

export const metadata: Metadata = {
  title: "Secure Guest Booking & Razorpay Checkout | Trip Master Luxury Concierge",
  description: "Direct guest reservation portal. Instant booking with full or advance token deposit.",
};

export default async function BookingCheckoutPage({
  params,
}: {
  params: Promise<{ packageSlug: string }>;
}) {
  const { packageSlug } = await params;
  return <BookingCheckout packageSlug={packageSlug} />;
}

