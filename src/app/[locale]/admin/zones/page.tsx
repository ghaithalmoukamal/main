import { setRequestLocale } from "next-intl/server";
import { DEMO_ZONES } from "@/lib/demo-data";
import AdminZonesClient from "./AdminZonesClient";

export default async function AdminZonesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdminZonesClient locale={locale as "ar" | "en"} zones={DEMO_ZONES} />;
}
