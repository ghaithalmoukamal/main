"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { pickLocalized } from "@/lib/utils";
import type { Trade, MapZone, SubscriptionPlan } from "@/lib/types";

interface Props {
  trades: Trade[];
  zones: MapZone[];
  plans: SubscriptionPlan[];
  locale: "ar" | "en";
}

type Step = "content" | "targeting" | "plan";

export default function AdCreatorClient({ trades, zones, plans, locale }: Props) {
  const isAr = locale === "ar";

  const [step, setStep] = useState<Step>("content");
  const [form, setForm] = useState({
    title: "",
    description: "",
    whatsapp: "",
    format: "image_card" as const,
    targetTradeIds: [] as number[],
    targetZoneIds: [] as number[],
    planId: null as number | null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const steps: Step[] = ["content", "targeting", "plan"];
  const stepLabels: Record<Step, string> = {
    content: isAr ? "المحتوى" : "Content",
    targeting: isAr ? "الاستهداف" : "Targeting",
    plan: isAr ? "الخطة" : "Plan",
  };
  const currentIdx = steps.indexOf(step);

  const handleSubmit = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setBusy(false);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center">
        <div className="text-5xl mb-4">📢</div>
        <p className="font-heading text-xl font-bold text-clay mb-2">
          {isAr ? "تم إرسال الإعلان!" : "Ad Submitted!"}
        </p>
        <p className="text-charcoal-500 text-sm">
          {isAr
            ? form.planId
              ? "إعلانك سيُراجع خلال 24 ساعة"
              : "إعلانك تمت الموافقة عليه تلقائياً"
            : form.planId
            ? "Your ad will be reviewed within 24 hours"
            : "Your ad was auto-approved (subscriber)"}
        </p>
      </div>
    );
  }

  const toggleId = (arr: number[], id: number) =>
    arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex gap-2">
        {steps.map((s, i) => (
          <div key={s} className={`flex-1 h-1.5 rounded-full ${i <= currentIdx ? "bg-clay" : "bg-clay-100"}`} />
        ))}
      </div>
      <div className="text-sm text-charcoal-500">{stepLabels[step]}</div>

      {/* Step: Content */}
      {step === "content" && (
        <div className="space-y-4">
          <Select
            label={isAr ? "نوع الإعلان" : "Ad Format"}
            value={form.format}
            onChange={(e) => setForm((f) => ({ ...f, format: e.target.value as "image_card" }))}
          >
            <option value="image_card">{isAr ? "بطاقة صورة + نص" : "Image Card"}</option>
            <option value="sponsored_search">{isAr ? "نتيجة بحث مدفوعة" : "Sponsored Search Result"}</option>
            <option value="banner">{isAr ? "بانر في أعلى الصفحة" : "Category Page Banner"}</option>
            <option value="channel_post">{isAr ? "منشور في قناة" : "Channel Post"}</option>
          </Select>
          <Input
            label={isAr ? "عنوان الإعلان" : "Ad Title"}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder={isAr ? "مثلاً: خشب جوز بأفضل الأسعار" : "e.g. Best walnut wood prices"}
            required
          />
          <Textarea
            label={isAr ? "النص" : "Description"}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
          />
          <Input
            label={isAr ? "رقم الواتساب للتواصل" : "WhatsApp Contact"}
            type="tel"
            value={form.whatsapp}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
            placeholder="+963 9XX XXX XXX"
          />
        </div>
      )}

      {/* Step: Targeting */}
      {step === "targeting" && (
        <div className="space-y-5">
          <div>
            <div className="text-sm font-medium text-charcoal-700 mb-2">
              {isAr ? "استهداف حسب المهنة:" : "Target by trade:"}
            </div>
            <div className="flex flex-wrap gap-2">
              {trades.map((tr) => {
                const on = form.targetTradeIds.includes(tr.id);
                return (
                  <button
                    key={tr.id}
                    onClick={() => setForm((f) => ({ ...f, targetTradeIds: toggleId(f.targetTradeIds, tr.id) }))}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${on ? "bg-clay text-cream border-clay" : "border-clay-100 text-charcoal-600 hover:border-clay"}`}
                  >
                    {pickLocalized(tr, "name", locale)}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-charcoal-700 mb-2">
              {isAr ? "استهداف حسب المنطقة:" : "Target by zone:"}
            </div>
            <div className="flex flex-wrap gap-2">
              {zones.map((z) => {
                const on = form.targetZoneIds.includes(z.id);
                const name = pickLocalized(z, "name", locale);
                return (
                  <button
                    key={z.id}
                    onClick={() => setForm((f) => ({ ...f, targetZoneIds: toggleId(f.targetZoneIds, z.id) }))}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${on ? "bg-clay text-cream border-clay" : "border-clay-100 text-charcoal-600 hover:border-clay"}`}
                  >
                    📍 {name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step: Plan */}
      {step === "plan" && (
        <div className="space-y-3">
          {plans.map((p) => {
            const name = isAr ? p.name_ar : p.name_en;
            const selected = form.planId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setForm((f) => ({ ...f, planId: p.id }))}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${selected ? "border-clay bg-clay/5" : "border-clay-100 hover:border-clay-200"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-charcoal">{name}</div>
                  <div className="font-bold text-clay">
                    {p.price === 0 ? (isAr ? "مجاني" : "Free") : `$${p.price}`}
                  </div>
                </div>
                <div className="text-sm text-charcoal-500 mt-1">{p.duration_type}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-clay-100">
        <Button variant="ghost" onClick={() => setStep(steps[currentIdx - 1])} disabled={currentIdx === 0}>
          ← {isAr ? "رجوع" : "Back"}
        </Button>
        {currentIdx < steps.length - 1 ? (
          <Button variant="primary" onClick={() => setStep(steps[currentIdx + 1])}>
            {isAr ? "التالي" : "Next"} →
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit} disabled={busy || !form.title}>
            {busy ? (isAr ? "جاري الإرسال..." : "Submitting...") : (isAr ? "إرسال الإعلان" : "Submit Ad")}
          </Button>
        )}
      </div>
    </div>
  );
}
