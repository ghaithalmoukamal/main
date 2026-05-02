/**
 * Generate a wa.me deep link for WhatsApp.
 * Number must be in international E.164 form WITHOUT the + sign.
 */
export function whatsappLink(phone: string, prefilled?: string): string {
  const cleaned = phone.replace(/[^\d]/g, "");
  const text = prefilled
    ? `?text=${encodeURIComponent(prefilled)}`
    : "";
  return `https://wa.me/${cleaned}${text}`;
}

export function instagramLink(handle: string): string {
  const cleaned = handle.replace(/^@/, "").trim();
  return `https://instagram.com/${cleaned}`;
}

export function facebookLink(handle: string): string {
  // Facebook handles or numeric IDs both work via /
  return `https://facebook.com/${handle.replace(/^\//, "")}`;
}

/**
 * Build the share message for a craftsman profile.
 */
export function craftsmanShareText(
  name: string,
  trade: string,
  url: string,
  locale: "ar" | "en"
): string {
  if (locale === "ar") {
    return `شوف هاد المعلم على سوق الحرفيين:\n${name} — ${trade}\n${url}`;
  }
  return `Check out this craftsman on Souq Al-Hirfiyeen:\n${name} — ${trade}\n${url}`;
}

/**
 * Compose a WhatsApp share URL for a craftsman profile.
 */
export function shareToWhatsApp(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function shareToFacebook(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

/**
 * Round coordinates to ~1 km grid for "approximate" public location.
 * Reveals neighborhood-level only; exact lat/lng kept server-side until lead approved.
 */
export function approximateCoords(
  lat: number,
  lng: number,
  precision = 2
): [number, number] {
  const factor = Math.pow(10, precision);
  return [Math.round(lat * factor) / factor, Math.round(lng * factor) / factor];
}

/**
 * Haversine distance in kilometers.
 */
export function haversineKm(
  a: [number, number],
  b: [number, number]
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Format minutes into a friendly relative string.
 */
export function formatRelativeTime(
  minutesElapsed: number,
  locale: "ar" | "en"
): string {
  if (locale === "ar") {
    if (minutesElapsed < 1) return "الآن";
    if (minutesElapsed < 60) return `${Math.floor(minutesElapsed)} دقيقة`;
    if (minutesElapsed < 60 * 24)
      return `${Math.floor(minutesElapsed / 60)} ساعة`;
    return `${Math.floor(minutesElapsed / (60 * 24))} يوم`;
  }
  if (minutesElapsed < 1) return "just now";
  if (minutesElapsed < 60) return `${Math.floor(minutesElapsed)} min`;
  if (minutesElapsed < 60 * 24)
    return `${Math.floor(minutesElapsed / 60)} hr`;
  return `${Math.floor(minutesElapsed / (60 * 24))} days`;
}

/**
 * Time remaining until a target ISO timestamp, in minutes.
 */
export function minutesUntil(iso: string | null): number {
  if (!iso) return 0;
  const target = new Date(iso).getTime();
  return Math.max(0, Math.floor((target - Date.now()) / 60000));
}

/**
 * Generate a slug from arbitrary text (Arabic or Latin).
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^؀-ۿa-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Choose the right localized field on an entity based on locale.
 */
export function pickLocalized(
  obj: unknown,
  base: string,
  locale: "ar" | "en"
): string {
  if (!obj || typeof obj !== "object") return "";
  const record = obj as Record<string, unknown>;
  const arKey = `${base}_ar`;
  const enKey = `${base}_en`;
  if (locale === "ar") {
    return (record[arKey] as string) || (record[enKey] as string) || "";
  }
  return (record[enKey] as string) || (record[arKey] as string) || "";
}

/**
 * Format currency for SYP/USD display.
 */
export function formatPrice(
  amount: number | null,
  currency: string,
  locale: "ar" | "en"
): string {
  if (amount == null) return "";
  const num = new Intl.NumberFormat(locale === "ar" ? "ar-SY" : "en-US").format(
    amount
  );
  if (currency === "USD") return `$${num}`;
  if (currency === "SYP")
    return locale === "ar" ? `${num} ل.س` : `${num} SYP`;
  return `${num} ${currency}`;
}

export function classNames(
  ...args: Array<string | false | null | undefined>
): string {
  return args.filter(Boolean).join(" ");
}
