import { setRequestLocale, getTranslations } from "next-intl/server";
import JournalUploadClient from "./JournalUploadClient";

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="font-heading text-2xl font-bold text-clay mb-6">
        {t("journal")}
      </h1>
      <JournalUploadClient />
    </div>
  );
}
