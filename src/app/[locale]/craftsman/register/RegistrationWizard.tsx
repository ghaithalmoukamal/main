"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { DEMO_TRADES, DEMO_CITIES } from "@/lib/demo-data";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { pickLocalized } from "@/lib/utils";

interface FormData {
  // Step 1 — Personal
  name: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  trade_id: string;
  custom_trade_name: string;
  bio: string;
  city_id: string;
  location_name: string;

  // Step 2 — Services
  services: Array<{ name: string; price: string; description: string }>;

  // Step 3 — Assets
  assets: Array<{ name: string }>;
}

const EMPTY: FormData = {
  name: "",
  phone: "",
  whatsapp: "",
  instagram: "",
  facebook: "",
  trade_id: "",
  custom_trade_name: "",
  bio: "",
  city_id: "",
  location_name: "",
  services: [{ name: "", price: "", description: "" }],
  assets: [],
};

const STEPS = 3;

export default function RegistrationWizard() {
  const locale = useLocale() as "ar" | "en";
  const t = useTranslations("register");
  const tCommon = useTranslations("common");

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const patch = (key: keyof FormData, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const stepLabel = [t("step1"), t("step2"), t("step3")][step - 1];

  const handleSubmit = async () => {
    setBusy(true);
    // In production: POST to /api/craftsman/register
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setBusy(false);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="font-heading text-2xl font-bold text-clay mb-3">
          {locale === "ar" ? "تم إرسال الطلب!" : "Application Submitted!"}
        </h1>
        <p className="text-charcoal-600">{t("submitted")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Header */}
      <h1 className="font-heading text-3xl font-bold text-clay mb-1">
        {t("title")}
      </h1>
      <p className="text-charcoal-500 mb-6">{t("subtitle")}</p>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: STEPS }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i + 1 <= step ? "bg-clay" : "bg-clay-100"
            }`}
          />
        ))}
      </div>

      <div className="text-sm font-medium text-charcoal-500 mb-4">
        {locale === "ar" ? `خطوة ${step} من ${STEPS}` : `Step ${step} of ${STEPS}`}
        {" — "}
        {stepLabel}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <Input
            label={t("fields.name")}
            value={form.name}
            onChange={(e) => patch("name", e.target.value)}
            required
          />
          <Input
            label={t("fields.phone")}
            type="tel"
            value={form.phone}
            onChange={(e) => patch("phone", e.target.value)}
            placeholder="+963 9XX XXX XXX"
            required
          />
          <Input
            label={t("fields.whatsapp")}
            type="tel"
            value={form.whatsapp}
            onChange={(e) => patch("whatsapp", e.target.value)}
            placeholder="+963 9XX XXX XXX"
          />

          <Select
            label={t("fields.trade")}
            value={form.trade_id}
            onChange={(e) => patch("trade_id", e.target.value)}
          >
            <option value="">
              {locale === "ar" ? "اختار مهنتك" : "Select your trade"}
            </option>
            {DEMO_TRADES.map((tr) => (
              <option key={tr.id} value={tr.id}>
                {pickLocalized(tr, "name", locale)}
              </option>
            ))}
            <option value="custom">
              {locale === "ar" ? "مهنة أخرى..." : "Other trade..."}
            </option>
          </Select>

          {form.trade_id === "custom" && (
            <Input
              label={t("fields.customTrade")}
              value={form.custom_trade_name}
              onChange={(e) => patch("custom_trade_name", e.target.value)}
              placeholder={
                locale === "ar"
                  ? "اكتب اسم مهنتك هون"
                  : "Type your trade name"
              }
            />
          )}

          <Select
            label={t("fields.city")}
            value={form.city_id}
            onChange={(e) => patch("city_id", e.target.value)}
          >
            <option value="">
              {locale === "ar" ? "اختار المدينة" : "Select city"}
            </option>
            {DEMO_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {pickLocalized(c, "name", locale)}
              </option>
            ))}
          </Select>

          <Input
            label={t("fields.location")}
            value={form.location_name}
            onChange={(e) => patch("location_name", e.target.value)}
            placeholder={
              locale === "ar"
                ? "مثلاً: حوش بلاس، الميدان"
                : "e.g. Hosh Blass, Midan"
            }
          />

          <Textarea
            label={t("fields.bio")}
            value={form.bio}
            onChange={(e) => patch("bio", e.target.value)}
            rows={3}
            placeholder={
              locale === "ar"
                ? "حكي عن خبرتك وشغلتك..."
                : "Tell us about your experience..."
            }
          />

          <Input
            label={t("fields.instagram")}
            value={form.instagram}
            onChange={(e) => patch("instagram", e.target.value)}
            placeholder="@username"
          />
          <Input
            label={t("fields.facebook")}
            value={form.facebook}
            onChange={(e) => patch("facebook", e.target.value)}
            placeholder="username or page name"
          />
        </div>
      )}

      {/* Step 2 — Services */}
      {step === 2 && (
        <div className="space-y-4">
          {form.services.map((svc, idx) => (
            <div
              key={idx}
              className="p-4 border border-clay-100 rounded-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-charcoal-500">
                  {locale === "ar"
                    ? `خدمة ${idx + 1}`
                    : `Service ${idx + 1}`}
                </span>
                {form.services.length > 1 && (
                  <button
                    onClick={() =>
                      patch(
                        "services",
                        form.services.filter((_, i) => i !== idx)
                      )
                    }
                    className="text-busy text-sm hover:underline"
                  >
                    {tCommon("delete")}
                  </button>
                )}
              </div>
              <Input
                label={t("fields.serviceName")}
                value={svc.name}
                onChange={(e) => {
                  const next = [...form.services];
                  next[idx] = { ...next[idx], name: e.target.value };
                  patch("services", next);
                }}
              />
              <Input
                label={t("fields.servicePrice")}
                value={svc.price}
                onChange={(e) => {
                  const next = [...form.services];
                  next[idx] = { ...next[idx], price: e.target.value };
                  patch("services", next);
                }}
                placeholder={
                  locale === "ar" ? "مثلاً: ٥٠٠,٠٠٠ ل.س" : "e.g. 500,000 SYP"
                }
              />
              <Textarea
                label={t("fields.serviceDescription")}
                value={svc.description}
                onChange={(e) => {
                  const next = [...form.services];
                  next[idx] = { ...next[idx], description: e.target.value };
                  patch("services", next);
                }}
                rows={2}
              />
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() =>
              patch("services", [
                ...form.services,
                { name: "", price: "", description: "" },
              ])
            }
          >
            + {t("fields.addService")}
          </Button>
        </div>
      )}

      {/* Step 3 — Assets */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-charcoal-500">
            {locale === "ar"
              ? "شو عندك في ورشتك؟ أدواتك تساعد الشركات تلاقيك أسرع."
              : "What tools do you have in your workshop? This helps firms find you faster."}
          </p>
          {form.assets.map((a, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                className="flex-1"
                value={a.name}
                onChange={(e) => {
                  const next = [...form.assets];
                  next[idx] = { name: e.target.value };
                  patch("assets", next);
                }}
                placeholder={
                  locale === "ar"
                    ? "مثلاً: منشار كهربائي"
                    : "e.g. Electric Saw"
                }
              />
              <button
                onClick={() =>
                  patch(
                    "assets",
                    form.assets.filter((_, i) => i !== idx)
                  )
                }
                className="text-busy px-2 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => patch("assets", [...form.assets, { name: "" }])}
          >
            + {t("fields.addAsset")}
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-clay-100">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 1}
        >
          ← {tCommon("back")}
        </Button>

        {step < STEPS ? (
          <Button
            variant="primary"
            onClick={() => setStep((s) => s + 1)}
          >
            {tCommon("next")} →
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={busy}
          >
            {busy ? tCommon("loading") : t("submit")}
          </Button>
        )}
      </div>
    </div>
  );
}
