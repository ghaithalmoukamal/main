import { setRequestLocale } from "next-intl/server";
import ApprovalsClient from "./ApprovalsClient";
import { DEMO_CRAFTSMEN, DEMO_TRADES, DEMO_CITIES } from "@/lib/demo-data";

export default async function ApprovalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Demo: add a few pending craftsmen for the queue
  const pending = DEMO_CRAFTSMEN.slice(0, 3).map((c) => ({
    ...c,
    approval_status: "pending" as const,
    trade: DEMO_TRADES.find((t) => t.id === c.trade_id) ?? null,
    city: DEMO_CITIES.find((x) => x.id === c.city_id),
  }));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-clay mb-6">
        {locale === "ar" ? "قائمة الموافقات" : "Approvals Queue"}
      </h1>
      <ApprovalsClient craftsmen={pending} locale={locale as "ar" | "en"} />
    </div>
  );
}
