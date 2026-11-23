import { Metadata } from "next";
import { MediaGalleryManager } from "@/components/admin/MediaGalleryManager";

export const metadata: Metadata = {
  title: "Media Vault | Trip Master Admin",
  description: "Centralized media vault for 1-click swapping across quotations and packages.",
};

export default function AdminMediaPage() {
  return <MediaGalleryManager />;
}

