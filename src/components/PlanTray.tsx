import { Link } from "react-router-dom";
import {
  AirplaneTilt,
  Bed,
  Car,
  CookingPot,
  ForkKnife,
  Warning,
} from "@phosphor-icons/react";
import { useActivePlanContext } from "@/store/useActivePlan";
import { detectConflicts, planTotal } from "@/store/tripStore";
import { usePrefs } from "@/store/prefsStore";
import { money } from "@/lib/format";
import { Button } from "./ui/Button";
import { CountUp } from "./motion/CountUp";

export function PlanTray() {
  const { trip, plan } = useActivePlanContext();
  const currency = usePrefs((s) => s.currency);

  if (!trip || !plan) {
    return (
      <aside className="hidden w-[290px] shrink-0 border-l border-[var(--color-line)] bg-[var(--color-surface)] p-5 xl:block">
        <h2 className="text-h2 mb-2">Plan tray</h2>
        <p className="text-[var(--color-ink-muted)]">
          Start a trip to save flights and nearby service requests here.
        </p>
        <Link to="/app/trips" className="mt-4 inline-block">
          <Button size="sm">Start a trip</Button>
        </Link>
      </aside>
    );
  }

  const counts = {
    flight: plan.items.filter((i) => i.kind === "flight").length,
    stay: plan.items.filter(
      (i) =>
        i.kind === "stay" ||
        (i.kind === "place" && i.placeBooking.service === "hotels"),
    ).length,
    food: plan.items.filter(
      (i) =>
        i.kind === "reservation" ||
        (i.kind === "place" && i.placeBooking.service === "restaurants"),
    ).length,
    catering: plan.items.filter(
      (i) =>
        i.kind === "catering" ||
        (i.kind === "place" && i.placeBooking.service === "catering"),
    ).length,
    rides: plan.items.filter(
      (i) =>
        i.kind === "ride" ||
        (i.kind === "place" && i.placeBooking.service === "rides"),
    ).length,
  };
  const conflicts = detectConflicts(plan);

  return (
    <aside className="hidden w-[290px] shrink-0 border-l border-[var(--color-line)] bg-[var(--color-surface)] p-5 xl:flex xl:flex-col">
      <div className="mb-1 text-[0.875rem] text-[var(--color-ink-muted)]">
        {trip.name}
      </div>
      <h2 className="text-h2 mb-4">{plan.name}</h2>

      <dl className="mb-4 flex gap-4 text-[0.875rem]">
        <div className="flex items-center gap-1">
          <AirplaneTilt size={18} className="text-[var(--color-flight)]" />
          <span className="tnum">{counts.flight}</span>
        </div>
        <div className="flex items-center gap-1">
          <Bed size={18} className="text-[var(--color-stay)]" />
          <span className="tnum">{counts.stay}</span>
        </div>
        <div className="flex items-center gap-1">
          <ForkKnife size={18} className="text-[var(--color-food)]" />
          <span className="tnum">{counts.food}</span>
        </div>
        <div className="flex items-center gap-1">
          <CookingPot size={18} className="text-[var(--color-catering)]" />
          <span className="tnum">{counts.catering}</span>
        </div>
        <div className="flex items-center gap-1">
          <Car size={18} className="text-[var(--color-trip)]" />
          <span className="tnum">{counts.rides}</span>
        </div>
      </dl>

      <div className="mb-1 text-[0.875rem] text-[var(--color-ink-muted)]">
        Total
      </div>
      <CountUp
        className="num-xl mb-4 tnum block"
        value={planTotal(plan)}
        format={(n) => money(n, currency)}
      />
      {plan.items.some((item) => item.kind === "place") && (
        <p className="mb-4 text-xs text-[var(--color-ink-muted)]">
          Place requests have no confirmed price; confirm availability directly.
        </p>
      )}

      {conflicts.length > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-warning-tint)] px-3 py-2 text-[0.875rem] text-[var(--color-ink)]">
          <Warning size={16} weight="bold" className="text-[var(--color-warning)]" />
          {conflicts.length} clash{conflicts.length > 1 ? "es" : ""}
        </div>
      )}

    </aside>
  );
}
