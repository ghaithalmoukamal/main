import { setRequestLocale } from "next-intl/server";
import LoginClient from "./LoginClient";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ role?: string; redirect?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);

  return (
    <LoginClient
      locale={locale as "ar" | "en"}
      defaultRole={sp.role ?? ""}
      redirectTo={sp.redirect ?? ""}
    />
  );
}
