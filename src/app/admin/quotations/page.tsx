import { Metadata } from "next";
import { QuotationsHub } from "@/components/admin/QuotationsHub";

export const metadata: Metadata = {
  title: "Mobile Quotations & Plan Builder | Trip Master Admin",
};

export default function AdminQuotationsPage() {
  return <QuotationsHub />;
}

