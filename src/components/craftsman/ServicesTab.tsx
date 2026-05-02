import { useLocale, useTranslations } from "next-intl";
import { formatPrice, pickLocalized } from "@/lib/utils";
import type { Service } from "@/lib/types";

export default function ServicesTab({ services }: { services: Service[] }) {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("profile");

  if (services.length === 0) {
    return (
      <div className="p-8 text-center text-charcoal-400 border border-dashed border-clay-100 rounded-xl">
        {t("noServices")}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {services.map((s) => {
        const name = locale === "ar" ? s.name_ar : s.name_en ?? s.name_ar;
        return (
          <div
            key={s.id}
            className="p-4 bg-cream-50 border border-clay-100 rounded-xl"
          >
            <div className="font-semibold text-charcoal mb-1">{name}</div>
            {s.description && (
              <p className="text-sm text-charcoal-500 mb-2">{s.description}</p>
            )}
            {s.starting_price != null && (
              <div className="text-brass font-medium text-sm">
                {locale === "ar" ? "يبدأ من" : "From"}{" "}
                {formatPrice(s.starting_price, s.currency, locale)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
