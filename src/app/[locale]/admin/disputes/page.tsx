import { setRequestLocale } from "next-intl/server";

const DEMO_DISPUTES = [
  {
    id: 1,
    lead_id: 42,
    raised_by: "user-client-5",
    status: "open" as const,
    escalation_level: 1 as const,
    description: "المعلم طلب مبلغ مختلف عن المتفق عليه.",
    desc_en: "Craftsman charged a different amount than agreed.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 2,
    lead_id: 38,
    raised_by: "craftsman-demo-3",
    status: "in_mediation" as const,
    escalation_level: 2 as const,
    description: "العميل رفض تأكيد الإنجاز رغم اكتمال الشغل.",
    desc_en: "Client refused to confirm completion despite job being done.",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export default async function AdminDisputesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-clay mb-6">
        {isAr ? "النزاعات" : "Disputes"}
      </h1>
      <div className="space-y-4">
        {DEMO_DISPUTES.map((d) => (
          <div key={d.id} className="p-5 bg-white border border-orange-100 rounded-xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-lg">⚖️</span>
              <span className="font-medium text-charcoal">
                {isAr ? `نزاع #${d.id}` : `Dispute #${d.id}`}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  d.status === "open"
                    ? "bg-red-100 text-busy"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {d.status}
              </span>
              <span className="text-xs text-charcoal-400">
                {isAr ? `مستوى التصعيد: ${d.escalation_level}` : `Escalation level ${d.escalation_level}`}
              </span>
            </div>
            <p className="text-sm text-charcoal-600 mb-4">
              {isAr ? d.description : d.desc_en}
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1.5 text-sm bg-clay text-cream rounded-lg hover:bg-clay-600 transition-colors font-medium">
                {isAr ? "وساطة عبر واتساب" : "Mediate via WhatsApp"}
              </button>
              <button className="px-3 py-1.5 text-sm border border-clay-100 text-charcoal-500 rounded-lg hover:border-clay transition-colors">
                {isAr ? "قرار نهائي" : "Final Decision"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
