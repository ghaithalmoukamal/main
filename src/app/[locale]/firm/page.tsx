import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { DEMO_PLANS } from "@/lib/demo-data";

export default async function FirmDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");

  const isAr = locale === "ar";

  const navItems = [
    {
      href: "/search",
      label: isAr ? "ابحث عن معلمين" : "Search Craftsmen",
      icon: "🔍",
      desc: isAr ? "ابحث بالمهنة، المنطقة، الأدوات" : "Filter by trade, zone, assets",
    },
    {
      href: "/firm/teams",
      label: isAr ? "فرق المشروع" : "Project Teams",
      icon: "👷",
      desc: isAr ? "احفظ قوائم معلميك المفضلين" : "Save lists of preferred craftsmen",
    },
    {
      href: "/nearest",
      label: isAr ? "أقرب معلم" : "Nearest Maalem",
      icon: "📍",
      desc: isAr ? "أقرب معلم متاح الآن" : "Closest available craftsman now",
    },
    {
      href: "/firm/analytics",
      label: isAr ? "الإحصائيات" : "Analytics",
      icon: "📊",
      desc: isAr ? "طلباتك وشاشات الأداء" : "Your leads and performance",
    },
    {
      href: "/firm/billing",
      label: isAr ? "الاشتراك" : "Subscription",
      icon: "💳",
      desc: isAr ? "إدارة خطة اشتراكك" : "Manage your plan",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-10 space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-clay mb-1">
          {isAr ? "بوابة الشركات" : "Firm Portal"}
        </h1>
        <p className="text-charcoal-500">
          {isAr
            ? "ابني فريق مشروعك من أفضل الحرفيين في دمشق"
            : "Build your project team from Damascus' finest craftsmen"}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href as Parameters<typeof Link>[0]["href"]}
            className="p-5 bg-white border border-clay-100 rounded-xl hover:border-clay hover:shadow-sm transition-all group"
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="font-semibold text-charcoal group-hover:text-clay transition-colors mb-1">
              {item.label}
            </div>
            <div className="text-sm text-charcoal-500">{item.desc}</div>
          </Link>
        ))}
      </div>

      {/* Plan promo */}
      <div className="bg-clay text-cream rounded-2xl p-6">
        <div className="font-heading text-xl font-bold mb-2">
          {isAr ? "رقّي لخطة احترافية" : "Upgrade to Pro"}
        </div>
        <p className="text-cream/80 mb-4 text-sm">
          {isAr
            ? "احصل على معدلات الموثوقية، تحديد المناطق، وأولوية ظهور المعلمين"
            : "Unlock reliability scores, zone targeting, and craftsman priority placement"}
        </p>
        <Link
          href="/firm/billing"
          className="inline-block bg-brass text-cream px-5 py-2.5 rounded-xl font-medium hover:bg-brass-500 transition-colors"
        >
          {isAr ? "اعرف المزيد" : "Learn more"} →
        </Link>
      </div>
    </div>
  );
}
