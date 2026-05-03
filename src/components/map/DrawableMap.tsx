"use client";

import { useState, useCallback, useEffect, useId } from "react";
import { MapContainer, TileLayer, Polygon, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapZone } from "@/lib/types";
import { DAMASCUS_CENTER, DEFAULT_ZOOM, ZONE_TYPES } from "@/lib/constants";
import { pickLocalized } from "@/lib/utils";

interface DrawableMapProps {
  zones: MapZone[];
  height?: string;
  locale: "ar" | "en";
  onZoneDrawn?: (coordinates: [number, number][]) => void;
  isDrawing?: boolean;
}

function DrawingHandler({
  isDrawing,
  points,
  onAddPoint,
}: {
  isDrawing: boolean;
  points: [number, number][];
  onAddPoint: (latlng: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      if (!isDrawing) return;
      onAddPoint([e.latlng.lat, e.latlng.lng]);
    },
  });

  if (points.length < 2) return null;

  return (
    <Polygon
      positions={points}
      pathOptions={{
        color: "#E67E22",
        fillColor: "#E67E22",
        fillOpacity: 0.25,
        weight: 3,
        dashArray: "8 4",
      }}
    />
  );
}

export default function DrawableMap({
  zones,
  height = "500px",
  locale,
  onZoneDrawn,
  isDrawing = false,
}: DrawableMapProps) {
  const mapId = useId();
  const [drawPoints, setDrawPoints] = useState<[number, number][]>([]);

  useEffect(() => {
    // Fix Leaflet default icons
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  // Reset points when drawing mode is toggled off
  useEffect(() => {
    if (!isDrawing) setDrawPoints([]);
  }, [isDrawing]);

  const handleAddPoint = useCallback((latlng: [number, number]) => {
    setDrawPoints((prev) => [...prev, latlng]);
  }, []);

  const handleFinish = useCallback(() => {
    if (drawPoints.length >= 3 && onZoneDrawn) {
      onZoneDrawn(drawPoints);
    }
  }, [drawPoints, onZoneDrawn]);

  const handleUndo = useCallback(() => {
    setDrawPoints((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setDrawPoints([]);
  }, []);

  const polygons = zones
    .filter((z) => z.is_active && z.geojson?.type === "Polygon")
    .map((z) => {
      const coords = (z.geojson as GeoJSON.Polygon).coordinates[0];
      return {
        zone: z,
        positions: coords.map(([lng, lat]) => [lat, lng] as [number, number]),
      };
    });

  return (
    <div className="space-y-3">
      {/* Drawing toolbar */}
      {isDrawing && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
          <span className="text-amber-700 font-medium">
            {locale === "ar" ? "🖊️ انقر على الخريطة لرسم نقاط المنطقة" : "🖊️ Click on the map to draw zone points"}
          </span>
          <span className="text-amber-500">({drawPoints.length} {locale === "ar" ? "نقطة" : "points"})</span>
          <div className="flex-1" />
          <button
            onClick={handleUndo}
            disabled={drawPoints.length === 0}
            className="px-2 py-1 text-xs border border-amber-300 rounded-lg text-amber-700 hover:bg-amber-100 disabled:opacity-30 transition-colors"
          >
            {locale === "ar" ? "تراجع" : "Undo"}
          </button>
          <button
            onClick={handleClear}
            disabled={drawPoints.length === 0}
            className="px-2 py-1 text-xs border border-amber-300 rounded-lg text-amber-700 hover:bg-amber-100 disabled:opacity-30 transition-colors"
          >
            {locale === "ar" ? "مسح" : "Clear"}
          </button>
          <button
            onClick={handleFinish}
            disabled={drawPoints.length < 3}
            className="px-3 py-1 text-xs bg-clay text-cream rounded-lg hover:bg-clay-600 disabled:opacity-30 transition-colors font-medium"
          >
            {locale === "ar" ? "✓ إنهاء الرسم" : "✓ Finish Drawing"}
          </button>
        </div>
      )}

      <div className="rounded-xl overflow-hidden border border-clay-100" style={{ height }}>
        <MapContainer
          key={mapId}
          center={DAMASCUS_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
          className={isDrawing ? "cursor-crosshair" : ""}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Existing zones */}
          {polygons.map(({ zone, positions }) => {
            const meta = ZONE_TYPES[zone.type];
            return (
              <Polygon
                key={zone.id}
                positions={positions}
                pathOptions={{
                  color: zone.color || meta.color,
                  fillColor: zone.color || meta.color,
                  fillOpacity: 0.18,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold">
                      {meta.emoji} {pickLocalized(zone, "name", locale)}
                    </div>
                    <div className="text-charcoal-500 mt-1">
                      {locale === "ar" ? meta.label_ar : meta.label_en}
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

          {/* Drawing handler */}
          <DrawingHandler
            isDrawing={isDrawing}
            points={drawPoints}
            onAddPoint={handleAddPoint}
          />
        </MapContainer>
      </div>
    </div>
  );
}
