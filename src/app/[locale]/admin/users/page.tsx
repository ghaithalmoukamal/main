import { setRequestLocale } from "next-intl/server";
import { DEMO_ACCOUNTS, ROLE_LABELS, canRateUser } from "@/lib/demo-auth";
import AdminUsersClient from "./AdminUsersClient";

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AdminUsersClient
      locale={locale as "ar" | "en"}
      accounts={DEMO_ACCOUNTS}
    />
  );
}
