import { setRequestLocale, getTranslations } from "next-intl/server";
import FilterPanel from "@/components/search/FilterPanel";
import CraftsmanCard from "@/components/search/CraftsmanCard";
import DynamicMap from "@/components/map/DynamicMap";
import { searchCraftsmen, DEMO_ZONES } from "@/lib/demo-data";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("search");

  const tradeId = sp.trade ? Number(sp.trade) : null;
  const cityId = sp.city ? Number(sp.city) : null;
  const assetId = sp.asset ? Number(sp.asset) : null;
  const status = (sp.status as "open" | "busy" | undefined) ?? null;

  const results = searchCraftsmen({
    q: sp.q,
    trade_id: tradeId,
    city_id: cityId,
    asset_type_id: assetId,
    status,
  });

  // Filter zones by visibility (firms_only requires login; we treat as logged-out here)
  const visibleZones = DEMO_ZONES.filter((z) => z.visibility === "public");

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
      <h1 className="font-heading text-3xl font-bold text-clay mb-6">
        {t("title")}
      </h1>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <FilterPanel
          current={{
            q: sp.q,
            trade: sp.trade,
            status: sp.status,
            city: sp.city,
            asset: sp.asset,
          }}
        />

        <div className="space-y-6">
          <div className="text-sm text-charcoal-500">
            {t("resultsCount", { count: results.length })}
          </div>

          {results.length === 0 ? (
            <div className="p-10 text-center text-charcoal-400 border border-dashed border-clay-100 rounded-xl">
              {t("noResults")}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {results.map((c) => (
                <CraftsmanCard key={c.id} craftsman={c} />
              ))}
            </div>
          )}

          <div className="hidden lg:block">
            <DynamicMap craftsmen={results} zones={visibleZones} />
          </div>
        </div>
      </div>
    </div>
  );
}
