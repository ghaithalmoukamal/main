import { NextRequest, NextResponse } from "next/server";

// WhatsApp Business API webhook — handles inbound messages from craftsmen
// Commands: STATUS BUSY, STATUS OPEN, LEAD APPROVE <id>, LEAD DECLINE <id>

export async function GET(req: NextRequest) {
  // Webhook verification handshake
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === process.env.WA_VERIFY_TOKEN
  ) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  // Extract message text and sender phone from WA payload
  const entry = body?.entry?.[0];
  const change = entry?.changes?.[0]?.value;
  const message = change?.messages?.[0];

  if (!message) {
    return NextResponse.json({ ok: true });
  }

  const from: string = message.from ?? "";
  const text: string = (message.text?.body ?? "").toUpperCase().trim();

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

async function updateCraftsmanStatus(
  phone: string,
  status: "open" | "busy"
): Promise<void> {
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
