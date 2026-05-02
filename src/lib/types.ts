// ============================================================
// Core entity types — mirror Supabase schema (001_init.sql)
// ============================================================

export type Role =
  | "admin"
  | "moderator"
  | "worker"
  | "supplier"
  | "craftsman"
  | "user";

export interface WorkerPermissions {
  can_approve_craftsmen?: boolean;
  can_approve_companies?: boolean;
  can_approve_ads?: boolean;
  can_approve_trades?: boolean;
  can_approve_channel_posts?: boolean;
  can_manage_zones?: boolean;
  can_view_disputes?: boolean;
  can_remove_ads?: false; // workers NEVER remove ads
  allowed_trade_ids?: number[];
  allowed_zone_ids?: number[];
  allowed_entity_types?: Array<
    "craftsman" | "company" | "ad" | "trade" | "channel_post"
  >;
  daily_action_cap?: number;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: Role;
  permissions: WorkerPermissions;
  behavior_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: number;
  name_ar: string;
  name_en: string;
  country: string;
}

export interface Trade {
  id: number;
  name_ar: string;
  name_en: string;
  icon: string | null;
  is_approved: boolean;
  submitted_by: string | null;
  approved_by: string | null;
  created_at: string;
}

export interface AssetType {
  id: number;
  name_ar: string;
  name_en: string;
  trade_id: number | null;
}

export type ApprovalStatus = "pending" | "approved" | "rejected";
export type CraftsmanStatus = "open" | "busy";
export type DisplayMode = "lite" | "normal";

export interface Craftsman {
  id: string;
  user_id: string | null;
  city_id: number;
  name: string;
  trade_id: number | null;
  custom_trade_name: string | null;
  bio_ar: string | null;
  bio_en: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  photo_url: string | null;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  status: CraftsmanStatus;
  approval_status: ApprovalStatus;
  approved_by: string | null;
  is_verified: boolean;
  is_elite: boolean;
  mode_pref: DisplayMode | null;
  created_at: string;
  updated_at: string;
  // Joined
  trade?: Trade | null;
  city?: City;
}

export interface Service {
  id: number;
  craftsman_id: string;
  name_ar: string;
  name_en: string | null;
  description: string | null;
  starting_price: number | null;
  currency: string;
}

export interface WorkshopAsset {
  id: number;
  craftsman_id: string;
  asset_type_id: number | null;
  custom_name: string | null;
  is_verified: boolean;
  // Joined
  asset_type?: AssetType | null;
}

export interface WorkJournalPost {
  id: number;
  craftsman_id: string;
  title: string;
  description: string | null;
  photos: string[];
  created_at: string;
}

export type CompanyType =
  | "engineering_firm"
  | "contractor"
  | "interior_design"
  | "supplier"
  | "other";

export interface Company {
  id: string;
  user_id: string | null;
  city_id: number;
  name: string;
  type: CompanyType;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  website: string | null;
  logo_url: string | null;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  approval_status: ApprovalStatus;
  approved_by: string | null;
  created_at: string;
}

export interface ProjectTeam {
  id: number;
  company_id: string;
  name: string;
  craftsman_ids: string[];
  created_at: string;
}

export type ZoneType =
  | "construction"
  | "market"
  | "industrial"
  | "heritage"
  | "residential"
  | "commercial";

export type ZoneVisibility = "public" | "firms_only" | "admin_only";

export interface MapZone {
  id: number;
  city_id: number;
  name_ar: string;
  name_en: string;
  type: ZoneType;
  description: string | null;
  geojson: GeoJSON.Polygon | GeoJSON.MultiPolygon;
  color: string;
  visibility: ZoneVisibility;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
}

export type LeadStatus =
  | "pending"
  | "approved"
  | "declined"
  | "waiting"
  | "in_progress"
  | "completed_by_craftsman"
  | "completed"
  | "disputed"
  | "expired";

export type ContactMethod = "whatsapp" | "in_app";

