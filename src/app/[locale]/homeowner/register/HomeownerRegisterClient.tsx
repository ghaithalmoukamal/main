"use client";

import { useState } from "react";
import { DEMO_CITIES } from "@/lib/demo-data";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { pickLocalized } from "@/lib/utils";
import { Link } from "@/i18n/routing";

interface Props {
  locale: "ar" | "en";
}

interface FormData {
  display_name: string;
  phone: string;
  city_id: string;
}

const EMPTY: FormData = {
  display_name: "",
  phone: "",
  city_id: "",
};

export default function HomeownerRegisterClient({ locale }: Props) {
  const isAr = locale === "ar";
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const patch = (key: keyof FormData, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    setBusy(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🏠</div>
          <h1 className="font-heading text-2xl font-bold text-clay mb-3">
            {isAr ? "مرحباً بك!" : "Welcome!"}
          </h1>
          <p className="text-charcoal-500 mb-6">
            {isAr
              ? "تم إنشاء حسابك بنجاح. يمكنك الآن البحث عن معلمين والتواصل معهم مباشرة."
              : "Your account is created. You can now search for Maalems and contact them directly."}
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-clay text-cream font-medium px-6 py-3 rounded-xl hover:bg-clay-600 transition-colors"
          >
            🛠️ {isAr ? "ابحث عن معلم الآن" : "Find a Maalem Now"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏠</div>
          <h1 className="font-heading text-3xl font-bold text-clay mb-1">
            {isAr ? "تسجيل صاحب البيت" : "Homeowner Registration"}
          </h1>
          <p className="text-charcoal-500 text-sm">
            {isAr
              ? "سجّل مجاناً وابحث عن المعلم المناسب لمنزلك"
              : "Register for free and find the right Maalem for your home"}
          </p>
        </div>

        {/* Value props */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: "🛠️", ar: "معلمون موثقون", en: "Verified Maalems" },
            { icon: "⭐", ar: "تقييمات حقيقية", en: "Real Reviews" },
            { icon: "🗺️", ar: "قريب منك", en: "Near You" },
          ].map((v) => (
            <div key={v.en} className="text-center bg-cream-50 border border-clay-100 rounded-xl p-3">
              <div className="text-xl mb-1">{v.icon}</div>
              <div className="text-xs text-charcoal-500">{isAr ? v.ar : v.en}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-clay-100 rounded-2xl p-6 shadow-sm space-y-4"
        >
          <Input
            label={isAr ? "اسمك (يظهر كـ\"صاحب بيت في دمشق\")" : "Your Name (shown as \"Homeowner in Damascus\")"}
            placeholder={isAr ? "مثال: رامي أو أم محمد" : "e.g. Rami or Sarah"}
            value={form.display_name}
            onChange={(e) => patch("display_name", e.target.value)}
            required
          />

          <Input
            label={isAr ? "رقم الهاتف" : "Phone Number"}
            type="tel"
            placeholder={isAr ? "+963 9XX XXX XXX" : "+963 9XX XXX XXX"}
            value={form.phone}
            onChange={(e) => patch("phone", e.target.value)}
            required
          />

          <Select
            label={isAr ? "المدينة" : "City"}
            value={form.city_id}
            onChange={(e) => patch("city_id", e.target.value)}
            required
          >
            <option value="">{isAr ? "اختر مدينتك" : "Select your city"}</option>
            {DEMO_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {pickLocalized(c.name_ar, c.name_en, locale)}
              </option>
            ))}
          </Select>

          {/* Privacy note */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex gap-2">
            <span className="shrink-0">🔒</span>
            <span>
              {isAr
                ? "بياناتك خاصة تماماً — لن تظهر إلا للمعلمين الذين تتواصل معهم فقط."
                : "Your data is completely private — only visible to Maalems you contact."}
            </span>
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={busy}>
            {busy
              ? (isAr ? "جاري التسجيل..." : "Registering...")
              : (isAr ? "تسجيل مجاني" : "Register for Free")}
          </Button>
        </form>

        <p className="text-center text-sm text-charcoal-400 mt-4">
          {isAr ? "لديك حساب بالفعل؟ " : "Already have an account? "}
          <Link href="/login?role=homeowner" className="text-clay hover:underline font-medium">
            {isAr ? "تسجيل الدخول" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}
