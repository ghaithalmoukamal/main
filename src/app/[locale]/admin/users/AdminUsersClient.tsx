"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS, canRateUser, type DemoUser } from "@/lib/demo-auth";
import { Badge } from "@/components/ui/Badge";

const ADMIN_LEVEL_LABELS: Record<number, { ar: string; en: string; color: string }> = {
  1: { ar: "مشرف رئيسي", en: "Super Admin", color: "bg-red-100 text-red-700 border-red-200" },
  2: { ar: "مدير", en: "Admin", color: "bg-orange-100 text-orange-700 border-orange-200" },
  3: { ar: "مشرف", en: "Moderator", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  4: { ar: "عامل", en: "Worker", color: "bg-blue-100 text-blue-700 border-blue-200" },
};

interface Props {
  locale: "ar" | "en";
  accounts: DemoUser[];
}

export default function AdminUsersClient({ locale, accounts }: Props) {
  const { user: currentUser } = useAuth();
  const isAr = locale === "ar";

  // Local state for ratings (demo only — would persist to DB in production)
  const [ratings, setRatings] = useState<Record<string, number>>(() =>
    Object.fromEntries(accounts.map((a) => [a.id, a.rating ?? 0]))
  );
  const [ratingTargetId, setRatingTargetId] = useState<string | null>(null);
  const [pendingRating, setPendingRating] = useState<number>(0);

  function submitRating(targetId: string) {
    if (pendingRating < 1) return;
    setRatings((prev) => ({ ...prev, [targetId]: pendingRating }));
    setRatingTargetId(null);
    setPendingRating(0);
  }

  const canRate = (target: DemoUser) => {
    if (!currentUser) return false;
    return canRateUser(currentUser, target);
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-clay mb-2">
        {isAr ? "المستخدمون والأدوار" : "Users & Roles"}
      </h1>
      {currentUser && (
        <p className="text-sm text-charcoal-500 mb-6">
          {isAr
            ? `أنت مسجّل كـ: ${ROLE_LABELS[currentUser.role]?.ar}`
            : `Signed in as: ${ROLE_LABELS[currentUser.role]?.en} (${currentUser.name})`}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-clay-100">
              <th className="py-3 pe-4 text-start font-medium text-charcoal-500">
                {isAr ? "الاسم" : "Name"}
              </th>
              <th className="py-3 pe-4 text-start font-medium text-charcoal-500">
                {isAr ? "اسم المستخدم" : "Username"}
              </th>
              <th className="py-3 pe-4 text-start font-medium text-charcoal-500">
                {isAr ? "الدور" : "Role"}
              </th>
              <th className="py-3 pe-4 text-start font-medium text-charcoal-500">
                {isAr ? "المستوى الإداري" : "Admin Level"}
              </th>
              <th className="py-3 pe-4 text-center font-medium text-charcoal-500">
                {isAr ? "التقييم" : "Rating"}
              </th>
              <th className="py-3 text-center font-medium text-charcoal-500">
                {isAr ? "إجراء" : "Action"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-clay-100">
            {accounts.map((a) => {
              const levelInfo = a.adminLevel ? ADMIN_LEVEL_LABELS[a.adminLevel] : null;
              const currentRating = ratings[a.id] ?? 0;
              const isRatingTarget = ratingTargetId === a.id;

              return (
                <tr key={a.id} className="hover:bg-cream-50">
                  <td className="py-3 pe-4">
                    <div className="font-medium text-charcoal">
                      {isAr ? a.name_ar : a.name}
                    </div>
                  </td>
                  <td className="py-3 pe-4 font-mono text-charcoal-500 text-xs">
                    {a.username}
                  </td>
                  <td className="py-3 pe-4">
                    <span className="px-2 py-0.5 text-xs bg-clay-100 text-clay rounded-full font-medium border border-clay-200">
                      {ROLE_LABELS[a.role]?.[locale] ?? a.role}
                    </span>
                  </td>
                  <td className="py-3 pe-4">
                    {levelInfo ? (
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium border ${levelInfo.color}`}>
                        {isAr ? levelInfo.ar : levelInfo.en}
                      </span>
                    ) : (
                      <span className="text-charcoal-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3 pe-4 text-center">
                    {a.adminLevel ? (
                      <div className="flex items-center justify-center gap-1">
                        <StarRating value={currentRating} />
                        {a.ratingCount ? (
                          <span className="text-xs text-charcoal-400">({a.ratingCount})</span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-charcoal-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {canRate(a) ? (
                      isRatingTarget ? (
                        <div className="flex items-center gap-1 justify-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setPendingRating(star)}
                              className={`text-lg ${star <= pendingRating ? "text-brass" : "text-charcoal-300"} hover:text-brass transition-colors`}
                            >
                              ★
                            </button>
                          ))}
                          <button
                            onClick={() => submitRating(a.id)}
                            disabled={pendingRating < 1}
                            className="ms-1 text-xs px-2 py-1 bg-clay text-cream rounded hover:bg-clay-600 disabled:opacity-40 transition-colors"
                          >
                            {isAr ? "حفظ" : "Save"}
                          </button>
                          <button
                            onClick={() => { setRatingTargetId(null); setPendingRating(0); }}
                            className="text-xs px-1 py-1 text-charcoal-400 hover:text-charcoal"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setRatingTargetId(a.id); setPendingRating(currentRating); }}
                          className="text-xs px-3 py-1 border border-brass text-brass rounded hover:bg-brass hover:text-cream transition-colors font-medium"
                        >
                          {isAr ? "قيّم" : "Rate"}
                        </button>
                      )
                    ) : (
                      <span className="text-charcoal-300 text-xs">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-cream-100 border border-clay-100 rounded-xl text-xs text-charcoal-500">
        {isAr
          ? "ملاحظة: يمكن للمشرف الأعلى مستوى فقط تقييم المستويات الأدنى منه. التقييمات في هذا العرض التجريبي ليست محفوظة بشكل دائم."
          : "Note: Only higher-level admins can rate lower-level admins. Ratings in this demo are not permanently saved."}
      </div>
    </div>
  );
}

function StarRating({ value }: { value: number }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className="text-brass text-sm">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rounded ? "text-brass" : "text-charcoal-200"}>
          ★
        </span>
      ))}
      {value > 0 && (
        <span className="ms-1 text-xs text-charcoal-500">{value.toFixed(1)}</span>
      )}
    </span>
  );
}
