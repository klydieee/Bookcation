import { useState } from "react";
import { Warning, X } from "@phosphor-icons/react";

// 02_BRAND_AND_COPY §9: honesty copy wherever money or confirmation appears.
export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div
      role="status"
      className="enter-fade flex items-center gap-2 bg-[var(--color-warning-tint)] px-4 py-2 text-[0.875rem] text-[var(--color-warning)]"
    >
      <Warning size={18} weight="bold" className="shrink-0" />
      <span className="flex-1 text-[var(--color-ink)]">
        Demo mode: this app uses sample data. Bookings are simulated and nothing
        is charged.
      </span>
      <button
        aria-label="Dismiss demo notice"
        onClick={() => setDismissed(true)}
        className="rounded-[var(--radius-xs)] p-1 hover:bg-[var(--color-warning)]/10"
      >
        <X size={16} weight="bold" className="text-[var(--color-ink)]" />
      </button>
    </div>
  );
}
