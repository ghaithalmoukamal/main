import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import SearchBar from "@/components/search/SearchBar";
import TradeGrid from "@/components/search/TradeGrid";
import CraftsmanCard from "@/components/search/CraftsmanCard";
import { Link } from "@/i18n/routing";
import { DEMO_CRAFTSMEN, DEMO_TRADES, DEMO_CITIES } from "@/lib/demo-data";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tBrand = await getTranslations("brand");

  // Featured: top 4 elite/verified open craftsmen
  const featured = DEMO_CRAFTSMEN.filter(
    (c) => c.approval_status === "approved" && (c.is_elite || c.is_verified)
  )
    .map((c) => ({
      ...c,
      trade: DEMO_TRADES.find((t) => t.id === c.trade_id) ?? null,
      city: DEMO_CITIES.find((x) => x.id === c.city_id),
    }))
    .slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-pattern-geometric bg-cream-100 border-b border-clay-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-14 md:py-20">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-clay mb-3">
            {t("heroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-charcoal-600 mb-2 max-w-2xl">
            {t("heroSubtitle")}
          </p>
          <p className="text-brass font-medium mb-7">{tBrand("tagline")}</p>
          <SearchBar />
        </div>
      </section>

      {/* Trade categories */}
      <TradeGrid />

      {/* Role-based CTAs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 grid md:grid-cols-2 gap-5">
          <Link
            href="/craftsman/register"
            className="group p-6 lg:p-8 bg-clay text-cream rounded-2xl hover:bg-clay-600 transition-colors"
          >
            <div className="text-3xl mb-2">🛠️</div>
            <div className="font-heading text-xl lg:text-2xl font-bold">
              {t("ctaCraftsman")}
            </div>
            <div className="opacity-90 mt-1">{t("ctaCraftsmanDesc")}</div>
            <div className="mt-4 text-sm opacity-75 group-hover:opacity-100">→</div>
          </Link>
          <Link
            href="/firm"
            className="group p-6 lg:p-8 bg-charcoal text-cream rounded-2xl hover:bg-charcoal-600 transition-colors"
          >
            <div className="text-3xl mb-2">🏢</div>
            <div className="font-heading text-xl lg:text-2xl font-bold">
              {t("ctaFirm")}
            </div>
            <div className="opacity-90 mt-1">{t("ctaFirmDesc")}</div>
            <div className="mt-4 text-sm opacity-75 group-hover:opacity-100">→</div>
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="py-10 bg-cream-100 border-y border-clay-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <h2 className="font-heading text-2xl font-bold mb-6 text-clay">
            {t("featuredTitle")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
            {featured.map((c) => (
              <CraftsmanCard key={c.id} craftsman={c} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
