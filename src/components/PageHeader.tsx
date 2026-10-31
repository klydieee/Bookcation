import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="border-b border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-5 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-h1">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-[var(--color-ink-muted)]">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  );
}
