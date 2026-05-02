import { setRequestLocale } from "next-intl/server";
import { DEMO_PLANS } from "@/lib/demo-data";

export default async function AdminSubscriptionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-clay mb-6">
        {isAr ? "خطط الاشتراك" : "Subscription Plans"}
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-clay-100">
              {[
                isAr ? "الاسم" : "Name",
                isAr ? "الجمهور" : "Audience",
                isAr ? "المدة" : "Duration",
                isAr ? "السعر" : "Price",
                isAr ? "إعلانات" : "Ads",
                isAr ? "نشط" : "Active",
              ].map((h) => (
                <th key={h} className="py-3 pe-4 text-start font-medium text-charcoal-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-clay-100">
            {DEMO_PLANS.map((p) => (
              <tr key={p.id} className="hover:bg-cream-50">
                <td className="py-3 pe-4 font-medium text-charcoal">
                  {isAr ? p.name_ar : p.name_en}
                </td>
                <td className="py-3 pe-4 text-charcoal-500">{p.target_audience}</td>
                <td className="py-3 pe-4 text-charcoal-500">{p.duration_type}</td>
                <td className="py-3 pe-4 text-charcoal-500">
                  {p.price === 0 ? (isAr ? "مجاني" : "Free") : `$${p.price}`}
                </td>
                <td className="py-3 pe-4 text-charcoal-500">
                  {p.max_ads === null ? "∞" : p.max_ads}
                </td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.is_active ? "bg-green-100 text-verified" : "bg-red-100 text-busy"}`}>
                    {p.is_active ? "✓" : "✗"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
