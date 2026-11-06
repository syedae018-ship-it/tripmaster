import { prisma } from "@/lib/prisma";
import { HeroBannerWireframe } from "@/components/home/HeroBannerWireframe";
import { TrustStatsStrip } from "@/components/home/TrustStatsStrip";
import { SocialProofReviews } from "@/components/home/SocialProofReviews";
import { CuratedEscapePackages } from "@/components/home/CuratedEscapePackages";
import { VideoTestimonialsSection } from "@/components/home/VideoTestimonialsSection";
import { AboutTeamSection } from "@/components/home/AboutTeamSection";
import { TravellerCommunityStrip } from "@/components/home/TravellerCommunityStrip";
import { ProcessStepsSection } from "@/components/home/ProcessStepsSection";
import { FaqAccordionWireframe } from "@/components/home/FaqAccordionWireframe";
import { PreFooterCtaBanner } from "@/components/home/PreFooterCtaBanner";
import { PlanTripModal } from "@/components/modals/PlanTripModal";
import { VideoModal } from "@/components/modals/VideoModal";

export default async function HomePage() {
  // Fetch site settings from Prisma
  const siteSettings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  // Fetch published holiday packages
  const rawPackages = await prisma.package.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { viewsCount: "desc" }],
    take: 8,
  });

  const packages = rawPackages.map((pkg) => ({
    id: pkg.id,
    title: pkg.title,
    slug: pkg.slug,
    destination: pkg.destination,
    durationDays: pkg.durationDays,
    durationNights: pkg.durationNights,
    basePrice: pkg.basePrice,
    discountedPrice: pkg.discountedPrice,
    featuredImage: pkg.featuredImage,
  }));

  // Fetch verified reviews & testimonials
  const testimonials = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  // Fetch FAQs in order
  const faqs = await prisma.fAQ.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return (
    <main id="main-content" className="bg-[#FAF9F6] min-h-screen">
      {/* 2. Hero Banner Section (Rounded Container) */}
      <HeroBannerWireframe
        title={siteSettings?.heroTitle || "Your next unforgettable journey starts here."}
        subtitle={
          siteSettings?.heroSubtitle ||
          "Curated holiday packages, trusted by thousands of happy travellers."
        }
        bgImage={siteSettings?.heroImage}
      />

      {/* 3. 3-Column Trust & Stats Strip (Directly Below Hero) */}
      <TrustStatsStrip />

      {/* 4. Social Proof & Google Reviews Section (#reviews) */}
      <SocialProofReviews testimonials={testimonials} />

      {/* 5. Curated Holiday Packages Section ("Find your kind of escape.") */}
      <CuratedEscapePackages packages={packages} />

      {/* 6. Video Testimonials Section ("Don't just take our word for it.") */}
      <VideoTestimonialsSection />

      {/* 7. About & Team Section ("More than a holiday. A team that cares.") (#about) */}
      <AboutTeamSection aboutText={siteSettings?.aboutText} />

      {/* 8. Traveller Community Photo Strip ("Memories made. Stories shared.") */}
      <TravellerCommunityStrip />

      {/* 9. 4-Step Process Section ("Your holiday, made simple.") */}
      <ProcessStepsSection />

      {/* 10. FAQ Accordion Section ("Questions before you take off?") */}
      <FaqAccordionWireframe faqs={faqs} />

      {/* 11. Pre-Footer CTA Banner ("Your next story is waiting.") */}
      <PreFooterCtaBanner />

      {/* Interactive Global Modals */}
      <PlanTripModal />
      <VideoModal />
    </main>
  );
}
