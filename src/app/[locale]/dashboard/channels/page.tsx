import { setRequestLocale, getTranslations } from "next-intl/server";
import ChannelsClient from "./ChannelsClient";
import { DEMO_CHANNELS } from "@/lib/demo-data";

export default async function ChannelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="font-heading text-2xl font-bold text-clay mb-2">
        {t("channels")}
      </h1>
      <p className="text-charcoal-500 text-sm mb-6">
        {locale === "ar"
          ? "اشترك بقنوات المواد لتوصلك عروض الموردين"
          : "Subscribe to material channels to receive supplier offers"}
      </p>
      <ChannelsClient channels={DEMO_CHANNELS} locale={locale as "ar" | "en"} />
    </div>
  );
}
