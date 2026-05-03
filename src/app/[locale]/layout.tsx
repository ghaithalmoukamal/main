import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { routing, isRTL } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ModeProvider from "@/components/layout/ModeProvider";
import FirstVisitModal from "@/components/layout/FirstVisitModal";
import ServiceWorkerRegistrar from "@/components/layout/ServiceWorkerRegistrar";
import { AuthProvider } from "@/context/AuthContext";
import { readModeCookie } from "@/lib/mode";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "سوق الحرفيين — Souq Al-Hirfiyeen",
    template: "%s — سوق الحرفيين",
  },
  description:
    "السوق الرقمي للحرفيين السوريين — نجار، حداد، كهربائي، سباك، دهان، بلّاط في دمشق وريفها",
  manifest: "/manifest.json",
  applicationName: "سوق الحرفيين",
  formatDetection: { telephone: false },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#8B4513",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const cookieStore = await cookies();
  const initialMode =
    readModeCookie(
      cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ")
    ) ?? null;

  const dir = isRTL(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${cairo.variable} ${plex.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-cream text-charcoal antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <ModeProvider initialMode={initialMode}>
              <ServiceWorkerRegistrar />
              <FirstVisitModal />
              <Header />
              <main className="min-h-[calc(100vh-160px)]">{children}</main>
              <Footer />
            </ModeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
