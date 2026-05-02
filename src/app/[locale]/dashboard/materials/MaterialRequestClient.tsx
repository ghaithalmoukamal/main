"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { pickLocalized } from "@/lib/utils";
import type { Channel } from "@/lib/types";

interface Props {
  channels: Channel[];
  locale: "ar" | "en";
}

export default function MaterialRequestClient({ channels, locale }: Props) {
  const [desc, setDesc] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<Set<number>>(new Set());
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggleChannel = (id: number) =>
    setSelectedChannels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleSend = async () => {
    if (!desc || selectedChannels.size === 0) return;
    setBusy(true);
    // TODO: POST /api/material-request
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setBusy(false);
  };

  if (sent) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-3">📡</div>
        <p className="text-charcoal-600">
          {locale === "ar"
            ? "تم إرسال طلبك للموردين المختصين"
            : "Your request has been sent to relevant suppliers"}
        </p>
        <button
          onClick={() => {
            setDesc("");
            setSelectedChannels(new Set());
            setSent(false);
          }}
          className="mt-4 text-sm text-clay underline"
        >
          {locale === "ar" ? "طلب جديد" : "New request"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Textarea
        label={
          locale === "ar"
            ? "وصف ما تحتاجه من مواد"
            : "Describe the materials you need"
        }
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        rows={4}
        placeholder={
          locale === "ar"
            ? "مثلاً: محتاج خشب جوز ٣×٥ سم، ٢٠ متر..."
            : "e.g. Need walnut wood 3×5cm, 20m..."
        }
      />

      <div>
        <div className="text-sm font-medium text-charcoal-700 mb-2">
          {locale === "ar" ? "أرسل إلى القنوات:" : "Send to channels:"}
        </div>
        <div className="flex flex-wrap gap-2">
          {channels.map((ch) => {
            const name = pickLocalized(ch, "name", locale);
            const on = selectedChannels.has(ch.id);
            return (
              <button
                key={ch.id}
                onClick={() => toggleChannel(ch.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  on
                    ? "bg-clay text-cream border-clay"
                    : "bg-white text-charcoal-600 border-clay-100 hover:border-clay"
                }`}
              >
                #{name}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        variant="primary"
        fullWidth
        disabled={busy || !desc || selectedChannels.size === 0}
        onClick={handleSend}
      >
        {busy
          ? locale === "ar"
            ? "جاري الإرسال..."
            : "Sending..."
          : locale === "ar"
          ? "📡 ارسل الطلب للموردين"
          : "📡 Broadcast to Suppliers"}
      </Button>
    </div>
  );
}
