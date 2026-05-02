"use client";

import { createBrowserClient } from "@supabase/ssr";

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY = "placeholder-anon-key";

export function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_KEY;
  return createBrowserClient(url, key);
}

export const isSupabaseConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
