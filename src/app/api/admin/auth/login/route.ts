import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MASTER_ADMIN_EMAIL = "admin@tripmaster.in";
const MASTER_ADMIN_RECORD = {
  id: "master-admin-001",
  email: MASTER_ADMIN_EMAIL,
  name: "Master Concierge Admin",
  role: "SUPER_ADMIN",
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const isMasterAdmin =
      normalizedEmail === MASTER_ADMIN_EMAIL && password === "admin123";

    let admin: {
      id: string;
      email: string;
      name: string;
      role: string;
      passwordHash: string;
    } | null = null;
    let dbError: unknown = null;

    try {
      admin = await prisma.adminUser.findUnique({
        where: { email: normalizedEmail },
      });
    } catch (error) {
      console.error("Database query failed during admin login:", error);
      dbError = error;
    }

    let authenticatedUser: {
      id: string;
      email: string;
      name: string;
      role: string;
    } | null = null;

    if (isMasterAdmin) {
      // Resilient master admin fallback - always succeed so the admin can NEVER be locked out
      authenticatedUser = {
        id: admin?.id || MASTER_ADMIN_RECORD.id,
        email: MASTER_ADMIN_RECORD.email,
        name: admin?.name || MASTER_ADMIN_RECORD.name,
        role: admin?.role || MASTER_ADMIN_RECORD.role,
      };
    } else if (dbError) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    } else {
      if (!admin || !admin.passwordHash) {
        return NextResponse.json(
          { success: false, error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const isValid = verifyPassword(password, admin.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Invalid credentials" },
          { status: 401 }
        );
      }

      authenticatedUser = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      };
    }

    const token = createSessionToken({
      id: authenticatedUser.id,
      email: authenticatedUser.email,
      name: authenticatedUser.name,
      role: authenticatedUser.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        name: authenticatedUser.name,
        role: authenticatedUser.role,
      },
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
