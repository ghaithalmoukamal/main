"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: Locale) => {
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="inline-flex items-center gap-1 text-sm">
      <button
        onClick={() => switchTo("ar")}
        className={
          locale === "ar"
            ? "px-2 py-1 rounded-md bg-clay text-cream font-medium"
            : "px-2 py-1 rounded-md text-charcoal-500 hover:text-charcoal"
        }
      >
        عربي
      </button>
      <span className="text-charcoal-300">|</span>
      <button
        onClick={() => switchTo("en")}
        className={
          locale === "en"
            ? "px-2 py-1 rounded-md bg-clay text-cream font-medium"
            : "px-2 py-1 rounded-md text-charcoal-500 hover:text-charcoal"
        }
      >
        EN
      </button>
    </div>
  );
}
