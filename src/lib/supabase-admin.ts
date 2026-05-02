import { createClient } from "@supabase/supabase-js";

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "placeholder-service-key";

/**
 * Service-role client. Bypasses RLS — use ONLY in trusted server-side
 * contexts (route handlers, cron jobs, admin actions). Never expose to
 * the browser.
 */
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || PLACEHOLDER_KEY;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
