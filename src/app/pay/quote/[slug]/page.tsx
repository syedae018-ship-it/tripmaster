import { Metadata } from "next";
import { QuotationPaymentPortal } from "@/components/payment/QuotationPaymentPortal";

export const metadata: Metadata = {
  title: "Client Quotation Payment & Verified Settlement | Trip Master",
  description: "Secure payment settlement and reservation confirmation for your custom Trip Master quotation.",
};

export default async function QuotationPaymentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <QuotationPaymentPortal slug={slug} />;
}
