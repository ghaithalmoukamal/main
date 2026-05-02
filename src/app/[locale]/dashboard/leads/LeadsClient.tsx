"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Lead } from "@/lib/types";

// Demo leads; replaced by real data from Supabase once auth is live
const DEMO_LEADS: Lead[] = [
  {
    id: 1,
    craftsman_id: "demo-1",
    client_user_id: "user-1",
    client_company_id: null,
    contact_method: "in_app",
    description:
      "محتاج موبيليا مكتب خشب جوز، غرفة ١٥ متر. الشغل بعد أسبوعين.",
    status: "pending",
    waiting_until: null,
    extension_used: false,
    craftsman_notes: null,
    client_notes: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    craftsman_id: "demo-1",
    client_user_id: "user-2",
    client_company_id: "company-1",
    contact_method: "in_app",
    description: "ترميم باب خشب قديم، تحت عمارة في باب توما.",
    status: "approved",
    waiting_until: null,
    extension_used: false,
    craftsman_notes: null,
    client_notes: null,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    craftsman_id: "demo-1",
    client_user_id: "user-3",
    client_company_id: null,
    contact_method: "in_app",
    description: "شاشة خشب لصالة كبيرة.",
    status: "waiting",
    waiting_until: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    extension_used: false,
    craftsman_notes: null,
    client_notes: null,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

const STATUS_VARIANT: Record<
  string,
  "pending" | "approved" | "rejected" | "neutral" | "brass"
> = {
  pending: "pending",
  approved: "approved",
  declined: "rejected",
  waiting: "brass",
  in_progress: "approved",
  completed: "neutral",
  expired: "neutral",
};

export default function LeadsClient() {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("leads");
  const tCommon = useTranslations("common");

  const [leads, setLeads] = useState<Lead[]>(DEMO_LEADS);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const updateStatus = (
    id: number,
    status: Lead["status"],
    extra?: Partial<Lead>
  ) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status, ...(extra ?? {}) } : l
      )
    );
  };

  const waitUntil = (extensionUsed: boolean) =>
    new Date(
      Date.now() + (extensionUsed ? 48 : 24) * 60 * 60 * 1000
    ).toISOString();

  const formatTime = (iso: string) => {
    const diff = new Date(iso).getTime() - Date.now();
    if (diff <= 0) return locale === "ar" ? "انتهت" : "Expired";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  if (leads.length === 0) {
    return (
      <div className="p-8 text-center text-charcoal-400 border border-dashed border-clay-100 rounded-xl">
        {t("noLeads")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => {
        const isExpanded = expandedId === lead.id;

        return (
          <div
            key={lead.id}
            className="border border-clay-100 rounded-xl overflow-hidden"
          >
            {/* Summary row */}
            <button
              className="w-full text-start p-4 flex items-start gap-3 hover:bg-cream-50 transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : lead.id)}
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge variant={STATUS_VARIANT[lead.status] ?? "neutral"}>
                    {lead.status}
                  </Badge>
                  <span className="text-xs text-charcoal-400">
                    {new Date(lead.created_at).toLocaleDateString(
                      locale === "ar" ? "ar-SY" : "en-GB"
                    )}
                  </span>
                </div>
                <p className="text-sm text-charcoal line-clamp-2">
                  {lead.description}
                </p>
                {lead.status === "waiting" && lead.waiting_until && (
                  <p className="text-xs text-brass mt-1">
                    ⏳ {t("expiresIn", { time: formatTime(lead.waiting_until) })}
                  </p>
                )}
              </div>
              <span className="text-charcoal-400 text-sm mt-1">
                {isExpanded ? "▲" : "▼"}
              </span>
            </button>

            {/* Expanded actions */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-clay-100 pt-3 space-y-3">
                <p className="text-sm text-charcoal">{lead.description}</p>

                {lead.status === "pending" && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => updateStatus(lead.id, "approved")}
                    >
                      ✅ {t("approve")}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => updateStatus(lead.id, "declined")}
                    >
                      ✗ {t("decline")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateStatus(lead.id, "waiting", {
                          waiting_until: waitUntil(false),
                          extension_used: false,
                        })
                      }
                    >
                      ⏳ {t("wait")}
                    </Button>
                  </div>
                )}

                {lead.status === "waiting" && !lead.extension_used && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => updateStatus(lead.id, "approved")}
                    >
                      ✅ {t("approve")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateStatus(lead.id, "waiting", {
                          waiting_until: waitUntil(true),
                          extension_used: true,
                        })
                      }
                    >
                      ⏱ {t("extend")}
                    </Button>
                  </div>
                )}

                {lead.status === "approved" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => updateStatus(lead.id, "in_progress")}
                  >
                    🔨 {locale === "ar" ? "ابدأ الشغل" : "Start Job"}
                  </Button>
                )}

                {lead.status === "in_progress" && (
                  <Button
                    variant="brass"
                    size="sm"
                    onClick={() =>
                      updateStatus(lead.id, "completed_by_craftsman")
                    }
                  >
                    🏁 {t("markComplete")}
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
