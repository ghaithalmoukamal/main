"use client";

import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import type { Craftsman } from "@/lib/types";
import { Badge, StatusDot } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { pickLocalized, whatsappLink } from "@/lib/utils";
import TradeIcon from "./TradeIcon";
import { useMode } from "@/components/layout/ModeProvider";

export default function CraftsmanCard({
  craftsman,
}: {
  craftsman: Craftsman;
}) {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("profile");
  const tStatus = useTranslations("status");
  const { mode } = useMode();

  const tradeName = pickLocalized(craftsman.trade ?? null, "name", locale);
  const bio = locale === "ar" ? craftsman.bio_ar : craftsman.bio_en;

  return (
    <Card hoverable className="overflow-hidden">
      <div className="flex gap-3 p-4">
        {/* Photo / icon block */}
        <div className="shrink-0 w-16 h-16 rounded-lg bg-clay-50 flex items-center justify-center overflow-hidden">
          {craftsman.photo_url && mode === "normal" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={craftsman.photo_url}
              alt={craftsman.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <TradeIcon
              icon={craftsman.trade?.icon ?? null}
              className="text-3xl"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <Link
              href={`/craftsman/${craftsman.id}`}
              className="font-heading font-semibold text-charcoal hover:text-clay text-base truncate"
            >
              {craftsman.name}
            </Link>
            {craftsman.is_verified && (
              <Badge variant="verified">✓ {tStatus("verified")}</Badge>
            )}
            {craftsman.is_elite && (
              <Badge variant="elite">★ {tStatus("elite")}</Badge>
            )}
          </div>
          <div className="text-sm text-charcoal-500 truncate">
            {tradeName}
            {craftsman.location_name && ` — ${craftsman.location_name}`}
          </div>
          {bio && (
            <p className="text-sm text-charcoal-600 mt-1 line-clamp-2">
              {bio}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1.5 text-xs">
              <StatusDot status={craftsman.status} />
              <span
                className={
                  craftsman.status === "open"
                    ? "text-verified"
                    : "text-busy"
                }
              >
                {tStatus(craftsman.status)}
              </span>
            </span>
            {craftsman.whatsapp && (
              <a
                href={whatsappLink(craftsman.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-verified/10 text-verified text-xs font-medium hover:bg-verified hover:text-cream transition-colors"
              >
                💬 {t("contactWhatsapp")}
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
