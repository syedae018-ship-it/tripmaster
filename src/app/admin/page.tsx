import { Metadata } from "next";
import { DashboardOverview } from "@/components/admin/DashboardOverview";

export const metadata: Metadata = {
  title: "Admin Dashboard | Trip Master",
};

export default function AdminDashboardPage() {
  return <DashboardOverview />;
}

