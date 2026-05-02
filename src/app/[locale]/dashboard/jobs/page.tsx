import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function JobsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="font-heading text-2xl font-bold text-clay mb-6">
        {t("activeJobs")}
      </h1>
      <div className="border border-clay-100 rounded-xl p-6">
        <div className="text-sm font-medium text-charcoal mb-2">
          {locale === "ar" ? "شغلة قيد التنفيذ" : "Job in Progress"}
        </div>
        <p className="text-charcoal-500 text-sm mb-4">
          {locale === "ar"
            ? "ترميم باب خشب قديم — باب توما"
            : "Antique door restoration — Bab Touma"}
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-brass text-cream rounded-lg hover:bg-brass-500 transition-colors font-medium">
            📸 {locale === "ar" ? "ارفع صور الإنجاز" : "Upload Completion Photos"}
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-clay text-cream rounded-lg hover:bg-clay-600 transition-colors font-medium">
            🏁 {locale === "ar" ? "أنجزت الشغل" : "Mark as Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
