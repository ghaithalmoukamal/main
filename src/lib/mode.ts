import type { DisplayMode } from "./types";
import { LITE_MODE_MBPS_THRESHOLD } from "./constants";

const COOKIE_NAME = "display-mode";
const STORAGE_KEY = "display-mode";

export function readModeCookie(cookieHeader: string | null): DisplayMode | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=(lite|normal)`));
  return (match?.[1] as DisplayMode) ?? null;
}

export function getStoredMode(): DisplayMode | null {
  if (typeof window === "undefined") return null;
  const fromStorage = window.localStorage.getItem(STORAGE_KEY);
  if (fromStorage === "lite" || fromStorage === "normal") return fromStorage;
  const fromCookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))
    ?.split("=")[1];
  if (fromCookie === "lite" || fromCookie === "normal") return fromCookie;
  return null;
}

export function persistMode(mode: DisplayMode): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, mode);
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_NAME}=${mode}; path=/; max-age=${oneYear}; SameSite=Lax`;
}

/**
 * Auto-detect display mode based on connection info.
 * Falls back to "normal" if API unavailable.
 */
export function autoDetectMode(): DisplayMode {
  if (typeof navigator === "undefined") return "normal";
  // @ts-expect-error: connection is non-standard but widely supported
  const conn = navigator.connection;
  if (!conn) return "normal";
  if (conn.saveData === true) return "lite";
  const downlink = conn.downlink as number | undefined;
  if (downlink !== undefined && downlink < LITE_MODE_MBPS_THRESHOLD) {
    return "lite";
  }
  const effectiveType = conn.effectiveType as string | undefined;
  if (effectiveType && /^(slow-)?(2g|3g)$/.test(effectiveType)) return "lite";
  return "normal";
}
