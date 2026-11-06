import crypto from "crypto";
import { cookies } from "next/headers";

const SECRET_KEY =
  process.env.ADMIN_JWT_SECRET || "tripmaster_super_luxury_secret_key_2026";
const COOKIE_NAME = "tm_admin_session";

// Password Hashing using PBKDF2 with SHA-512
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    return crypto.timingSafeEqual(Buffer.from(key, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

// HMAC-Signed Session Token (Self-contained, edge & node compatible)
export interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: string;
  exp: number;
}

export function createSessionToken(user: {
  id: string;
  email: string;
  name: string;
  role: string;
}): string {
  const payload: AdminSession = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const dataStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(dataStr)
    .digest("base64url");

  return `${dataStr}.${signature}`;
}

export function verifySessionToken(token: string): AdminSession | null {
  try {
    const [dataStr, signature] = token.split(".");
    if (!dataStr || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(dataStr)
      .digest("base64url");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
      return null;
    }

    const payload: AdminSession = JSON.parse(
      Buffer.from(dataStr, "base64url").toString("utf-8")
    );

    if (Date.now() > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

// Server-side helper to read session from cookies
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;

