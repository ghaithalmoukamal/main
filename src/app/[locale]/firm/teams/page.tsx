import { setRequestLocale } from "next-intl/server";
import TeamsClient from "./TeamsClient";
import { DEMO_CRAFTSMEN, DEMO_TRADES, DEMO_CITIES } from "@/lib/demo-data";
import FeatureGate from "@/components/ui/FeatureGate";

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const craftsmen = DEMO_CRAFTSMEN.filter(
    (c) => c.approval_status === "approved"
  ).map((c) => ({
    ...c,
    trade: DEMO_TRADES.find((t) => t.id === c.trade_id) ?? null,
    city: DEMO_CITIES.find((x) => x.id === c.city_id),
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="font-heading text-2xl font-bold text-clay mb-2">
        {locale === "ar" ? "فرق المشروع" : "Project Teams"}
      </h1>
      <p className="text-charcoal-500 text-sm mb-6">
        {locale === "ar"
          ? "احفظ معلميك المفضلين في فرق للمشاريع المستقبلية"
          : "Save your preferred craftsmen into named teams for future projects"}
      </p>
      <FeatureGate requiredFeature="save_teams" audience="firm">
        <TeamsClient craftsmen={craftsmen} locale={locale as "ar" | "en"} />
      </FeatureGate>
    </div>
  );
}
