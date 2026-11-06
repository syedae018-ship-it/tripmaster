import { Metadata } from "next";
import { MediaGalleryManager } from "@/components/admin/MediaGalleryManager";

export const metadata: Metadata = {
  title: "TripMaster Media Vault | Trip Master Admin",
};

export default function AdminGalleryPage() {
  return <MediaGalleryManager />;
}
