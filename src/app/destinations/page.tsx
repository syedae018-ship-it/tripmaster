import { Metadata } from "next";
import PackagesPage from "@/app/packages/page";

export const metadata: Metadata = {
  title: "Curated Luxury Destinations & Escapes | Trip Master",
  description:
    "Explore our complete collection of bespoke luxury destinations across Kashmir, Kerala, Andaman, and Rajasthan. 5-star heritage retreats and 24/7 dedicated concierge.",
};

export default async function DestinationsPage(props: {
  searchParams: Promise<{
    destination?: string;
    duration?: string;
    maxPrice?: string;
    minPrice?: string;
  }>;
}) {
  return <PackagesPage {...props} />;
}
