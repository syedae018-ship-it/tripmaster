import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const totalPackages = await prisma.package.count();
    const activePackages = await prisma.package.count({
      where: { isPublished: true },
    });

    const totalInquiries = await prisma.inquiry.count();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const inquiriesToday = await prisma.inquiry.count({
      where: {
        createdAt: { gte: todayStart },
      },
    });

    const totalBookings = await prisma.booking.count();
    const activeBookings = await prisma.booking.count({
      where: {
        bookingStatus: { in: ["PENDING", "CONFIRMED", "PARTIALLY_PAID"] },
      },
    });

    // Revenue calculations
    const bookings = await prisma.booking.findMany({
      select: {
        totalAmount: true,
        amountPaid: true,
        balanceAmount: true,
      },
    });

    const totalRevenueCollected = bookings.reduce(
      (sum, b) => sum + (b.amountPaid || 0),
      0
    );
    const totalOutstandingBalance = bookings.reduce(
      (sum, b) => sum + (b.balanceAmount || 0),
      0
    );

    // Overdue and Today's Follow-ups
    const urgentInquiries = await prisma.inquiry.findMany({
      where: {
        followUpDate: { lte: tomorrowStart },
        status: { in: ["NEW", "CONTACTED", "QUOTED"] },
      },
      orderBy: { followUpDate: "asc" },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            whatsappNumber: true,
            email: true,
            city: true,
          },
        },
        package: {
          select: {
            id: true,
            title: true,
            destination: true,
          },
        },
      },
    });

    const overdueFollowUps = urgentInquiries
      .filter((inq) => inq.followUpDate && inq.followUpDate < todayStart)
      .map((inq) => ({
        ...inq,
        internalNotes: inq.internalNotes ? JSON.parse(inq.internalNotes) : [],
      }));

    const todayFollowUps = urgentInquiries
      .filter(
        (inq) =>
          inq.followUpDate &&
          inq.followUpDate >= todayStart &&
          inq.followUpDate < tomorrowStart
      )
      .map((inq) => ({
        ...inq,
        internalNotes: inq.internalNotes ? JSON.parse(inq.internalNotes) : [],
      }));

    // Recent 5 Inquiries
    const recentInquiries = await prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            city: true,
          },
        },
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      kpis: {
        totalPackages,
        activePackages,
        totalInquiries,
        inquiriesToday,
        totalBookings,
        activeBookings,
        totalRevenueCollected,
        totalOutstandingBalance,
        overdueCount: overdueFollowUps.length,
        todayFollowUpCount: todayFollowUps.length,
      },
      followUpAlerts: {
        overdue: overdueFollowUps,
        today: todayFollowUps,
      },
      recentInquiries,
    });
  } catch (error) {
    console.error("Dashboard KPI fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}
