-- ==============================================================================
-- TRIP MASTER — SUPABASE POSTGRESQL SCHEMA & CONFIGURATION
-- Project Ref: qjngehohxqpicaypzusj
-- Clean Production Schema (0 Mock CRM Records)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ADMIN USER TABLE
CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "email" TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'ADMIN',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS "SiteSettings" (
  "id" TEXT PRIMARY KEY DEFAULT 'default',
  "companyName" TEXT NOT NULL DEFAULT 'Trip Master',
  "tagline" TEXT NOT NULL DEFAULT 'Curating Bespoke Luxury Journeys Across India & Beyond',
  "aboutText" TEXT NOT NULL,
  "heroTitle" TEXT NOT NULL,
  "heroSubtitle" TEXT NOT NULL,
  "heroImage" TEXT NOT NULL,
  "email" TEXT NOT NULL DEFAULT 'concierge@tripmaster.in',
  "phone" TEXT NOT NULL DEFAULT '+91 98765 43210',
  "whatsappNumber" TEXT NOT NULL DEFAULT '+91 98765 43210',
  "address" TEXT NOT NULL DEFAULT 'The Oberoi Grand Arc, MG Road, Bengaluru, India',
  "gstNumber" TEXT NOT NULL DEFAULT '29AABCU9603R1ZX',
  "bankDetails" TEXT,
  "socialLinks" TEXT NOT NULL,
  "stats" TEXT NOT NULL,
  "features" TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 4. PACKAGE TABLE
CREATE TABLE IF NOT EXISTS "Package" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "title" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "destination" TEXT NOT NULL,
  "durationDays" INTEGER NOT NULL,
  "durationNights" INTEGER NOT NULL,
  "basePrice" DOUBLE PRECISION NOT NULL,
  "discountedPrice" DOUBLE PRECISION,
  "featuredImage" TEXT NOT NULL,
  "galleryImages" TEXT NOT NULL DEFAULT '[]',
  "overview" TEXT NOT NULL,
  "mapCoordinates" TEXT NOT NULL DEFAULT '[]',
  "inclusions" TEXT NOT NULL DEFAULT '[]',
  "exclusions" TEXT NOT NULL DEFAULT '[]',
  "paymentPolicy" TEXT NOT NULL DEFAULT '25% advance token required to lock itinerary.',
  "cancellationPolicy" TEXT NOT NULL DEFAULT '100% refund up to 15 days prior to departure.',
  "isFeatured" BOOLEAN NOT NULL DEFAULT FALSE,
  "isPublished" BOOLEAN NOT NULL DEFAULT TRUE,
  "viewsCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. ITINERARY DAY TABLE
CREATE TABLE IF NOT EXISTS "ItineraryDay" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "packageId" TEXT NOT NULL REFERENCES "Package"("id") ON DELETE CASCADE,
  "dayNumber" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "mealsIncluded" TEXT NOT NULL DEFAULT '["Breakfast"]',
  "activityPhotos" TEXT NOT NULL DEFAULT '[]',
  "accommodationName" TEXT,
  "accommodationPhoto" TEXT,
  "accommodationRating" DOUBLE PRECISION,
  "accommodationCategory" TEXT DEFAULT 'Luxury Resort',
  "accommodationDetails" TEXT,
  CONSTRAINT "ItineraryDay_packageId_dayNumber_key" UNIQUE ("packageId", "dayNumber")
);

-- 6. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS "Testimonial" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "customerName" TEXT NOT NULL,
  "tripDestination" TEXT NOT NULL,
  "rating" INTEGER NOT NULL DEFAULT 5,
  "reviewText" TEXT NOT NULL,
  "customerPhoto" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 7. FAQ TABLE
CREATE TABLE IF NOT EXISTS "FAQ" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "category" TEXT NOT NULL DEFAULT 'General',
  "isPublished" BOOLEAN NOT NULL DEFAULT TRUE,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 8. CUSTOMER TABLE (CLEAN - ZERO MOCK RECORDS)
