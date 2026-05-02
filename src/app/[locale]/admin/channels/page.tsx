import { setRequestLocale } from "next-intl/server";
import { DEMO_CHANNELS } from "@/lib/demo-data";
import { pickLocalized } from "@/lib/utils";

export default async function AdminChannelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const loc = locale as "ar" | "en";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-clay">
          {isAr ? "القنوات" : "Channels"}
        </h1>
        <button className="px-4 py-2 bg-clay text-cream text-sm rounded-lg hover:bg-clay-600 transition-colors font-medium">
          + {isAr ? "قناة جديدة" : "New Channel"}
        </button>
      </div>
      <div className="space-y-2">
        {DEMO_CHANNELS.map((ch) => (
          <div key={ch.id} className="flex items-center gap-3 p-3 bg-white border border-clay-100 rounded-xl">
            <span>📡</span>
            <div className="flex-1">
              <div className="font-medium text-charcoal">{pickLocalized(ch, "name", loc)}</div>
              <div className="text-xs text-charcoal-400">#{ch.slug} · {ch.type} · {ch.source}</div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ch.is_active ? "bg-green-100 text-verified" : "bg-red-100 text-busy"}`}>
              {ch.is_active ? (isAr ? "نشط" : "Active") : (isAr ? "معطّل" : "Inactive")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
