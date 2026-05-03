"use client";

import dynamic from "next/dynamic";
import type { MapZone } from "@/lib/types";

const DrawableMap = dynamic(() => import("./DrawableMap"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-clay-100 bg-cream-100 h-[500px] flex items-center justify-center text-charcoal-400">
      ...
    </div>
  ),
});

export default function DynamicDrawableMap(props: {
  zones: MapZone[];
  height?: string;
  locale: "ar" | "en";
  onZoneDrawn?: (coordinates: [number, number][]) => void;
  isDrawing?: boolean;
}) {
  return <DrawableMap {...props} />;
}
