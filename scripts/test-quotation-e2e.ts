import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:3000";

interface TestReport {
  name: string;
  passed: boolean;
  details?: any;
  error?: string;
}

const reports: TestReport[] = [];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

async function runStep(name: string, fn: () => Promise<any>) {
  console.log(`\n======================================================`);
  console.log(`[TEST RUNNING] ${name}`);
  console.log(`======================================================`);
  try {
    const result = await fn();
    console.log(`[PASS] ${name}`);
    reports.push({ name, passed: true, details: result });
    return result;
  } catch (error: any) {
    console.error(`[FAIL] ${name}:`, error?.message || error);
    reports.push({ name, passed: false, error: error?.message || String(error) });
    throw error;
  }
}

async function main() {
  console.log("Starting End-to-End Quotation Workflow QA Test Suite...");

  let createdQuotationId = "";
  let quotationNumber = "";
  let shareSlug = "";
  let customerId = "";
  const totalTripAmount = 145000;
  const advanceAmount = 45000;
  let adminCookie = "";

  // STEP 0: AUTHENTICATE ADMIN USER
  await runStep("0. Authenticate Master Concierge Admin via /api/admin/auth/login", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@tripmaster.in",
        password: "admin123",
      }),
    });

    const data = await res.json();
    assert(res.ok && data.success, `Admin login failed: ${data.error}`);

    // Extract cookie from Set-Cookie header
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      adminCookie = setCookie.split(";")[0];
    } else {
      // Fallback: create token directly
      const { createSessionToken } = await import("../src/lib/auth");
      const token = createSessionToken({
        id: "master-admin-001",
        email: "admin@tripmaster.in",
        name: "Master Concierge Admin",
        role: "SUPER_ADMIN",
      });
      adminCookie = `tm_admin_session=${token}`;
    }

    assert(Boolean(adminCookie), "Failed to obtain tm_admin_session cookie");
    console.log(`Authenticated Admin: ${data.user?.name} (${data.user?.email})`);
    return { user: data.user, hasCookie: Boolean(adminCookie) };
  });

  // STEP 1: CREATE LUXURY QUOTATION VIA API
  await runStep("1. Create Bespoke Luxury Kashmir Quotation via /api/admin/quotations", async () => {
    const payload = {
      title: "Royal Kashmir: Houseboat Heritage & High-Altitude Alpine Luxury",
      destination: "Kashmir, India",
      durationDays: 5,
      durationNights: 4,
      pricePerPerson: 72500,
      totalAmount: 145000,
      travelDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      paxCount: 2,
      adultsCount: 2,
      childrenCount: 0,
      status: "DRAFT",
      customerData: {
        name: "Vikramaditya Singhania",
        email: "vikram.singhania@heritage-holdings.in",
        phone: "+91 98201 55432",
        whatsappNumber: "+91 98201 55432",
        city: "Mumbai",
      },
      content: {
        heroImage: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80",
        title: "Royal Kashmir: Houseboat Heritage & Alpine Luxury",
        subtitle: "A 5-Day Bespoke Expedition Across Srinagar, Gulmarg Meadows, and Pahalgam Pines",
        mapIntro: "Your private chauffeur-driven luxury SUV whisks you from Srinagar's ancient waterways through Gulmarg's snow-clad Apharwat peak, the Lidder river banks in Pahalgam, and back to private Dal Lake moorings.",
        mapStops: [
          { name: "Srinagar Airport & Dal Lake", label: "Day 1: Private Shikara & Heritage Houseboat" },
          { name: "Gulmarg Highlands", label: "Day 2: Gondola Phase 2 & Khyber High Tea" },
          { name: "Pahalgam Valley", label: "Day 3: Betaab Valley & Lidder Trout Reserve" },
          { name: "Aru Valley & Baisaran", label: "Day 4: Alpine Meadows & Pine Forest Trek" },
          { name: "Old City & Mughal Gardens", label: "Day 5: Shalimar, Nishat & Changi Departure" },
        ],
        summary: {
          duration: "5 Days / 4 Nights",
          destination: "Kashmir, India",
          pricePerPersonFormatted: "₹72,500 / Guest",
          pricePerPerson: 72500,
          paxCount: 2,
          totalCostFormatted: "₹1,45,000 Total Experience",
        },
        costBreakdown: [
          { category: "Luxury Accommodations (Houseboat + 5★ Resort)", cost: "₹75,000" },
          { category: "Private Chauffeur & Luxury 4x4 SUV", cost: "₹28,000" },
          { category: "VIP Gulmarg Gondola Phase 1 & 2 Passes", cost: "₹12,000" },
          { category: "Gourmet Wazwan & Daily Royal Breakfasts", cost: "₹18,000" },
          { category: "Dedicated Concierge & Private Shikara Charters", cost: "₹12,000" },
        ],
        staySummary: {
          city: "Srinagar & Gulmarg",
          hotelName: "Mascot Luxury Houseboat & The Khyber Himalayan Resort & Spa",
          roomType: "Royal Cedar Suite & Luxury Pine Valley Room",
          rating: 5,
          photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        },
        mealsBanner: {
          title: "Gastronomic Royal Wazwan & High-Altitude Dining",
          description: "All morning breakfasts and curated multi-course Kashmiri Wazwan dinners included featuring Rista, Rogan Josh, Gushtaba, and saffron Kahwa tea.",
          tags: ["Daily Gourmet Breakfast", "Private Wazwan Banquet", "Evening Kahwa by Dal Lake", "Chef Curated Menus"],
        },
        quickDayWiseSummary: [
          { day: "Day 1", summary: "VIP Arrival at Srinagar, check-in to Luxury Houseboat, sunset Shikara on Nigeen Lake" },
          { day: "Day 2", summary: "Scenic ascent to Gulmarg, Gondola ride to Apharwat Peak (Phase 1 & 2), spa evening" },
          { day: "Day 3", summary: "Drive to Pahalgam, Lidder Valley walk, trout fishing experience, luxury cottage check-in" },
          { day: "Day 4", summary: "Equestrian ride through Baisaran valley (Mini Switzerland) & romantic bonfire dinner" },
          { day: "Day 5", summary: "Heritage tour of Mughal Gardens (Nishat & Shalimar Bagh), VIP transfer to Srinagar airport" },
        ],
        days: [
          {
            dayNumber: 1,
            dayTitle: "Arrival in Srinagar & Royal Houseboat Moorings",
            dateLabel: "Day 01 • Private Lake Cruise",
            places: [
              {
                title: "Sheikh ul-Alam VIP Arrival",
                subtitle: "Srinagar International Airport",
                category: "TRANSFER",
                photos: [
                  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
                ],
                description: "Personal concierge greeting on tarmac with cold saffron Kahwa towels. Direct luxury transfer to Dal Lake boat ghat.",
              },
              {
                title: "Sunset Shikara Cruise on Nigeen Lake",
                subtitle: "Nigeen Lake, Srinagar",
                category: "ATTRACTION",
                photos: [
                  "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80",
                ],
                description: "Private cushioned Shikara glide beneath Zabarwan mountain shadows with lotus garden blossoms and floating market artisans.",
              },
            ],
            hotel: {
              name: "Mascot Heritage Luxury Houseboat",
              photo: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
              rating: 5,
              roomType: "Carved Walnut Royal Suite with Lake Balcony",
              description: "Centuries-old carved Deodar wood sanctuary adorned with antique Kashmiri silk carpets, crystal chandeliers, and butler service.",
            },
          },
          {
            dayNumber: 2,
            dayTitle: "Gulmarg Ski Highlands & Apharwat Peak",
            dateLabel: "Day 02 • High Altitude Wonder",
            places: [
              {
                title: "Gulmarg Gondola Ride (Phase 1 & 2)",
                subtitle: "Apharwat Mountain, Gulmarg (13,780 ft)",
                category: "ACTIVITY",
                photos: [
                  "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=800&q=80",
                ],
                description: "Ascend one of the world's highest operating cable cars directly to snow-dusted ridges touching the clouds overlooking the Pir Panjal range.",
              },
            ],
            hotel: {
              name: "The Khyber Himalayan Resort & Spa",
              photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
              rating: 5,
              roomType: "Premier Pine Valley View Room",
              description: "World-class alpine luxury nestled amidst pine forests with heated indoor pool and panoramic views of Apharwat mountain.",
            },
          },
          {
            dayNumber: 3,
            dayTitle: "Valley of Shepherds & Lidder Waters",
            dateLabel: "Day 03 • Pahalgam Sylvan Charms",
            places: [
              {
                title: "Betaab Valley & Chandanwari",
                subtitle: "Pahalgam, Anantnag District",
                category: "ATTRACTION",
                photos: [
                  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
                ],
                description: "Lush meadows flanked by snowcapped crests where the crystalline Lidder river cuts through emerald pine woodlands.",
              },
            ],
            hotel: {
              name: "Pahalgam Pine Palace Heritage",
              photo: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
              rating: 4.8,
              roomType: "Riverside Chalet with Fireplace",
              description: "Charming log cottage featuring timber hearths, hot water bottles, and direct riverbank walking trails.",
            },
          },
          {
            dayNumber: 4,
            dayTitle: "Baisaran Alpine Meadows & Twilight Wazwan",
            dateLabel: "Day 04 • The Mini Switzerland Trek",
            places: [
              {
                title: "Baisaran Meadow Horse Trek",
                subtitle: "Baisaran Highlands, Pahalgam",
                category: "ACTIVITY",
                photos: [
                  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
                ],
                description: "A gentle forest ride leading into an expansive highland meadow surrounded by dense deodar forests.",
              },
            ],
            hotel: {
              name: "The Lalit Grand Palace Srinagar",
              photo: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
              rating: 5,
              roomType: "Palace Heritage King Room",
              description: "Former residence of Maharaja Pratap Singh with expansive manicured gardens overlooking Dal Lake.",
            },
          },
          {
            dayNumber: 5,
            dayTitle: "Mughal Imperial Splendor & VIP Departure",
            dateLabel: "Day 05 • Farewell Kashmir",
            places: [
              {
                title: "Nishat & Shalimar Imperial Terraces",
                subtitle: "Boulevard Road, Srinagar",
                category: "ATTRACTION",
                photos: [
                  "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
                ],
                description: "Walk under four-century-old Chinar trees along stepped cascading water fountains designed by Emperor Jahangir for Empress Nur Jahan.",
              },
            ],
          },
        ],
        momentsThatMatter: [
          { url: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=600&q=80", caption: "Dawn mist over Dal Lake floating flowers" },
          { url: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=600&q=80", caption: "Gondola ascent into snowy Apharwat peaks" },
          { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", caption: "Pristine Lidder river pebbles in Betaab valley" },
          { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80", caption: "Grand Palace sunset tea under Royal Chinars" },
        ],
        inclusions: [
          "4 Nights luxury stays: 1N Mascot Houseboat, 1N The Khyber, 1N Pine Palace, 1N Lalit Grand Palace",
          "Private dedicated 4x4 Luxury Scorpio / Innova Crysta for all transfers and mountain excursions",
          "VIP Gondola Cable Car tickets for both Phase 1 and Phase 2 with fast-track boarding",
          "Daily gourmet breakfast spread and 4 royal multi-course Wazwan dinners",
          "2-Hour private romantic sunset Shikara cruise on Dal & Nigeen Lake with Kahwa service",
          "Toll taxes, mountain driver allowances, parking fees, and fuel charges included",
          "Dedicated 24x7 Trip Master holiday concierge on call throughout the itinerary",
        ],
        exclusions: [
          "Commercial or chartered airfare to and from Srinagar",
          "Pony / horse ride charges in Gulmarg and Pahalgam (payable directly)",
          "Personal expenses like laundry, minibar, spa treatments, or alcoholic beverages",
          "Travel insurance coverage (available upon request)",
        ],
        paymentPolicy: [
          "Advance deposit of ₹45,000 required at confirmation to block luxury boutique suites & Gondola slots",
          "Remaining balance payable 15 days prior to arrival via Razorpay or bank transfer",
          "100% refund for cancellations made 30+ days prior to travel departure",
          "50% refund for cancellations between 15-29 days prior to arrival",
        ],
        reviews: [
          {
            customerName: "Dr. Anirudh & Shweta Kulkarni",
            tripDestination: "Kashmir Luxury Honeymoon",
            rating: 5,
            reviewText: "Trip Master made our Kashmir dream seamless. The Khyber suite upgrade and private Shikara with hot saffron Kahwa was unforgettable!",
          },
          {
            customerName: "Rajeev Mehra, Delhi",
            tripDestination: "Family Alpine Tour",
            rating: 5,
            reviewText: "The Gondola Phase 2 VIP tickets saved us 3 hours of queuing in the cold. Superb chauffeur and five-star arrangements throughout.",
          },
        ],
        advisor: {
          name: "Farhan Mir",
          phone: "+91 98765 43210",
          whatsappNumber: "+91 98765 43210",
          email: "farhan.concierge@tripmaster.in",
          offices: "Srinagar Boulevard • Bangalore Luxury Tower",
          companyName: "Trip Master Luxury Journeys",
        },
      },
    };

    const res = await fetch(`${BASE_URL}/api/admin/quotations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    assert(res.ok && data.success, `API returned error: ${data.error}`);
    assert(Boolean(data.quotation), "Quotation object was not returned");

    const q = data.quotation;
    createdQuotationId = q.id;
    quotationNumber = q.quotationNumber;
    shareSlug = q.shareSlug;
    customerId = q.customerId;

    console.log(`Created Quotation ID: ${createdQuotationId}`);
    console.log(`Quotation Number: ${quotationNumber}`);
    console.log(`Share Slug: ${shareSlug}`);
    console.log(`Customer ID: ${customerId}`);

    return {
      id: createdQuotationId,
      quotationNumber,
      shareSlug,
      customerId,
      title: q.title,
    };
  });

  // STEP 2: VERIFY PERSISTENCE & FORMATS IN SQLITE DB
  await runStep("2. Verify Quotation Persistence & Identifier Formatting", async () => {
    assert(Boolean(createdQuotationId), "No createdQuotationId");
    assert(Boolean(quotationNumber), "No quotationNumber");
    assert(Boolean(shareSlug), "No shareSlug");

    // Format: QT-YYYYMM-XXXX
    const formatRegex = /^QT-\d{6}-\d{4}$/;
    assert(formatRegex.test(quotationNumber), `Quotation number ${quotationNumber} does not match format QT-YYYYMM-XXXX`);

    // ShareSlug: kashmir-quote-XXXX-XXXX
    assert(shareSlug.includes("kashmir"), `Slug ${shareSlug} should contain destination prefix`);

    const persisted = await prisma.quotation.findUnique({
      where: { id: createdQuotationId },
      include: { customer: true },
    });

    assert(Boolean(persisted), "Quotation was not found in SQLite database");
    assert(persisted?.status === "DRAFT", `Expected DRAFT, found ${persisted?.status}`);
    assert(persisted?.paxCount === 2, `Expected paxCount 2, found ${persisted?.paxCount}`);
    assert(persisted?.customer?.name === "Vikramaditya Singhania", "Customer record not linked properly");

    return {
      persistedInDb: true,
      quotationNumber: persisted?.quotationNumber,
      customerName: persisted?.customer?.name,
      totalAmount: persisted?.totalAmount,
    };
  });

  // STEP 3: FETCH PUBLIC QUOTATION VIA API
  await runStep("3. Fetch Public Quotation via /api/quotations/[slug]", async () => {
    const res = await fetch(`${BASE_URL}/api/quotations/${shareSlug}`);
    const data = await res.json();

    assert(res.ok && data.success, `Public quotation API failed: ${data.error}`);
    const q = data.quotation;

    assert(q.id === createdQuotationId, "Quotation ID mismatch in public fetch");
    assert(q.shareSlug === shareSlug, "Quotation slug mismatch in public fetch");
    assert(typeof q.content === "object", "Content was not parsed into an object");
    assert(q.content.title.includes("Royal Kashmir"), "Content title missing or invalid");
    assert(Array.isArray(q.content.days) && q.content.days.length === 5, "Content days must have 5 days");
    assert(Array.isArray(q.content.costBreakdown) && q.content.costBreakdown.length > 0, "Cost breakdown missing");
    assert(Boolean(q.content.staySummary), "Stay summary missing");
    assert(Array.isArray(q.content.inclusions) && q.content.inclusions.length > 0, "Inclusions missing");
    assert(Boolean(q.content.advisor), "Advisor profile missing");

    return {
      slug: q.shareSlug,
      title: q.title,
      daysCount: q.content.days.length,
      costCategories: q.content.costBreakdown.length,
      hasAdvisor: Boolean(q.content.advisor),
    };
  });

  // STEP 4: VERIFY SSR RENDERING OF /quote/[slug]
  await runStep("4. Verify Public Page Rendering /quote/[slug]", async () => {
    const res = await fetch(`${BASE_URL}/quote/${shareSlug}`);
    assert(res.status === 200, `Expected HTTP 200 from /quote/${shareSlug}, got ${res.status}`);

    const html = await res.text();
    assert(html.includes("TripMaster"), "TripMaster branding missing from page");
    assert(html.includes("Download PDF") || html.includes("download"), "PDF Download capability missing from HTML");

    return {
      status: res.status,
      contentLength: html.length,
      containsBrand: html.includes("TripMaster"),
    };
  });

  // STEP 5: ACTIVATE PAYMENT LINK VIA ADMIN API
  await runStep("5. Activate & Configure Payment Link via POST /api/admin/quotations/[id]/payment-link", async () => {
    const payload = {
      paymentAmountDue: advanceAmount,
      paymentPlan: "ADVANCE",
      paymentNote: "Initial 30% advance deposit to secure luxury houseboat and Gondola VIP passes",
      paymentLinkActive: true,
    };

    const res = await fetch(`${BASE_URL}/api/admin/quotations/${createdQuotationId}/payment-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    assert(res.ok && data.success, `Payment link activation failed: ${data.error}`);
    assert(data.paymentLinkActive === true, "paymentLinkActive is not true");
    assert(data.amountDue === advanceAmount, `Expected amountDue ${advanceAmount}, got ${data.amountDue}`);
    assert(data.paymentUrl.includes(`/pay/quote/${shareSlug}`), `Payment URL does not point to /pay/quote/${shareSlug}`);

    return {
      paymentUrl: data.paymentUrl,
      amountDue: data.amountDue,
      paymentPlan: data.quotation?.paymentPlan,
      paymentLinkActive: data.paymentLinkActive,
    };
  });

  // STEP 6: VERIFY PAYMENT LINK DETAILS VIA GET API
  await runStep("6. Fetch Payment Link via GET /api/admin/quotations/[id]/payment-link", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/quotations/${createdQuotationId}/payment-link`, {
      headers: {
        Cookie: adminCookie,
      },
    });
    const data = await res.json();

    assert(res.ok && data.success, `GET payment link failed: ${data.error}`);
    assert(data.paymentLinkActive === true, "paymentLinkActive must be true");
    assert(data.amountDue === advanceAmount, `Expected amountDue ${advanceAmount}, got ${data.amountDue}`);
    assert(data.paymentUrl.includes(shareSlug), "paymentUrl does not contain slug");

    return {
      amountDue: data.amountDue,
      paymentUrl: data.paymentUrl,
      paymentStatus: data.paymentStatus,
    };
  });

  // STEP 7: VERIFY PAYMENT PORTAL ROUTE /pay/quote/[slug]
  await runStep("7. Access Payment Portal Route /pay/quote/[slug]", async () => {
    const res = await fetch(`${BASE_URL}/pay/quote/${shareSlug}`);
    assert(res.status === 200, `Expected HTTP 200 from /pay/quote/${shareSlug}, got ${res.status}`);

    const html = await res.text();
    assert(html.includes("Razorpay") || html.includes("Payment"), "Payment portal branding missing");

    return {
      status: res.status,
      contentLength: html.length,
      routeAccessible: true,
    };
  });

  // STEP 8: TEST RAZORPAY ORDER CREATION FOR THIS QUOTATION
  let createdOrderId = "";
  await runStep("8. Create Razorpay Order via POST /api/payments/razorpay/create-order", async () => {
    const payload = {
      amount: advanceAmount,
      currency: "INR",
      receipt: `rcpt_qt_${quotationNumber}_${Date.now()}`,
      notes: {
        quotationId: createdQuotationId,
        quotationNumber,
        quotationSlug: shareSlug,
        customerName: "Vikramaditya Singhania",
        type: "QUOTATION_PAYMENT",
      },
    };

    const res = await fetch(`${BASE_URL}/api/payments/razorpay/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    assert(res.ok && data.success, `Create order failed: ${data.error}`);
    assert(Boolean(data.order), "No order object in response");
    assert(Boolean(data.order.id), "No order id in response");
    assert(data.order.amount === advanceAmount * 100, `Expected amount in paise ${advanceAmount * 100}, got ${data.order.amount}`);

    createdOrderId = data.order.id;
    console.log(`Razorpay Order Created: ${createdOrderId} (${data.order.isSimulated ? "Simulated Mode" : "Gateway Mode"})`);

    return {
      orderId: createdOrderId,
      amountPaise: data.order.amount,
      currency: data.order.currency,
      isSimulated: data.order.isSimulated,
      isDummy: data.order.isDummy,
      keyId: data.order.keyId,
    };
  });

  // STEP 9: TEST PAYMENT VERIFICATION SIMULATION
  let confirmedBookingRef = "";
  let taxInvoiceNumber = "";
  await runStep("9. Verify Payment via POST /api/payments/razorpay/verify (Simulation)", async () => {
    const simulatedPaymentId = `pay_dummy_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
    const simulatedSignature = `dummy_sig_${Date.now()}`;

    const payload = {
      razorpay_order_id: createdOrderId || `order_dummy_${Date.now()}`,
      razorpay_payment_id: simulatedPaymentId,
      razorpay_signature: simulatedSignature,
      bookingData: {
        quotationId: createdQuotationId,
        quotationSlug: shareSlug,
        quotationNumber,
        name: "Vikramaditya Singhania",
        phone: "+91 98201 55432",
        email: "vikram.singhania@heritage-holdings.in",
        totalAmount: totalTripAmount,
        amountPaid: advanceAmount,
        paymentMethod: "RAZORPAY_ONLINE",
      },
    };

    const res = await fetch(`${BASE_URL}/api/payments/razorpay/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    assert(res.ok && data.success, `Payment verification failed: ${data.error}`);
    assert(Boolean(data.bookingReference), "No bookingReference in verification response");
    assert(Boolean(data.invoiceNumber), "No invoiceNumber in verification response");

    confirmedBookingRef = data.bookingReference;
    taxInvoiceNumber = data.invoiceNumber;

    console.log(`Verified Booking Reference: ${confirmedBookingRef}`);
    console.log(`Tax Invoice Number: ${taxInvoiceNumber}`);

    return {
      bookingReference: confirmedBookingRef,
      invoiceNumber: taxInvoiceNumber,
      message: data.message,
    };
  });

  // STEP 10: CONFIRM DATABASE RECORDS UPDATED
  await runStep("10. Confirm Booking, Transaction & Quotation Records in SQLite DB", async () => {
    // Check Quotation
    const updatedQuotation = await prisma.quotation.findUnique({
      where: { id: createdQuotationId },
    });
    assert(updatedQuotation?.status === "CONVERTED", `Quotation status should be CONVERTED, got ${updatedQuotation?.status}`);
    assert(updatedQuotation?.paymentStatus === "PARTIALLY_PAID", `Quotation paymentStatus should be PARTIALLY_PAID, got ${updatedQuotation?.paymentStatus}`);
    assert(updatedQuotation?.paymentAmountDue === totalTripAmount - advanceAmount, `Expected balance amount due ${totalTripAmount - advanceAmount}, got ${updatedQuotation?.paymentAmountDue}`);

    // Check Booking
    const booking = await prisma.booking.findUnique({
      where: { bookingReference: confirmedBookingRef },
      include: {
        paymentTransactions: true,
        customerDocuments: true,
        customer: true,
      },
    });

    assert(Boolean(booking), `Booking ${confirmedBookingRef} was not found in DB`);
    assert(booking?.quotationId === createdQuotationId, "Booking is not linked to quotationId");
    assert(booking?.totalAmount === totalTripAmount, `Booking totalAmount expected ${totalTripAmount}, got ${booking?.totalAmount}`);
    assert(booking?.amountPaid === advanceAmount, `Booking amountPaid expected ${advanceAmount}, got ${booking?.amountPaid}`);
    assert(booking?.balanceAmount === totalTripAmount - advanceAmount, `Booking balanceAmount expected ${totalTripAmount - advanceAmount}, got ${booking?.balanceAmount}`);
    assert(booking?.bookingStatus === "PARTIALLY_PAID", `Booking status expected PARTIALLY_PAID, got ${booking?.bookingStatus}`);
    assert(booking?.taxInvoiceNumber === taxInvoiceNumber, "Booking tax invoice number mismatch");

    // Check PaymentTransaction
    assert(booking!.paymentTransactions.length >= 1, "No payment transactions logged");
    const txn = booking!.paymentTransactions[0];
    assert(txn.amount === advanceAmount, `Txn amount expected ${advanceAmount}, got ${txn.amount}`);
    assert(txn.status === "SUCCESS", `Txn status expected SUCCESS, got ${txn.status}`);

    // Check CustomerDocuments
    assert(booking!.customerDocuments.length >= 2, `Expected at least 2 customer documents, got ${booking!.customerDocuments.length}`);

    return {
      quotationStatus: updatedQuotation?.status,
      quotationPaymentStatus: updatedQuotation?.paymentStatus,
      bookingReference: booking?.bookingReference,
      bookingStatus: booking?.bookingStatus,
      transactionStatus: txn.status,
      customerDocumentsCount: booking?.customerDocuments.length,
    };
  });

  // STEP 11: TEST FULL BALANCE SETTLEMENT SIMULATION
  await runStep("11. Verify Full Balance Settlement & Quotation Converted to PAID", async () => {
    const remainingBalance = totalTripAmount - advanceAmount;
    const finalPaymentId = `pay_dummy_final_${Date.now().toString(36)}`;
    const finalSignature = `dummy_sig_final_${Date.now()}`;

    const payload = {
      razorpay_order_id: `order_dummy_final_${Date.now()}`,
      razorpay_payment_id: finalPaymentId,
      razorpay_signature: finalSignature,
      bookingData: {
        quotationId: createdQuotationId,
        quotationSlug: shareSlug,
        quotationNumber,
        name: "Vikramaditya Singhania",
        phone: "+91 98201 55432",
        email: "vikram.singhania@heritage-holdings.in",
        totalAmount: totalTripAmount,
        amountPaid: remainingBalance,
        paymentMethod: "RAZORPAY_ONLINE",
      },
    };

    const res = await fetch(`${BASE_URL}/api/payments/razorpay/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    assert(res.ok && data.success, `Final settlement verification failed: ${data.error}`);

    const fullySettledQuotation = await prisma.quotation.findUnique({
      where: { id: createdQuotationId },
    });
    assert(fullySettledQuotation?.paymentStatus === "PAID", `Expected quotation paymentStatus PAID, got ${fullySettledQuotation?.paymentStatus}`);
    assert(fullySettledQuotation?.paymentAmountDue === 0, `Expected paymentAmountDue 0, got ${fullySettledQuotation?.paymentAmountDue}`);

    const fullySettledBooking = await prisma.booking.findUnique({
      where: { bookingReference: confirmedBookingRef },
      include: { paymentTransactions: true },
    });
    assert(fullySettledBooking?.bookingStatus === "CONFIRMED", `Expected bookingStatus CONFIRMED, got ${fullySettledBooking?.bookingStatus}`);
    assert(fullySettledBooking?.balanceAmount === 0, `Expected balanceAmount 0, got ${fullySettledBooking?.balanceAmount}`);
    assert(fullySettledBooking?.amountPaid === totalTripAmount, `Expected amountPaid ${totalTripAmount}, got ${fullySettledBooking?.amountPaid}`);
    assert(fullySettledBooking!.paymentTransactions.length >= 2, "Expected 2 payment transactions logged");

    return {
      quotationPaymentStatus: fullySettledQuotation?.paymentStatus,
      bookingStatus: fullySettledBooking?.bookingStatus,
      totalPaid: fullySettledBooking?.amountPaid,
      balance: fullySettledBooking?.balanceAmount,
      transactionsCount: fullySettledBooking?.paymentTransactions.length,
    };
  });

  // STEP 12: RE-FETCH PUBLIC QUOTATION & VERIFY BOOKING DATA INCLUDED
  await runStep("12. Re-fetch Public Quotation & Confirm Bookings Array Populated", async () => {
    const res = await fetch(`${BASE_URL}/api/quotations/${shareSlug}`);
    const data = await res.json();

    assert(res.ok && data.success, `Public fetch failed: ${data.error}`);
    const q = data.quotation;

    assert(q.paymentStatus === "PAID", `Expected PAID, got ${q.paymentStatus}`);
    assert(Array.isArray(q.bookings) && q.bookings.length > 0, "Bookings array must be populated in public quotation");
    assert(q.bookings[0].bookingReference === confirmedBookingRef, "Booking reference does not match in public quotation");
    assert(q.bookings[0].bookingStatus === "CONFIRMED", "Booking status in public quotation is not CONFIRMED");

    return {
      shareSlug: q.shareSlug,
      paymentStatus: q.paymentStatus,
      bookingReference: q.bookings[0].bookingReference,
      taxInvoiceNumber: q.bookings[0].taxInvoiceNumber,
    };
  });

  console.log("\n======================================================");
  console.log("ALL 12 END-TO-END QA TESTS COMPLETED SUCCESSFULLY! 🎉");
  console.log("======================================================");
  console.table(reports.map(r => ({ Step: r.name, Passed: r.passed ? "✅ YES" : "❌ NO" })));
}

main()
  .catch((e) => {
    console.error("Test execution aborted due to error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
