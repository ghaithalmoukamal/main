"use client";

import { useAuth } from "@/context/AuthContext";
import { useLocale } from "next-intl";
import { useState } from "react";
import { ROLE_LABELS } from "@/lib/demo-auth";
import { Link } from "@/i18n/routing";

export default function HeaderAuthButton() {
  const { user, logout, loading } = useAuth();
  const locale = useLocale() as "ar" | "en";
  const isAr = locale === "ar";
  const [open, setOpen] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="px-3 py-1.5 text-sm rounded-lg bg-clay text-cream hover:bg-clay-600 transition-colors font-medium"
      >
        {isAr ? "تسجيل الدخول" : "Sign In"}
      </Link>
    );
  }

  const roleLabel = ROLE_LABELS[user.role]?.[locale] ?? user.role;
  const dashboardLink = getDashboardLink(user.role);

  function handleLogout() {
    logout();
    setOpen(false);
    // Full page reload is intentional — clears all client-side auth state,
    // React context, and localStorage-hydrated providers cleanly.
    window.location.href = `/${locale}`;
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
            <Link
              href={dashboardLink as Parameters<typeof Link>[0]["href"]}
              className="block px-4 py-2 text-sm text-charcoal hover:bg-cream-50 hover:text-clay"
              onClick={() => setOpen(false)}
            >
              {isAr ? "لوحة التحكم" : "Dashboard"}
            </Link>
            {(user.role === "super_admin" || user.role === "admin" || user.role === "moderator" || user.role === "worker") && (
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm text-charcoal hover:bg-cream-50 hover:text-clay"
                onClick={() => setOpen(false)}
              >
                {isAr ? "لوحة الإدارة" : "Admin Panel"}
              </Link>
            )}
            {user.role === "supplier" && (
              <Link
                href="/supplier/dashboard"
                className="block px-4 py-2 text-sm text-charcoal hover:bg-cream-50 hover:text-clay"
                onClick={() => setOpen(false)}
              >
                {isAr ? "بوابة الموردين" : "Supplier Portal"}
              </Link>
            )}
            {user.role === "firm" && (
              <Link
                href="/firm"
                className="block px-4 py-2 text-sm text-charcoal hover:bg-cream-50 hover:text-clay"
                onClick={() => setOpen(false)}
              >
                {isAr ? "بوابة الشركة" : "Firm Portal"}
              </Link>
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

function getDashboardLink(role: string): string {
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
