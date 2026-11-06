import { Metadata } from "next";
import { CmsManager } from "@/components/admin/CmsManager";

export const metadata: Metadata = {
  title: "Website Content / CMS | Trip Master Admin",
};

export default function AdminCmsPage() {
  return <CmsManager />;
}

