"use client";

import { classNames } from "@/lib/utils";

export function Toggle({
  checked,
  onChange,
  labelOn,
  labelOff,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  labelOn?: string;
  labelOff?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={classNames(
        "inline-flex items-center gap-3 px-4 py-2 rounded-full border-2 transition-colors",
        checked
          ? "bg-verified/10 border-verified text-verified"
          : "bg-busy/10 border-busy text-busy"
      )}
    >
      <span
        className={classNames(
          "inline-block w-3 h-3 rounded-full",
          checked ? "bg-verified" : "bg-busy"
        )}
      />
      <span className="text-sm font-medium">
        {checked ? labelOn ?? "On" : labelOff ?? "Off"}
      </span>
    </button>
  );
}
