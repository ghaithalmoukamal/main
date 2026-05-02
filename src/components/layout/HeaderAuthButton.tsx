"use client";

import { useAuth } from "@/context/AuthContext";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { ROLE_LABELS } from "@/lib/demo-auth";

export default function HeaderAuthButton() {
  const { user, logout, loading } = useAuth();
  const locale = useLocale() as "ar" | "en";
  const isAr = locale === "ar";
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <a
        href={`/${locale}/login`}
        className="px-3 py-1.5 text-sm rounded-lg bg-clay text-cream hover:bg-clay-600 transition-colors font-medium"
      >
        {isAr ? "تسجيل الدخول" : "Sign In"}
      </a>
    );
  }

  const roleLabel = ROLE_LABELS[user.role]?.[locale] ?? user.role;
  const dashboardLink = getDashboardLink(user.role, locale);

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-clay-100 hover:border-clay text-charcoal hover:text-clay transition-colors"
      >
        <span className="hidden sm:inline font-medium max-w-[100px] truncate">
          {user.name}
        </span>
        <span className="text-xs text-charcoal-500 hidden sm:inline">({roleLabel})</span>
        <span className="text-xs">▾</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute end-0 top-full mt-1 z-50 bg-white border border-clay-100 rounded-xl shadow-lg py-1 min-w-[160px]">
            <a
              href={`/${locale}${dashboardLink}`}
              className="block px-4 py-2 text-sm text-charcoal hover:bg-cream-50 hover:text-clay"
              onClick={() => setOpen(false)}
            >
              {isAr ? "لوحة التحكم" : "Dashboard"}
            </a>
            {(user.role === "super_admin" || user.role === "admin" || user.role === "moderator" || user.role === "worker") && (
              <a
                href={`/${locale}/admin`}
                className="block px-4 py-2 text-sm text-charcoal hover:bg-cream-50 hover:text-clay"
                onClick={() => setOpen(false)}
              >
                {isAr ? "لوحة الإدارة" : "Admin Panel"}
              </a>
            )}
            {user.role === "supplier" && (
              <a
                href={`/${locale}/supplier/dashboard`}
                className="block px-4 py-2 text-sm text-charcoal hover:bg-cream-50 hover:text-clay"
                onClick={() => setOpen(false)}
              >
                {isAr ? "بوابة الموردين" : "Supplier Portal"}
              </a>
            )}
            {user.role === "firm" && (
              <a
                href={`/${locale}/firm`}
                className="block px-4 py-2 text-sm text-charcoal hover:bg-cream-50 hover:text-clay"
                onClick={() => setOpen(false)}
              >
                {isAr ? "بوابة الشركة" : "Firm Portal"}
              </a>
            )}
            <div className="border-t border-clay-100 mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="block w-full text-start px-4 py-2 text-sm text-busy hover:bg-red-50"
              >
                {isAr ? "تسجيل الخروج" : "Sign Out"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function getDashboardLink(role: string, locale: string): string {
  switch (role) {
    case "super_admin":
    case "admin":
    case "moderator":
    case "worker":
      return "/admin";
    case "supplier":
      return "/supplier/dashboard";
    case "firm":
      return "/firm";
    case "craftsman":
      return "/dashboard";
    default:
      return "/";
  }
}
