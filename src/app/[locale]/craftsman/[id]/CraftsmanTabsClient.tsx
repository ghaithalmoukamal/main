"use client";

import { useState } from "react";
import { classNames } from "@/lib/utils";
import AboutTab from "@/components/craftsman/AboutTab";
import ServicesTab from "@/components/craftsman/ServicesTab";
import WorkshopTab from "@/components/craftsman/WorkshopTab";
import JournalTab from "@/components/craftsman/JournalTab";
import ShareButtons from "@/components/craftsman/ShareButtons";
import dynamic from "next/dynamic";
import type { Craftsman, Trade, City, Service, WorkshopAsset, WorkJournalPost } from "@/lib/types";

const QRCard = dynamic(() => import("@/components/craftsman/QRCard"), { ssr: false });

interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface Props {
  tabs: Tab[];
  craftsman: Craftsman & { trade?: Trade | null; city?: City };
  services: Service[];
  assets: WorkshopAsset[];
  journalPosts: WorkJournalPost[];
  profileUrl: string;
  locale: "ar" | "en";
  shareLabel: string;
}

export default function CraftsmanTabsClient({
  tabs,
  craftsman,
  services,
  assets,
  journalPosts,
  profileUrl,
  locale,
  shareLabel,
}: Props) {
  const [active, setActive] = useState("about");
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex border-b border-clay-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={classNames(
              "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0",
              active === tab.key
                ? "border-clay text-clay"
                : "border-transparent text-charcoal-500 hover:text-charcoal"
            )}
          >
            {tab.label}
            {tab.count != null && tab.count > 0 && (
              <span className="ms-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] bg-clay-100 text-clay rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {active === "about" && <AboutTab craftsman={craftsman} />}
        {active === "services" && <ServicesTab services={services} />}
        {active === "workshop" && <WorkshopTab assets={assets} />}
        {active === "journal" && <JournalTab posts={journalPosts} />}
      </div>

      {/* Share + QR section */}
      <div className="pt-4 border-t border-clay-100">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-sm font-medium text-charcoal-500">
            {shareLabel}:
          </span>
          <ShareButtons url={profileUrl} name={craftsman.name} />
          <button
            onClick={() => setShowQR((v) => !v)}
            className="text-sm text-charcoal-500 hover:text-clay transition-colors underline"
          >
            {showQR
              ? locale === "ar"
                ? "إخفاء QR"
                : "Hide QR"
              : locale === "ar"
              ? "عرض QR"
              : "Show QR"}
          </button>
        </div>
        {showQR && <QRCard url={profileUrl} />}
      </div>
    </div>
  );
}
