import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import {
  getCraftsman,
  getServicesFor,
  getAssetsFor,
  DEMO_TRADES,
  DEMO_CITIES,
} from "@/lib/demo-data";
import ProfileHeader from "@/components/craftsman/ProfileHeader";

export default async function CraftsmanProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("profile");

  const craftsman = getCraftsman(id);
  if (!craftsman || craftsman.approval_status !== "approved") {
    notFound();
  }

  const enriched = {
    ...craftsman,
    trade: DEMO_TRADES.find((tr) => tr.id === craftsman.trade_id) ?? null,
    city: DEMO_CITIES.find((c) => c.id === craftsman.city_id),
  };

  const services = getServicesFor(id);
  const assets = getAssetsFor(id);
  // Work journal empty for demo; real data from Supabase
  const journalPosts: import("@/lib/types").WorkJournalPost[] = [];

  const hdrs = await headers();
  const host = hdrs.get("host") ?? "souq-hirfiyeen.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  const profileUrl = `${protocol}://${host}/${locale}/craftsman/${id}`;

  const tabs = [
    { key: "about", label: t("tabs.about") },
    { key: "services", label: t("tabs.services"), count: services.length },
    { key: "workshop", label: t("tabs.workshop"), count: assets.length },
    {
      key: "journal",
      label: t("tabs.journal"),
      count: journalPosts.length || undefined,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-10 space-y-6">
      <ProfileHeader craftsman={enriched} completedJobs={0} />

      {/* Tabs — client-side interactive section */}
      <CraftsmanTabs
        tabs={tabs}
        services={services}
        assets={assets}
        journalPosts={journalPosts}
        craftsman={enriched}
        profileUrl={profileUrl}
        locale={locale as "ar" | "en"}
        shareLabel={t("share")}
      />
    </div>
  );
}

// ------------------------------------------------------------------
// Client component for tab switching
// ------------------------------------------------------------------
import CraftsmanTabsClient from "./CraftsmanTabsClient";

function CraftsmanTabs(props: React.ComponentProps<typeof CraftsmanTabsClient>) {
  return <CraftsmanTabsClient {...props} />;
}
