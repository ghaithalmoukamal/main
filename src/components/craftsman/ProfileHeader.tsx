"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { StatusDot } from "@/components/ui/Badge";
import { Badge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { whatsappLink, pickLocalized } from "@/lib/utils";
import type { Craftsman, Trade, City } from "@/lib/types";

interface Props {
  craftsman: Craftsman & { trade?: Trade | null; city?: City };
  completedJobs?: number;
}

export default function ProfileHeader({ craftsman, completedJobs = 0 }: Props) {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("profile");
  const tStatus = useTranslations("status");

  const tradeName = craftsman.trade
    ? pickLocalized(craftsman.trade, "name", locale)
    : craftsman.custom_trade_name ?? "";

  const cityName = craftsman.city
    ? pickLocalized(craftsman.city, "name", locale)
    : "";

  return (
    <div className="bg-white border border-clay-100 rounded-2xl p-6 shadow-sm">
      <div className="flex gap-4 items-start">
        {/* Avatar */}
        <div className="shrink-0">
          {craftsman.photo_url ? (
            <Image
              src={craftsman.photo_url}
              alt={craftsman.name}
              width={80}
              height={80}
              className="w-20 h-20 rounded-xl object-cover border-2 border-clay-100"
              priority
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-cream-100 border-2 border-clay-100 flex items-center justify-center text-3xl">
              🛠️
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="font-heading text-2xl font-bold text-clay">
              {craftsman.name}
            </h1>
            <StatusDot status={craftsman.status} />
            <span className="text-sm text-charcoal-500">
              {tStatus(craftsman.status)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {tradeName && (
              <Badge variant="neutral">{tradeName}</Badge>
            )}
            {craftsman.is_elite && (
              <Badge variant="brass">⭐ {tStatus("elite")}</Badge>
            )}
            {craftsman.is_verified && (
              <Badge variant="verified">✓ {tStatus("verified")}</Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-charcoal-500">
            {cityName && (
              <span>📍 {craftsman.location_name ?? cityName}</span>
            )}
            {completedJobs > 0 && (
              <span>✅ {completedJobs} {t("completedJobs")}</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-clay-100">
        {craftsman.whatsapp && (
          <LinkButton
            href={whatsappLink(
              craftsman.whatsapp,
              locale === "ar"
                ? `مرحباً، شفت ملفك على سوق الحرفيين وبدي أتواصل معك`
                : `Hi, I found your profile on Souq Al-Hirfiyeen and I'd like to get in touch`
            )}
            external
            variant="primary"
            size="lg"
          >
            <WhatsAppIcon />
            {t("contactWhatsapp")}
          </LinkButton>
        )}
        <Button variant="outline" size="lg">
          📋 {t("sendInquiry")}
        </Button>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
