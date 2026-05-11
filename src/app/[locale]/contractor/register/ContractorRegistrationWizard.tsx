"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { DEMO_CITIES } from "@/lib/demo-data";
import { CONTRACTOR_SPECIALIZATIONS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { pickLocalized } from "@/lib/utils";

interface FormData {
  // Step 1 — Identity
  name: string;
  type: "individual" | "company";
  phone: string;
  whatsapp: string;
  website: string;
  instagram: string;
  facebook: string;
  city_id: string;
  location_name: string;
  bio: string;
  years_experience: string;
  team_size_min: string;
  team_size_max: string;

  // Step 2 — Specializations
  specialization: string[];

  // Step 3 — Past projects (up to 5)
  projects: Array<{ title: string; description: string; year: string }>;
}

const EMPTY: FormData = {
  name: "",
  type: "individual",
  phone: "",
  whatsapp: "",
  website: "",
  instagram: "",
  facebook: "",
  city_id: "",
  location_name: "",
  bio: "",
  years_experience: "",
  team_size_min: "",
  team_size_max: "",
  specialization: [],
  projects: [{ title: "", description: "", year: "" }],
};

const STEPS = 3;

export default function ContractorRegistrationWizard() {
  const locale = useLocale() as "ar" | "en";
  const isAr = locale === "ar";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const patch = (key: keyof FormData, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const stepLabels = [
    isAr ? "المعلومات الشخصية" : "Personal Info",
    isAr ? "التخصصات"          : "Specializations",
    isAr ? "المشاريع السابقة"  : "Past Projects",
  ];

  const toggleSpecialization = (val: string) => {
    patch(
      "specialization",
      form.specialization.includes(val)
        ? form.specialization.filter((s) => s !== val)
        : [...form.specialization, val]
    );
  };

  const handleSubmit = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 800));
    setBusy(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🏗️</div>
          <h1 className="font-heading text-2xl font-bold text-clay mb-3">
            {isAr ? "تم تقديم طلبك!" : "Application Submitted!"}
          </h1>
          <p className="text-charcoal-500 mb-4">
            {isAr
              ? "سيراجع فريقنا ملفك ويتواصل معك خلال 24-48 ساعة للتحقق من بياناتك."
              : "Our team will review your profile and contact you within 24–48 hours to verify your details."}
          </p>
          <div className="bg-cream-50 border border-clay-100 rounded-xl p-4 text-sm text-charcoal-500 text-start">
            <p className="font-medium text-clay mb-2">
              {isAr ? "الخطوات التالية:" : "Next steps:"}
            </p>
            <ul className="space-y-1 list-disc list-inside">
              <li>{isAr ? "مراجعة الطلب من فريق الإدارة" : "Admin team reviews your application"}</li>
              <li>{isAr ? "التحقق من بياناتك عبر واتساب" : "Verification via WhatsApp"}</li>
              <li>{isAr ? "ظهور ملفك في نتائج البحث" : "Your profile appears in search results"}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] px-4 py-10 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🏗️</div>
        <h1 className="font-heading text-2xl font-bold text-clay">
          {isAr ? "تسجيل مقاول" : "Contractor Registration"}
        </h1>
        <p className="text-charcoal-500 text-sm mt-1">
          {isAr ? "سجّل ملفك المهني واظهر للشركات والمعلمين" : "Build your professional profile and get found by firms and Maalems"}
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 mb-8">
        {Array.from({ length: STEPS }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`h-1.5 w-full rounded-full transition-colors ${
                i + 1 <= step ? "bg-clay" : "bg-clay-100"
              }`}
            />
            <span className={`text-xs ${i + 1 === step ? "text-clay font-medium" : "text-charcoal-400"}`}>
              {stepLabels[i]}
            </span>
          </div>
        ))}
      </div>

      {/* ── Step 1: Personal Info ── */}
      {step === 1 && (
        <div className="space-y-5">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              {isAr ? "نوع التسجيل" : "Registration Type"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["individual", "company"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => patch("type", t)}
                  className={`py-3 rounded-xl border text-sm font-medium transition-colors ${
                    form.type === t
                      ? "border-clay bg-clay text-cream"
                      : "border-clay-100 bg-white text-charcoal hover:border-clay"
                  }`}
                >
                  {t === "individual"
                    ? (isAr ? "👤 فردي" : "👤 Individual")
                    : (isAr ? "🏢 شركة" : "🏢 Company")}
                </button>
              ))}
            </div>
          </div>

          <Input
            label={isAr ? (form.type === "company" ? "اسم الشركة" : "الاسم الكامل") : (form.type === "company" ? "Company Name" : "Full Name")}
            value={form.name}
            onChange={(e) => patch("name", e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={isAr ? "رقم الهاتف" : "Phone Number"}
              type="tel"
              value={form.phone}
              onChange={(e) => patch("phone", e.target.value)}
              required
            />
            <Input
              label={isAr ? "واتساب (اختياري)" : "WhatsApp (optional)"}
              type="tel"
              value={form.whatsapp}
              onChange={(e) => patch("whatsapp", e.target.value)}
            />
          </div>

          <Select
            label={isAr ? "المدينة" : "City"}
            value={form.city_id}
            onChange={(e) => patch("city_id", e.target.value)}
            required
          >
            <option value="">{isAr ? "اختر المدينة" : "Select city"}</option>
            {DEMO_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {pickLocalized(c.name_ar, c.name_en, locale)}
              </option>
            ))}
          </Select>

          <Input
            label={isAr ? "المنطقة / الحي" : "District / Area"}
            placeholder={isAr ? "مثال: المزة، دمشق" : "e.g. Mazza, Damascus"}
            value={form.location_name}
            onChange={(e) => patch("location_name", e.target.value)}
          />

          <Textarea
            label={isAr ? "نبذة مهنية" : "Professional Bio"}
            placeholder={isAr ? "صف خبرتك وأنواع المشاريع التي تنفذها..." : "Describe your experience and the types of projects you handle..."}
            value={form.bio}
            onChange={(e) => patch("bio", e.target.value)}
            rows={4}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label={isAr ? "سنوات الخبرة" : "Years Experience"}
              type="number"
              min="0"
              value={form.years_experience}
              onChange={(e) => patch("years_experience", e.target.value)}
            />
            <Input
              label={isAr ? "حجم الفريق (أقل)" : "Team Min"}
              type="number"
              min="1"
              value={form.team_size_min}
              onChange={(e) => patch("team_size_min", e.target.value)}
            />
            <Input
              label={isAr ? "حجم الفريق (أكثر)" : "Team Max"}
              type="number"
              min="1"
              value={form.team_size_max}
              onChange={(e) => patch("team_size_max", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={isAr ? "إنستغرام (اختياري)" : "Instagram (optional)"}
              placeholder="@username"
              value={form.instagram}
              onChange={(e) => patch("instagram", e.target.value)}
            />
            <Input
              label={isAr ? "موقع إلكتروني (اختياري)" : "Website (optional)"}
              placeholder="https://..."
              value={form.website}
              onChange={(e) => patch("website", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ── Step 2: Specializations ── */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-charcoal-500">
            {isAr
              ? "اختر تخصصاتك (يمكن اختيار أكثر من واحد)"
              : "Select your specializations (multiple allowed)"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CONTRACTOR_SPECIALIZATIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleSpecialization(s.value)}
                className={`py-3 px-3 rounded-xl border text-sm font-medium transition-colors text-center ${
                  form.specialization.includes(s.value)
                    ? "border-clay bg-clay text-cream"
                    : "border-clay-100 bg-white text-charcoal hover:border-clay"
                }`}
              >
                {isAr ? s.label_ar : s.label_en}
              </button>
            ))}
          </div>
          {form.specialization.length === 0 && (
            <p className="text-xs text-busy">
              {isAr ? "يرجى اختيار تخصص واحد على الأقل" : "Please select at least one specialization"}
            </p>
          )}
        </div>
      )}

      {/* ── Step 3: Past Projects ── */}
      {step === 3 && (
        <div className="space-y-5">
          <p className="text-sm text-charcoal-500">
            {isAr
              ? "أضف مشاريعك السابقة لتعزيز ملفك المهني (اختياري)"
              : "Add past projects to strengthen your profile (optional)"}
          </p>
          {form.projects.map((proj, i) => (
            <div key={i} className="bg-cream-50 border border-clay-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-clay">
                  {isAr ? `مشروع ${i + 1}` : `Project ${i + 1}`}
                </span>
                {form.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => patch("projects", form.projects.filter((_, j) => j !== i))}
                    className="text-xs text-busy hover:underline"
                  >
                    {isAr ? "حذف" : "Remove"}
                  </button>
                )}
              </div>
              <Input
                label={isAr ? "اسم المشروع" : "Project Title"}
                value={proj.title}
                onChange={(e) => {
                  const updated = [...form.projects];
                  updated[i] = { ...updated[i], title: e.target.value };
                  patch("projects", updated);
                }}
              />
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <Textarea
                    label={isAr ? "وصف المشروع" : "Description"}
                    rows={2}
                    value={proj.description}
                    onChange={(e) => {
                      const updated = [...form.projects];
                      updated[i] = { ...updated[i], description: e.target.value };
                      patch("projects", updated);
                    }}
                  />
                </div>
                <Input
                  label={isAr ? "السنة" : "Year"}
                  placeholder="2023"
                  value={proj.year}
                  onChange={(e) => {
                    const updated = [...form.projects];
                    updated[i] = { ...updated[i], year: e.target.value };
                    patch("projects", updated);
                  }}
                />
              </div>
            </div>
          ))}
          {form.projects.length < 5 && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => patch("projects", [...form.projects, { title: "", description: "", year: "" }])}
            >
              + {isAr ? "أضف مشروعاً" : "Add Project"}
            </Button>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 1 && (
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
            {isAr ? "→ السابق" : "← Back"}
          </Button>
        )}
        <div className="flex-1" />
        {step < STEPS ? (
          <Button
            variant="primary"
            onClick={() => {
              if (step === 2 && form.specialization.length === 0) return;
              setStep((s) => s + 1);
            }}
            disabled={step === 2 && form.specialization.length === 0}
          >
            {isAr ? "التالي ←" : "Next →"}
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit} disabled={busy}>
            {busy
              ? (isAr ? "جاري الإرسال..." : "Submitting...")
              : (isAr ? "تقديم الطلب" : "Submit Application")}
          </Button>
        )}
      </div>
    </div>
  );
}
