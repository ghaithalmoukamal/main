import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { pickLocalized } from "@/lib/utils";
import type { WorkshopAsset } from "@/lib/types";

export default function WorkshopTab({ assets }: { assets: WorkshopAsset[] }) {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("profile");

  if (assets.length === 0) {
    return (
      <div className="p-8 text-center text-charcoal-400 border border-dashed border-clay-100 rounded-xl">
        {t("noAssets")}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {assets.map((a) => {
        const assetName = a.custom_name
          ? a.custom_name
          : a.asset_type
          ? pickLocalized(a.asset_type, "name", locale)
          : locale === "ar"
          ? "أداة غير معرّفة"
          : "Unknown asset";

        return (
          <div
            key={a.id}
            className="flex items-center gap-3 p-3 bg-cream-50 border border-clay-100 rounded-lg"
          >
            <span className="text-xl">🔧</span>
            <span className="flex-1 font-medium text-charcoal">{assetName}</span>
            {a.is_verified && (
              <Badge variant="verified">✓ {t("verifiedAsset")}</Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}
