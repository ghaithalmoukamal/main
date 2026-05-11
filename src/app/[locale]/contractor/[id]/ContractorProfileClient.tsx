"use client";

import { CONTRACTOR_SPECIALIZATIONS } from "@/lib/constants";

// ── Demo data ──────────────────────────────────────────────────────────────
const DEMO_CONTRACTOR = {
  id: "contractor-1",
  name: "Khaled Al-Miqati Contracting",
  name_ar: "خالد المقاتي للمقاولات",
  type: "company" as "individual" | "company",
  specialization: ["finishing", "civil", "interior"],
  bio_ar: "شركة متخصصة في أعمال التشطيب والبناء المدني بخبرة تزيد عن 15 عاماً في دمشق والضواحي. نعمل مع أفضل المعلمين والشركات الهندسية لتسليم مشاريع بأعلى معايير الجودة.",
  bio_en: "Specialized in finishing and civil works with over 15 years of experience in Damascus and suburbs. We work with the best Maalems and engineering firms to deliver projects at the highest quality standards.",
  phone: "+963 11 123 4567",
  whatsapp: "+963 911 234 567",
  instagram: "@miqati_contracting",
  website: "https://miqati.sy",
  location_name: "المزة، دمشق",
  city_name_ar: "دمشق",
  city_name_en: "Damascus",
  years_experience: 15,
  team_size_min: 10,
  team_size_max: 50,
  is_verified: true,
  is_elite: false,
  status: "open" as const,
  approval_status: "approved" as const,
  projects: [
    { title: "مجمع سكني — المزة", description: "أعمال تشطيب كاملة لمجمع 40 شقة", year: "2023" },
    { title: "فندق الياسمين — دمشق", description: "إعادة تأهيل وتشطيب غرف الفندق بالكامل", year: "2022" },
  ],
  linked_maalems: [
    { id: "craftsman-1", name: "أبو محمود الدمشقي", trade: "نجار", collaboration_type: "regular_team" as const },
  ],
  created_at: "2024-01-01T00:00:00Z",
};

interface Props {
  id: string;
  locale: "ar" | "en";
}

export default function ContractorProfileClient({ id, locale }: Props) {
  const isAr = locale === "ar";
  const c = DEMO_CONTRACTOR; // replace with real fetch

  const name = isAr ? (c.name_ar || c.name) : c.name;
  const bio = isAr ? c.bio_ar : c.bio_en;
  const city = isAr ? c.city_name_ar : c.city_name_en;

  const specializations = c.specialization
    .map((s) => CONTRACTOR_SPECIALIZATIONS.find((sp) => sp.value === s))
    .filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* ── Header card ── */}
      <div className="bg-white border border-clay-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-clay-100 flex items-center justify-center text-4xl shrink-0">
            🏗️
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="font-heading text-2xl font-bold text-charcoal">{name}</h1>
              {c.is_verified && (
                <span className="text-xs bg-verified text-white px-2 py-0.5 rounded-full">
                  {isAr ? "✓ موثق" : "✓ Verified"}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                c.status === "open" ? "bg-verified/10 text-verified" : "bg-busy/10 text-busy"
              }`}>
                {c.status === "open"
                  ? (isAr ? "● متاح" : "● Available")
                  : (isAr ? "● مشغول" : "● Busy")}
              </span>
            </div>

            <div className="text-sm text-charcoal-500 flex flex-wrap gap-3">
              <span>🏗️ {c.type === "individual" ? (isAr ? "مقاول فردي" : "Individual Contractor") : (isAr ? "شركة مقاولات" : "Contracting Company")}</span>
              <span>📍 {c.location_name}, {city}</span>
              {c.years_experience && <span>🗓️ {c.years_experience} {isAr ? "سنة خبرة" : "yrs exp."}</span>}
              {c.team_size_min && <span>👥 {c.team_size_min}–{c.team_size_max} {isAr ? "عامل" : "workers"}</span>}
            </div>

            {/* Specializations */}
            <div className="flex flex-wrap gap-2 mt-3">
              {specializations.map((s) => s && (
                <span key={s.value} className="text-xs bg-cream border border-clay-100 text-clay px-2 py-1 rounded-lg">
                  {isAr ? s.label_ar : s.label_en}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-clay-100">
          {c.whatsapp && (
            <a
              href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-xl text-sm font-medium hover:bg-[#1ebe5d] transition-colors"
            >
              💬 {isAr ? "واتساب" : "WhatsApp"}
            </a>
          )}
          {c.website && (
            <a
              href={c.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-clay-100 text-charcoal rounded-xl text-sm hover:border-clay hover:text-clay transition-colors"
            >
              🌐 {isAr ? "الموقع الإلكتروني" : "Website"}
            </a>
          )}
          {c.instagram && (
            <a
              href={`https://instagram.com/${c.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-clay-100 text-charcoal rounded-xl text-sm hover:border-clay hover:text-clay transition-colors"
            >
              📸 {c.instagram}
            </a>
          )}
        </div>
      </div>

      {/* ── About ── */}
      {bio && (
        <div className="bg-white border border-clay-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-clay mb-3">
            {isAr ? "نبذة عن المقاول" : "About"}
          </h2>
          <p className="text-charcoal-600 leading-relaxed text-sm">{bio}</p>
        </div>
      )}

      {/* ── Past Projects ── */}
      {c.projects.length > 0 && (
        <div className="bg-white border border-clay-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-clay mb-4">
            {isAr ? "المشاريع السابقة" : "Past Projects"}
          </h2>
          <div className="space-y-4">
            {c.projects.map((proj, i) => (
              <div key={i} className="flex gap-4 p-4 bg-cream-50 rounded-xl border border-clay-100">
                <div className="w-10 h-10 rounded-lg bg-clay/10 flex items-center justify-center text-xl shrink-0">
                  🏛️
                </div>
                <div>
                  <div className="font-medium text-charcoal text-sm">{proj.title}</div>
                  <div className="text-charcoal-500 text-xs mt-0.5">{proj.description}</div>
                  <div className="text-charcoal-400 text-xs mt-1">📅 {proj.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Linked Maalems ── */}
      {c.linked_maalems.length > 0 && (
        <div className="bg-white border border-clay-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-clay mb-4">
            {isAr ? "المعلمون الذين نعمل معهم" : "Maalems We Work With"}
          </h2>
          <div className="space-y-3">
            {c.linked_maalems.map((m) => (
              <a
                key={m.id}
                href={`/${locale}/craftsman/${m.id}`}
                className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl border border-clay-100 hover:border-clay transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-clay-100 flex items-center justify-center text-lg">🛠️</div>
                <div>
                  <div className="font-medium text-charcoal text-sm">{m.name}</div>
                  <div className="text-charcoal-400 text-xs">{m.trade} · {
                    m.collaboration_type === "regular_team"
                      ? (isAr ? "فريق ثابت" : "Regular team")
                      : (isAr ? "تعاون دوري" : "Occasional")
                  }</div>
                </div>
                <span className="ms-auto text-clay text-sm">←</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
