import { setRequestLocale } from "next-intl/server";
import SupplierChannelClient from "./SupplierChannelClient";
import { DEMO_CHANNELS } from "@/lib/demo-data";

export default async function SupplierChannelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 py-10">
      <h1 className="font-heading text-2xl font-bold text-clay mb-2">
        {locale === "ar" ? "النشر في القنوات" : "Post to Channels"}
      </h1>
      <p className="text-charcoal-500 text-sm mb-6">
        {locale === "ar"
          ? "انشر عروضك مباشرة لحرفيي القنوات المختصة"
          : "Post your offers directly to craftsmen in relevant channels"}
      </p>
      <SupplierChannelClient
        channels={DEMO_CHANNELS}
        locale={locale as "ar" | "en"}
      />
    </div>
  );
}
