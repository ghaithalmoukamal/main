import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import DashboardStatusToggle from "./DashboardStatusToggle";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  const tNav = await getTranslations("nav");

  // Demo metrics — replaced by real Supabase queries once auth is live
  const stats = {
    totalLeads: 12,
    approvalRate: 83,
    completionRate: 91,
    avgResponseTime: "18",
  };

  const navItems = [
    { href: "/dashboard/leads", label: t("leads"), icon: "📥", badge: 3 },
    { href: "/dashboard/jobs", label: t("activeJobs"), icon: "⚙️", badge: 1 },
    { href: "/dashboard/journal", label: t("journal"), icon: "📸" },
    { href: "/dashboard/channels", label: t("channels"), icon: "📡" },
    { href: "/dashboard/materials", label: t("materials"), icon: "🧱" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-10 space-y-8">
      <h1 className="font-heading text-3xl font-bold text-clay">
        {t("title")}
      </h1>

      {/* Status toggle */}
      <DashboardStatusToggle
        openLabel={t("openForWork")}
        busyLabel={t("tooBusy")}
        myStatusLabel={t("myStatus")}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label={t("stats.totalLeads")} value={stats.totalLeads} />
        <StatCard
          label={t("stats.approvalRate")}
          value={`${stats.approvalRate}%`}
        />
        <StatCard
          label={t("stats.completionRate")}
          value={`${stats.completionRate}%`}
        />
        <StatCard
          label={t("stats.avgResponseTime")}
          value={`${stats.avgResponseTime}m`}
        />
      </div>

      {/* Nav tiles */}
      <div className="grid sm:grid-cols-2 gap-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href as Parameters<typeof Link>[0]["href"]}
            className="flex items-center gap-4 p-4 bg-white border border-clay-100 rounded-xl hover:border-clay hover:shadow-sm transition-all group"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium text-charcoal group-hover:text-clay transition-colors flex-1">
              {item.label}
            </span>
            {item.badge ? (
              <span className="bg-clay text-cream text-xs font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            ) : null}
            <span className="text-charcoal-400">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="p-4 bg-cream-50 border border-clay-100 rounded-xl">
      <div className="font-heading text-2xl font-bold text-clay">{value}</div>
      <div className="text-xs text-charcoal-500 mt-1">{label}</div>
    </div>
  );
}
