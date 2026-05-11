"use client";

import { useAuth } from "@/context/AuthContext";
import { Link } from "@/i18n/routing";

interface Props {
  locale: "ar" | "en";
}

const STATS = [
  { labelAr: "إجمالي العطاءات", labelEn: "Total Leads",     value: "8",   icon: "📥" },
  { labelAr: "مشاريع نشطة",     labelEn: "Active Projects", value: "2",   icon: "⚙️" },
  { labelAr: "معدل الإتمام",     labelEn: "Completion Rate", value: "88%", icon: "✅" },
  { labelAr: "معلمون في الفريق", labelEn: "Team Maalems",   value: "6",   icon: "👥" },
];

const NAV_TILES = [
  { href: "/contractor/dashboard/leads",   iconAr: "📥", labelAr: "العطاءات",       labelEn: "Leads",          badge: 3 },
  { href: "/contractor/dashboard/projects", iconAr: "⚙️", labelAr: "المشاريع",      labelEn: "Projects",       badge: 2 },
  { href: "/search",                        iconAr: "🛠️", labelAr: "ابحث عن معلم",  labelEn: "Find a Maalem",  badge: null },
  { href: "/contractor/dashboard/team",     iconAr: "👥", labelAr: "فريقي",          labelEn: "My Team",        badge: null },
  { href: "/contractor/dashboard/profile",  iconAr: "📝", labelAr: "ملفي الشخصي",   labelEn: "My Profile",     badge: null },
  { href: "/contractor/dashboard/billing",  iconAr: "💳", labelAr: "الاشتراك",       labelEn: "Subscription",   badge: null },
];

export default function ContractorDashboardClient({ locale }: Props) {
  const { user } = useAuth();
  const isAr = locale === "ar";

  if (!user || user.role !== "contractor") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-charcoal-400">
        {isAr ? "غير مصرح بالدخول" : "Not authorized"}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white border border-clay-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-clay">
              {isAr ? "بوابة المقاول" : "Contractor Portal"}
            </h1>
            <p className="text-charcoal-500 text-sm mt-1">
              {isAr ? `أهلاً، ${user.name_ar || user.name}` : `Welcome, ${user.name}`}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-clay-100 flex items-center justify-center text-2xl">
            🏗️
          </div>
        </div>

        {/* Approval notice */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-start gap-2">
          <span>⏳</span>
          <span>
            {isAr
              ? "ملفك قيد المراجعة. سيظهر في نتائج البحث بعد الموافقة."
              : "Your profile is under review. It will appear in search results after approval."}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map((s) => (
          <div key={s.labelEn} className="bg-white border border-clay-100 rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-heading text-xl font-bold text-clay">{s.value}</div>
            <div className="text-xs text-charcoal-400 mt-0.5">
              {isAr ? s.labelAr : s.labelEn}
            </div>
          </div>
        ))}
      </div>

      {/* Nav tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {NAV_TILES.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href as Parameters<typeof Link>[0]["href"]}
            className="bg-white border border-clay-100 rounded-xl p-4 hover:border-clay hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{tile.iconAr}</span>
              {tile.badge !== null && (
                <span className="text-xs bg-clay text-cream rounded-full px-2 py-0.5 font-medium">
                  {tile.badge}
                </span>
              )}
            </div>
            <div className="font-medium text-charcoal text-sm group-hover:text-clay transition-colors">
              {isAr ? tile.labelAr : tile.labelEn}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick action — Find Maalem */}
      <div className="bg-gradient-to-r from-clay to-brass text-cream rounded-2xl p-6">
        <h2 className="font-heading text-lg font-bold mb-1">
          {isAr ? "ابحث عن معلم لمشروعك" : "Find a Maalem for your project"}
        </h2>
        <p className="text-cream/80 text-sm mb-4">
          {isAr
            ? "تصفح مئات المعلمين المعتمدين وابنِ فريق مشروعك"
            : "Browse hundreds of approved Maalems and build your project team"}
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 bg-white text-clay font-medium text-sm px-4 py-2 rounded-lg hover:bg-cream transition-colors"
        >
          🛠️ {isAr ? "تصفح المعلمين" : "Browse Maalems"} →
        </Link>
      </div>
    </div>
  );
}
