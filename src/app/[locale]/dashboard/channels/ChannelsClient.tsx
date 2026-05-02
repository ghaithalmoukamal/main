"use client";

import { useState } from "react";
import { pickLocalized } from "@/lib/utils";
import { Toggle } from "@/components/ui/Toggle";
import type { Channel } from "@/lib/types";

interface Props {
  channels: Channel[];
  locale: "ar" | "en";
}

export default function ChannelsClient({ channels, locale }: Props) {
  // Demo: all subscribed to start
  const [subscribed, setSubscribed] = useState<Set<number>>(
    new Set(channels.map((c) => c.id))
  );

  const toggle = (id: number) =>
    setSubscribed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const typeEmoji: Record<string, string> = {
    trade: "🔧",
    material: "🧱",
    zone: "📍",
    custom: "⭐",
  };

  return (
    <div className="space-y-3">
      {channels.map((ch) => {
        const name = pickLocalized(ch, "name", locale);
        const on = subscribed.has(ch.id);

        return (
          <div
            key={ch.id}
            className="flex items-center gap-3 p-4 bg-white border border-clay-100 rounded-xl"
          >
            <span className="text-xl">{typeEmoji[ch.type] ?? "📡"}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-charcoal">{name}</div>
              <div className="text-xs text-charcoal-400">#{ch.slug}</div>
            </div>
            <Toggle
              checked={on}
              onChange={() => toggle(ch.id)}
              labelOn={locale === "ar" ? "مشترك" : "Subscribed"}
              labelOff={locale === "ar" ? "اشترك" : "Subscribe"}
            />
          </div>
        );
      })}
    </div>
  );
}
