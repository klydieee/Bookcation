import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

// Reveals children once when scrolled into view. Used only for grouped,
// staggered content (never on every section) to stay within 03 §6.
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduce]);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className ?? ""}`}
      data-shown={shown}
      style={{ transitionDelay: shown && !reduce ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  );
}
