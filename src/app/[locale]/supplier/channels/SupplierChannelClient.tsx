"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { pickLocalized } from "@/lib/utils";
import type { Channel } from "@/lib/types";

interface Props {
  channels: Channel[];
  locale: "ar" | "en";
}

export default function SupplierChannelClient({ channels, locale }: Props) {
  const isAr = locale === "ar";
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<Set<number>>(new Set());
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggle = (id: number) =>
    setSelectedChannels((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handlePost = async () => {
    if (!title || selectedChannels.size === 0) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setBusy(false);
  };

  if (sent) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-3">📡</div>
        <p className="text-charcoal-600">
          {isAr ? "تم نشر المنشور في القنوات المحددة" : "Post published to selected channels"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        label={isAr ? "عنوان المنشور" : "Post Title"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={isAr ? "مثلاً: عروض خشب جوز هذا الأسبوع" : "e.g. Walnut wood deals this week"}
        required
      />
      <Textarea
        label={isAr ? "التفاصيل" : "Details"}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        rows={3}
      />
      <Input
        label={isAr ? "معلومات السعر" : "Price Info"}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder={isAr ? "مثلاً: ٥٠٠ ل.س / متر" : "e.g. 500 SYP / meter"}
      />
      <Input
        label={isAr ? "رقم الواتساب" : "WhatsApp"}
        type="tel"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        placeholder="+963 9XX XXX XXX"
      />

      <div>
        <div className="text-sm font-medium text-charcoal-700 mb-2">
          {isAr ? "القنوات:" : "Channels:"}
        </div>
        <div className="flex flex-wrap gap-2">
          {channels.map((ch) => {
            const name = pickLocalized(ch, "name", locale);
            const on = selectedChannels.has(ch.id);
            return (
              <button
                key={ch.id}
                onClick={() => toggle(ch.id)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${on ? "bg-clay text-cream border-clay" : "border-clay-100 text-charcoal-600 hover:border-clay"}`}
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
        disabled={busy || !title || selectedChannels.size === 0}
        onClick={handlePost}
      >
        {busy ? (isAr ? "جاري النشر..." : "Publishing...") : (isAr ? "📡 انشر الآن" : "📡 Publish Now")}
      </Button>
    </div>
  );
}
