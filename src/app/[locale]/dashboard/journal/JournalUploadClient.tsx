"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

export default function JournalUploadClient() {
  const locale = useLocale() as "ar" | "en";
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []).slice(0, 10);
    setFiles(picked);
  };

  const handleSubmit = async () => {
    if (!title) return;
    setBusy(true);
    // TODO: upload files to Supabase Storage, POST to /api/journal
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setBusy(false);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <p className="text-charcoal-600">
          {locale === "ar"
            ? "تم نشر التسجيل في سجل أشغالك"
            : "Post added to your work journal"}
        </p>
        <button
          onClick={() => {
            setTitle("");
            setDesc("");
            setFiles([]);
            setSubmitted(false);
          }}
          className="mt-4 text-sm text-clay underline"
        >
          {locale === "ar" ? "أضف تسجيل آخر" : "Add another post"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        label={locale === "ar" ? "عنوان الشغلة" : "Job title"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={
          locale === "ar" ? "مثلاً: موبيليا غرفة نوم" : "e.g. Bedroom furniture set"
        }
        required
      />
      <Textarea
        label={locale === "ar" ? "وصف" : "Description"}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        rows={3}
        placeholder={
          locale === "ar"
            ? "شو عملت، وين، كيف..."
            : "What you built, where, how..."
        }
      />

      <div>
        <label className="block text-sm font-medium mb-1.5 text-charcoal-700">
          {locale === "ar" ? "الصور (حتى ١٠)" : "Photos (up to 10)"}
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="block w-full text-sm text-charcoal-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-clay file:text-cream hover:file:bg-clay-600"
        />
        {files.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {files.map((f, i) => (
              <span
                key={i}
                className="text-xs bg-cream-100 border border-clay-100 rounded px-2 py-1"
              >
                {f.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={busy || !title}
        fullWidth
      >
        {busy
          ? locale === "ar"
            ? "جاري النشر..."
            : "Publishing..."
          : locale === "ar"
          ? "انشر في سجل الأشغال"
          : "Publish to Work Journal"}
      </Button>
    </div>
  );
}
