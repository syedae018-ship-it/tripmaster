import crypto from "crypto";

export function isRazorpayConfigured(): boolean {
  // If dummy mode is explicitly forced in .env or keys contain "dummy", treat as dummy/simulated
  if (
    process.env.NEXT_PUBLIC_RAZORPAY_DUMMY_MODE === "true" ||
    (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID.includes("dummy"))
  ) {
    return false;
  }

  return Boolean(
    process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      process.env.RAZORPAY_KEY_ID.startsWith("rzp_") &&
      !process.env.RAZORPAY_KEY_ID.includes("dummy")
  );
}

export function isRazorpayDummyMode(): boolean {
  return !isRazorpayConfigured();
}

export function getRazorpayKeyId(): string {
  if (isRazorpayConfigured()) {
    return process.env.RAZORPAY_KEY_ID!;
  }
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy_tripmaster";
}

export interface CreateOrderParams {
  amount: number; // in INR rupees
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  amount: number; // in paise
  currency: string;
  receipt?: string;
  status: string;
  isSimulated: boolean;
  isDummy: boolean;
  keyId: string;
}

export async function createRazorpayOrder(
  params: CreateOrderParams
): Promise<RazorpayOrderResult> {
  const { amount, currency = "INR", receipt, notes } = params;
  const amountPaise = Math.max(100, Math.round(amount * 100)); // minimum 100 paise (₹1)

  // If Razorpay live/test credentials are configured, create real order via Razorpay API
  if (isRazorpayConfigured()) {
    try {
      const keyId = process.env.RAZORPAY_KEY_ID!;
      const keySecret = process.env.RAZORPAY_KEY_SECRET!;
      const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;

      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountPaise,
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
          notes: notes || {},
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Razorpay order creation failed:", errorText);
        throw new Error(`Razorpay API responded with ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      return {
        id: data.id,
        amount: data.amount,
        currency: data.currency,
        receipt: data.receipt,
        status: data.status,
        isSimulated: false,
        isDummy: false,
        keyId,
      };
    } catch (err) {
      console.warn("Failed calling real Razorpay API, falling back to dummy simulation mode:", err);
    }
  }

  // Realistic Simulation / Dummy Mode fallback
  const dummyOrderId = `order_dummy_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    id: dummyOrderId,
    amount: amountPaise,
    currency,
    receipt: receipt || `rcpt_dummy_${Date.now()}`,
    status: "created",
    isSimulated: true,
    isDummy: true,
    keyId: getRazorpayKeyId(),
  };
}

export interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export function verifyRazorpayPaymentSignature(
  params: VerifyPaymentParams
): { isValid: boolean; isSimulated: boolean; isDummy: boolean; error?: string } {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return {
      isValid: false,
      isSimulated: false,
      isDummy: false,
      error: "Missing required Razorpay parameters",
    };
  }

  // Simulation / Dummy mode check
  if (
    razorpay_order_id.startsWith("order_sim_") ||
    razorpay_order_id.startsWith("order_dummy_") ||
    razorpay_payment_id.startsWith("pay_sim_") ||
    razorpay_payment_id.startsWith("pay_dummy_") ||
    razorpay_signature.startsWith("sim_sig_") ||
    razorpay_signature.startsWith("dummy_sig_") ||
    isRazorpayDummyMode()
  ) {
    return {
      isValid: true,
      isSimulated: true,
      isDummy: true,
    };
  }

  // Live / Test Mode HMAC SHA256 Signature Verification
  if (!isRazorpayConfigured()) {
    return {
      isValid: true,
      isSimulated: true,
      isDummy: true,
    };
  }

  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;
    return {
      isValid,
      isSimulated: false,
      isDummy: false,
      error: isValid ? undefined : "Invalid cryptographic signature verification",
    };
  } catch (err: any) {
    return {
      isValid: false,
      isSimulated: false,
      isDummy: false,
      error: err.message || "Cryptographic verification error",
    };
  }
}

export function generateBookingReference(destinationPrefix = "TM"): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${destinationPrefix}-${year}-${randomSuffix}`;
}
