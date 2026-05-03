import { setRequestLocale } from "next-intl/server";
import { DEMO_PLANS } from "@/lib/demo-data";
import { formatPrice } from "@/lib/utils";

// Features that exist across plans — used to show ✓ vs 🔒
const ALL_FIRM_FEATURES = [
  "browse_profiles",
  "basic_search",
  "advanced_search",
  "save_teams",
  "capacity_filter",
  "reliability_scores",
  "zone_targeting",
  "priority_support",
];

const FEATURE_LABELS: Record<string, { ar: string; en: string }> = {
  browse_profiles: { ar: "تصفح الملفات", en: "Browse Profiles" },
  basic_search: { ar: "بحث أساسي", en: "Basic Search" },
  advanced_search: { ar: "بحث متقدم", en: "Advanced Search" },
  save_teams: { ar: "حفظ الفرق", en: "Save Teams" },
  capacity_filter: { ar: "تصفية بالسعة", en: "Capacity Filter" },
  reliability_scores: { ar: "درجات الموثوقية", en: "Reliability Scores" },
  zone_targeting: { ar: "استهداف المناطق", en: "Zone Targeting" },
  priority_support: { ar: "دعم أولوية", en: "Priority Support" },
};

export default async function FirmBillingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  const firmPlans = DEMO_PLANS.filter((p) => p.target_audience === "firm");

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="font-heading text-2xl font-bold text-clay mb-2">
        {isAr ? "خطط الاشتراك" : "Subscription Plans"}
      </h1>
      <p className="text-charcoal-500 text-sm mb-8">
        {isAr
          ? "مجاني للشركات في السنة الأولى. الباقات المدفوعة تفتح مميزات متقدمة."
          : "Free for firms in year one. Paid plans unlock advanced features."}
      </p>

      <div className="grid sm:grid-cols-3 gap-5">
        {firmPlans.map((plan) => {
          const name = isAr ? plan.name_ar : plan.name_en;
          const isFree = plan.price === 0;

          return (
            <div
              key={plan.id}
              className={`relative p-5 rounded-2xl border-2 ${
                plan.priority_placement
                  ? "border-clay bg-clay text-cream"
                  : "border-clay-100 bg-white"
              }`}
            >
              {plan.priority_placement && (
                <div className="absolute -top-3 start-4 text-xs bg-brass text-cream px-3 py-0.5 rounded-full font-medium">
                  {isAr ? "الأفضل قيمة" : "Best Value"}
                </div>
              )}
              <div className="font-heading text-xl font-bold mb-1">{name}</div>
              <div className="text-3xl font-bold mb-1">
                {isFree
                  ? isAr
                    ? "مجاني"
                    : "Free"
                  : formatPrice(plan.price, plan.currency, locale as "ar" | "en")}
              </div>
              {!isFree && (
                <div className="text-xs opacity-70 mb-4">
                  /{isAr ? (plan.duration_type === "monthly" ? "شهر" : "سنة") : plan.duration_type}
                </div>
              )}

              {/* Feature list — only show included features */}
              <ul className="space-y-1.5 mt-4 mb-5">
                {plan.features.map((f) => {
                  const label = FEATURE_LABELS[f]
                    ? isAr ? FEATURE_LABELS[f].ar : FEATURE_LABELS[f].en
                    : f.replace(/_/g, " ");
                  return (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className="opacity-70">✓</span>
                      <span>{label}</span>
                    </li>
                  );
                })}
                {/* Show what's NOT included as a subtle hint */}
                {ALL_FIRM_FEATURES.filter((f) => !plan.features.includes(f)).length > 0 && !plan.priority_placement && (
                  <li className="text-xs opacity-40 mt-2 pt-2 border-t border-current/10">
                    🔒 {isAr
                      ? `+${ALL_FIRM_FEATURES.filter((f) => !plan.features.includes(f)).length} ميزات في الخطط الأعلى`
                      : `+${ALL_FIRM_FEATURES.filter((f) => !plan.features.includes(f)).length} more in higher plans`}
                  </li>
                )}
              </ul>
              <button
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  plan.priority_placement
                    ? "bg-cream text-clay hover:bg-cream-100"
                    : "bg-clay text-cream hover:bg-clay-600"
                }`}
              >
                {isFree
                  ? isAr
                    ? "الخطة الحالية"
                    : "Current Plan"
                  : isAr
                  ? "اشترك الآن"
                  : "Subscribe"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-charcoal-400 text-center mt-6">
        {isAr
          ? "الدفع عبر Stripe (بطاقات دولية) أو واتساب للمدفوعات المحلية"
          : "Pay via Stripe (international cards) or WhatsApp for local payments"}
      </p>
    </div>
  );
}
