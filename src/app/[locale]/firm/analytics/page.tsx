import { setRequestLocale } from "next-intl/server";
import AnalyticsHub from "./AnalyticsHub";

export default async function FirmAnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="font-heading text-2xl font-bold text-clay mb-2">
        {isAr ? "الإحصائيات والتحليلات" : "Analytics & Insights"}
      </h1>
      <p className="text-sm text-charcoal-500 mb-8">
        {isAr
          ? "تتبع أداء شركتك ومقاييس التواصل مع المعلمين"
          : "Track your firm's performance and craftsmen engagement metrics"}
      </p>

      <AnalyticsHub locale={locale as "ar" | "en"} />
    </div>
  );
}
