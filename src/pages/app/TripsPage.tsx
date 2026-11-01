import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Path, Plus, SuitcaseRolling, Trash } from "@phosphor-icons/react";
import { useTrips, activePlan, planTotal } from "@/store/tripStore";
import { usePrefs } from "@/store/prefsStore";
import { addDays, money, dateShort } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Field";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { TripRouteAnimation } from "@/components/TripRouteAnimation";
import { AIRPORTS } from "@/lib/mock-data";

export function TripsPage() {
  const trips = useTrips((s) => s.trips);
  const createTrip = useTrips((s) => s.createTrip);
  const deleteTrip = useTrips((s) => s.deleteTrip);
  const setActiveTrip = useTrips((s) => s.setActiveTrip);
  const currency = usePrefs((s) => s.currency);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [open, setOpen] = useState(params.get("start") === "1");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const cities = [...new Set(AIRPORTS.map((a) => a.city))];
  const [name, setName] = useState("My trip");
  const [city, setCity] = useState("");
  const [start, setStart] = useState(() =>
    new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  );
  const [days, setDays] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const endDate = start
    ? dateShort(
        addDays(
          new Date(`${start}T12:00:00`).toISOString(),
          Math.max(1, days),
        ),
      )
    : "";

  function submit() {
    if (!city || !start || days < 1 || travelers < 1) return;
    const id = createTrip({
      name,
      destinationCity: city,
      startDateISO: new Date(start).toISOString(),
      days,
      travelers,
    });
    setOpen(false);
    navigate(`/app/guide/${id}`);
  }

  return (
    <div>
      <PageHeader
        title="Trips"
        subtitle="Every trip keeps its plan versions. Open one to edit the canvas."
        action={
          <Button onClick={() => setOpen((o) => !o)}>
            <Plus size={18} weight="bold" />
            New trip
          </Button>
        }
      />
      <div className="p-4 lg:p-8">
        {open && (
          <Card className="enter-up mb-6 p-5">
            <TripRouteAnimation />
            <h2 className="text-h2 mb-2">Start a trip</h2>
            <p className="mb-4 text-[0.875rem] text-[var(--color-ink-muted)]">
              Bookcation will guide you through flights, stays, food, catering, and rides.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="tname">Trip name</Label>
                <Input
                  id="tname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tcity">Destination</Label>
                <Select
                  id="tcity"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Choose a destination</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="tstart">Start date</Label>
                <Input
                  id="tstart"
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tdays">Days</Label>
                <Input
                  id="tdays"
                  type="number"
                  min={1}
                  max={30}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="ttrav">Travelers</Label>
                <Input
                  id="ttrav"
                  type="number"
                  min={1}
                  max={40}
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                />
              </div>
            </div>
            <p className="mt-3 rounded-[var(--radius-sm)] bg-[var(--color-primary-tint)] px-3 py-2 text-sm text-[var(--color-primary-ink)]">
              Trip dates: {start ? dateShort(new Date(`${start}T12:00:00`).toISOString()) : "Choose a start date"} – {endDate}
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={submit}
                disabled={!city || !start || days < 1 || travelers < 1}
              >
                Create trip and plan
              </Button>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {trips.length === 0 && !open && (
          <EmptyState
            icon={Path}
            title="No trips yet"
            body="Start a trip to put flights, meals, and catering on one plan."
            action={<Button onClick={() => setOpen(true)}>Start a trip</Button>}
          />
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {trips.map((t) => {
            const plan = activePlan(t);
            return (
              <Card
                key={t.id}
                className="p-5"
              >
                <Link
                  to={`/app/trips/${t.id}`}
                  onClick={() => setActiveTrip(t.id)}
                  className="block rounded-[var(--radius-sm)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <SuitcaseRolling
                      size={22}
                      className="text-[var(--color-trip)]"
                    />
                    <h3 className="text-h3">{t.name}</h3>
                  </div>
                  <p className="text-[0.875rem] text-[var(--color-ink-muted)]">
                    {t.destinationCity} · {dateShort(t.startDateISO)} –{" "}
                    {dateShort(addDays(t.startDateISO, t.days))} ·{" "}
                    {t.days} days · {t.travelers} travelers
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[0.875rem] text-[var(--color-ink-muted)]">
                      {t.plans.length} plan{t.plans.length > 1 ? "s" : ""} ·{" "}
                      {plan?.items.length ?? 0} items
                    </span>
                    <span className="num-md tnum">
                      {money(plan ? planTotal(plan) : 0, currency)}
                    </span>
                  </div>
                </Link>
                <div className="mt-4 flex justify-end border-t border-[var(--color-line)] pt-3">
                  {confirmDeleteId === t.id ? (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="mr-auto text-xs text-[var(--color-ink-muted)]">
                        Delete this trip, its plans, and its demo booking records?
                      </p>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          deleteTrip(t.id);
                          setConfirmDeleteId(null);
                        }}
                      >
                        Confirm delete
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Delete trip ${t.name}`}
                      onClick={() => setConfirmDeleteId(t.id)}
                    >
                      <Trash size={16} />
                      Delete trip
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
