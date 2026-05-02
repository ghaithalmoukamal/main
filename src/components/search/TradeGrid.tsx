import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { DEMO_TRADES } from "@/lib/demo-data";
import { pickLocalized } from "@/lib/utils";
import TradeIcon from "./TradeIcon";

export default function TradeGrid() {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("home");

  return (
    <section className="py-10 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <h2 className="font-heading text-2xl font-bold mb-6 text-clay">
          {t("tradesTitle")}
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {DEMO_TRADES.map((trade) => (
            <Link
              key={trade.id}
              href={`/search?trade=${trade.id}`}
              className="group flex flex-col items-center gap-2 p-4 bg-cream-50 border border-clay-100 rounded-xl hover:border-clay hover:shadow-md transition-all"
            >
              <TradeIcon icon={trade.icon} className="text-3xl" />
              <span className="text-sm font-medium text-charcoal-700 text-center group-hover:text-clay">
                {pickLocalized(trade, "name", locale)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
