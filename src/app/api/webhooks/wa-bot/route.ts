import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

// WhatsApp Business API webhook — handles inbound messages from craftsmen
// Commands: STATUS BUSY, STATUS OPEN, LEAD APPROVE <id>, LEAD DECLINE <id>

// ---------------------------------------------------------------------------
// Signature verification
// Meta signs every POST with HMAC-SHA256 of the raw body using your app secret.
// Header: x-hub-signature-256 = "sha256=<hex>"
// ---------------------------------------------------------------------------
async function verifyMetaSignature(req: NextRequest, rawBody: string): Promise<boolean> {
  const appSecret = process.env.WA_APP_SECRET;
  if (!appSecret) {
    // In dev, skip verification if secret isn't configured yet
    if (process.env.NODE_ENV === "development") return true;
    console.error("[WA webhook] WA_APP_SECRET not set — rejecting request");
    return false;
  }

  const signature = req.headers.get("x-hub-signature-256");
  if (!signature?.startsWith("sha256=")) return false;

  const expected = createHmac("sha256", appSecret)
    .update(rawBody, "utf8")
    .digest("hex");

  const sigBuffer = Buffer.from(signature.slice(7));
  const expBuffer = Buffer.from(expected);

  // Use timing-safe comparison to prevent timing attacks
  if (sigBuffer.length !== expBuffer.length) return false;
  return timingSafeEqual(sigBuffer, expBuffer);
}

export async function GET(req: NextRequest) {
  // Webhook verification handshake
  const url   = new URL(req.url);
  const mode  = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WA_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  if (!await verifyMetaSignature(req, rawBody)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: true }); // malformed but signature passed — ignore
  }

  // Extract message text and sender phone from WA payload
  const entry   = (body?.entry as unknown[])?.[0] as Record<string, unknown> | undefined;
  const change  = (entry?.changes as unknown[])?.[0] as Record<string, unknown> | undefined;
  const value   = change?.value as Record<string, unknown> | undefined;
  const message = (value?.messages as unknown[])?.[0] as Record<string, unknown> | undefined;

  if (!message) return NextResponse.json({ ok: true });

  const from: string = (message.from as string) ?? "";
  const text: string = ((message.text as Record<string, string>)?.body ?? "").toUpperCase().trim();

  if (text === "STATUS BUSY" || text === "مشغول") {
    await updateCraftsmanStatus(from, "busy");
  } else if (text === "STATUS OPEN" || text === "متاح") {
    await updateCraftsmanStatus(from, "open");
  } else if (text.startsWith("LEAD APPROVE ")) {
    const leadId = parseInt(text.split(" ")[2] ?? "0");
    if (leadId) await updateLeadStatus(from, leadId, "approved");
  } else if (text.startsWith("LEAD DECLINE ")) {
    const leadId = parseInt(text.split(" ")[2] ?? "0");
    if (leadId) await updateLeadStatus(from, leadId, "declined");
  }

  return NextResponse.json({ ok: true });
}

async function updateCraftsmanStatus(phone: string, status: "open" | "busy"): Promise<void> {
  // TODO: find craftsman by phone, update status in Supabase
  console.log(`[WA bot] ${phone} → status: ${status}`);
}

async function updateLeadStatus(
  phone: string,
  leadId: number,
  status: "approved" | "declined"
): Promise<void> {
  // TODO: verify lead belongs to craftsman with this phone, update status
  console.log(`[WA bot] ${phone} → lead ${leadId}: ${status}`);
}
