import { classNames } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant =
  | "neutral"
  | "open"
  | "busy"
  | "verified"
  | "elite"
  | "pending"
  | "approved"
  | "rejected"
  | "brass";

const variantClasses: Record<Variant, string> = {
  neutral: "bg-charcoal-50 text-charcoal-600",
  open: "bg-green-100 text-verified",
  busy: "bg-red-100 text-busy",
  verified: "bg-green-100 text-verified",
  elite: "bg-brass text-cream",
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-verified",
  rejected: "bg-red-100 text-busy",
  brass: "bg-brass-50 text-brass",
};

export function Badge({
  variant = "neutral",
  children,
  className,
}: {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({
  status,
}: {
  status: "open" | "busy";
}) {
  return (
    <span
      className={classNames(
        "inline-block w-2 h-2 rounded-full",
        status === "open" ? "bg-verified" : "bg-busy"
      )}
      aria-label={status}
    />
  );
}
