import { getLocale } from "next-intl/server";
import ContractorProfileClient from "./ContractorProfileClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ContractorProfilePage({ params }: Props) {
  const { id } = await params;
  const locale = (await getLocale()) as "ar" | "en";
  return <ContractorProfileClient id={id} locale={locale} />;
}
