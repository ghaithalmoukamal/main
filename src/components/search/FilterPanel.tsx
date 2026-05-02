"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Select } from "@/components/ui/Input";
import {
  DEMO_TRADES,
  DEMO_CITIES,
  DEMO_ASSET_TYPES,
} from "@/lib/demo-data";
import { pickLocalized } from "@/lib/utils";

export default function FilterPanel({
  current,
}: {
  current: {
    q?: string;
    trade?: string;
    status?: string;
    city?: string;
    asset?: string;
  };
}) {
  const t = useTranslations("search");
  const locale = useLocale() as "ar" | "en";
  const router = useRouter();

  const update = (key: string, value: string) => {
    const params = new URLSearchParams();
    Object.entries(current).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <aside className="space-y-3 p-4 bg-cream-50 border border-clay-100 rounded-xl">
      <div className="font-heading font-semibold text-clay mb-1">
        {t("filtersTitle")}
      </div>

      <Select
        label={t("filterTrade")}
        value={current.trade ?? ""}
        onChange={(e) => update("trade", e.target.value)}
      >
        <option value="">{t("anyOption")}</option>
        {DEMO_TRADES.map((trade) => (
          <option key={trade.id} value={trade.id}>
            {pickLocalized(trade, "name", locale)}
          </option>
        ))}
      </Select>

      <Select
        label={t("filterStatus")}
        value={current.status ?? ""}
        onChange={(e) => update("status", e.target.value)}
      >
        <option value="">{t("anyOption")}</option>
        <option value="open">{locale === "ar" ? "متاح" : "Available"}</option>
        <option value="busy">{locale === "ar" ? "مشغول" : "Busy"}</option>
      </Select>

      <Select
        label={t("filterCity")}
        value={current.city ?? ""}
        onChange={(e) => update("city", e.target.value)}
      >
        <option value="">{t("anyOption")}</option>
        {DEMO_CITIES.map((c) => (
          <option key={c.id} value={c.id}>
            {pickLocalized(c, "name", locale)}
          </option>
        ))}
      </Select>

      <Select
        label={t("filterAssets")}
        value={current.asset ?? ""}
        onChange={(e) => update("asset", e.target.value)}
      >
        <option value="">{t("anyOption")}</option>
        {DEMO_ASSET_TYPES.map((a) => (
          <option key={a.id} value={a.id}>
            {pickLocalized(a, "name", locale)}
          </option>
        ))}
      </Select>
    </aside>
  );
}
