import { setRequestLocale } from "next-intl/server";
import SupplierRegisterClient from "./SupplierRegisterClient";

export default async function SupplierRegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SupplierRegisterClient />;
}
