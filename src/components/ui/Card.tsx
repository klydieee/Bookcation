import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ className, interactive, ...rest }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] shadow-2",
        interactive && "lift cursor-pointer",
        className,
      )}
      {...rest}
    />
  );
}
