import { Metadata } from "next";
import { CustomerProfileView } from "@/components/admin/CustomerProfileView";

export const metadata: Metadata = {
  title: "Customer 360° Profile | Trip Master Admin",
  description: "Unified customer details, inquiry history, bookings, and document vault.",
};

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerProfileView customerId={id} />;
}

