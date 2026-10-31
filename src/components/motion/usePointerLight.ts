import { useCallback, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

// Tracks the pointer within an element and writes CSS custom properties the
// Fluent effects read: --mx/--my (px) and --mxp/--myp (%). Throttled to one
// update per animation frame. No-ops under reduced motion.
export function usePointerLight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const frame = useRef<number | null>(null);
  const reduce = usePrefersReducedMotion();

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<T>) => {
      if (reduce) return;
      const el = ref.current;
      if (!el) return;
      const x = e.clientX;
      const y = e.clientY;
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        const rect = el.getBoundingClientRect();
        const mx = x - rect.left;
        const my = y - rect.top;
        el.style.setProperty("--mx", `${mx}px`);
        el.style.setProperty("--my", `${my}px`);
        el.style.setProperty("--mxp", `${(mx / rect.width) * 100}%`);
        el.style.setProperty("--myp", `${(my / rect.height) * 100}%`);
      });
    },
    [reduce],
  );

  return { ref, onPointerMove };
}
