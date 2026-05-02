import { setRequestLocale } from "next-intl/server";
import { DEMO_ZONES } from "@/lib/demo-data";
import { pickLocalized } from "@/lib/utils";

const ZONE_EMOJI: Record<string, string> = {
  construction: "🏗️",
  market: "🏪",
  industrial: "🏭",
  heritage: "🕌",
  residential: "🏠",
  commercial: "🏢",
};

export default async function AdminZonesPage({
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
          {isAr ? "المناطق الجغرافية" : "Map Zones"}
        </h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-clay text-cream text-sm rounded-lg hover:bg-clay-600 transition-colors font-medium">
            ✏️ {isAr ? "ارسم منطقة" : "Draw Zone"}
          </button>
          <button className="px-4 py-2 border-2 border-clay text-clay text-sm rounded-lg hover:bg-clay hover:text-cream transition-colors font-medium">
            📁 {isAr ? "رفع GeoJSON" : "Upload GeoJSON"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {DEMO_ZONES.map((zone) => {
          const name = pickLocalized(zone, "name", locale as "ar" | "en");
          return (
            <div
              key={zone.id}
              className="flex items-center gap-4 p-4 bg-white border border-clay-100 rounded-xl"
            >
              <span className="text-2xl">{ZONE_EMOJI[zone.type] ?? "📍"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-charcoal">{name}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: zone.color + "30", color: zone.color }}
                  >
                    {zone.type}
                  </span>
                </div>
                <div className="text-xs text-charcoal-400 mt-0.5">
                  {zone.visibility} · {zone.is_active ? (isAr ? "نشط" : "Active") : (isAr ? "معطّل" : "Inactive")}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1.5 border border-clay-100 rounded-lg hover:border-clay text-charcoal-500 hover:text-clay transition-colors">
                  {isAr ? "تعديل" : "Edit"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
