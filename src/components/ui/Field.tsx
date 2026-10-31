import { clsx } from "clsx";
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  ReactNode,
} from "react";

const controlBase =
  "w-full h-11 rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-[var(--color-surface)] px-3 text-base text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]";

export function Label({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-[0.875rem] font-semibold text-[var(--color-ink-muted)]"
    >
      {children}
    </label>
  );
}

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(controlBase, className)} {...rest} />;
}

export function Select({
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={clsx(controlBase, className)} {...rest}>
      {children}
    </select>
  );
}
