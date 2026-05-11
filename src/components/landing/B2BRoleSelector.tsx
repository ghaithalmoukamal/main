"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

const B2B_ROLES = [
  {
    key: "maalem",
    icon: "🛠️",
    labelAr: "معلم (مالم)",
    labelEn: "Maalem",
    descAr: "حرفي ماهر بتخصص واضح — نجار، كهربجي، دهان وغيرهم",
    descEn: "Skilled master craftsman — carpenter, electrician, painter & more",
    loginHref: "/login?role=craftsman",
    registerHref: "/craftsman/register",
    loginAr: "دخول كمعلم",
    loginEn: "Maalem Login",
    registerAr: "سجّل ورشتك",
    registerEn: "Register Workshop",
    color: "clay",
  },
  {
    key: "contractor",
    icon: "🏗️",
    labelAr: "مقاول",
    labelEn: "Contractor",
    descAr: "محترف بمشاريع كاملة — يعمل مع المعلمين والشركات",
    descEn: "Project-level professional — works with Maalems and firms",
    loginHref: "/login?role=contractor",
    registerHref: "/contractor/register",
    loginAr: "دخول كمقاول",
    loginEn: "Contractor Login",
    registerAr: "سجّل كمقاول",
    registerEn: "Register as Contractor",
    color: "brass",
  },
  {
    key: "firm",
    icon: "🏢",
    labelAr: "شركة هندسية",
    labelEn: "Engineering Firm",
    descAr: "مهندس مستقل أو شركة — تحتاج معلمين لمشاريعك",
    descEn: "Solo engineer or company — needs Maalems for projects",
    loginHref: "/login?role=firm",
    registerHref: "/firm",
    loginAr: "دخول كشركة",
    loginEn: "Firm Login",
    registerAr: "اعرف أكثر",
    registerEn: "Learn More",
    color: "charcoal",
  },
  {
    key: "supplier",
    icon: "🏭",
    labelAr: "مورّد / مصنّع",
    labelEn: "Supplier / Manufacturer",
    descAr: "اعلن عن موادك وتواصل مع المعلمين والشركات",
    descEn: "Advertise your materials and connect with Maalems and firms",
    loginHref: "/login?role=supplier",
    registerHref: "/supplier/register",
    loginAr: "دخول كمورّد",
    loginEn: "Supplier Login",
    registerAr: "سجّل كمورّد",
    registerEn: "Register as Supplier",
    color: "brass",
  },
] as const;

export default function B2BRoleSelector() {
  const locale = useLocale() as "ar" | "en";
  const isAr = locale === "ar";

  return (
    <section className="py-12 bg-cream-100 border-y border-clay-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-clay mb-2">
            {isAr ? "ما هو دورك المهني؟" : "What is your professional role?"}
          </h2>
          <p className="text-charcoal-500 text-sm">
            {isAr
              ? "اختر نوع حسابك للوصول إلى المميزات المناسبة لك"
              : "Choose your account type to access the right features"}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {B2B_ROLES.map((role) => (
            <div
              key={role.key}
              className="bg-white border border-clay-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3 hover:border-clay hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{role.icon}</span>
                <div>
                  <div className="font-heading text-lg font-bold text-charcoal">
                    {isAr ? role.labelAr : role.labelEn}
                  </div>
                  <p className="text-charcoal-500 text-xs mt-0.5">
                    {isAr ? role.descAr : role.descEn}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-1">
                <Link
                  href={role.loginHref as Parameters<typeof Link>[0]["href"]}
                  className="flex-1 text-center px-3 py-2 text-xs rounded-lg bg-clay text-cream hover:bg-clay-600 transition-colors font-medium"
                >
                  {isAr ? role.loginAr : role.loginEn}
                </Link>
                <Link
                  href={role.registerHref as Parameters<typeof Link>[0]["href"]}
                  className="flex-1 text-center px-3 py-2 text-xs rounded-lg border border-clay text-clay hover:bg-clay-50 transition-colors font-medium"
                >
                  {isAr ? role.registerAr : role.registerEn}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Switch to homeowner */}
        <p className="text-center text-sm text-charcoal-400 mt-6">
          {isAr ? "تبحث عن معلم لمنزلك؟ " : "Looking for a Maalem for your home? "}
          <a
            href="?ctx=homeowner"
            className="text-clay hover:underline font-medium"
          >
            {isAr ? "انتقل لبوابة صاحب البيت" : "Switch to Homeowner"}
          </a>
        </p>
      </div>
    </section>
  );
}
