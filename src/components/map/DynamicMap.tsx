"use client";

import dynamic from "next/dynamic";
import type { Craftsman, MapZone } from "@/lib/types";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-clay-100 bg-cream-100 h-[500px] flex items-center justify-center text-charcoal-400">
      ...
    </div>
  ),
});

export default function DynamicMap(props: {
  craftsmen: Craftsman[];
  zones: MapZone[];
  height?: string;
  center?: [number, number];
}) {
  return <MapView {...props} />;
}
