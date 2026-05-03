"use client";

import { useState } from "react";
import DynamicDrawableMap from "@/components/map/DynamicDrawableMap";
import type { MapZone, ZoneType } from "@/lib/types";
import { pickLocalized } from "@/lib/utils";

const ZONE_EMOJI: Record<string, string> = {
  construction: "🏗️",
  market: "🏪",
  industrial: "🏭",
  heritage: "🕌",
  residential: "🏠",
  commercial: "🏢",
};

const ZONE_TYPE_OPTIONS = [
  { value: "construction", labelAr: "بناء", labelEn: "Construction" },
  { value: "industrial", labelAr: "صناعي", labelEn: "Industrial" },
  { value: "heritage", labelAr: "تراث", labelEn: "Heritage" },
  { value: "market", labelAr: "سوق", labelEn: "Market" },
  { value: "residential", labelAr: "سكني", labelEn: "Residential" },
  { value: "commercial", labelAr: "تجاري", labelEn: "Commercial" },
];

interface Props {
  locale: "ar" | "en";
  zones: MapZone[];
}

export default function AdminZonesClient({ locale, zones: initialZones }: Props) {
  const isAr = locale === "ar";
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnCoords, setDrawnCoords] = useState<[number, number][] | null>(null);
  const [zones, setZones] = useState(initialZones);

  // New zone form
  const [newName, setNewName] = useState("");
  const [newNameEn, setNewNameEn] = useState("");
  const [newType, setNewType] = useState<ZoneType>("construction");
  const [newVisibility, setNewVisibility] = useState<"public" | "firms_only">("public");

  function handleZoneDrawn(coordinates: [number, number][]) {
    setDrawnCoords(coordinates);
    setIsDrawing(false);
  }

  function handleSaveZone() {
    if (!drawnCoords || drawnCoords.length < 3 || !newName) return;

    const geojsonCoords = drawnCoords.map(([lat, lng]) => [lng, lat]);
    geojsonCoords.push(geojsonCoords[0]); // Close the polygon

    const newZone: MapZone = {
      id: Date.now(),
      city_id: 1,
      name_ar: newName,
      name_en: newNameEn || newName,
      type: newType,
      description: null,
      geojson: { type: "Polygon", coordinates: [geojsonCoords] },
      color: "#E67E22",
      visibility: newVisibility,
      is_active: true,
      created_by: null,
      created_at: new Date().toISOString(),
    };

    setZones((prev) => [...prev, newZone]);
    setDrawnCoords(null);
    setNewName("");
    setNewNameEn("");
    setNewType("construction");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-clay">
          {isAr ? "المناطق الجغرافية" : "Map Zones"}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setIsDrawing(!isDrawing); setDrawnCoords(null); }}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              isDrawing
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-clay text-cream hover:bg-clay-600"
            }`}
          >
            {isDrawing
              ? isAr ? "❌ إلغاء الرسم" : "❌ Cancel Drawing"
              : isAr ? "✏️ ارسم منطقة" : "✏️ Draw Zone"}
          </button>
        </div>
      </div>

      {/* Map */}
      <DynamicDrawableMap
        zones={zones}
        locale={locale}
        isDrawing={isDrawing}
        onZoneDrawn={handleZoneDrawn}
        height="450px"
      />

      {/* New zone form (appears after drawing) */}
      {drawnCoords && (
        <div className="p-5 bg-amber-50 border-2 border-amber-200 rounded-2xl space-y-4">
          <h3 className="font-heading text-lg font-bold text-charcoal">
            {isAr ? "تسمية المنطقة الجديدة" : "Name Your New Zone"}
          </h3>
          <div className="text-xs text-amber-700 mb-2">
            {isAr ? `${drawnCoords.length} نقطة مرسومة` : `${drawnCoords.length} points drawn`}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-charcoal-500 mb-1 block">
                {isAr ? "الاسم (عربي)" : "Name (Arabic)"}
              </label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-clay-100 rounded-lg text-sm focus:border-clay focus:ring-1 focus:ring-clay outline-none"
                placeholder={isAr ? "مثال: حي الميدان" : "e.g. Al-Midan Quarter"}
              />
            </div>
            <div>
              <label className="text-xs text-charcoal-500 mb-1 block">
                {isAr ? "الاسم (إنكليزي)" : "Name (English)"}
              </label>
              <input
                value={newNameEn}
                onChange={(e) => setNewNameEn(e.target.value)}
                className="w-full px-3 py-2 border border-clay-100 rounded-lg text-sm focus:border-clay focus:ring-1 focus:ring-clay outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-charcoal-500 mb-1 block">
                {isAr ? "نوع المنطقة" : "Zone Type"}
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as ZoneType)}
                className="w-full px-3 py-2 border border-clay-100 rounded-lg text-sm focus:border-clay outline-none bg-white"
              >
                {ZONE_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {isAr ? opt.labelAr : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-charcoal-500 mb-1 block">
                {isAr ? "الرؤية" : "Visibility"}
              </label>
              <select
                value={newVisibility}
                onChange={(e) => setNewVisibility(e.target.value as "public" | "firms_only")}
                className="w-full px-3 py-2 border border-clay-100 rounded-lg text-sm focus:border-clay outline-none bg-white"
              >
                <option value="public">{isAr ? "عام" : "Public"}</option>
                <option value="firms_only">{isAr ? "شركات فقط" : "Firms Only"}</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSaveZone}
              disabled={!newName}
              className="px-5 py-2 bg-clay text-cream rounded-lg text-sm font-medium hover:bg-clay-600 disabled:opacity-40 transition-colors"
            >
              {isAr ? "💾 حفظ المنطقة" : "💾 Save Zone"}
            </button>
            <button
              onClick={() => setDrawnCoords(null)}
              className="px-4 py-2 border border-clay-100 text-charcoal-500 rounded-lg text-sm hover:border-clay transition-colors"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
          </div>

          {/* GeoJSON preview */}
          <details className="text-xs">
            <summary className="text-charcoal-400 cursor-pointer hover:text-charcoal">
              {isAr ? "عرض GeoJSON" : "Show GeoJSON"}
            </summary>
            <pre className="mt-2 p-3 bg-white border border-clay-100 rounded-lg overflow-x-auto text-[10px] text-charcoal-600">
              {JSON.stringify({
                type: "Polygon",
                coordinates: [drawnCoords.map(([lat, lng]) => [lng, lat])],
              }, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Existing zones list */}
      <div className="space-y-3">
        <h2 className="font-heading text-lg font-bold text-charcoal">
          {isAr ? "المناطق الحالية" : "Existing Zones"} ({zones.length})
        </h2>
        {zones.map((zone) => {
          const name = pickLocalized(zone, "name", locale);
          return (
            <div
              key={zone.id}
              className="flex items-center gap-4 p-4 bg-white border border-clay-100 rounded-xl"
            >
              <span className="text-2xl">{ZONE_EMOJI[zone.type] ?? "📍"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-charcoal">{name}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: zone.color + "30", color: zone.color }}
                  >
                    {zone.type}
                  </span>
                </div>
                <div className="text-xs text-charcoal-400 mt-0.5">
                  {zone.visibility} · {zone.is_active ? (isAr ? "نشط" : "Active") : (isAr ? "معطّل" : "Inactive")}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1.5 border border-clay-100 rounded-lg hover:border-clay text-charcoal-500 hover:text-clay transition-colors">
                  {isAr ? "تعديل" : "Edit"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
