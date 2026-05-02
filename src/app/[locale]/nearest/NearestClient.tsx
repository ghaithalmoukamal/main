"use client";

import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  DEMO_CRAFTSMEN,
  DEMO_TRADES,
  DEMO_CITIES,
} from "@/lib/demo-data";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import CraftsmanCard from "@/components/search/CraftsmanCard";
import { haversineKm, pickLocalized } from "@/lib/utils";

export default function NearestClient() {
  const locale = useLocale() as "ar" | "en";
  const tNav = useTranslations("nav");
  const tHome = useTranslations("home");
  const tCommon = useTranslations("common");

  const [tradeId, setTradeId] = useState<number | null>(null);
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const ranked = useMemo(() => {
    if (!coords) return [];
    return DEMO_CRAFTSMEN.filter(
      (c) =>
        c.approval_status === "approved" &&
        c.status === "open" &&
        (!tradeId || c.trade_id === tradeId) &&
        c.latitude !== null &&
        c.longitude !== null
    )
      .map((c) => ({
        ...c,
        trade: DEMO_TRADES.find((t) => t.id === c.trade_id) ?? null,
        city: DEMO_CITIES.find((x) => x.id === c.city_id),
        distance: haversineKm(coords, [c.latitude!, c.longitude!]),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }, [coords, tradeId]);

  const locate = () => {
    setError(null);
    setBusy(true);
    if (!navigator.geolocation) {
      setError(
        locale === "ar"
          ? "متصفحك ما يدعم تحديد الموقع"
          : "Your browser doesn't support geolocation"
      );
      setBusy(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([pos.coords.latitude, pos.coords.longitude]);
        setBusy(false);
      },
      () => {
        setError(
          locale === "ar"
            ? "ما قدرنا نحدد موقعك. سمحلنا بالوصول."
            : "Could not get your location. Please grant permission."
        );
        setBusy(false);
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="font-heading text-3xl font-bold text-clay mb-2">
        {tNav("nearest")}
      </h1>
      <p className="text-charcoal-600 mb-6">
        {locale === "ar"
          ? "اضغط زر، نلاقيلك أقرب معلم متاح."
          : "Tap the button, we'll find the nearest available craftsman."}
      </p>

      <div className="grid sm:grid-cols-[1fr_auto] gap-3 mb-6">
        <Select
          value={tradeId ?? ""}
          onChange={(e) =>
            setTradeId(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">
            {locale === "ar" ? "أي مهنة" : "Any trade"}
          </option>
          {DEMO_TRADES.map((trade) => (
            <option key={trade.id} value={trade.id}>
              {pickLocalized(trade, "name", locale)}
            </option>
          ))}
        </Select>
        <Button onClick={locate} disabled={busy} size="lg">
          📍 {busy ? tCommon("loading") : tHome("searchButton")}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-busy/30 text-busy rounded-lg mb-4">
          {error}
        </div>
      )}

      {coords && (
        <div className="space-y-4">
          <div className="text-sm text-charcoal-500">
            {locale === "ar" ? "أقرب ٥ معلمين متاحين:" : "Nearest 5 available craftsmen:"}
          </div>
          {ranked.length === 0 ? (
            <div className="p-6 text-center text-charcoal-400 border border-dashed border-clay-100 rounded-xl">
              {locale === "ar"
                ? "ما لقينا حدا متاح حالياً"
                : "Nobody available right now"}
            </div>
          ) : (
            <div className="grid gap-3">
              {ranked.map((c) => (
                <div key={c.id}>
                  <div className="text-xs text-charcoal-400 mb-1">
                    {c.distance < 1
                      ? `${Math.round(c.distance * 1000)} m`
                      : `${c.distance.toFixed(1)} km`}
                  </div>
                  <CraftsmanCard craftsman={c} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
