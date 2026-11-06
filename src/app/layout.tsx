import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trip Master | Bespoke Luxury Travel Concierge & Curated Journeys",
  description:
    "Curating handcrafted luxury vacations across Kashmir, Kerala, Andaman, and Rajasthan. Private houseboats, 5-star heritage palace suites, and dedicated 24/7 personal travel concierges.",
  keywords: [
    "luxury travel",
    "trip master",
    "kashmir luxury package",
    "kerala backwaters houseboat",
    "andaman private island",
    "rajasthan palace tour",
    "bespoke tours india",
  ],
  openGraph: {
    title: "Trip Master | Curating Unforgettable Luxury Journeys",
    description:
      "Handcrafted luxury travel itineraries with verified 5-star heritage retreats and personal concierges.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} scroll-smooth`}>
      <body className="font-sans bg-[#FAF9F6] text-[#111111] antialiased selection:bg-[#0D2C24] selection:text-white flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
