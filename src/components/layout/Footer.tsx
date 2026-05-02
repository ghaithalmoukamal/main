import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("footer");
  const tBrand = await getTranslations("brand");

  return (
    <footer className="border-t border-clay-100 bg-charcoal text-cream-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div>
            <div className="font-heading font-bold text-lg text-cream">
              {tBrand("name")}
            </div>
            <div className="text-cream-200 mt-1">{tBrand("tagline")}</div>
          </div>
          <div className="space-y-1">
            <a href="#" className="block hover:text-brass">
              {t("about")}
            </a>
            <a href="#" className="block hover:text-brass">
              {t("contact")}
            </a>
          </div>
          <div className="space-y-1">
            <a href="#" className="block hover:text-brass">
              {t("privacy")}
            </a>
            <a href="#" className="block hover:text-brass">
              {t("terms")}
            </a>
          </div>
          <div className="text-cream-300 text-xs">{t("rights")}</div>
        </div>
      </div>
    </footer>
  );
}
