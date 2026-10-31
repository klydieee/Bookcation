import { clsx } from "clsx";
import type { ModuleId } from "@/lib/types";
import type { ReactNode } from "react";

const moduleStyles: Record<ModuleId, string> = {
  flight:
    "bg-[var(--color-flight-tint)] text-[var(--color-flight-ink)]",
  food: "bg-[var(--color-food-tint)] text-[var(--color-food-ink)]",
  catering:
    "bg-[var(--color-catering-tint)] text-[var(--color-catering-ink)]",
  stay: "bg-[var(--color-stay-tint)] text-[var(--color-stay-ink)]",
  trip: "bg-[var(--color-trip-tint)] text-[var(--color-trip-ink)]",
};

export function ModuleBadge({
  module,
  children,
}: {
  module: ModuleId;
  children: ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-[var(--radius-xs)] px-2 py-0.5 text-[0.75rem] font-semibold",
        moduleStyles[module],
      )}
    >
      {children}
    </span>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center rounded-[var(--radius-xs)] border border-[var(--color-line-strong)] px-1.5 py-0.5 text-[0.7rem] font-semibold text-[var(--color-ink-muted)]">
      Demo
    </span>
  );
}
