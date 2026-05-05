import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import SearchBar from "@/components/search/SearchBar";
import TradeGrid from "@/components/search/TradeGrid";
import { Link } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tBrand = await getTranslations("brand");
  const isAr = locale === "ar";

  return (
    <div>
      {/* Hero — centered */}
      <section className="bg-pattern-geometric bg-cream-100 border-b border-clay-100">
        <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 text-center">
          <div className="text-5xl mb-4">🏛️</div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-clay mb-4 leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-lg md:text-xl text-charcoal-600 mb-2 max-w-xl mx-auto">
            {t("heroSubtitle")}
          </p>
          <p className="text-brass font-medium mb-8 text-lg">{tBrand("tagline")}</p>
          <div className="max-w-xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Trade categories */}
      <TradeGrid />

      {/* Role portal cards — who are you? */}
      <section className="py-14 bg-cream-100 border-y border-clay-100">
        <div className="max-w-4xl mx-auto px-4 text-center mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-clay mb-2">
            {isAr ? "من أنت في السوق؟" : "Who are you in the marketplace?"}
          </h2>
          <p className="text-charcoal-500">
            {isAr ? "سجّل دخولك أو أنشئ حساباً حسب دورك" : "Sign in or create an account based on your role"}
          </p>
        </div>
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-5">
          {/* Craftsman card */}
          <div className="bg-white border border-clay-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center gap-3">
            <div className="text-4xl">🛠️</div>
            <div className="font-heading text-xl font-bold text-clay">
              {isAr ? "أنا معلم" : "I'm a Craftsman"}
            </div>
            <p className="text-charcoal-500 text-sm">
              {isAr
                ? "سجّل ورشتك واستقبل طلبات العمل مباشرةً"
                : "Register your workshop and receive job leads directly"}
            </p>
            <div className="flex gap-2 mt-2 w-full justify-center">
              <Link
                href="/login?role=craftsman"
                className="flex-1 max-w-[140px] text-center px-4 py-2 text-sm rounded-lg bg-clay text-cream hover:bg-clay-600 transition-colors font-medium"
              >
                {isAr ? "تسجيل الدخول" : "Sign In"}
              </Link>
              <Link
                href="/craftsman/register"
                className="flex-1 max-w-[140px] text-center px-4 py-2 text-sm rounded-lg border border-clay text-clay hover:bg-clay-50 transition-colors font-medium"
              >
                {isAr ? "سجّل ورشتك" : "Register"}
              </Link>
            </div>
          </div>

          {/* Firm card */}
          <div className="bg-white border border-clay-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center gap-3">
            <div className="text-4xl">🏢</div>
            <div className="font-heading text-xl font-bold text-charcoal">
              {isAr ? "أنا شركة هندسية" : "I'm an Engineering Firm"}
            </div>
            <p className="text-charcoal-500 text-sm">
              {isAr
                ? "ابحث عن المعلمين وابني فريق مشروعك بكفاءة"
                : "Find craftsmen and build your project team efficiently"}
            </p>
            <div className="flex gap-2 mt-2 w-full justify-center">
              <Link
                href="/login?role=firm"
                className="flex-1 max-w-[140px] text-center px-4 py-2 text-sm rounded-lg bg-charcoal text-cream hover:bg-charcoal-600 transition-colors font-medium"
              >
                {isAr ? "تسجيل الدخول" : "Sign In"}
              </Link>
              <Link
                href="/firm"
                className="flex-1 max-w-[140px] text-center px-4 py-2 text-sm rounded-lg border border-charcoal text-charcoal hover:bg-cream-100 transition-colors font-medium"
              >
                {isAr ? "اعرف أكثر" : "Learn More"}
              </Link>
            </div>
          </div>

          {/* Supplier card */}
          <div className="bg-white border border-clay-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center gap-3">
            <div className="text-4xl">🏭</div>
            <div className="font-heading text-xl font-bold text-brass">
              {isAr ? "أنا مورّد" : "I'm a Supplier"}
            </div>
            <p className="text-charcoal-500 text-sm">
              {isAr
                ? "اعلن عن موادك وتواصل مع المعلمين والشركات"
                : "Advertise your materials and connect with craftsmen and firms"}
            </p>
            <div className="flex gap-2 mt-2 w-full justify-center">
              <Link
                href="/login?role=supplier"
                className="flex-1 max-w-[140px] text-center px-4 py-2 text-sm rounded-lg bg-brass text-cream hover:bg-brass-600 transition-colors font-medium"
              >
                {isAr ? "تسجيل الدخول" : "Sign In"}
              </Link>
              <Link
                href="/supplier/register"
                className="flex-1 max-w-[140px] text-center px-4 py-2 text-sm rounded-lg border border-brass text-brass hover:bg-cream-100 transition-colors font-medium"
              >
                {isAr ? "سجّل كمورّد" : "Register"}
              </Link>
            </div>
          </div>

          {/* Admin card */}
          <div className="bg-white border border-clay-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center gap-3">
            <div className="text-4xl">🔐</div>
            <div className="font-heading text-xl font-bold text-charcoal-600">
              {isAr ? "الإدارة" : "Administration"}
            </div>
            <p className="text-charcoal-500 text-sm">
              {isAr
                ? "لوحة الإدارة لمديري المنصة والمشرفين"
                : "Admin panel for platform managers and moderators"}
            </p>
            <div className="flex gap-2 mt-2 w-full justify-center">
              <Link
                href="/login?role=admin"
                className="flex-1 max-w-[140px] text-center px-4 py-2 text-sm rounded-lg bg-charcoal-600 text-cream hover:bg-charcoal transition-colors font-medium"
              >
                {isAr ? "دخول الإدارة" : "Admin Login"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse link */}
      <section className="py-8 text-center">
        <p className="text-charcoal-500 mb-3 text-sm">
          {isAr ? "تصفّح المعلمين بدون حساب" : "Browse craftsmen without an account"}
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-clay text-clay hover:bg-clay hover:text-cream transition-colors font-medium text-sm"
        >
          {isAr ? "استعرض السوق" : "Browse the Marketplace"} →
        </Link>
      </section>
    </div>
  );
}
