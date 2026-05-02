"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export default function SearchBar({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const t = useTranslations("home");
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row gap-2 w-full max-w-2xl"
    >
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className="flex-1 px-5 py-3.5 rounded-xl bg-white border border-clay-100 text-base placeholder:text-charcoal-300 focus:border-brass focus:outline-none"
      />
      <button
        type="submit"
        className="px-6 py-3.5 rounded-xl bg-clay text-cream font-medium hover:bg-clay-600 transition-colors"
      >
        {t("searchButton")}
      </button>
    </form>
  );
}
