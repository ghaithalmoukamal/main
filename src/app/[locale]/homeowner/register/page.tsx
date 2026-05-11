import { getLocale } from "next-intl/server";
import HomeownerRegisterClient from "./HomeownerRegisterClient";

export default async function HomeownerRegisterPage() {
  const locale = (await getLocale()) as "ar" | "en";
  return <HomeownerRegisterClient locale={locale} />;
}
