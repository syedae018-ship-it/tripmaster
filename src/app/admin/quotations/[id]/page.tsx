import { Metadata } from "next";
import { QuotationStudio } from "@/components/admin/QuotationStudio";

export const metadata: Metadata = {
  title: "Edit Quotation Plan | Trip Master Admin",
};

export default async function EditQuotationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <QuotationStudio initialQuotationId={id} />;
}
