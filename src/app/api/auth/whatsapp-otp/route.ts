import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { phone, otp } = body as { phone?: string; otp?: string };

  if (!phone) {
    return NextResponse.json({ error: "phone required" }, { status: 400 });
  }

  // SEND mode: generate OTP and deliver via WhatsApp Business API
  if (!otp) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // TODO: store hash(code) in Redis/Supabase with 10min TTL
    // TODO: send via WA Business API: `Su código de verificación es ${code}`

    if (process.env.NODE_ENV === "development") {
      console.log(`[WA OTP] ${phone} → ${code}`);
      return NextResponse.json({ sent: true, dev_code: code });
    }

    return NextResponse.json({ sent: true });
  }

  // VERIFY mode: check OTP against stored hash
  // TODO: look up stored OTP for this phone, compare hash
  // TODO: if valid, create/update Supabase auth session
  // Placeholder: always succeeds in dev
  if (process.env.NODE_ENV === "development") {
    return NextResponse.json({ verified: true, user_id: `demo-${phone}` });
  }

  return NextResponse.json({ error: "invalid_otp" }, { status: 401 });
}
