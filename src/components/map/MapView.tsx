"use client";

import { useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Craftsman, MapZone } from "@/lib/types";
import { DAMASCUS_CENTER, DEFAULT_ZOOM, ZONE_TYPES } from "@/lib/constants";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Fix default icons once
  useEffect(() => {
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
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

  // Initialize map imperatively — fully controlled lifecycle
  useEffect(() => {
    if (!containerRef.current) return;

    // If map already exists, destroy it first
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      center: center ?? DAMASCUS_CENTER,
      zoom: DEFAULT_ZOOM,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add zone polygons
    polygons.forEach(({ zone, positions }) => {
      const meta = ZONE_TYPES[zone.type];
      const polygon = L.polygon(positions, {
        color: zone.color || meta.color,
        fillColor: zone.color || meta.color,
        fillOpacity: 0.18,
        weight: 2,
      }).addTo(map);

      polygon.bindPopup(`
        <div class="text-sm">
          <div class="font-semibold">${meta.emoji} ${pickLocalized(zone, "name", locale)}</div>
          <div class="text-charcoal-500 mt-1">${locale === "ar" ? meta.label_ar : meta.label_en}</div>
        </div>
      `);
    });

    // Add craftsman markers
    craftsmen
      .filter(
        (c): c is Craftsman & { latitude: number; longitude: number } =>
          c.latitude !== null && c.longitude !== null
      )
      .forEach((c) => {
        const marker = L.marker([c.latitude, c.longitude], {
          icon: buildIcon(c.status),
        }).addTo(map);

        marker.bindPopup(`
          <div class="text-sm min-w-[180px]">
            <a href="/${locale}/craftsman/${c.id}" class="font-semibold" style="color:#8B4513">${c.name}</a>
            <div style="color:#6B7280">${pickLocalized(c.trade ?? null, "name", locale)}</div>
            ${c.location_name ? `<div style="color:#9CA3AF;font-size:12px;margin-top:4px">📍 ${c.location_name}</div>` : ""}
          </div>
        `);
      });

    mapRef.current = map;

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, craftsmen, polygons, locale]);

  return (
    <div className="rounded-xl overflow-hidden border border-clay-100" style={{ height }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
