import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

// Twilio inbound SMS webhook
// Same command set as WA bot: STATUS BUSY, STATUS OPEN, LEAD APPROVE <id>

// ---------------------------------------------------------------------------
// Twilio signature verification
// Twilio signs every request with HMAC-SHA1 of: URL + sorted POST params
// Header: x-twilio-signature
// Docs: https://www.twilio.com/docs/usage/webhooks/webhooks-security
// ---------------------------------------------------------------------------
function verifyTwilioSignature(
  req: NextRequest,
  rawFormData: URLSearchParams
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    if (process.env.NODE_ENV === "development") return true;
    console.error("[SMS webhook] TWILIO_AUTH_TOKEN not set — rejecting");
    return false;
  }

  const signature = req.headers.get("x-twilio-signature");
  if (!signature) return false;

  // Build the string Twilio signs: full URL + sorted params concatenated
  const url = req.url;
  const sortedParams = Array.from(rawFormData.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}${v}`)
    .join("");

  const expected = createHmac("sha1", authToken)
    .update(url + sortedParams, "utf8")
    .digest("base64");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  return timingSafeEqual(sigBuf, expBuf);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ ok: true });

  const rawParams = new URLSearchParams();
  formData.forEach((v, k) => rawParams.set(k, v as string));

  if (!verifyTwilioSignature(req, rawParams)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const from = (formData.get("From") as string | null) ?? "";
  const body = ((formData.get("Body") as string | null) ?? "").toUpperCase().trim();

  if (body === "STATUS BUSY" || body === "مشغول") {
    console.log(`[SMS bot] ${from} → status: busy`);
    // TODO: update craftsman status in Supabase
  } else if (body === "STATUS OPEN" || body === "متاح") {
    console.log(`[SMS bot] ${from} → status: open`);
    // TODO: update craftsman status in Supabase
  } else if (body.startsWith("LEAD APPROVE ")) {
    const leadId = parseInt(body.split(" ")[2] ?? "0");
    if (leadId) console.log(`[SMS bot] ${from} → approve lead ${leadId}`);
    // TODO: approve lead in Supabase
  } else if (body.startsWith("LEAD DECLINE ")) {
    const leadId = parseInt(body.split(" ")[2] ?? "0");
    if (leadId) console.log(`[SMS bot] ${from} → decline lead ${leadId}`);
    // TODO: decline lead in Supabase
  }

  // TwiML response (empty = no SMS reply sent back)
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, {
    headers: { "Content-Type": "text/xml" },
  });
}
