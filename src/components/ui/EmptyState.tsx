import type { Icon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: IconCmp,
  title,
  body,
  action,
}: {
  icon: Icon;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
      <IconCmp size={48} weight="duotone" className="text-[var(--color-ink-muted)]" />
      <h3 className="text-h3">{title}</h3>
      <p className="text-[var(--color-ink-muted)]">{body}</p>
      {action}
    </div>
  );
}
