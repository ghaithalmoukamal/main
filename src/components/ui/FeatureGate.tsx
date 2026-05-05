"use client";

import { useAuth } from "@/context/AuthContext";
import { DEMO_PLANS } from "@/lib/demo-data";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

interface FeatureGateProps {
  /** The feature key that the user's plan must include */
  requiredFeature: string;
  /** Which audience to check plans for (firm or supplier) */
  audience?: "firm" | "supplier";
  children: React.ReactNode;
}

/**
 * Wraps content that requires a specific subscription feature.
 * If the user's current plan doesn't include it, shows a locked overlay
 * with an upgrade CTA.
 */
export default function FeatureGate({
  requiredFeature,
  audience = "firm",
  children,
}: FeatureGateProps) {
  const { user } = useAuth();
  const locale = useLocale() as "ar" | "en";
  const isAr = locale === "ar";

  // For demo: the free plan (id=1 for firm) is the default
  // In production this would come from the user's subscription record
  const currentPlanId = 1; // Free plan
  const currentPlan = DEMO_PLANS.find((p) => p.id === currentPlanId);
  const hasFeature = currentPlan?.features.includes(requiredFeature) ?? false;

  if (hasFeature) {
    return <>{children}</>;
  }

  // Find the cheapest plan that includes this feature
  const upgradePlan = DEMO_PLANS
    .filter((p) => p.target_audience === audience && p.features.includes(requiredFeature))
    .sort((a, b) => a.price - b.price)[0];

  const upgradeName = upgradePlan
    ? isAr ? upgradePlan.name_ar : upgradePlan.name_en
    : isAr ? "خطة أعلى" : "a higher plan";

  return (
    <div className="relative">
      {/* Blurred locked content */}
      <div className="blur-[3px] pointer-events-none select-none opacity-50">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-cream/60 backdrop-blur-[1px] rounded-xl">
        <div className="bg-white border-2 border-clay-100 rounded-2xl p-6 text-center shadow-lg max-w-sm mx-4">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="font-heading text-lg font-bold text-charcoal mb-2">
            {isAr ? "ميزة مقفلة" : "Feature Locked"}
          </h3>
          <p className="text-sm text-charcoal-500 mb-4">
            {isAr
              ? `هذه الميزة متاحة في خطة "${upgradeName}". رقّي اشتراكك للوصول.`
              : `This feature is available on the "${upgradeName}" plan. Upgrade to access.`}
          </p>
          <Link
            href={`/${audience === "firm" ? "firm" : "supplier"}/billing` as Parameters<typeof Link>[0]["href"]}
            className="inline-block px-6 py-2.5 bg-clay text-cream rounded-xl font-medium hover:bg-clay-600 transition-colors text-sm"
          >
            {isAr ? "رقّي الآن" : "Upgrade Now"} →
          </Link>
        </div>
      </div>
    </div>
  );
}
