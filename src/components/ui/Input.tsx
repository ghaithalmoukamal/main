import { classNames } from "@/lib/utils";
import type {
  ComponentProps,
  ReactNode,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from "react";

interface FieldShellProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
}

function FieldShell({ label, hint, error, children }: FieldShellProps) {
  return (
    <label className="block w-full">
      {label && (
        <span className="block text-sm font-medium mb-1.5 text-charcoal-700">
          {label}
        </span>
      )}
      {children}
      {hint && !error && (
        <span className="block mt-1 text-xs text-charcoal-400">{hint}</span>
      )}
      {error && (
        <span className="block mt-1 text-xs text-busy">{error}</span>
      )}
    </label>
  );
}

const baseField =
  "w-full px-4 py-2.5 bg-white border border-clay-100 rounded-lg text-charcoal placeholder:text-charcoal-300 focus:border-brass focus:outline-none transition-colors";

interface InputProps
  extends ComponentProps<"input"> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

export function Input({ label, hint, error, className, ...rest }: InputProps) {
  return (
    <FieldShell label={label} hint={hint} error={error}>
      <input className={classNames(baseField, className)} {...rest} />
    </FieldShell>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

export function Textarea({
  label,
  hint,
  error,
  className,
  rows = 4,
  ...rest
}: TextareaProps) {
  return (
    <FieldShell label={label} hint={hint} error={error}>
      <textarea
        rows={rows}
        className={classNames(baseField, "resize-y", className)}
        {...rest}
      />
    </FieldShell>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
}

export function Select({
  label,
  hint,
  error,
  className,
  children,
  ...rest
}: SelectProps) {
  return (
    <FieldShell label={label} hint={hint} error={error}>
      <select className={classNames(baseField, className)} {...rest}>
        {children}
      </select>
    </FieldShell>
  );
}
