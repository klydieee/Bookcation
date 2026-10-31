import { clsx } from "clsx";

interface Segment<T extends string> {
  value: T;
  label: string;
}

// Pill segmented control with a sliding highlight. The indicator is a single
// absolutely-positioned element translated to the active segment, so it glides
// between options (disabled under reduced motion via the global rules).
export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  className,
}: {
  segments: Segment<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  const index = Math.max(
    0,
    segments.findIndex((s) => s.value === value),
  );
  const pct = 100 / segments.length;

  return (
    <div
      className={clsx(
        "relative inline-flex rounded-[var(--radius-pill)] border border-[var(--color-line)] bg-[var(--color-sunken)] p-1",
        className,
      )}
      role="tablist"
    >
      <span
        aria-hidden
        className="absolute inset-y-1 rounded-[var(--radius-pill)] bg-[var(--color-surface)] shadow-1 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-quint)]"
        style={{
          width: `calc(${pct}% - 4px)`,
          transform: `translateX(calc(${index * 100}% + ${index * 4}px))`,
          left: 4,
        }}
      />
      {segments.map((s) => (
        <button
          key={s.value}
          role="tab"
          aria-selected={s.value === value}
          onClick={() => onChange(s.value)}
          className={clsx(
            "press relative z-10 rounded-[var(--radius-pill)] px-4 py-1.5 text-[0.875rem] font-semibold transition-colors duration-[var(--dur-fast)]",
            s.value === value
              ? "text-[var(--color-primary-ink)]"
              : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
          )}
          style={{ flex: `1 0 ${pct}%` }}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
