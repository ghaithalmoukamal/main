import { setRequestLocale } from "next-intl/server";
import { DEMO_PLANS } from "@/lib/demo-data";

export default async function SupplierBillingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  const supplierPlans = DEMO_PLANS.filter((p) => p.target_audience === "supplier");

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="font-heading text-2xl font-bold text-clay mb-6">
        {isAr ? "خطط الموردين" : "Supplier Plans"}
      </h1>
      <div className="grid sm:grid-cols-3 gap-4">
        {supplierPlans.map((plan) => {
          const name = isAr ? plan.name_ar : plan.name_en;
          return (
            <div key={plan.id} className={`p-5 rounded-2xl border-2 ${plan.priority_placement ? "border-brass bg-brass/5" : "border-clay-100 bg-white"}`}>
              <div className="font-heading text-lg font-bold mb-1">{name}</div>
              <div className="text-3xl font-bold text-clay mb-1">
                {plan.price === 0 ? (isAr ? "مجاني" : "Free") : `$${plan.price}`}
              </div>
              <div className="text-xs text-charcoal-400 mb-4">
                /{plan.duration_type === "monthly" ? (isAr ? "شهر" : "mo") : plan.duration_type === "yearly" ? (isAr ? "سنة" : "yr") : isAr ? "مرة" : "one-time"}
              </div>
              <ul className="space-y-1 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs text-charcoal-500 flex items-center gap-1.5">
                    <span className="text-verified">✓</span> {f.replace(/_/g, " ")}
                  </li>
                ))}
              </ul>
              <button className="w-full py-2.5 rounded-xl text-sm font-medium bg-clay text-cream hover:bg-clay-600 transition-colors">
                {isAr ? "اشترك" : "Subscribe"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
