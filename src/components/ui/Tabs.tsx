"use client";

import { useState, type ReactNode } from "react";
import { classNames } from "@/lib/utils";

export interface TabItem {
  key: string;
  label: ReactNode;
  content: ReactNode;
  count?: number;
}

export function Tabs({
  items,
  defaultKey,
}: {
  items: TabItem[];
  defaultKey?: string;
}) {
  const [active, setActive] = useState(defaultKey ?? items[0]?.key);
  const current = items.find((t) => t.key === active);

  return (
    <div>
      <div
        role="tablist"
        className="flex gap-1 border-b border-clay-100 overflow-x-auto no-scrollbar"
      >
        {items.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.key)}
              className={classNames(
                "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                isActive
                  ? "text-clay border-clay"
                  : "text-charcoal-400 border-transparent hover:text-charcoal-600"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={classNames(
                    "ms-2 px-1.5 py-0.5 text-xs rounded-full",
                    isActive ? "bg-clay text-cream" : "bg-clay-50 text-clay"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="pt-5">
        {current?.content}
      </div>
    </div>
  );
}
