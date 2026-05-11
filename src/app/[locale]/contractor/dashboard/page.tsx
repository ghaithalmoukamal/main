import { getLocale } from "next-intl/server";
import ContractorDashboardClient from "./ContractorDashboardClient";

export default async function ContractorDashboardPage() {
  const locale = (await getLocale()) as "ar" | "en";
  return <ContractorDashboardClient locale={locale} />;
}
