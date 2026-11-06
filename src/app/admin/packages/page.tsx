import { Metadata } from "next";
import { PackageListTable } from "@/components/admin/PackageListTable";

export const metadata: Metadata = {
  title: "Packages & Reusable Assets | Trip Master Admin",
};

export default function AdminPackagesPage() {
  return <PackageListTable />;
}

