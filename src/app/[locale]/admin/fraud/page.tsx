import { setRequestLocale } from "next-intl/server";
import type { FraudFlag } from "@/lib/types";

const DEMO_FLAGS: FraudFlag[] = [
  {
    id: 1,
    entity_type: "craftsman",
    entity_id: "demo-99",
    signal: "duplicate_phone",
    severity: "high",
    raw_data: { phone: "+963991234567", duplicate_of: "demo-1" },
    status: "open",
    reviewed_by: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    entity_type: "craftsman",
    entity_id: "demo-7",
    signal: "accept_cancel",
    severity: "medium",
    raw_data: { accepted: 12, cancelled: 10, ratio: 0.83 },
    status: "open",
    reviewed_by: null,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 3,
    entity_type: "craftsman",
    entity_id: "demo-5",
    signal: "ghost_profile",
    severity: "low",
    raw_data: { last_active_days: 45 },
    status: "open",
    reviewed_by: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const SEVERITY_STYLE: Record<string, string> = {
  high: "bg-red-100 text-busy",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-cream-100 text-charcoal-600",
};

const SIGNAL_ICON: Record<string, string> = {
  duplicate_phone: "📱",
  ghost_profile: "👻",
  accept_cancel: "🔄",
  rating_anomaly: "⭐",
};

export default async function AdminFraudPage({
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
        {isAr ? "مراقبة الاحتيال" : "Fraud Monitoring"}
      </h1>
      <div className="space-y-3">
        {DEMO_FLAGS.map((flag) => (
          <div
            key={flag.id}
            className="p-4 bg-white border border-red-100 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{SIGNAL_ICON[flag.signal] ?? "🚨"}</span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-medium text-charcoal">{flag.signal.replace(/_/g, " ")}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${SEVERITY_STYLE[flag.severity]}`}
                  >
                    {flag.severity}
                  </span>
                </div>
                <div className="text-xs text-charcoal-400 mb-2">
                  {flag.entity_type} · {flag.entity_id}
                </div>
                <pre className="text-xs bg-cream-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(flag.raw_data, null, 2)}
                </pre>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1.5 text-sm bg-clay text-cream rounded-lg hover:bg-clay-600 transition-colors font-medium">
                {isAr ? "تحقيق" : "Investigate"}
              </button>
              <button className="px-3 py-1.5 text-sm border border-clay-100 text-charcoal-500 rounded-lg hover:border-clay transition-colors">
                {isAr ? "تجاهل" : "Dismiss"}
              </button>
              <button className="px-3 py-1.5 text-sm bg-busy text-cream rounded-lg hover:bg-red-700 transition-colors font-medium">
                {isAr ? "تعليق الحساب" : "Suspend Account"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
