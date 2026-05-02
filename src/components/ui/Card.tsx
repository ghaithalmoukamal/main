import { classNames } from "@/lib/utils";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
  hoverable,
}: {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}) {
  return (
    <div
      className={classNames(
        "bg-cream-50 border border-clay-100 rounded-xl shadow-sm",
        hoverable && "transition-shadow hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={classNames("p-5", className)}>{children}</div>;
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "px-5 py-4 border-b border-clay-100 font-semibold",
        className
      )}
    >
      {children}
    </div>
  );
}
