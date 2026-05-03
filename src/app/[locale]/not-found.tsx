import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations("nav");

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <h1 className="text-4xl font-bold text-clay mb-4">404</h1>
      <p className="text-lg text-charcoal-600 mb-8">
        الصفحة التي تبحث عنها غير موجودة.
        <br />
        The page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-clay text-cream rounded-lg hover:bg-clay-600 transition-colors"
      >
        العودة للرئيسية / Return Home
      </a>
    </div>
  );
}
