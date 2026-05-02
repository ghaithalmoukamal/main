import { setRequestLocale } from "next-intl/server";
import RegistrationWizard from "./RegistrationWizard";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RegistrationWizard />;
}
