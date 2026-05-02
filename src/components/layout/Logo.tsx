import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const locale = useLocale();
  const heightCls =
    size === "sm" ? "text-xl" : size === "lg" ? "text-3xl" : "text-2xl";

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-clay font-heading font-bold"
    >
      <svg
        viewBox="0 0 32 32"
        width={size === "sm" ? 24 : size === "lg" ? 40 : 32}
        height={size === "sm" ? 24 : size === "lg" ? 40 : 32}
        aria-hidden
        fill="none"
      >
        <path
          d="M4 28 L4 16 Q4 6 16 6 Q28 6 28 16 L28 28"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="3" fill="currentColor" />
        <line
          x1="16"
          y1="20"
          x2="16"
          y2="26"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className={heightCls}>
        {locale === "ar" ? "سوق الحرفيين" : "Souq Al-Hirfiyeen"}
      </span>
    </Link>
  );
}
