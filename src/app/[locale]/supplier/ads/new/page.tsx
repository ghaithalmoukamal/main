import { setRequestLocale } from "next-intl/server";
import AdCreatorClient from "./AdCreatorClient";
import { DEMO_TRADES, DEMO_ZONES, DEMO_PLANS } from "@/lib/demo-data";

export default async function NewAdPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="font-heading text-2xl font-bold text-clay mb-6">
        {locale === "ar" ? "إنشاء إعلان جديد" : "Create New Ad"}
      </h1>
      <AdCreatorClient
        trades={DEMO_TRADES}
        zones={DEMO_ZONES}
        plans={DEMO_PLANS.filter((p) => p.target_audience === "supplier")}
        locale={locale as "ar" | "en"}
      />
    </div>
  );
}
