import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import SearchBar from "@/components/search/SearchBar";
import TradeGrid from "@/components/search/TradeGrid";
import { Link } from "@/i18n/routing";
import ContextSplitScreen from "@/components/landing/ContextSplitScreen";
import B2BRoleSelector from "@/components/landing/B2BRoleSelector";

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

  // Read the B2C/B2B context cookie set by middleware on first visit
  const cookieStore = await cookies();
  const userContext = cookieStore.get("user_context")?.value as
    | "homeowner"
    | "b2b"
    | undefined;

  // ── No context yet: show full-screen split chooser ────────────────────────
  if (!userContext) {
    return <ContextSplitScreen />;
  }

  // ── Homeowner (B2C) landing ────────────────────────────────────────────────
  if (userContext === "homeowner") {
    return (
      <div>
        {/* Hero — search-first, map-forward */}
        <section className="bg-pattern-geometric bg-cream-100 border-b border-clay-100">
          <div className="max-w-3xl mx-auto px-4 py-14 md:py-20 text-center">
            {/* Homeowner greeting */}
            <div className="inline-flex items-center gap-2 bg-white border border-clay-100 rounded-full px-4 py-1.5 text-sm text-charcoal-500 mb-6 shadow-sm">
              <span>🏠</span>
              <span>{isAr ? "بوابة صاحب البيت" : "Homeowner Portal"}</span>
              <span className="text-charcoal-300">·</span>
              <a href="?ctx=b2b" className="text-clay hover:underline text-xs">
                {isAr ? "أنا محترف؟" : "I'm a professional"}
              </a>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-clay mb-4 leading-tight">
              {isAr
                ? "ابحث عن معلمك القريب"
                : "Find Your Nearest Maalem"}
            </h1>
            <p className="text-lg md:text-xl text-charcoal-600 mb-2 max-w-xl mx-auto">
              {isAr
                ? "نجارين، كهربجيين، دهانين، سباكين — كلهم عندنا"
                : "Carpenters, electricians, painters, plumbers — all here"}
            </p>
            <p className="text-brass font-medium mb-8 text-lg">{tBrand("tagline")}</p>

            {/* Search bar — always prominent */}
            <div className="max-w-xl mx-auto">
              <SearchBar />
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link
                href="/nearest"
                className="flex items-center gap-2 px-4 py-2 bg-clay text-cream rounded-xl text-sm font-medium hover:bg-clay-600 transition-colors shadow-sm"
              >
                📍 {isAr ? "أقرب معلم مني" : "Nearest Maalem"}
              </Link>
              <Link
                href="/search"
                className="flex items-center gap-2 px-4 py-2 border border-clay text-clay rounded-xl text-sm font-medium hover:bg-clay-50 transition-colors"
              >
                🗺️ {isAr ? "تصفح على الخريطة" : "Browse on Map"}
              </Link>
            </div>
          </div>
        </section>

        {/* Trade categories grid */}
        <TradeGrid />

        {/* Trust signals */}
        <section className="py-10 bg-white border-y border-clay-100">
          <div className="max-w-3xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { icon: "✅", valueAr: "معلمون موثقون", valueEn: "Verified Maalems",   statAr: "بهوية مؤكدة",           statEn: "ID-verified" },
                { icon: "⭐", valueAr: "تقييمات حقيقية", valueEn: "Real Reviews",       statAr: "من أصحاب البيوت",        statEn: "From homeowners" },
                { icon: "📍", valueAr: "قريب منك",       valueEn: "Near You",            statAr: "عبر الخريطة التفاعلية", statEn: "Via interactive map" },
              ].map((item) => (
                <div key={item.valueEn}>
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-medium text-charcoal text-sm">{isAr ? item.valueAr : item.valueEn}</div>
                  <div className="text-xs text-charcoal-400 mt-0.5">{isAr ? item.statAr : item.statEn}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Register CTA */}
        <section className="py-10 text-center bg-cream-50">
          <div className="max-w-md mx-auto px-4">
            <h2 className="font-heading text-xl font-bold text-clay mb-2">
              {isAr ? "سجّل مجاناً واحفظ معلمينك المفضلين" : "Register free and save your favourite Maalems"}
            </h2>
            <p className="text-charcoal-500 text-sm mb-4">
              {isAr
                ? "اترك تقييماً، تواصل مباشرة، وتابع طلباتك"
                : "Leave reviews, contact directly, and track your requests"}
            </p>
            <Link
              href="/homeowner/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-clay text-cream rounded-xl font-medium hover:bg-clay-600 transition-colors shadow-sm"
            >
              🏠 {isAr ? "تسجيل مجاني" : "Register Free"}
            </Link>
            <p className="text-xs text-charcoal-400 mt-3">
              {isAr ? "أو " : "or "}
              <Link href="/search" className="text-clay hover:underline">
                {isAr ? "تصفح بدون حساب" : "browse without an account"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    );
  }

  // ── B2B landing ────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Professional hero */}
      <section className="bg-charcoal border-b border-charcoal-800">
        <div className="max-w-4xl mx-auto px-4 py-14 md:py-20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-start">
              {/* Context toggle */}
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-cream/70 mb-6">
                <span>🏗️</span>
                <span>{isAr ? "بوابة المحترفين" : "Professional Portal"}</span>
                <span className="text-white/30">·</span>
                <a href="?ctx=homeowner" className="text-brass hover:underline text-xs">
                  {isAr ? "أنا صاحب بيت؟" : "I'm a homeowner"}
                </a>
              </div>

              <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream mb-4 leading-tight">
                {isAr
                  ? "منصتك المهنية للحرف والبناء"
                  : "Your Professional Platform for Craft & Construction"}
              </h1>
              <p className="text-cream/70 text-lg mb-8">
                {isAr
                  ? "ابحث عن معلمين، أدِر مشاريعك، وطوّر أعمالك"
                  : "Find Maalems, manage your projects, and grow your business"}
              </p>

              {/* Search bar also available on B2B */}
              <div className="max-w-lg">
                <SearchBar />
              </div>
            </div>

            {/* Stats */}
            <div className="shrink-0 grid grid-cols-2 gap-3 w-full md:w-auto md:max-w-[220px]">
              {[
                { icon: "🛠️", statAr: "معلم موثق",     statEn: "Verified Maalems", valueAr: "200+", valueEn: "200+" },
                { icon: "🏗️", statAr: "تخصص",          statEn: "Specializations",  valueAr: "12",   valueEn: "12"   },
                { icon: "📍", statAr: "منطقة",          statEn: "Zones",             valueAr: "6",    valueEn: "6"   },
                { icon: "⭐", statAr: "مشروع منجز",     statEn: "Jobs done",         valueAr: "500+", valueEn: "500+" },
              ].map((s) => (
                <div key={s.statEn} className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="font-bold text-cream text-lg">{isAr ? s.valueAr : s.valueEn}</div>
                  <div className="text-cream/50 text-xs">{isAr ? s.statAr : s.statEn}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trade grid — still useful for B2B browsing */}
      <TradeGrid />

      {/* B2B Role selector — what kind of professional? */}
      <B2BRoleSelector />

      {/* Footer browse */}
      <section className="py-8 text-center bg-cream-50">
        <p className="text-charcoal-500 text-sm mb-3">
          {isAr ? "تصفّح المعلمين بدون حساب" : "Browse Maalems without an account"}
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
