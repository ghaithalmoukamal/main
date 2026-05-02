import { setRequestLocale } from "next-intl/server";
import { DEMO_PLANS } from "@/lib/demo-data";
import { formatPrice } from "@/lib/utils";

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
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="font-heading text-2xl font-bold text-clay mb-2">
        {isAr ? "خطط الاشتراك" : "Subscription Plans"}
      </h1>
      <p className="text-charcoal-500 text-sm mb-8">
        {isAr
          ? "مجاني للشركات في السنة الأولى. الباقات المدفوعة تفتح مميزات متقدمة."
          : "Free for firms in year one. Paid plans unlock advanced features."}
      </p>

      <div className="grid sm:grid-cols-3 gap-4">
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
              <ul className="space-y-1.5 mt-4 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="opacity-70">✓</span>
                    <span>{f.replace(/_/g, " ")}</span>
                  </li>
                ))}
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
