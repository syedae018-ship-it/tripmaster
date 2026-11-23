const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ₹1 Live Test Package & ₹1 Quotation...");

  const testSlug = "razorpay-test-package-1rs";

  // Upsert the ₹1 Live Test Package
  const pkg = await prisma.package.upsert({
    where: { slug: testSlug },
    update: {
      title: "Razorpay Live Gateway Test Package (₹1 Live Verification)",
      destination: "Goa / Live Sandbox",
      durationDays: 2,
      durationNights: 1,
      basePrice: 1,
      discountedPrice: 1,
      isFeatured: true,
      isPublished: true,
      featuredImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
      ]),
      overview: "Special 1 Rupee Live Test Package configured for testing real-time Razorpay payments, UPI QR scanning, card charges, webhook updates, and instant automated GST invoice issuance.",
      mapCoordinates: JSON.stringify([
        { name: "Live Payment Gateway Sandbox", lat: 15.2993, lng: 74.1240, dayNumber: 1 },
        { name: "Instant Booking Confirmation Desk", lat: 15.4989, lng: 73.8278, dayNumber: 2 }
      ]),
      inclusions: JSON.stringify([
        "100% Real Live Razorpay Gateway Connectivity Test",
        "Instant UPI / Cards / Netbanking / QR Payment Verification",
        "Immediate Automated Tax Invoice & Booking Reference Generation",
        "Admin CRM & Customer Ledger Synchronization"
      ]),
      exclusions: JSON.stringify([
        "None - Fully functional live test environment"
      ]),
      paymentPolicy: "Instant ₹1 checkout. 100% secure Razorpay TLS 256-bit payment pipeline.",
      cancellationPolicy: "Instant test transaction verification.",
    },
    create: {
      title: "Razorpay Live Gateway Test Package (₹1 Live Verification)",
      slug: testSlug,
      destination: "Goa / Live Sandbox",
      durationDays: 2,
      durationNights: 1,
      basePrice: 1,
      discountedPrice: 1,
      isFeatured: true,
      isPublished: true,
      featuredImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      galleryImages: JSON.stringify([
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
      ]),
      overview: "Special 1 Rupee Live Test Package configured for testing real-time Razorpay payments, UPI QR scanning, card charges, webhook updates, and instant automated GST invoice issuance.",
      mapCoordinates: JSON.stringify([
        { name: "Live Payment Gateway Sandbox", lat: 15.2993, lng: 74.1240, dayNumber: 1 },
        { name: "Instant Booking Confirmation Desk", lat: 15.4989, lng: 73.8278, dayNumber: 2 }
      ]),
      inclusions: JSON.stringify([
        "100% Real Live Razorpay Gateway Connectivity Test",
        "Instant UPI / Cards / Netbanking / QR Payment Verification",
        "Immediate Automated Tax Invoice & Booking Reference Generation",
        "Admin CRM & Customer Ledger Synchronization"
      ]),
      exclusions: JSON.stringify([
        "None - Fully functional live test environment"
      ]),
      paymentPolicy: "Instant ₹1 checkout. 100% secure Razorpay TLS 256-bit payment pipeline.",
      cancellationPolicy: "Instant test transaction verification.",
    }
  });

  console.log("Package ready:", pkg.title, `(ID: ${pkg.id})`);

  // Itinerary days
  await prisma.itineraryDay.deleteMany({ where: { packageId: pkg.id } });
  await prisma.itineraryDay.createMany({
    data: [
      {
        packageId: pkg.id,
        dayNumber: 1,
        title: "Live Razorpay Payment Authorization & Instant Hold",
        description: "Initiate ₹1 live charge via UPI (GPay, PhonePe, Paytm, QR) or Credit/Debit Card. Order ID generated and verified in real-time.",
        mealsIncluded: JSON.stringify(["Welcome Refreshment"]),
        activityPhotos: JSON.stringify([
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80"
        ]),
        accommodationName: "TripMaster Sandbox Suite",
        accommodationPhoto: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
        accommodationRating: 5.0,
        accommodationCategory: "Luxury Suite"
      },
      {
        packageId: pkg.id,
        dayNumber: 2,
        title: "Cryptographic HMAC SHA256 Verification & Automated Invoice Generation",
        description: "Payment signature is verified on server. Customer profile linked, confirmed Booking reference generated, and downloadable PDF invoice unlocked.",
        mealsIncluded: JSON.stringify(["Buffet Breakfast"]),
        activityPhotos: JSON.stringify([
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
        ]),
        accommodationName: "TripMaster Sandbox Suite",
        accommodationPhoto: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
        accommodationRating: 5.0,
        accommodationCategory: "Luxury Suite"
      }
    ]
  });

  // Also create a ₹1 Live Test Quotation
  const quoteSlug = "razorpay-live-test-quote";
  const existingQuote = await prisma.quotation.findFirst({ where: { shareSlug: quoteSlug } });
  if (existingQuote) {
    await prisma.quotation.update({
      where: { id: existingQuote.id },
      data: {
        paymentAmountDue: 1,
        paymentStatus: "UNPAID",
        paymentPlan: "CUSTOM",
        paymentNote: "Live 1 Rupee payment test for Razorpay integration.",
        paymentLinkActive: true,
        pricePerPerson: 1,
        totalAmount: 1,
      }
    });
    console.log("Updated ₹1 Live Test Quotation: /pay/quote/" + quoteSlug);
  } else {
    await prisma.quotation.create({
      data: {
        quotationNumber: "QT-TEST-0001",
        title: "Singapore Explorer (Live ₹1 Test Plan)",
        destination: "Singapore",
        durationDays: 4,
        durationNights: 3,
        pricePerPerson: 1,
        totalAmount: 1,
        paxCount: 1,
        status: "SENT",
        shareSlug: quoteSlug,
        paymentAmountDue: 1,
        paymentStatus: "UNPAID",
        paymentPlan: "CUSTOM",
        paymentNote: "Live 1 Rupee payment test for Razorpay integration.",
        paymentLinkActive: true,
        content: JSON.stringify({
          title: "Singapore Explorer (Live ₹1 Test Plan)",
          heroImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
          summary: {
            duration: "3 Nights, 4 Days",
            destination: "Singapore",
            pricePerPerson: 1,
            pricePerPersonFormatted: "INR 1 per person",
            paxCount: 1,
            totalCostFormatted: "INR 1 Total"
          },
          costBreakdown: [
            { category: "Accommodation (4-Star)", cost: "Included" },
            { category: "Chauffeur Airport Transfers", cost: "Included" },
            { category: "Full Day Universal Studios VIP", cost: "Included" },
            { category: "Test Package Charge", cost: "INR 1.00" }
          ],
          staySummary: {
            city: "Singapore",
            hotelName: "Hotel Boss Singapore",
            roomType: "Superior Double Room",
            rating: 4.5,
            photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
          },
          days: [
            {
              dayNumber: 1,
              dayTitle: "Arrival & Gardens by the Bay",
              places: [
                {
                  title: "Changi Airport Private Pick-up",
                  subtitle: "Airport to Hotel",
                  category: "TRANSFER",
                  photos: ["https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=600&q=80"],
                  description: "Chauffeur meets you at arrival hall and transfers to city hotel."
                }
              ]
            }
          ],
          inclusions: ["All transfers", "Hotel stay", "Live ₹1 Razorpay verification"],
          exclusions: ["Personal extras"],
          advisor: {
            name: "Master Concierge Desk",
            phone: "+91 98765 43210",
            whatsappNumber: "+91 98765 43210",
            email: "concierge@tripmaster.in",
            companyName: "Trip Master"
          }
        })
      }
    });
    console.log("Created ₹1 Live Test Quotation: /pay/quote/" + quoteSlug);
  }

  console.log("Done! All ₹1 test resources ready.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
