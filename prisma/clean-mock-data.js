const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function cleanMockData() {
  console.log("Cleaning mock CRM data from Admin Portal...");

  const deletedPayments = await prisma.paymentTransaction.deleteMany({});
  console.log(`✓ Deleted ${deletedPayments.count} mock payment transactions`);

  const deletedDocs = await prisma.customerDocument.deleteMany({});
  console.log(`✓ Deleted ${deletedDocs.count} mock customer documents`);

  const deletedBookings = await prisma.booking.deleteMany({});
  console.log(`✓ Deleted ${deletedBookings.count} mock bookings`);

  const deletedInquiries = await prisma.inquiry.deleteMany({});
  console.log(`✓ Deleted ${deletedInquiries.count} mock inquiries`);

  const deletedCustomers = await prisma.customer.deleteMany({});
  console.log(`✓ Deleted ${deletedCustomers.count} mock customers`);

  console.log("\nAdmin Portal CRM is now completely cleaned and reset to 0.");
  console.log("Preserved:");
  console.log("- AdminUser (admin@tripmaster.in is intact)");
  console.log("- SiteSettings & Storefront Packages");
}

cleanMockData()
  .catch((err) => {
    console.error("Cleanup error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

