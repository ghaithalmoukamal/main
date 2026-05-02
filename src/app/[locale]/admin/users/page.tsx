import { setRequestLocale } from "next-intl/server";

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  const demoUsers = [
    { id: "u1", name: "Admin User", phone: "+963991000001", role: "admin", is_active: true },
    { id: "u2", name: "Moderator A", phone: "+963991000002", role: "moderator", is_active: true },
    { id: "u3", name: "Worker — Damascus Trades", phone: "+963991000003", role: "worker", is_active: true },
    { id: "u4", name: "Supplier Co.", phone: "+963991000004", role: "supplier", is_active: true },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-clay mb-6">
        {isAr ? "المستخدمون والأدوار" : "Users & Roles"}
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-clay-100 text-start">
              <th className="py-3 pe-4 text-start font-medium text-charcoal-500">
                {isAr ? "الاسم" : "Name"}
              </th>
              <th className="py-3 pe-4 text-start font-medium text-charcoal-500">
                {isAr ? "الموبايل" : "Phone"}
              </th>
              <th className="py-3 pe-4 text-start font-medium text-charcoal-500">
                {isAr ? "الدور" : "Role"}
              </th>
              <th className="py-3 text-start font-medium text-charcoal-500">
                {isAr ? "الحالة" : "Status"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-clay-100">
            {demoUsers.map((u) => (
              <tr key={u.id} className="hover:bg-cream-50">
                <td className="py-3 pe-4 font-medium text-charcoal">{u.name}</td>
                <td className="py-3 pe-4 text-charcoal-500">{u.phone}</td>
                <td className="py-3 pe-4">
                  <span className="px-2 py-0.5 text-xs bg-clay-100 text-clay rounded-full font-medium">
                    {u.role}
                  </span>
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      u.is_active
                        ? "bg-green-100 text-verified"
                        : "bg-red-100 text-busy"
                    }`}
                  >
                    {u.is_active
                      ? isAr
                        ? "نشط"
                        : "Active"
                      : isAr
                      ? "معطّل"
                      : "Inactive"}
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
