import { Metadata } from "next";
import { PresetsManager } from "@/components/admin/PresetsManager";

export const metadata: Metadata = {
  title: "Destinations & Master Presets | Trip Master Admin",
  description: "Manage pre-configured countries, sightseeing places, hotels, and airport transfers.",
};

export default function AdminPresetsPage() {
  return <PresetsManager />;
}

