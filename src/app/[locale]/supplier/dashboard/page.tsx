import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function SupplierDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  const navItems = [
    { href: "/supplier/ads/new", label: isAr ? "إنشاء إعلان" : "Create Ad", icon: "📢" },
    { href: "/supplier/channels", label: isAr ? "النشر في القنوات" : "Post to Channels", icon: "📡" },
    { href: "/supplier/billing", label: isAr ? "الاشتراك" : "Subscription", icon: "💳" },
  ];

  const stats = [
    { label: isAr ? "الإعلانات النشطة" : "Active Ads", value: 2 },
    { label: isAr ? "الانطباعات" : "Impressions", value: "1.2k" },
    { label: isAr ? "النقرات" : "Clicks", value: 87 },
    { label: isAr ? "طلبات المواد" : "Material Requests", value: 14 },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-10 space-y-8">
      <h1 className="font-heading text-3xl font-bold text-clay">
        {isAr ? "لوحة الموردين" : "Supplier Dashboard"}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="p-4 bg-cream-50 border border-clay-100 rounded-xl">
            <div className="font-heading text-2xl font-bold text-clay">{s.value}</div>
            <div className="text-xs text-charcoal-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href as Parameters<typeof Link>[0]["href"]}
            className="flex flex-col items-center gap-2 p-5 bg-white border border-clay-100 rounded-xl hover:border-clay hover:shadow-sm transition-all"
          >
            <span className="text-3xl">{item.icon}</span>
            <span className="font-medium text-charcoal text-sm">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
