"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useMode } from "./ModeProvider";

export default function FirstVisitModal() {
  const t = useTranslations("modeModal");
  const { hasExplicitChoice, setMode } = useMode();
  const [open, setOpen] = useState(false);

  // Open modal AFTER hydration if user has not made an explicit choice.
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!hasExplicitChoice) setOpen(true);
    }, 600);
    return () => window.clearTimeout(id);
  }, [hasExplicitChoice]);

  const choose = (m: "lite" | "normal") => {
    setMode(m);
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)} title={t("title")}>
      <div className="grid gap-3">
        <button
          type="button"
          onClick={() => choose("normal")}
          className="text-start p-4 border-2 border-clay-100 rounded-xl hover:border-clay transition-colors"
        >
          <div className="font-heading text-lg font-semibold text-clay">
            {t("normal")}
          </div>
          <div className="text-sm text-charcoal-500 mt-1">
            {t("normalDesc")}
          </div>
        </button>
        <button
          type="button"
          onClick={() => choose("lite")}
          className="text-start p-4 border-2 border-clay-100 rounded-xl hover:border-clay transition-colors"
        >
          <div className="font-heading text-lg font-semibold text-clay">
            {t("lite")}
          </div>
          <div className="text-sm text-charcoal-500 mt-1">{t("liteDesc")}</div>
        </button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
          className="mt-2"
        >
          {t("auto")}
        </Button>
      </div>
    </Modal>
  );
}
