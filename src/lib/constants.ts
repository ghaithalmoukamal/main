import type { ZoneType, AdFormat, SubscriptionDuration } from "./types";

export const APP_NAME = {
  ar: "سوق الحرفيين",
  en: "Souq Al-Hirfiyeen",
} as const;

export const TAGLINE = {
  ar: "من إيد المعلم... لعندك دغري",
  en: "From the master's hand... straight to yours",
} as const;

export const BRAND_COLORS = {
  clay: "#8B4513",
  charcoal: "#1C2833",
  cream: "#F5F0E8",
  brass: "#C67B30",
  verified: "#2E7D32",
  busy: "#B71C1C",
} as const;

export const ZONE_TYPES: Record<
  ZoneType,
  { emoji: string; label_ar: string; label_en: string; color: string }
> = {
  construction: {
    emoji: "🏗️",
    label_ar: "منطقة إعمار",
    label_en: "Construction",
    color: "#C67B30",
  },
  market: {
    emoji: "🏪",
    label_ar: "سوق",
    label_en: "Market",
    color: "#2E7D32",
  },
  industrial: {
    emoji: "🏭",
    label_ar: "منطقة صناعية",
    label_en: "Industrial",
    color: "#1C2833",
  },
  heritage: {
    emoji: "🕌",
    label_ar: "منطقة تراثية",
    label_en: "Heritage",
    color: "#8B4513",
  },
  residential: {
    emoji: "🏠",
    label_ar: "منطقة سكنية",
    label_en: "Residential",
    color: "#475663",
  },
  commercial: {
    emoji: "🏢",
    label_ar: "منطقة تجارية",
    label_en: "Commercial",
    color: "#A86727",
  },
};

export const AD_FORMATS: Record<
  AdFormat,
  { label_ar: string; label_en: string }
> = {
  image_card: { label_ar: "بطاقة صورة وعنوان", label_en: "Image + Text Card" },
  sponsored_search: {
    label_ar: "نتيجة بحث مميزة",
    label_en: "Sponsored Search Result",
  },
  banner: { label_ar: "بانر علوي", label_en: "Top Banner" },
  channel_post: {
    label_ar: "منشور في قناة",
    label_en: "Channel Post",
  },
};

export const SUBSCRIPTION_DURATION: Record<
  SubscriptionDuration,
  { label_ar: string; label_en: string }
> = {
  one_time: { label_ar: "مرة وحدة", label_en: "One-time" },
  monthly: { label_ar: "شهري", label_en: "Monthly" },
  yearly: { label_ar: "سنوي", label_en: "Yearly" },
};

// Default Damascus map center (Old City area)
export const DAMASCUS_CENTER: [number, number] = [33.5138, 36.2765];
export const DEFAULT_ZOOM = 12;

// Waiting list rules
export const WAITING_LIST_DEFAULT_HOURS = 24;
export const WAITING_LIST_MAX_HOURS = 48; // after one extension

// Photo limits
export const MAX_PROFILE_PHOTOS = 5;
export const MAX_JOURNAL_PHOTOS = 10;
export const MAX_PHOTO_BYTES = 500 * 1024;

// Lite mode connection threshold
export const LITE_MODE_MBPS_THRESHOLD = 1.5;

// Behavior thresholds
export const REPORT_AUTO_SUSPEND_THRESHOLD = 3;
export const GHOST_PROFILE_DAYS_INACTIVE = 30;
export const ACCEPT_CANCEL_RATIO_THRESHOLD = 0.4;

// Default fraud severity colors
export const FRAUD_SEVERITY = {
  low: { color: "#FBC02D", label_ar: "خفيف", label_en: "Low" },
  medium: { color: "#F57C00", label_ar: "متوسط", label_en: "Medium" },
  high: { color: "#B71C1C", label_ar: "حرج", label_en: "Critical" },
} as const;

// Trade slugs map (used for URL-friendly identifiers)
export const TRADE_SLUGS: Record<string, string> = {
  carpenter: "carpenter",
  blacksmith: "blacksmith",
  electrician: "electrician",
  plumber: "plumber",
  painter: "painter",
  tiler: "tiler",
  welder: "welder",
  aluminum: "aluminum",
  stonemason: "stonemason",
  mechanic: "mechanic",
  turner: "turner",
  glassworker: "glassworker",
};
