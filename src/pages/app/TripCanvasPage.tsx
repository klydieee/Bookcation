import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AirplaneTilt,
  Bed,
  CookingPot,
  ForkKnife,
  GitDiff,
  GitFork,
  Trash,
  Warning,
} from "@phosphor-icons/react";
import {
  activePlan,
  detectConflicts,
  diffPlans,
  planTotal,
  useTrips,
} from "@/store/tripStore";
import type { Plan, PlanItem, ModuleId } from "@/lib/types";
import { usePrefs } from "@/store/prefsStore";
import { money } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { CountUp } from "@/components/motion/CountUp";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

const moduleIcon: Record<ModuleId, typeof AirplaneTilt> = {
  flight: AirplaneTilt,
  food: ForkKnife,
  catering: CookingPot,
  stay: Bed,
  trip: AirplaneTilt,
};

export function TripCanvasPage() {
  const { tripId = "" } = useParams();
  const navigate = useNavigate();
  const trips = useTrips((s) => s.trips);
  const setActiveTrip = useTrips((s) => s.setActiveTrip);
  const setActivePlan = useTrips((s) => s.setActivePlan);
  const forkPlan = useTrips((s) => s.forkPlan);
  const removeItem = useTrips((s) => s.removeItem);
  const moveItem = useTrips((s) => s.moveItem);
  const checkout = useTrips((s) => s.checkout);
  const currency = usePrefs((s) => s.currency);

  const [compareOpen, setCompareOpen] = useState(false);

  const trip = trips.find((t) => t.id === tripId) ?? null;

  useEffect(() => {
    if (trip) setActiveTrip(trip.id);
  }, [trip, setActiveTrip]);

  const plan = useMemo(() => (trip ? activePlan(trip) : undefined), [trip]);
  const conflicts = plan ? detectConflicts(plan) : [];

  if (!trip) {
    return (
      <div className="p-8">
        <EmptyState
          icon={AirplaneTilt}
          title="Trip not found"
          body="This trip may have been reset. Head back to your trips."
          action={
            <Link to="/app/trips">
              <Button>Back to trips</Button>
            </Link>
          }
        />
      </div>
    );
  }
  if (!plan) return null;

  function book() {
    const id = checkout(trip!.id, plan!.id);
    if (id) navigate(`/app/checkout/${trip!.id}/${plan!.id}`);
  }

  return (
    <div>
      <PageHeader
        title={trip.name}
        subtitle={`${trip.destinationCity} · ${trip.days} days · ${trip.travelers} travelers`}
        action={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => forkPlan(trip.id, plan.id)}
            >
              <GitFork size={16} weight="bold" />
              Fork plan
            </Button>
            {trip.plans.length > 1 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCompareOpen((o) => !o)}
              >
                <GitDiff size={16} weight="bold" />
                Compare plans
              </Button>
            )}
          </div>
        }
      />

      <div className="p-4 lg:p-8">
        {/* Plan tabs — sliding segmented control */}
        {trip.plans.length > 1 ? (
          <div className="mb-4">
            <SegmentedControl
              segments={trip.plans.map((p) => ({ value: p.id, label: p.name }))}
              value={plan.id}
              onChange={(id) => setActivePlan(trip.id, id)}
            />
          </div>
        ) : (
          <div className="mb-4">
            <span className="rounded-[var(--radius-pill)] bg-[var(--color-trip)] px-4 py-1.5 text-[0.875rem] font-semibold text-[var(--color-on-accent)]">
              {plan.name}
            </span>
          </div>
        )}

        {compareOpen && trip.plans.length > 1 && (
          <ComparePanel plan={plan} plans={trip.plans} />
        )}

        {/* Conflicts */}
        {conflicts.map((c) => (
          <div
            key={c.itemId}
            className="enter-up mb-3 flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--color-warning)] bg-[var(--color-warning-tint)] px-4 py-3"
          >
            <Warning
              size={20}
              weight="bold"
              className="mt-0.5 shrink-0 text-[var(--color-warning)]"
            />
            <div className="text-[0.875rem]">
              <div className="font-semibold text-[var(--color-ink)]">
                {c.message}
              </div>
              <div className="text-[var(--color-ink-muted)]">{c.fix}</div>
            </div>
          </div>
        ))}

        {plan.items.length === 0 ? (
          <EmptyState
            icon={AirplaneTilt}
            title="This plan is empty"
            body="Add flights, meals, and catering from their pages. They land on a day here."
            action={
              <Link to="/app/flights">
                <Button>Search flights</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4">
            {Array.from({ length: trip.days }).map((_, day) => {
              const dayItems = plan.items.filter((i) => i.dayIndex === day);
              return (
                <div
                  key={day}
                  className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-trip-tint)] text-[0.875rem] font-bold text-[var(--color-trip-ink)]">
                      {day + 1}
                    </span>
                    <h3 className="text-h4">Day {day + 1}</h3>
                    {/* dotted route motif */}
                    <div className="flex-1 border-t-2 border-dashed border-[var(--color-line)]" />
                  </div>
                  {dayItems.length === 0 ? (
                    <p className="text-[0.875rem] text-[var(--color-ink-muted)]">
                      Nothing scheduled.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {dayItems.map((item) => (
                        <CanvasItemRow
                          key={item.id}
                          item={item}
                          days={trip.days}
                          currency={currency}
                          onMove={(d) =>
                            moveItem(trip.id, plan.id, item.id, d)
                          }
                          onRemove={() =>
                            removeItem(trip.id, plan.id, item.id)
                          }
                        />
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky review bar */}
      <div className="sticky bottom-0 z-10 border-t border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[0.75rem] text-[var(--color-ink-muted)]">
              {plan.name} total
            </div>
            <CountUp
              className="num-lg tnum block"
              value={planTotal(plan)}
              format={(n) => money(n, currency)}
            />
          </div>
          <Button onClick={book} disabled={plan.items.length === 0}>
            Review and book
          </Button>
        </div>
      </div>
    </div>
  );
}

function CanvasItemRow({
  item,
  days,
  currency,
  onMove,
  onRemove,
}: {
  item: PlanItem;
  days: number;
  currency: ReturnType<typeof usePrefs.getState>["currency"];
  onMove: (day: number) => void;
  onRemove: () => void;
}) {
  const IconCmp = moduleIcon[item.module];
  return (
    <li className="hover-tint enter-up flex items-center gap-3 rounded-[var(--radius-sm)] bg-[var(--color-canvas)] p-3 hover:bg-[var(--color-sunken)]">
      <span
        className="h-8 w-1 shrink-0 rounded-full"
        style={{ background: `var(--color-${item.module})` }}
      />
      <IconCmp
        size={20}
        className="shrink-0"
        style={{ color: `var(--color-${item.module})` }}
      />
      <span className="min-w-0 flex-1 truncate">{item.title}</span>
      <span className="num-md tnum">{money(item.price, currency)}</span>
      <label className="sr-only" htmlFor={`move-${item.id}`}>
        Move {item.title} to day
      </label>
      <Select
        id={`move-${item.id}`}
        className="h-9 w-auto"
        value={item.dayIndex}
        onChange={(e) => onMove(Number(e.target.value))}
      >
        {Array.from({ length: days }).map((_, d) => (
          <option key={d} value={d}>
            Day {d + 1}
          </option>
        ))}
      </Select>
      <button
        aria-label={`Remove ${item.title}`}
        onClick={onRemove}
        className="rounded-[var(--radius-sm)] p-2 text-[var(--color-ink-muted)] hover:bg-[var(--color-sunken)] hover:text-[var(--color-error)]"
      >
        <Trash size={18} />
      </button>
    </li>
  );
}

function ComparePanel({ plan, plans }: { plan: Plan; plans: Plan[] }) {
  const currency = usePrefs((s) => s.currency);
  const other = plans.find((p) => p.id !== plan.id) ?? plans[0];
  const [otherId, setOtherId] = useState(other.id);
  const setActivePlan = useTrips((s) => s.setActivePlan);
  const b = plans.find((p) => p.id === otherId) ?? other;
  const diff = diffPlans(plan, b);
  const tripId = useTrips((s) => s.activeTripId)!;

  return (
    <div className="enter-up mb-6 rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 shadow-3">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h3 className="text-h3">Compare</h3>
        <span className="text-[var(--color-ink-muted)]">{plan.name} vs</span>
        <Select
          className="h-9 w-auto"
          value={otherId}
          onChange={(e) => setOtherId(e.target.value)}
        >
          {plans
            .filter((p) => p.id !== plan.id)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-[0.875rem] font-semibold text-[var(--color-success)]">
            Added in {b.name}
          </div>
          {diff.added.length === 0 ? (
            <p className="text-[0.875rem] text-[var(--color-ink-muted)]">
              Nothing added.
            </p>
          ) : (
            <ul className="text-[0.875rem]">
              {diff.added.map((it) => (
                <li key={it.id} className="flex justify-between py-0.5">
                  <span className="truncate">{it.title}</span>
                  <span className="tnum">{money(it.price, currency)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <div className="mb-1 text-[0.875rem] font-semibold text-[var(--color-error)]">
            Removed from {plan.name}
          </div>
          {diff.removed.length === 0 ? (
            <p className="text-[0.875rem] text-[var(--color-ink-muted)]">
              Nothing removed.
            </p>
          ) : (
            <ul className="text-[0.875rem]">
              {diff.removed.map((it) => (
                <li key={it.id} className="flex justify-between py-0.5">
                  <span className="truncate">{it.title}</span>
                  <span className="tnum">{money(it.price, currency)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-line)] pt-3">
        <div className="text-[0.875rem] text-[var(--color-ink-muted)]">
          Cost difference
        </div>
        <div className="num-md tnum">
          {diff.costDelta >= 0 ? "+" : "−"}
          {money(Math.abs(diff.costDelta), currency)}
        </div>
      </div>

      <Button
        size="sm"
        className="mt-3"
        onClick={() => setActivePlan(tripId, b.id)}
      >
        Make {b.name} the plan
      </Button>
    </div>
  );
}
