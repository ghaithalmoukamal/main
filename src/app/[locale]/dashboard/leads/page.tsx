import { setRequestLocale, getTranslations } from "next-intl/server";
import LeadsClient from "./LeadsClient";

export default async function LeadsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("leads");
  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="font-heading text-2xl font-bold text-clay mb-6">
        {t("title")}
      </h1>
      <LeadsClient />
    </div>
  );
}
