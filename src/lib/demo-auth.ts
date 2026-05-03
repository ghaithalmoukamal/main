export type DemoRole =
  | "super_admin"
  | "admin"
  | "moderator"
  | "worker"
  | "supplier"
  | "craftsman"
  | "firm"
  | "user";

export interface DemoUser {
  id: string;
  username: string;
  password: string;
  name: string;
  name_ar: string;
  role: DemoRole;
  // Admin hierarchy: 1 = super_admin, 2 = admin, 3 = moderator, 4 = worker
  adminLevel?: 1 | 2 | 3 | 4;
  rating?: number; // out of 5, set by higher admins
  ratingCount?: number;
}

export const DEMO_ACCOUNTS: DemoUser[] = [
  {
    id: "super-admin-1",
    username: "admin",
    password: "admin",
    name: "Super Admin",
    name_ar: "المشرف الرئيسي",
    role: "super_admin",
    adminLevel: 1,
  },
  {
    id: "admin-2",
    username: "admin2",
    password: "admin2",
    name: "Ahmad Admin",
    name_ar: "أحمد — مدير",
    role: "admin",
    adminLevel: 2,
    rating: 4.2,
    ratingCount: 5,
  },
  {
    id: "mod-1",
    username: "moderator",
    password: "mod",
    name: "Samer Moderator",
    name_ar: "سامر — مشرف",
    role: "moderator",
    adminLevel: 3,
    rating: 3.8,
    ratingCount: 3,
  },
  {
    id: "worker-1",
    username: "worker",
    password: "worker",
    name: "Worker — Damascus Trades",
    name_ar: "عامل — مهن دمشق",
    role: "worker",
    adminLevel: 4,
    rating: 4.5,
    ratingCount: 8,
  },
  {
    id: "supplier-1",
    username: "supplier",
    password: "supplier",
    name: "Hammad Supplies Co.",
    name_ar: "شركة حماد للمواد",
    role: "supplier",
  },
  {
    id: "craftsman-1",
    username: "craftsman",
    password: "craftsman",
    name: "Abu Mahmoud Al-Dimashqi",
    name_ar: "أبو محمود الدمشقي",
    role: "craftsman",
  },
  {
    id: "firm-1",
    username: "firm",
    password: "firm",
    name: "Damascus Engineering Ltd.",
    name_ar: "دمشق للهندسة م.م.م",
    role: "firm",
  },
];

export function loginDemo(
  username: string,
  password: string
): DemoUser | null {
  return (
    DEMO_ACCOUNTS.find(
      (a) => a.username === username && a.password === password
    ) ?? null
  );
}

export const ROLE_DASHBOARDS: Record<DemoRole, string> = {
  super_admin: "/admin",
  admin: "/admin",
  moderator: "/admin",
  worker: "/admin",
  supplier: "/supplier/dashboard",
  craftsman: "/dashboard",
  firm: "/firm",
  user: "/",
};

export const ROLE_LABELS: Record<DemoRole, { ar: string; en: string }> = {
  super_admin: { ar: "مشرف رئيسي", en: "Super Admin" },
  admin: { ar: "مدير", en: "Admin" },
  moderator: { ar: "مشرف", en: "Moderator" },
  worker: { ar: "عامل", en: "Worker" },
  supplier: { ar: "مورّد", en: "Supplier" },
  craftsman: { ar: "معلم", en: "Craftsman" },
  firm: { ar: "شركة", en: "Firm" },
  user: { ar: "زائر", en: "Guest" },
};

export function canRateUser(rater: DemoUser, target: DemoUser): boolean {
  if (!rater.adminLevel || !target.adminLevel) return false;
  return rater.adminLevel < target.adminLevel;
}

/**
 * Admin hierarchy visibility: a user can only see the rating of someone
 * whose adminLevel is GREATER (i.e., lower rank) than their own.
 * super_admin (1) sees everyone. admin (2) sees moderator+worker but NOT super_admin.
 * moderator (3) sees worker only. worker (4) sees nobody.
 */
export function canSeeRating(viewer: DemoUser, target: DemoUser): boolean {
  if (!viewer.adminLevel || !target.adminLevel) return false;
  return viewer.adminLevel < target.adminLevel;
}
