import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter — resets on every cold start / serverless spin.
// Replace with Redis (Upstash) before production for persistence across instances.
// ---------------------------------------------------------------------------
interface RateEntry { count: number; windowStart: number }
const otpRateMap = new Map<string, RateEntry>();

const OTP_MAX_REQUESTS = 3;          // max OTP sends per phone per window
const OTP_WINDOW_MS    = 60 * 60 * 1000; // 1-hour rolling window

function isRateLimited(phone: string): boolean {
  const now   = Date.now();
  const entry = otpRateMap.get(phone);

  if (!entry || now - entry.windowStart > OTP_WINDOW_MS) {
    otpRateMap.set(phone, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= OTP_MAX_REQUESTS) return true;

  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  let body: { phone?: string; otp?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { phone, otp } = body;

  if (!phone || typeof phone !== "string") {
    return NextResponse.json({ error: "phone required" }, { status: 400 });
  }

  // Basic phone-number sanity check — digits, +, spaces, dashes only
  if (!/^\+?[\d\s\-]{7,20}$/.test(phone.trim())) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }

  // SEND mode: generate OTP and deliver via WhatsApp Business API
  if (!otp) {
    if (isRateLimited(phone)) {
      return NextResponse.json(
        { error: "rate_limited", retryAfterSeconds: 3600 },
        { status: 429 }
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // TODO: store hash(code) in Redis/Supabase with 10-min TTL
    // TODO: send via WA Business API: `رمز التحقق هو ${code}`

    if (process.env.NODE_ENV === "development") {
      // Only log to server console in dev — never return OTP in the response body
      console.log(`[WA OTP DEV] ${phone} → ${code}`);
    }

    return NextResponse.json({ sent: true });
  }

  // VERIFY mode: check OTP against stored hash
  if (typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
    return NextResponse.json({ error: "invalid_otp_format" }, { status: 400 });
  }

  // TODO: look up stored OTP hash for this phone and compare
  // TODO: if valid, create/update Supabase auth session
  // Placeholder: always succeeds in dev only
  if (process.env.NODE_ENV === "development") {
    return NextResponse.json({ verified: true, user_id: `demo-${phone.replace(/\D/g, "")}` });
  }

  return NextResponse.json({ error: "invalid_otp" }, { status: 401 });
}
