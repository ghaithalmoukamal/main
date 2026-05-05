import { Link } from "@/i18n/routing";
import { classNames } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "brass";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-clay text-cream hover:bg-clay-600 active:bg-clay-700 shadow-sm",
  secondary:
    "bg-charcoal text-cream hover:bg-charcoal-600 active:bg-charcoal-700",
  outline:
    "border-2 border-clay text-clay hover:bg-clay hover:text-cream",
  ghost: "text-charcoal hover:bg-clay-50",
  danger: "bg-busy text-cream hover:bg-red-700",
  brass: "bg-brass text-cream hover:bg-brass-500",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-5 py-2.5 text-base rounded-lg",
  lg: "px-7 py-3.5 text-lg rounded-xl",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

type ButtonProps = CommonProps & ComponentProps<"button">;

export function Button({
  variant = "primary",
  size = "md",
  className,
  fullWidth,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={classNames(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

interface LinkButtonProps extends CommonProps {
  href: string;
  external?: boolean;
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  fullWidth,
  href,
  external,
  children,
}: LinkButtonProps) {
  const cls = classNames(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
