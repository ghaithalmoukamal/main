import { NextRequest, NextResponse } from "next/server";

// Twilio inbound SMS webhook
// Same command set as WA bot: STATUS BUSY, STATUS OPEN, LEAD APPROVE <id>

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ ok: true });

  const from = (formData.get("From") as string | null) ?? "";
  const body = ((formData.get("Body") as string | null) ?? "").toUpperCase().trim();

  if (body === "STATUS BUSY" || body === "مشغول") {
    console.log(`[SMS bot] ${from} → status: busy`);
    // TODO: update craftsman status
  } else if (body === "STATUS OPEN" || body === "متاح") {
    console.log(`[SMS bot] ${from} → status: open`);
    // TODO: update craftsman status
  } else if (body.startsWith("LEAD APPROVE ")) {
    const leadId = parseInt(body.split(" ")[2] ?? "0");
    if (leadId) console.log(`[SMS bot] ${from} → approve lead ${leadId}`);
    // TODO: approve lead
  } else if (body.startsWith("LEAD DECLINE ")) {
    const leadId = parseInt(body.split(" ")[2] ?? "0");
    if (leadId) console.log(`[SMS bot] ${from} → decline lead ${leadId}`);
    // TODO: decline lead
  }

  // TwiML response (empty = no SMS reply sent)
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, {
    headers: { "Content-Type": "text/xml" },
  });
}
