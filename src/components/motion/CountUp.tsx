import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

// Animates from the previous value to the next (03 §6: count to the new value
// in ~320ms). Reduced motion sets the value immediately. The visible number is
// aria-hidden while animating; a separate debounced live region announces only
// the final value, so screen readers don't hear every interpolated frame.
export function CountUp({
  value,
  durationMs = 320,
  format = (n) => String(Math.round(n)),
  className,
}: {
  value: number;
  durationMs?: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const [display, setDisplay] = useState(value);
  const [announced, setAnnounced] = useState(() => format(value));
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);
  const announceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Debounced final-value announcement (600ms per 03 §6).
    if (announceTimer.current) clearTimeout(announceTimer.current);
    announceTimer.current = setTimeout(() => setAnnounced(format(value)), 600);

    if (reduce) {
      setDisplay(value);
      fromRef.current = value;
      return;
    }
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 5); // easeOutQuint
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs, reduce]);

  useEffect(() => {
    return () => {
      if (announceTimer.current) clearTimeout(announceTimer.current);
    };
  }, []);

  return (
    <span className={className}>
      <span aria-hidden="true">{format(display)}</span>
      <span className="sr-only" aria-live="polite">
        {announced}
      </span>
    </span>
  );
}
