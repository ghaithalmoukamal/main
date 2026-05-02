"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";

export default function SupplierRegisterClient() {
  const locale = useLocale() as "ar" | "en";
  const isAr = locale === "ar";

  const [form, setForm] = useState({
    name: "", phone: "", whatsapp: "", description: "", city: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const patch = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setBusy(false);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🏭</div>
        <h1 className="font-heading text-2xl font-bold text-clay mb-3">
          {isAr ? "تم إرسال الطلب!" : "Application Submitted!"}
        </h1>
        <p className="text-charcoal-500">
          {isAr
            ? "سنتواصل معك عبر الواتساب لتفعيل حسابك."
            : "We'll contact you via WhatsApp to activate your account."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-5">
      <h1 className="font-heading text-2xl font-bold text-clay">
        {isAr ? "سجّل كمورّد" : "Register as Supplier"}
      </h1>

      <Input
        label={isAr ? "اسم الشركة أو المستودع" : "Company / Warehouse Name"}
        value={form.name}
        onChange={(e) => patch("name", e.target.value)}
        required
      />
      <Input
        label={isAr ? "رقم الموبايل" : "Phone"}
        type="tel"
        value={form.phone}
        onChange={(e) => patch("phone", e.target.value)}
        placeholder="+963 9XX XXX XXX"
      />
      <Input
        label={isAr ? "واتساب" : "WhatsApp"}
        type="tel"
        value={form.whatsapp}
        onChange={(e) => patch("whatsapp", e.target.value)}
        placeholder="+963 9XX XXX XXX"
      />
      <Select
        label={isAr ? "المدينة" : "City"}
        value={form.city}
        onChange={(e) => patch("city", e.target.value)}
      >
        <option value="">{isAr ? "اختار" : "Select"}</option>
        <option value="damascus">{isAr ? "دمشق" : "Damascus"}</option>
        <option value="rif_dimashq">{isAr ? "ريف دمشق" : "Rif Dimashq"}</option>
      </Select>
      <Textarea
        label={isAr ? "وصف المنتجات التي تبيعها" : "Description of products you sell"}
        value={form.description}
        onChange={(e) => patch("description", e.target.value)}
        rows={3}
        placeholder={isAr ? "مثلاً: خشب، أدوات نجارة، مواد بناء..." : "e.g. wood, carpentry tools, construction materials..."}
      />

      <Button variant="primary" fullWidth disabled={busy || !form.name} onClick={handleSubmit}>
        {busy ? (isAr ? "جاري الإرسال..." : "Submitting...") : (isAr ? "إرسال الطلب" : "Submit Application")}
      </Button>
    </div>
  );
}
