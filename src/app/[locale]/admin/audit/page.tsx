import { setRequestLocale } from "next-intl/server";
import type { AuditLog } from "@/lib/types";

const DEMO_AUDIT: AuditLog[] = [
  {
    id: 1,
    actor_id: "admin-1",
    action: "approve_craftsman",
    entity_type: "craftsman",
    entity_id: "demo-1",
    before: { approval_status: "pending" },
    after: { approval_status: "approved" },
    notes: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    actor_id: "worker-3",
    action: "reject_craftsman",
    entity_type: "craftsman",
    entity_id: "demo-99",
    before: { approval_status: "pending" },
    after: { approval_status: "rejected" },
    notes: "Duplicate profile",
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 3,
    actor_id: "admin-1",
    action: "create_zone",
    entity_type: "map_zone",
    entity_id: "3",
    before: null,
    after: { name_ar: "إعمار سقبا", type: "construction" },
    notes: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export default async function AdminAuditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-clay mb-6">
        {isAr ? "سجل الأحداث" : "Audit Log"}
      </h1>
      <div className="space-y-2">
        {DEMO_AUDIT.map((log) => (
          <div
            key={log.id}
            className="flex gap-4 p-4 bg-white border border-clay-100 rounded-xl text-sm"
          >
            <div className="text-xs text-charcoal-400 whitespace-nowrap mt-0.5">
              {new Date(log.created_at).toLocaleString(
                isAr ? "ar-SY" : "en-GB",
                { dateStyle: "short", timeStyle: "short" }
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-charcoal">{log.action}</span>
                <span className="text-xs text-charcoal-400">
                  {log.entity_type}/{log.entity_id}
                </span>
                <span className="text-xs text-charcoal-400">by {log.actor_id}</span>
              </div>
              {log.notes && (
                <div className="text-xs text-charcoal-400 mt-1">{log.notes}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
