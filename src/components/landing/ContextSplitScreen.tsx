"use client";

import { useLocale } from "next-intl";

/**
 * First-visit full-screen split screen.
 * Shown once — clicking a side stores the cookie via middleware
 * (?ctx=homeowner or ?ctx=b2b) and reloads with the appropriate landing.
 *
 * ⚠️ We use window.location.href (full browser reload) instead of router.push()
 * because Next.js App Router soft navigation can serve a stale RSC cache that
 * doesn't reflect the cookie set by middleware on this request. A hard reload
 * guarantees the server re-reads the cookie and renders the correct landing page.
 */
export default function ContextSplitScreen() {
  const locale = useLocale() as "ar" | "en";
  const isAr = locale === "ar";

  const choose = (ctx: "homeowner" | "b2b") => {
    // Set cookie directly from JS so it's present in the very next request's
    // incoming headers — server components read cookies() from the request, not
    // the response, so the only reliable way is to write it client-side before
    // navigating.  Middleware is no longer involved in this flow.
    const twoYears = 60 * 60 * 24 * 365 * 2;
    document.cookie = `user_context=${ctx}; path=/; max-age=${twoYears}; SameSite=Lax`;
    // Hard reload (not router.push) so the RSC cache is bypassed and page.tsx
    // re-runs on the server with the freshly-set cookie.
    window.location.replace(`/${locale}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col sm:flex-row" dir={isAr ? "rtl" : "ltr"}>
      {/* ── Left / Top: Homeowner (B2C) ── */}
      <button
        onClick={() => choose("homeowner")}
        className="flex-1 relative flex flex-col items-center justify-center gap-6 p-8
                   bg-cream hover:bg-clay/5 transition-colors group cursor-pointer
                   border-b sm:border-b-0 sm:border-e border-clay-200"
      >
        {/* Background texture */}
        <div className="absolute inset-0 bg-pattern-geometric opacity-20 pointer-events-none" />

        <div className="relative text-center space-y-4 max-w-xs">
          <div className="text-6xl sm:text-7xl animate-bounce-slow">🏠</div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-clay">
            {isAr ? "أحتاج معلماً" : "I need a Maalem"}
          </h2>
          <p className="text-charcoal-600 text-base sm:text-lg leading-relaxed">
            {isAr
              ? "ابحث عن المعلم المناسب لمنزلك أو مشروعك الخاص"
              : "Find the right craftsman for your home or personal project"}
          </p>

          {/* Visual cues */}
          <div className="flex justify-center flex-wrap gap-2 pt-2">
            {["🪚 نجار", "🎨 دهان", "⚡ كهربجي", "🔧 سباك"].map((tag) => (
              <span key={tag} className="text-xs bg-white border border-clay-200 text-charcoal px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="pt-4">
            <span className="inline-flex items-center gap-2 bg-clay text-cream px-6 py-3 rounded-xl font-medium text-sm
                           group-hover:bg-clay-600 transition-colors shadow-md">
              {isAr ? "ابدأ البحث" : "Start Searching"} {isAr ? "←" : "→"}
            </span>
          </div>
        </div>
      </button>

      {/* ── Right / Bottom: Professional (B2B) ── */}
      <button
        onClick={() => choose("b2b")}
        className="flex-1 relative flex flex-col items-center justify-center gap-6 p-8
                   bg-charcoal hover:bg-charcoal-800 transition-colors group cursor-pointer"
      >
        <div className="relative text-center space-y-4 max-w-xs">
          <div className="text-6xl sm:text-7xl animate-bounce-slow" style={{ animationDelay: "0.3s" }}>🏗️</div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-cream">
            {isAr ? "أنا محترف" : "I'm a Professional"}
          </h2>
          <p className="text-cream/70 text-base sm:text-lg leading-relaxed">
            {isAr
              ? "معلم، مقاول، شركة هندسية، أو مورّد مواد"
              : "Maalem, Contractor, Engineering Firm, or Supplier"}
          </p>

          {/* Role badges */}
          <div className="flex justify-center flex-wrap gap-2 pt-2">
            {[
              { icon: "🛠️", ar: "معلم", en: "Maalem" },
              { icon: "🏗️", ar: "مقاول", en: "Contractor" },
              { icon: "🏢", ar: "شركة", en: "Firm" },
              { icon: "🏭", ar: "مورّد", en: "Supplier" },
            ].map((r) => (
              <span key={r.en} className="text-xs bg-white/10 text-cream px-2.5 py-1 rounded-full border border-white/20">
                {r.icon} {isAr ? r.ar : r.en}
              </span>
            ))}
          </div>

          <div className="pt-4">
            <span className="inline-flex items-center gap-2 bg-brass text-charcoal px-6 py-3 rounded-xl font-medium text-sm
                           group-hover:bg-brass-400 transition-colors shadow-md">
              {isAr ? "انضم كمحترف" : "Join as Professional"} {isAr ? "←" : "→"}
            </span>
          </div>
        </div>
      </button>

      {/* Center divider label — "OR" */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-10 h-10 rounded-full bg-white border-2 border-clay-200 flex items-center justify-center z-10 shadow-md">
          <span className="text-xs font-bold text-charcoal-400">{isAr ? "أو" : "OR"}</span>
        </div>
      </div>

      {/* Skip link */}
      <button
        onClick={() => choose("homeowner")}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-charcoal-400 hover:text-charcoal underline z-20"
      >
        {isAr ? "تصفح بدون تسجيل" : "Browse without registering"}
      </button>
    </div>
  );
}
