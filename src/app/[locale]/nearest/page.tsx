import { setRequestLocale } from "next-intl/server";
import NearestClient from "./NearestClient";

export default async function NearestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NearestClient />;
}
