"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Craftsman, MapZone } from "@/lib/types";
import { DAMASCUS_CENTER, DEFAULT_ZOOM, ZONE_TYPES } from "@/lib/constants";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { pickLocalized } from "@/lib/utils";

// Custom brand-colored marker
const buildIcon = (status: "open" | "busy") =>
  L.divIcon({
    className: "souq-marker",
    html: `<div style="
      width:28px;height:28px;border-radius:999px;
      background:${status === "open" ? "#2E7D32" : "#B71C1C"};
      border:3px solid #F5F0E8;
      box-shadow:0 2px 4px rgba(0,0,0,0.25);
      display:flex;align-items:center;justify-content:center;
      color:white;font-weight:bold;font-size:14px;
    ">★</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });

export default function MapView({
  craftsmen,
  zones,
  height = "500px",
  center,
}: {
  craftsmen: Craftsman[];
  zones: MapZone[];
  height?: string;
  center?: [number, number];
}) {
  const locale = useLocale() as "ar" | "en";

  // Default Leaflet icons in SSR-less envs sometimes break — fix
  useEffect(() => {
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const polygons = useMemo(() => {
    return zones
      .filter((z) => z.is_active && z.geojson?.type === "Polygon")
      .map((z) => {
        const coords = (z.geojson as GeoJSON.Polygon).coordinates[0];
        return {
          zone: z,
          positions: coords.map(([lng, lat]) => [lat, lng] as [number, number]),
        };
      });
  }, [zones]);

  return (
    <div className="rounded-xl overflow-hidden border border-clay-100" style={{ height }}>
      <MapContainer
        center={center ?? DAMASCUS_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

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

        {craftsmen
          .filter(
            (c): c is Craftsman & { latitude: number; longitude: number } =>
              c.latitude !== null && c.longitude !== null
          )
          .map((c) => (
            <Marker
              key={c.id}
              position={[c.latitude, c.longitude]}
              icon={buildIcon(c.status)}
            >
              <Popup>
                <div className="text-sm min-w-[180px]">
                  <Link
                    href={`/craftsman/${c.id}`}
                    className="font-semibold text-clay"
                  >
                    {c.name}
                  </Link>
                  <div className="text-charcoal-500">
                    {pickLocalized(c.trade ?? null, "name", locale)}
                  </div>
                  {c.location_name && (
                    <div className="text-charcoal-400 text-xs mt-1">
                      📍 {c.location_name}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
