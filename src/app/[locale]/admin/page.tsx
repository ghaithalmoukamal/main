import { setRequestLocale } from "next-intl/server";

export default async function AdminOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  const kpis = [
    { label: isAr ? "معلمون مسجلون" : "Registered Craftsmen", value: 10, icon: "🛠️" },
    { label: isAr ? "بانتظار الموافقة" : "Pending Approval", value: 7, icon: "⏳", alert: true },
    { label: isAr ? "طلبات نشطة" : "Active Leads", value: 23, icon: "📥" },
    { label: isAr ? "نزاعات مفتوحة" : "Open Disputes", value: 2, icon: "⚖️", alert: true },
    { label: isAr ? "إعلانات نشطة" : "Active Ads", value: 5, icon: "📢" },
    { label: isAr ? "علامات احتيال" : "Fraud Flags", value: 3, icon: "🚨", alert: true },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-clay mb-6">
        {isAr ? "نظرة عامة" : "Overview"}
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`p-5 rounded-xl border ${
              kpi.alert
                ? "bg-red-50 border-red-200"
                : "bg-cream-50 border-clay-100"
            }`}
          >
            <div className="text-2xl mb-2">{kpi.icon}</div>
            <div
              className={`font-heading text-3xl font-bold mb-1 ${
                kpi.alert ? "text-busy" : "text-clay"
              }`}
            >
              {kpi.value}
            </div>
            <div className="text-xs text-charcoal-500">{kpi.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
