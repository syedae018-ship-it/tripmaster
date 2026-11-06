import { Metadata } from "next";
import { CustomerDirectory } from "@/components/admin/CustomerDirectory";

export const metadata: Metadata = {
  title: "Customer Directory & CRM | Trip Master Admin",
  description: "Unified customer profiles, lifetime metrics, bookings and document repository.",
};

export default function AdminCustomersPage() {
  return <CustomerDirectory />;
}

