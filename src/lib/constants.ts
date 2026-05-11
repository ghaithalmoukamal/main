import type {
  ZoneType,
  AdFormat,
  SubscriptionDuration,
  FirmSpecialization,
  PricingType,
  OutsideZoneType,
} from "./types";

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

// ============================================================
// Contractor specializations
// ============================================================
export const CONTRACTOR_SPECIALIZATIONS: Array<{ value: string; label_ar: string; label_en: string }> = [
  { value: "civil",        label_ar: "أعمال مدنية",          label_en: "Civil Works" },
  { value: "finishing",    label_ar: "أعمال تشطيب",          label_en: "Finishing Works" },
  { value: "mep",          label_ar: "ميكانيك وكهرباء وصحي", label_en: "MEP" },
  { value: "interior",     label_ar: "تصميم داخلي",          label_en: "Interior Design" },
  { value: "demolition",   label_ar: "هدم وترميم",            label_en: "Demolition & Restoration" },
  { value: "landscaping",  label_ar: "تنسيق حدائق",          label_en: "Landscaping" },
  { value: "painting",     label_ar: "دهانات",                label_en: "Painting" },
  { value: "electrical",   label_ar: "كهرباء",                label_en: "Electrical" },
  { value: "plumbing",     label_ar: "صحي",                   label_en: "Plumbing" },
  { value: "hvac",         label_ar: "تكييف وتبريد",          label_en: "HVAC" },
  { value: "general",      label_ar: "أعمال عامة",            label_en: "General Contracting" },
];

// ============================================================
// Firm structure & specialization
// ============================================================
export const FIRM_STRUCTURES: Array<{ value: "solo" | "company"; label_ar: string; label_en: string; icon: string }> = [
  { value: "solo",    label_ar: "مهندس مستقل",    label_en: "Solo Engineer",  icon: "👤" },
  { value: "company", label_ar: "شركة هندسية",     label_en: "Engineering Co.", icon: "🏢" },
];

export const FIRM_SPECIALIZATIONS: Record<
  FirmSpecialization,
  { label_ar: string; label_en: string; icon: string; default_trades: string[] }
> = {
  architecture_interior: {
    label_ar: "معمارية وتصميم داخلي",
    label_en: "Architecture & Interior Design",
    icon: "🏛️",
    default_trades: ["carpenter", "painter", "tiler", "aluminum"],
  },
  structural_civil: {
    label_ar: "إنشائية ومدنية",
    label_en: "Structural & Civil Engineering",
    icon: "🏗️",
    default_trades: ["stonemason", "welder", "blacksmith"],
  },
  mep: {
    label_ar: "ميكانيك وكهرباء وصحي",
    label_en: "MEP Engineering",
    icon: "⚡",
    default_trades: ["electrician", "plumber", "mechanic"],
  },
  general_contractor: {
    label_ar: "مقاولات عامة",
    label_en: "General Contractor",
    icon: "🔨",
    default_trades: [], // all trades
  },
  multidisciplinary: {
    label_ar: "متعددة التخصصات",
    label_en: "Multidisciplinary",
    icon: "🔧",
    default_trades: [], // all trades
  },
  freelance_engineer: {
    label_ar: "مهندس مستقل",
    label_en: "Freelance Engineer",
    icon: "👤",
    default_trades: [], // all trades
  },
  sole_contractor: {
    label_ar: "مقاول فردي",
    label_en: "Sole Contractor",
    icon: "🪚",
    default_trades: [], // all trades
  },
};

// ============================================================
// Maalem pricing types
// ============================================================
export const PRICING_TYPES: Record<
  PricingType,
  { label_ar: string; label_en: string; unit_ar: string; unit_en: string; icon: string }
> = {
  fixed:          { label_ar: "سعر ثابت",         label_en: "Fixed Price",  unit_ar: "",           unit_en: "",         icon: "💰" },
  per_hour:       { label_ar: "بالساعة",           label_en: "Per Hour",     unit_ar: "/ ساعة",     unit_en: "/ hr",     icon: "⏱️" },
  per_sqm:        { label_ar: "بالمتر المربع",     label_en: "Per m²",       unit_ar: "/ م²",       unit_en: "/ m²",     icon: "📐" },
  per_meter:      { label_ar: "بالمتر الطولي",     label_en: "Per Meter",    unit_ar: "/ م",        unit_en: "/ m",      icon: "📏" },
  per_unit:       { label_ar: "بالقطعة / الوحدة", label_en: "Per Unit",     unit_ar: "/ قطعة",     unit_en: "/ unit",   icon: "📦" },
  custom_formula: { label_ar: "تسعيرة مخصصة",     label_en: "Custom Blocks",unit_ar: "مخصص",       unit_en: "custom",   icon: "⚙️" },
};

// ============================================================
// Outside-zone surcharge types
// ============================================================
export const OUTSIDE_ZONE_TYPES: Record<
  OutsideZoneType,
  { label_ar: string; label_en: string; icon: string }
> = {
  not_available: { label_ar: "لا أعمل خارج المنطقة", label_en: "Not available outside area", icon: "🚫" },
  flat_fee:      { label_ar: "رسوم إضافية ثابتة",    label_en: "Flat fee surcharge",         icon: "💳" },
  per_km:        { label_ar: "رسوم لكل كيلومتر",     label_en: "Per km surcharge",           icon: "🛣️" },
  percentage:    { label_ar: "نسبة من إجمالي الفاتورة", label_en: "% of total invoice",      icon: "📊" },
};
