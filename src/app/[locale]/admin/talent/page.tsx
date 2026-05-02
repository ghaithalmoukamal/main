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

  // Only approved craftsmen; assign deterministic metrics using index for stability
  const allApproved = DEMO_CRAFTSMEN.filter(
    (c) => c.approval_status === "approved"
  ).map((c, i) => ({
    ...c,
    trade: DEMO_TRADES.find((t) => t.id === c.trade_id) ?? null,
    // Use deterministic values so page doesn't re-randomize on every render
    completion_rate: 80 + ((i * 7) % 20),
    approval_rate: 75 + ((i * 11) % 25),
    total_jobs: 10 + ((i * 13) % 50),
  }));

  // Only show workers/craftsmen with 20+ completed jobs
  const talent = allApproved
    .filter((c) => c.total_jobs >= 20)
    .sort((a, b) => b.completion_rate - a.completion_rate);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-clay">
          {isAr ? "لوحة المواهب" : "Talent Dashboard"}
        </h1>
        <span className="text-sm text-charcoal-500">
          {isAr
            ? `${talent.length} معلم (20+ عمل)`
            : `${talent.length} craftsmen (20+ jobs)`}
        </span>
      </div>

      {talent.length === 0 ? (
        <div className="p-10 text-center text-charcoal-400 border border-dashed border-clay-100 rounded-xl">
          {isAr
            ? "لا يوجد معلمون بـ 20 عمل أو أكثر حتى الآن"
            : "No craftsmen with 20+ completed jobs yet"}
        </div>
      ) : (
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
                  {isAr ? "نسبة الإنجاز" : "Completion %"}
                </th>
                <th className="py-3 pe-4 text-center font-medium text-charcoal-500">
                  {isAr ? "نسبة القبول" : "Approval %"}
                </th>
                <th className="py-3 pe-4 text-center font-medium text-charcoal-500">
                  {isAr ? "الأعمال المنجزة" : "Total Jobs"}
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
                      {c.is_elite && <Badge variant="brass">★ {isAr ? "نخبة" : "Elite"}</Badge>}
                      {c.is_verified && <Badge variant="verified">✓ {isAr ? "موثّق" : "Verified"}</Badge>}
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
                  <td className="py-3 pe-4 text-center">
                    <span className={`font-semibold ${c.total_jobs >= 40 ? "text-verified" : "text-charcoal"}`}>
                      {c.total_jobs}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    {!c.is_elite && (
                      <button className="text-xs px-2 py-1 bg-brass text-cream rounded hover:bg-brass-500 transition-colors font-medium">
                        ⭐ {isAr ? "منح لقب نخبة" : "Grant Elite"}
                      </button>
                    )}
                    {c.is_elite && (
                      <Badge variant="brass">★ {isAr ? "نخبة" : "Elite"}</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
