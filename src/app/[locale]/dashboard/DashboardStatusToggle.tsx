"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/Toggle";
import { StatusDot } from "@/components/ui/Badge";

interface Props {
  openLabel: string;
  busyLabel: string;
  myStatusLabel: string;
}

export default function DashboardStatusToggle({
  openLabel,
  busyLabel,
  myStatusLabel,
}: Props) {
  // In production: initial value from craftsman.status, update via API
  const [isOpen, setIsOpen] = useState(true);

  const toggle = async (next: boolean) => {
    setIsOpen(next);
    // TODO: PATCH /api/craftsman/status with { status: next ? "open" : "busy" }
  };

  return (
    <div className="flex items-center gap-4 p-5 bg-white border border-clay-100 rounded-xl">
      <div>
        <div className="text-sm text-charcoal-500 mb-1">{myStatusLabel}</div>
        <div className="flex items-center gap-2">
          <StatusDot status={isOpen ? "open" : "busy"} />
          <span className="font-semibold text-charcoal">
            {isOpen ? openLabel : busyLabel}
          </span>
        </div>
      </div>
      <div className="ms-auto">
        <Toggle
          checked={isOpen}
          onChange={toggle}
          labelOn={openLabel}
          labelOff={busyLabel}
        />
      </div>
    </div>
  );
}
