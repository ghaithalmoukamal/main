import { useLocale, useTranslations } from "next-intl";
import { pickLocalized } from "@/lib/utils";
import type { Craftsman, Trade, City } from "@/lib/types";

interface Props {
  craftsman: Craftsman & { trade?: Trade | null; city?: City };
}

export default function AboutTab({ craftsman }: Props) {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("profile");

  const bio =
    locale === "ar" ? craftsman.bio_ar : craftsman.bio_en ?? craftsman.bio_ar;
  const tradeName = craftsman.trade
    ? pickLocalized(craftsman.trade, "name", locale)
    : craftsman.custom_trade_name ?? "";
  const cityName = craftsman.city
    ? pickLocalized(craftsman.city, "name", locale)
    : "";

  return (
    <div className="space-y-5">
      {bio && (
        <div>
          <p className="text-charcoal-700 leading-relaxed text-lg">{bio}</p>
        </div>
      )}

      <dl className="grid sm:grid-cols-2 gap-4">
        {tradeName && (
          <div className="p-4 bg-cream-50 rounded-xl">
            <dt className="text-xs text-charcoal-400 uppercase tracking-wide mb-1">
              {t("trade")}
            </dt>
            <dd className="font-semibold text-charcoal">{tradeName}</dd>
          </div>
        )}
        {(craftsman.location_name || cityName) && (
          <div className="p-4 bg-cream-50 rounded-xl">
            <dt className="text-xs text-charcoal-400 uppercase tracking-wide mb-1">
              {t("location")}
            </dt>
            <dd className="font-semibold text-charcoal">
              {craftsman.location_name
                ? `${craftsman.location_name}, ${cityName}`
                : cityName}
            </dd>
            <dd className="text-xs text-charcoal-400 mt-1">
              📍 {t("approximateLocation")}
            </dd>
          </div>
        )}
      </dl>

      {/* Social links */}
      {(craftsman.instagram || craftsman.facebook) && (
        <div className="flex gap-3 flex-wrap pt-2">
          {craftsman.instagram && (
            <a
              href={`https://instagram.com/${craftsman.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-charcoal-500 hover:text-clay transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              {craftsman.instagram}
            </a>
          )}
          {craftsman.facebook && (
            <a
              href={`https://facebook.com/${craftsman.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-charcoal-500 hover:text-clay transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              {craftsman.facebook}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
