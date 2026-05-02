import { setRequestLocale } from "next-intl/server";

export default async function FirmAnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  // Demo metrics
  const metrics = [
    { label: isAr ? "إجمالي الطلبات" : "Total Leads Sent", value: 24 },
    { label: isAr ? "معلمون تم التواصل معهم" : "Craftsmen Contacted", value: 18 },
    { label: isAr ? "أعمال مكتملة" : "Jobs Completed", value: 15 },
    { label: isAr ? "متوسط وقت الرد" : "Avg Response Time", value: "22m" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="font-heading text-2xl font-bold text-clay mb-6">
        {isAr ? "الإحصائيات" : "Analytics"}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="p-4 bg-cream-50 border border-clay-100 rounded-xl">
            <div className="font-heading text-2xl font-bold text-clay">{m.value}</div>
            <div className="text-xs text-charcoal-500 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-cream-50 border border-clay-100 rounded-xl text-center text-charcoal-400 text-sm">
        {isAr
          ? "رسوم بيانية تفصيلية متاحة في خطة احترافي"
          : "Detailed charts available on Professional plan"}
      </div>
    </div>
  );
}
