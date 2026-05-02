"use client";

import { useState } from "react";
import { pickLocalized } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import type { Craftsman, Trade, City, ApprovalStatus } from "@/lib/types";

interface Props {
  craftsmen: Array<Craftsman & { trade?: Trade | null; city?: City }>;
  locale: "ar" | "en";
}

export default function ApprovalsClient({ craftsmen, locale }: Props) {
  const [items, setItems] = useState(craftsmen);

  const update = (id: string, status: ApprovalStatus) =>
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, approval_status: status } : c))
    );

  const pending = items.filter((c) => c.approval_status === "pending");

  if (pending.length === 0) {
    return (
      <div className="p-8 text-center text-charcoal-400 border border-dashed border-clay-100 rounded-xl">
        {locale === "ar" ? "لا يوجد طلبات بانتظار المراجعة" : "No pending approvals"}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pending.map((c) => {
        const tradeName = c.trade ? pickLocalized(c.trade, "name", locale) : c.custom_trade_name ?? "";
        const cityName = c.city ? pickLocalized(c.city, "name", locale) : "";

        return (
          <div key={c.id} className="p-4 bg-white border border-clay-100 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center text-xl shrink-0">
                🛠️
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-charcoal">{c.name}</div>
                <div className="text-sm text-charcoal-500">
                  {tradeName} · {cityName}
                  {c.location_name ? ` · ${c.location_name}` : ""}
                </div>
                {(c.bio_ar || c.bio_en) && (
                  <p className="text-sm text-charcoal-400 mt-1 line-clamp-2">
                    {locale === "ar" ? c.bio_ar : c.bio_en}
                  </p>
                )}
                <div className="text-xs text-charcoal-400 mt-1">
                  📞 {c.phone}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-clay-100">
              <Button
                variant="primary"
                size="sm"
                onClick={() => update(c.id, "approved")}
              >
                ✅ {locale === "ar" ? "موافقة" : "Approve"}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => update(c.id, "rejected")}
              >
                ✗ {locale === "ar" ? "رفض" : "Reject"}
              </Button>
              <Link
                href={`/craftsman/${c.id}` as Parameters<typeof Link>[0]["href"]}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border-2 border-clay text-clay rounded-lg hover:bg-clay hover:text-cream transition-colors font-medium"
                target="_blank"
              >
                👁 {locale === "ar" ? "عرض الملف" : "View Profile"}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
