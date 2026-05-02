"use client";

import { useTranslations } from "next-intl";
import { useMode } from "./ModeProvider";

export default function ModeToggle() {
  const { mode, setMode } = useMode();
  const t = useTranslations("modeModal");

  return (
    <button
      type="button"
      onClick={() => setMode(mode === "lite" ? "normal" : "lite")}
      title={mode === "lite" ? t("normal") : t("lite")}
      className="px-2 py-1 text-xs rounded-md border border-clay-100 text-charcoal-500 hover:text-clay hover:border-clay transition-colors"
    >
      {mode === "lite" ? "⚡ " + t("lite") : "✨ " + t("normal")}
    </button>
  );
}
