"use client";

import { BarChart, LineChart, DonutChart } from "@/components/ui/SimpleChart";
import FeatureGate from "@/components/ui/FeatureGate";

const DEMO_LEADS_BY_TRADE = [
  { label: "نجار", value: 8 },
  { label: "حداد", value: 5 },
  { label: "كهربائي", value: 6 },
  { label: "سباك", value: 4 },
  { label: "دهان", value: 3 },
  { label: "بلّاط", value: 2 },
  { label: "لحّام", value: 4 },
  { label: "ألمنيوم", value: 1 },
];

const DEMO_WEEKLY_ACTIVITY = [
  { label: "W1", value: 3 },
  { label: "W2", value: 5 },
  { label: "W3", value: 7 },
  { label: "W4", value: 4 },
  { label: "W5", value: 9 },
  { label: "W6", value: 6 },
  { label: "W7", value: 11 },
  { label: "W8", value: 8 },
];

interface Props {
  locale: "ar" | "en";
}

export default function AnalyticsHub({ locale }: Props) {
  const isAr = locale === "ar";

  const kpis = [
    { label: isAr ? "إجمالي الطلبات" : "Total Leads", value: "24", icon: "📨", color: "bg-blue-50 border-blue-200 text-blue-700" },
    { label: isAr ? "معلمون تم التواصل" : "Craftsmen Contacted", value: "18", icon: "🤝", color: "bg-green-50 border-green-200 text-green-700" },
    { label: isAr ? "أعمال مكتملة" : "Jobs Completed", value: "15", icon: "✅", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { label: isAr ? "متوسط الرد" : "Avg Response", value: "22m", icon: "⏱️", color: "bg-amber-50 border-amber-200 text-amber-700" },
  ];

  return (
    <div className="space-y-8">
      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`p-4 rounded-xl border ${kpi.color} transition-transform hover:scale-[1.02]`}
          >
            <div className="text-2xl mb-2">{kpi.icon}</div>
            <div className="font-heading text-2xl font-bold">{kpi.value}</div>
            <div className="text-xs opacity-70 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts — locked behind analytics_access */}
      <FeatureGate requiredFeature="analytics_access" audience="firm">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bar Chart: Leads by Trade */}
          <div className="bg-white border border-clay-100 rounded-2xl p-5">
            <h3 className="font-heading text-base font-bold text-charcoal mb-4">
              {isAr ? "الطلبات حسب المهنة" : "Leads by Trade"}
            </h3>
            <BarChart
              data={DEMO_LEADS_BY_TRADE}
              barColor="#8B4513"
              locale={locale}
            />
          </div>

          {/* Line Chart: Weekly Activity */}
          <div className="bg-white border border-clay-100 rounded-2xl p-5">
            <h3 className="font-heading text-base font-bold text-charcoal mb-4">
              {isAr ? "النشاط الأسبوعي" : "Weekly Activity"}
            </h3>
            <LineChart
              data={DEMO_WEEKLY_ACTIVITY}
              lineColor="#8B4513"
            />
          </div>
        </div>

        {/* Bottom row: Donut + stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Donut: Completion Rate */}
          <div className="bg-white border border-clay-100 rounded-2xl p-5 flex flex-col items-center justify-center">
            <h3 className="font-heading text-sm font-bold text-charcoal mb-4">
              {isAr ? "معدل الإنجاز" : "Completion Rate"}
            </h3>
            <div className="relative">
              <DonutChart
                value={15}
                max={24}
                color="#2E7D32"
                label={isAr ? "15 من 24 طلب" : "15 of 24 leads"}
              />
            </div>
          </div>

          {/* Top Trades */}
          <div className="bg-white border border-clay-100 rounded-2xl p-5">
            <h3 className="font-heading text-sm font-bold text-charcoal mb-3">
              {isAr ? "أكثر المهن طلباً" : "Top Requested Trades"}
            </h3>
            <div className="space-y-2.5">
              {DEMO_LEADS_BY_TRADE.sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-charcoal-500 w-4">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="font-medium text-charcoal">{item.label}</span>
                        <span className="text-charcoal-400">{item.value}</span>
                      </div>
                      <div className="h-1.5 bg-cream-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-clay transition-all duration-500"
                          style={{ width: `${(item.value / DEMO_LEADS_BY_TRADE[0].value) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Response Time Breakdown */}
          <div className="bg-white border border-clay-100 rounded-2xl p-5">
            <h3 className="font-heading text-sm font-bold text-charcoal mb-3">
              {isAr ? "سرعة الرد" : "Response Speed"}
            </h3>
            <div className="space-y-3">
              {[
                { label: isAr ? "< 15 دقيقة" : "< 15 min", pct: 40, color: "#2E7D32" },
                { label: isAr ? "15-30 دقيقة" : "15-30 min", pct: 35, color: "#F59E0B" },
                { label: isAr ? "30-60 دقيقة" : "30-60 min", pct: 15, color: "#E67E22" },
                { label: isAr ? "> ساعة" : "> 1 hour", pct: 10, color: "#B71C1C" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-charcoal-600">{item.label}</span>
                    <span className="text-charcoal-400 font-medium">{item.pct}%</span>
                  </div>
                  <div className="h-2 bg-cream-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FeatureGate>
    </div>
  );
}
