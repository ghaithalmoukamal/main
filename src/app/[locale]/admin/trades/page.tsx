import { setRequestLocale } from "next-intl/server";
import { DEMO_TRADES } from "@/lib/demo-data";
import { pickLocalized } from "@/lib/utils";

export default async function AdminTradesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-clay">
          {isAr ? "المهن" : "Trades"}
        </h1>
        <button className="px-4 py-2 bg-clay text-cream text-sm rounded-lg hover:bg-clay-600 transition-colors font-medium">
          + {isAr ? "إضافة مهنة" : "Add Trade"}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {DEMO_TRADES.map((trade) => (
          <div
            key={trade.id}
            className="flex items-center gap-3 p-3 bg-white border border-clay-100 rounded-xl"
          >
            <span className="text-lg">🔧</span>
            <div className="flex-1">
              <div className="font-medium text-charcoal">
                {pickLocalized(trade, "name", locale as "ar" | "en")}
              </div>
              <div className="text-xs text-charcoal-400">
                {isAr ? trade.name_en : trade.name_ar}
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 bg-green-100 text-verified rounded-full">
              {isAr ? "موافق" : "Approved"}
            </span>
          </div>
        ))}

        {/* Demo pending custom trade */}
        <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
          <span className="text-lg">🔧</span>
          <div className="flex-1">
            <div className="font-medium text-charcoal">
              {isAr ? "مصلّح أثاث" : "Furniture Repairer"}
            </div>
            <div className="text-xs text-charcoal-400">
              {isAr ? "طلب مخصص" : "Custom request"}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <button className="text-xs px-2 py-0.5 bg-clay text-cream rounded hover:bg-clay-600 transition-colors">
              ✓
            </button>
            <button className="text-xs px-2 py-0.5 bg-red-100 text-busy rounded hover:bg-red-200 transition-colors">
              ✗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
