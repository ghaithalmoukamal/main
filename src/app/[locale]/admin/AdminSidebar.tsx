"use client";

import { Link, usePathname } from "@/i18n/routing";
import { classNames } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", labelAr: "نظرة عامة", icon: "📊" },
  { href: "/admin/approvals", label: "Approvals", labelAr: "الموافقات", icon: "✅", badge: 7 },
  { href: "/admin/users", label: "Users", labelAr: "المستخدمون", icon: "👤" },
  { href: "/admin/trades", label: "Trades", labelAr: "المهن", icon: "🔧" },
  { href: "/admin/zones", label: "Zones", labelAr: "المناطق", icon: "🗺️" },
  { href: "/admin/ads", label: "Ads", labelAr: "الإعلانات", icon: "📢" },
  { href: "/admin/channels", label: "Channels", labelAr: "القنوات", icon: "📡" },
  { href: "/admin/subscriptions", label: "Plans", labelAr: "الخطط", icon: "💳" },
  { href: "/admin/disputes", label: "Disputes", labelAr: "النزاعات", icon: "⚖️", badge: 2 },
  { href: "/admin/fraud", label: "Fraud", labelAr: "الاحتيال", icon: "🚨", badge: 3 },
  { href: "/admin/talent", label: "Talent", labelAr: "المواهب", icon: "⭐" },
  { href: "/admin/audit", label: "Audit Log", labelAr: "سجل الأحداث", icon: "📜" },
] as const;

export default function AdminSidebar({ locale }: { locale: "ar" | "en" }) {
  const pathname = usePathname();
  const isAr = locale === "ar";

  return (
    <aside className="w-56 shrink-0 bg-charcoal text-cream min-h-screen flex flex-col">
      <div className="p-4 border-b border-charcoal-600">
        <div className="font-heading font-bold text-brass text-sm">
          {isAr ? "لوحة الإدارة" : "Admin Panel"}
        </div>
      </div>
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" &&
              pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={classNames(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-clay text-cream"
                  : "text-cream/70 hover:text-cream hover:bg-charcoal-600"
              )}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{isAr ? item.labelAr : item.label}</span>
              {item.badge ? (
                <span className="bg-busy text-cream text-xs px-1.5 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