CREATE TABLE IF NOT EXISTS "Customer" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "whatsappNumber" TEXT,
  "city" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 9. INQUIRY TABLE (CLEAN - ZERO MOCK RECORDS)
CREATE TABLE IF NOT EXISTS "Inquiry" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "customerId" TEXT NOT NULL REFERENCES "Customer"("id") ON DELETE CASCADE,
  "packageId" TEXT REFERENCES "Package"("id") ON DELETE SET NULL,
  "destination" TEXT NOT NULL,
  "travelDate" TIMESTAMP WITH TIME ZONE,
  "paxCount" INTEGER NOT NULL DEFAULT 2,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "followUpDate" TIMESTAMP WITH TIME ZONE,
  "followUpNote" TEXT,
  "internalNotes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 10. BOOKING TABLE (CLEAN - ZERO MOCK RECORDS)
CREATE TABLE IF NOT EXISTS "Booking" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "bookingReference" TEXT UNIQUE NOT NULL,
  "customerId" TEXT NOT NULL REFERENCES "Customer"("id") ON DELETE CASCADE,
  "packageId" TEXT NOT NULL REFERENCES "Package"("id") ON DELETE CASCADE,
  "inquiryId" TEXT UNIQUE REFERENCES "Inquiry"("id") ON DELETE SET NULL,
  "travelStartDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "travelEndDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "paxCount" INTEGER NOT NULL DEFAULT 2,
  "adultsCount" INTEGER NOT NULL DEFAULT 2,
  "childrenCount" INTEGER NOT NULL DEFAULT 0,
  "specialRequests" TEXT,
  "totalAmount" DOUBLE PRECISION NOT NULL,
  "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "balanceAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "bookingStatus" TEXT NOT NULL DEFAULT 'PENDING',
  "documents" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 11. CUSTOMER DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS "CustomerDocument" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "customerId" TEXT NOT NULL REFERENCES "Customer"("id") ON DELETE CASCADE,
  "bookingId" TEXT REFERENCES "Booking"("id") ON DELETE SET NULL,
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'QUOTATION',
  "fileUrl" TEXT NOT NULL,
  "fileSize" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 12. PAYMENT TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS "PaymentTransaction" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "bookingId" TEXT NOT NULL REFERENCES "Booking"("id") ON DELETE CASCADE,
  "razorpayOrderId" TEXT,
  "razorpayPaymentId" TEXT,
  "razorpaySignature" TEXT,
  "amount" DOUBLE PRECISION NOT NULL,
  "paymentMethod" TEXT,
  "status" TEXT NOT NULL DEFAULT 'SUCCESS',
  "refundStatus" TEXT,
  "refundAmount" DOUBLE PRECISION DEFAULT 0,
  "notes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS "Package_slug_idx" ON "Package"("slug");
CREATE INDEX IF NOT EXISTS "Package_destination_idx" ON "Package"("destination");
CREATE INDEX IF NOT EXISTS "Booking_bookingReference_idx" ON "Booking"("bookingReference");
CREATE INDEX IF NOT EXISTS "Inquiry_status_idx" ON "Inquiry"("status");
CREATE INDEX IF NOT EXISTS "Customer_email_idx" ON "Customer"("email");
CREATE INDEX IF NOT EXISTS "Customer_phone_idx" ON "Customer"("phone");

-- ==============================================================================
-- SUPABASE STORAGE BUCKETS SETUP
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('packages', 'packages', true),
  ('customer-documents', 'customer-documents', false),
  ('hotels', 'hotels', true),
  ('cms-media', 'cms-media', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Allow public read access to public storage buckets
CREATE POLICY "Public Access for Packages"
ON storage.objects FOR SELECT
USING (bucket_id = 'packages');

CREATE POLICY "Public Access for Hotels"
ON storage.objects FOR SELECT
USING (bucket_id = 'hotels');

CREATE POLICY "Public Access for CMS"
ON storage.objects FOR SELECT
USING (bucket_id = 'cms-media');

