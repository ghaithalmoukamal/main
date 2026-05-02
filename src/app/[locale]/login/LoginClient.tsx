"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DEMO_ACCOUNTS, ROLE_LABELS } from "@/lib/demo-auth";

const ROLE_TABS = [
  { key: "craftsman", icon: "🛠️" },
  { key: "firm", icon: "🏢" },
  { key: "supplier", icon: "🏭" },
  { key: "admin", icon: "🔐" },
] as const;

interface Props {
  locale: "ar" | "en";
  defaultRole: string;
  redirectTo: string;
}

export default function LoginClient({ locale, defaultRole, redirectTo }: Props) {
  const isAr = locale === "ar";
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState(defaultRole || "craftsman");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Demo hint accounts for each role tab
  const hints: Record<string, { username: string; password: string; label: string }> = {
    craftsman: { username: "craftsman", password: "craftsman", label: isAr ? "تجربة كمعلم" : "Try as Craftsman" },
    firm: { username: "firm", password: "firm", label: isAr ? "تجربة كشركة" : "Try as Firm" },
    supplier: { username: "supplier", password: "supplier", label: isAr ? "تجربة كمورّد" : "Try as Supplier" },
    admin: { username: "admin", password: "admin", label: isAr ? "دخول الإدارة" : "Admin Login" },
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 300));
    const result = login(username, password);
    setBusy(false);
    if (result.ok) {
      window.location.href = `/${locale}${redirectTo || result.redirect}`;
    } else {
      setError(
        isAr
          ? "اسم المستخدم أو كلمة المرور غير صحيحة"
          : "Incorrect username or password"
      );
    }
  };

  const fillHint = (tab: string) => {
    const h = hints[tab];
    if (h) { setUsername(h.username); setPassword(h.password); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏛️</div>
          <h1 className="font-heading text-3xl font-bold text-clay mb-1">
            {isAr ? "تسجيل الدخول" : "Sign In"}
          </h1>
          <p className="text-charcoal-500 text-sm">
            {isAr ? "سوق الحرفيين — منصتك الرقمية" : "Souq Al-Hirfiyeen — Your Digital Marketplace"}
          </p>
        </div>

        {/* Role tabs */}
        <div className="flex border border-clay-100 rounded-xl overflow-hidden mb-6">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); fillHint(tab.key); setError(""); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors flex flex-col items-center gap-1 ${
                activeTab === tab.key
                  ? "bg-clay text-cream"
                  : "bg-white text-charcoal-500 hover:bg-cream-50"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs">{ROLE_LABELS[tab.key as keyof typeof ROLE_LABELS]?.[locale] ?? tab.key}</span>
            </button>
          ))}
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="bg-white border border-clay-100 rounded-2xl p-6 shadow-sm space-y-4">
          <Input
            label={isAr ? "اسم المستخدم" : "Username"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <Input
            label={isAr ? "كلمة المرور" : "Password"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-busy text-sm rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={busy}>
            {busy
              ? isAr ? "جاري الدخول..." : "Signing in..."
              : isAr ? "دخول" : "Sign In"}
          </Button>

          {/* Quick-fill hint */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => fillHint(activeTab)}
              className="text-xs text-charcoal-400 hover:text-clay underline transition-colors"
            >
              {hints[activeTab]?.label}
            </button>
          </div>
        </form>

        {/* Demo accounts table */}
        <details className="mt-4">
          <summary className="text-xs text-charcoal-400 cursor-pointer hover:text-charcoal text-center">
            {isAr ? "عرض جميع حسابات التجربة" : "Show all demo accounts"}
          </summary>
          <div className="mt-3 bg-cream-50 border border-clay-100 rounded-xl p-4 text-xs">
            <table className="w-full">
              <thead>
                <tr className="text-charcoal-400 border-b border-clay-100">
                  <th className="pb-2 text-start">{isAr ? "المستخدم" : "Username"}</th>
                  <th className="pb-2 text-start">{isAr ? "كلمة المرور" : "Password"}</th>
                  <th className="pb-2 text-start">{isAr ? "الدور" : "Role"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clay-100">
                {DEMO_ACCOUNTS.map((a) => (
                  <tr
                    key={a.id}
                    className="cursor-pointer hover:bg-cream-100"
                    onClick={() => { setUsername(a.username); setPassword(a.password); }}
                  >
                    <td className="py-1.5 font-mono text-clay font-semibold">{a.username}</td>
                    <td className="py-1.5 font-mono text-charcoal-500">{a.password}</td>
                    <td className="py-1.5 text-charcoal-500">{ROLE_LABELS[a.role]?.[locale]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-charcoal-400 mt-2 text-center">
              {isAr ? "اضغط على أي صف لملء البيانات" : "Click any row to auto-fill"}
            </p>
          </div>
        </details>

        {/* Register links */}
        <div className="mt-6 text-center text-sm text-charcoal-500 space-y-2">
          <div>
            {isAr ? "معلم جديد؟ " : "New craftsman? "}
            <a href={`/${locale}/craftsman/register`} className="text-clay hover:underline font-medium">
              {isAr ? "سجّل ورشتك" : "Register your workshop"}
            </a>
          </div>
          <div>
            {isAr ? "مورّد جديد؟ " : "New supplier? "}
            <a href={`/${locale}/supplier/register`} className="text-clay hover:underline font-medium">
              {isAr ? "سجّل كمورّد" : "Register as supplier"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
