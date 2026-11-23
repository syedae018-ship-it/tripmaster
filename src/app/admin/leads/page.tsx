import { Metadata } from "next";
import { InquiriesHub } from "@/components/admin/InquiriesHub";

export const metadata: Metadata = {
  title: "Leads & Inquiries | Trip Master Admin",
  description: "Track guest leads, follow-up schedule, and convert travel inquiries.",
};

export default function AdminLeadsPage() {
  return <InquiriesHub />;
}

