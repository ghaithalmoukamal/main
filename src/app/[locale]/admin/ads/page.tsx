import { setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";

const DEMO_ADS = [
  { id: 1, title: "عروض خشب الجوز — مستودعات حماد", format: "image_card", status: "approved", is_active: true, impressions: 245, clicks: 18 },
  { id: 2, title: "مواد لحام — شركة الفولاذ الحديث", format: "banner", status: "pending", is_active: false, impressions: 0, clicks: 0 },
  { id: 3, title: "أدوات كهرباء — سبارك إليكترو", format: "sponsored_search", status: "approved", is_active: true, impressions: 512, clicks: 41 },
];

export default async function AdminAdsPage({
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
        {isAr ? "الإعلانات" : "Ads"}
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-clay-100">
              {[isAr ? "العنوان" : "Title", isAr ? "النوع" : "Format", isAr ? "الحالة" : "Status", "Impressions", "Clicks", isAr ? "إجراء" : "Action"].map((h) => (
                <th key={h} className="py-3 pe-4 text-start font-medium text-charcoal-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-clay-100">
            {DEMO_ADS.map((ad) => (
              <tr key={ad.id} className="hover:bg-cream-50">
                <td className="py-3 pe-4 font-medium text-charcoal">{ad.title}</td>
                <td className="py-3 pe-4 text-charcoal-500">{ad.format}</td>
                <td className="py-3 pe-4">
                  <Badge variant={ad.status === "approved" ? "approved" : "pending"}>
                    {ad.status}
                  </Badge>
                </td>
                <td className="py-3 pe-4 text-charcoal-500">{ad.impressions}</td>
                <td className="py-3 pe-4 text-charcoal-500">{ad.clicks}</td>
                <td className="py-3">
                  {ad.status === "pending" && (
                    <div className="flex gap-1">
                      <button className="px-2 py-1 text-xs bg-clay text-cream rounded hover:bg-clay-600 transition-colors">✓</button>
                      <button className="px-2 py-1 text-xs bg-red-100 text-busy rounded hover:bg-red-200 transition-colors">✗</button>
                    </div>
                  )}
                  {ad.status === "approved" && (
                    /* Workers cannot see this button — only admins */
                    <button className="px-2 py-1 text-xs bg-busy text-cream rounded hover:bg-red-700 transition-colors">
                      {isAr ? "إزالة" : "Remove"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
