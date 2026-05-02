import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import ModeToggle from "./ModeToggle";

export default async function Header() {
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-30 bg-cream-100/90 backdrop-blur border-b border-clay-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <Logo />

          <nav className="hidden md:flex items-center gap-5 text-sm">
            <Link
              href="/search"
              className="text-charcoal-600 hover:text-clay transition-colors"
            >
              {t("search")}
            </Link>
            <Link
              href="/nearest"
              className="text-charcoal-600 hover:text-clay transition-colors"
            >
              {t("nearest")}
            </Link>
            <Link
              href="/craftsman/register"
              className="text-charcoal-600 hover:text-clay transition-colors"
            >
              {t("register")}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile sub-nav */}
        <nav className="md:hidden flex items-center justify-around py-2 text-xs border-t border-clay-50">
          <Link href="/search" className="text-charcoal-600">
            {t("search")}
          </Link>
          <Link href="/nearest" className="text-charcoal-600">
            {t("nearest")}
          </Link>
          <Link href="/craftsman/register" className="text-charcoal-600">
            {t("register")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
