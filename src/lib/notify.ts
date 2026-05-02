/**
 * Unified notification dispatcher.
 * Fans out to WhatsApp, SMS, web push, and in-app channels
 * based on the user's notification_preferences table.
 *
 * In dev (no env vars), all channels are mocked and log to console.
 */

export type NotifyEvent =
  | "lead_received"
  | "lead_approved"
  | "lead_declined"
  | "lead_waiting"
  | "job_completed"
  | "dispute_opened"
  | "status_change"
  | "zone_alert"
  | "material_request";

interface NotifyPayload {
  userId: string;
  event: NotifyEvent;
  data: Record<string, unknown>;
  title?: string;
  body?: string;
}

export async function notify(payload: NotifyPayload): Promise<void> {
  const { userId, event, data, title, body } = payload;

  // In production: read user's notification_preferences from Supabase
  // then fan out to enabled channels. For now, log only.
  if (process.env.NODE_ENV === "development") {
    console.log(`[notify] ${event} → user ${userId}`, { title, body, data });
    return;
  }

  // Production fan-out (wired when env vars are present):
  const tasks: Promise<void>[] = [];

  if (process.env.WHATSAPP_API_TOKEN) {
    tasks.push(sendWhatsAppNotification(userId, event, title ?? event, body ?? ""));
  }

  if (process.env.WEB_PUSH_PRIVATE_KEY) {
    tasks.push(sendWebPushNotification(userId, title ?? event, body ?? ""));
  }

  await Promise.allSettled(tasks);
}

async function sendWhatsAppNotification(
  userId: string,
  _event: string,
  title: string,
  body: string
): Promise<void> {
  // Wire to WhatsApp Business API
  // Look up user's whatsapp number from profiles/craftsmen table
  console.log(`[WA notify] ${userId}: ${title} — ${body}`);
}

async function sendWebPushNotification(
  userId: string,
  title: string,
  body: string
): Promise<void> {
  // Use web-push library with VAPID keys
  console.log(`[push notify] ${userId}: ${title} — ${body}`);
}