export interface Lead {
  id: number;
  craftsman_id: string;
  client_user_id: string | null;
  client_company_id: string | null;
  contact_method: ContactMethod;
  description: string;
  status: LeadStatus;
  waiting_until: string | null;
  extension_used: boolean;
  craftsman_notes: string | null;
  client_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobEvidence {
  id: number;
  lead_id: number;
  submitted_by: string;
  role: "craftsman" | "client";
  type: "progress" | "completion";
  photos: string[];
  notes: string | null;
  created_at: string;
}

export interface Rating {
  id: number;
  lead_id: number;
  rated_by: string;
  rated_entity_type: "craftsman" | "client";
  rated_entity_id: string;
  quality: number;
  punctuality: number;
  communication: number;
  price_fairness: number;
  comment: string | null;
  is_public: boolean;
  created_at: string;
}

export interface Dispute {
  id: number;
  lead_id: number;
  raised_by: string;
  status: "open" | "in_mediation" | "resolved" | "closed";
  escalation_level: 1 | 2 | 3;
  admin_notes: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

export type SubscriptionAudience = "firm" | "supplier";
export type SubscriptionDuration = "one_time" | "monthly" | "yearly";

export interface SubscriptionPlan {
  id: number;
  name_ar: string;
  name_en: string;
  target_audience: SubscriptionAudience;
  duration_type: SubscriptionDuration;
  price: number;
  currency: string;
  features: string[];
  max_contacts_per_month: number | null;
  max_ads: number | null;
  can_target_zones: boolean;
  can_target_categories: boolean;
  priority_placement: boolean;
  analytics_access: boolean;
  is_active: boolean;
}

export interface Subscription {
  id: number;
  user_id: string;
  plan_id: number;
  status: "active" | "expired" | "cancelled";
  starts_at: string;
  ends_at: string | null;
  stripe_id: string | null;
}

export type AdFormat =
  | "image_card"
  | "sponsored_search"
  | "banner"
  | "channel_post";

export interface Ad {
  id: number;
  company_id: string;
  format: AdFormat;
  title_ar: string;
  title_en: string | null;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  whatsapp: string | null;
  target_trade_ids: number[];
  target_zone_ids: number[];
  ad_type: "one_time" | "subscription";
  subscription_id: number | null;
  approval_status: ApprovalStatus;
  approved_by: string | null;
  is_active: boolean;
  starts_at: string;
  ends_at: string | null;
  impressions: number;
  clicks: number;
}

export type ChannelSource = "auto" | "admin" | "suggested";

export interface Channel {
  id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  type: "trade" | "material" | "zone" | "custom";
  related_trade_id: number | null;
  related_zone_id: number | null;
  source: ChannelSource;
  is_active: boolean;
}

export interface ChannelPost {
  id: number;
  channel_id: number;
  company_id: string;
  title: string;
  description: string | null;
  photos: string[];
  price_info: string | null;
  whatsapp: string | null;
  approval_status: ApprovalStatus;
  approved_by: string | null;
  created_at: string;
}

export interface MaterialRequest {
  id: number;
  craftsman_id: string;
  description: string;
  target_channel_ids: number[];
  created_at: string;
  expires_at: string;
}

export interface FraudFlag {
  id: number;
  entity_type: string;
  entity_id: string;
  signal:
    | "duplicate_phone"
    | "ghost_profile"
    | "accept_cancel"
    | "rating_anomaly";
  severity: "low" | "medium" | "high";
  raw_data: Record<string, unknown>;
  status: "open" | "reviewed" | "dismissed";
  reviewed_by: string | null;
  created_at: string;
}

export interface BehaviorIndicator {
  id: number;
  entity_type: string;
  entity_id: string;
  indicator_key: string;
  value: number;
  computed_at: string;
}

export interface Report {
  id: number;
  reporter_id: string;
  target_entity_type: string;
  target_entity_id: string;
  reason: string;
  status: "open" | "reviewed" | "actioned" | "dismissed";
  reviewed_by: string | null;
  created_at: string;
}

export interface AuditLog {
  id: number;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
}

export interface ReliabilityMetrics {
  approval_rate: number;
  completion_rate: number;
  avg_response_minutes: number;
  on_time_rate: number;
  total_jobs: number;
}

// ============================================================
// Reliability metrics — visible only to firms
// ============================================================
