import { Metadata } from "next";
import { QuotationStudio } from "@/components/admin/QuotationStudio";

export const metadata: Metadata = {
  title: "New Mobile Quotation Studio | Trip Master Admin",
};

export default function NewQuotationPage() {
  return <QuotationStudio />;
}

