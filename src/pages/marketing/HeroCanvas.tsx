import { useState } from "react";
import {
  AirplaneTilt,
  Bed,
  Car,
  CookingPot,
  ForkKnife,
  GitFork,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/motion/CountUp";
import { usePrefersReducedMotion } from "@/lib/motion";

// A self-contained live sample plan that forks into Plan A / Plan B and
// updates the total. Illustrative prices only (02 §5.2 caption).
const BASE = [
  { icon: AirplaneTilt, color: "flight", label: "JFK to LIS · Skyloom Air", price: 438 },
  { icon: Bed, color: "stay", label: "Lisbon Harbor Hotel · 4 nights", price: 720 },
  { icon: ForkKnife, color: "food", label: "Casa do Mar · table for 2", price: 0 },
  { icon: CookingPot, color: "catering", label: "Table & Co · boxed for 12", price: 360 },
  { icon: Car, color: "trip", label: "Airport ride · Lisbon", price: 38 },
];

export function HeroCanvas() {
  const [forked, setForked] = useState(false);
  const reduce = usePrefersReducedMotion();
  // Plan B swaps the flight for a cheaper one.
  const planB = [
    { ...BASE[0], label: "JFK to LIS · Harbor Jet", price: 352 },
    { ...BASE[1], label: "Alfama House · 4 nights", price: 640 },
    BASE[2],
    BASE[3],
    { ...BASE[4], label: "Airport ride · Lisbon", price: 32 },
  ];
  const totalA = BASE.reduce((s, i) => s + i.price, 0);
  const totalB = planB.reduce((s, i) => s + i.price, 0);
  const items = forked ? planB : BASE;

  return (
    <div className="relative rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-3 shadow-3 sm:p-4">
      {/* decorative route arc drawn once on load */}
      <svg
        aria-hidden
        viewBox="0 0 400 60"
        className="pointer-events-none absolute inset-x-6 top-14 -z-0 h-10 opacity-40"
      >
        <path
          className="route-draw"
          d="M10 50 C 120 10, 280 10, 390 46"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="0.1 9"
        />
      </svg>

      <div className="relative mb-3 flex items-center gap-2">
        <button className="rounded-[var(--radius-pill)] bg-[var(--color-trip)] px-3 py-1 text-[0.8rem] font-semibold text-[var(--color-on-accent)]">
          Plan A
        </button>
        {forked && (
          <button className="enter-up rounded-[var(--radius-pill)] bg-[var(--color-sunken)] px-3 py-1 text-[0.8rem] font-semibold">
            Plan B
          </button>
        )}
        <div className="ml-auto text-right">
          <div className="text-[0.7rem] text-[var(--color-ink-muted)]">
            Total
          </div>
          <CountUp
            className="num-md tnum block"
            value={forked ? totalB : totalA}
            format={(n) => `$${Math.round(n)}`}
          />
        </div>
      </div>

      <div className="relative grid gap-2">
        {items.map((item, i) => {
          const IconCmp = item.icon;
          return (
            <div
              key={item.color}
              className="lift hero-ticket flex min-w-0 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-canvas)] p-2.5 sm:gap-3 sm:p-3"
              style={
                reduce ? undefined : { animationDelay: `${300 + i * 110}ms` }
              }
            >
              <span
                className="h-8 w-1 rounded-full"
                style={{ background: `var(--color-${item.color})` }}
              />
              <IconCmp
                size={20}
                style={{ color: `var(--color-${item.color})` }}
              />
              <span className="min-w-0 flex-1 text-[0.8rem] sm:text-[0.9rem]">{item.label}</span>
              <span className="num-md tnum text-[0.9rem] sm:text-[1rem]">${item.price}</span>
            </div>
          );
        })}
      </div>

      <div className="relative mt-3 flex items-center justify-between">
        <span className="text-[0.75rem] text-[var(--color-ink-muted)]">
          Sample trip. Prices are illustrative.
        </span>
        <Button
          size="sm"
          variant={forked ? "secondary" : "primary"}
          onClick={() => setForked((f) => !f)}
        >
          <GitFork size={16} weight="bold" />
          {forked ? "Reset" : "Fork plan"}
        </Button>
      </div>
    </div>
  );
}
