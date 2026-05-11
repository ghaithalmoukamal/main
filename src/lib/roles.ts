import type { Profile, Role, WorkerPermissions } from "./types";

export const ROLES: Record<Role, { label_ar: string; label_en: string }> = {
  admin:      { label_ar: "مدير",          label_en: "Admin" },
  moderator:  { label_ar: "مشرف",          label_en: "Moderator" },
  worker:     { label_ar: "عامل مراجعة",   label_en: "Review Worker" }, // internal staff — NOT a craftsman
  supplier:   { label_ar: "مورّد",          label_en: "Supplier" },
  craftsman:  { label_ar: "معلم",           label_en: "Maalem" },       // the master craftsman
  firm:       { label_ar: "شركة هندسية",   label_en: "Engineering Firm" },
  contractor: { label_ar: "مقاول",          label_en: "Contractor" },
  homeowner:  { label_ar: "صاحب البيت",    label_en: "Homeowner" },
  user:       { label_ar: "مستخدم",         label_en: "User" },
};

export type Action =
  | "approve_craftsman"
  | "approve_company"
  | "approve_ad"
  | "approve_trade"
  | "approve_channel_post"
  | "manage_zones"
  | "view_disputes"
  | "remove_ad" // admin only
  | "manage_users"
  | "manage_subscriptions"
  | "view_audit_log"
  | "view_fraud_flags"
  | "view_talent_dashboard"
  | "manage_pricing";

interface ResourceContext {
  trade_id?: number;
  zone_id?: number;
  entity_type?: WorkerPermissions["allowed_entity_types"] extends Array<
    infer T
  >
    ? T
    : string;
}

/**
 * Permission gate. Layered decision:
 * 1. inactive profile → deny.
 * 2. admin → allow everything.
 * 3. moderator → allow approvals + zones + disputes (NOT ad removal, user mgmt, pricing).
 * 4. worker → granular permissions JSONB drives the answer.
 * 5. everyone else → deny admin actions.
 */
export function can(
  profile: Profile | null,
  action: Action,
  ctx: ResourceContext = {}
): boolean {
  if (!profile || !profile.is_active) return false;
  if (profile.role === "admin") return true;

  const adminOnly: Action[] = [
    "remove_ad",
    "manage_users",
    "manage_subscriptions",
    "manage_pricing",
  ];
  if (adminOnly.includes(action)) return false;

  if (profile.role === "moderator") {
    const moderatorAllowed: Action[] = [
      "approve_craftsman",
      "approve_company",
      "approve_ad",
      "approve_trade",
      "approve_channel_post",
      "manage_zones",
      "view_disputes",
      "view_audit_log",
      "view_fraud_flags",
      "view_talent_dashboard",
    ];
    return moderatorAllowed.includes(action);
  }

  if (profile.role === "worker") {
    return checkWorkerPermission(profile.permissions, action, ctx);
  }

  return false;
}

function checkWorkerPermission(
  perms: WorkerPermissions,
  action: Action,
  ctx: ResourceContext
): boolean {
  // Workers NEVER remove ads. Hard rule.
  if (action === "remove_ad") return false;

  const map: Partial<Record<Action, keyof WorkerPermissions>> = {
    approve_craftsman: "can_approve_craftsmen",
    approve_company: "can_approve_companies",
    approve_ad: "can_approve_ads",
    approve_trade: "can_approve_trades",
    approve_channel_post: "can_approve_channel_posts",
    manage_zones: "can_manage_zones",
    view_disputes: "can_view_disputes",
  };

  const flag = map[action];
  if (!flag) return false;
  if (!perms[flag]) return false;

  // Trade scope
  if (ctx.trade_id && perms.allowed_trade_ids?.length) {
    if (!perms.allowed_trade_ids.includes(ctx.trade_id)) return false;
  }

  // Zone scope
  if (ctx.zone_id && perms.allowed_zone_ids?.length) {
    if (!perms.allowed_zone_ids.includes(ctx.zone_id)) return false;
  }

  // Entity type scope
  if (
    ctx.entity_type &&
    perms.allowed_entity_types?.length &&
    !perms.allowed_entity_types.includes(
      ctx.entity_type as NonNullable<WorkerPermissions["allowed_entity_types"]>[number]
    )
  ) {
    return false;
  }

  return true;
}

export function isStaff(role: Role): boolean {
  return role === "admin" || role === "moderator" || role === "worker";
}

export function canSeeReliabilityScores(role: Role): boolean {
  // Reliability metrics visible only to firms (companies) and staff.
  return isStaff(role) || role === "user"; // user-as-firm-rep handled separately
}
