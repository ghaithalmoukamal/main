import { setRequestLocale, getTranslations } from "next-intl/server";
import MaterialRequestClient from "./MaterialRequestClient";
import { DEMO_CHANNELS } from "@/lib/demo-data";

export default async function MaterialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  return (
    <div className="max-w-xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="font-heading text-2xl font-bold text-clay mb-2">
        {t("materials")}
      </h1>
      <p className="text-charcoal-500 text-sm mb-6">
        {locale === "ar"
          ? "ارسل طلب مواد للموردين المختصين — يوصلهم مباشرة عبر الواتساب والقنوات"
          : "Broadcast a material request to relevant suppliers — delivered via WhatsApp and channels"}
      </p>
      <MaterialRequestClient
        channels={DEMO_CHANNELS}
        locale={locale as "ar" | "en"}
      />
    </div>
  );
}
