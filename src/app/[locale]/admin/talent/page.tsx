import { setRequestLocale } from "next-intl/server";
import { DEMO_CRAFTSMEN, DEMO_TRADES } from "@/lib/demo-data";
import { pickLocalized } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export default async function AdminTalentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const loc = locale as "ar" | "en";

  // Demo: show approved elite/verified craftsmen with mock metrics
  const talent = DEMO_CRAFTSMEN.filter(
    (c) => c.approval_status === "approved"
  ).map((c) => ({
    ...c,
    trade: DEMO_TRADES.find((t) => t.id === c.trade_id) ?? null,
    completion_rate: Math.floor(80 + Math.random() * 20),
    approval_rate: Math.floor(75 + Math.random() * 25),
    total_jobs: Math.floor(5 + Math.random() * 40),
  })).sort((a, b) => b.completion_rate - a.completion_rate);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-clay mb-6">
        {isAr ? "لوحة المواهب" : "Talent Dashboard"}
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-clay-100">
              <th className="py-3 pe-4 text-start font-medium text-charcoal-500">
                {isAr ? "المعلم" : "Craftsman"}
              </th>
              <th className="py-3 pe-4 text-start font-medium text-charcoal-500">
                {isAr ? "المهنة" : "Trade"}
              </th>
              <th className="py-3 pe-4 text-center font-medium text-charcoal-500">
                {isAr ? "الإنجاز" : "Completion"}
              </th>
              <th className="py-3 pe-4 text-center font-medium text-charcoal-500">
                {isAr ? "القبول" : "Approval"}
              </th>
              <th className="py-3 pe-4 text-center font-medium text-charcoal-500">
                {isAr ? "الأعمال" : "Jobs"}
              </th>
              <th className="py-3 text-center font-medium text-charcoal-500">
                {isAr ? "إجراء" : "Action"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-clay-100">
            {talent.map((c) => (
              <tr key={c.id} className="hover:bg-cream-50">
                <td className="py-3 pe-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-charcoal">{c.name}</span>
                    {c.is_elite && <Badge variant="brass">★</Badge>}
                    {c.is_verified && <Badge variant="verified">✓</Badge>}
                  </div>
                </td>
                <td className="py-3 pe-4 text-charcoal-500">
                  {c.trade ? pickLocalized(c.trade, "name", loc) : "—"}
                </td>
                <td className="py-3 pe-4 text-center">
                  <span
                    className={`font-semibold ${
                      c.completion_rate >= 90 ? "text-verified" : "text-charcoal"
                    }`}
                  >
                    {c.completion_rate}%
                  </span>
                </td>
                <td className="py-3 pe-4 text-center text-charcoal">
                  {c.approval_rate}%
                </td>
                <td className="py-3 pe-4 text-center text-charcoal">
                  {c.total_jobs}
                </td>
                <td className="py-3 text-center">
                  {!c.is_elite && (
                    <button className="text-xs px-2 py-1 bg-brass text-cream rounded hover:bg-brass-500 transition-colors font-medium">
                      ⭐ {isAr ? "معلم نخبة" : "Elite"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
