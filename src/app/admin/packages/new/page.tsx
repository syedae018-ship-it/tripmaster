import { Metadata } from "next";
import { PackageStudio } from "@/components/admin/PackageStudio";

export const metadata: Metadata = {
  title: "New Package Studio | Trip Master Admin",
};

export default function NewPackagePage() {
  return <PackageStudio isEdit={false} />;
}

