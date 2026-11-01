import { useState } from "react";
import { Car, CheckCircle, MapPin } from "@phosphor-icons/react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Field";
import { useAddToPlan } from "@/store/useAddToPlan";
import type { PlanItem } from "@/lib/types";

type RideProvider = "Grab" | "Uber";

interface RideSuggestion {
  label: string;
  from: string;
  to: string;
  timeISO: string;
  dayIndex: number;
}

function localDateAndTime(iso: string): [string, string] {
  const date = new Date(iso);
  const localISO = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  ).toISOString();
  return [localISO.slice(0, 10), localISO.slice(11, 16)];
}

function suggestionsFromPlan(items: PlanItem[], city: string): RideSuggestion[] {
  const hotel = items.find((item) => item.kind === "stay");
  return items.flatMap((item) => {
    if (item.kind === "reservation") {
      return [
        {
          label: `Ride to ${item.reservation.restaurantName}`,
          from: hotel?.kind === "stay" ? hotel.stay.hotelName : `${city} city center`,
          to: item.reservation.restaurantName,
          timeISO: new Date(
            new Date(item.reservation.timeISO).getTime() - 30 * 60000,
          ).toISOString(),
          dayIndex: item.dayIndex,
        },
      ];
    }
    if (item.kind === "flight") {
      return [
        {
          label: `Airport ride for ${item.offer.airline}`,
          from: `${item.offer.to.city} airport`,
          to:
            hotel?.kind === "stay"
              ? hotel.stay.hotelName
              : `${item.offer.to.city} city center`,
          timeISO: new Date(
            new Date(item.offer.arriveISO).getTime() + 45 * 60000,
          ).toISOString(),
          dayIndex: item.dayIndex,
        },
      ];
    }
    return [];
  });
}

export function RidesPage() {
  const { add, trip, plan } = useAddToPlan();
  const [provider, setProvider] = useState<RideProvider>("Grab");
  const [from, setFrom] = useState(
    trip ? `${trip.destinationCity} Airport` : "Airport",
  );
  const [to, setTo] = useState(
    trip ? `${trip.destinationCity} city center` : "Hotel or restaurant",
  );
  const [date, setDate] = useState(
    trip?.startDateISO.slice(0, 10) ??
      new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  );
  const [time, setTime] = useState("18:00");
  const [dayIndex, setDayIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const suggestions = suggestionsFromPlan(plan?.items ?? [], trip?.destinationCity ?? "Cebu City");

  function chooseSuggestion(suggestion: RideSuggestion) {
    const [suggestedDate, suggestedTime] = localDateAndTime(suggestion.timeISO);
    setFrom(suggestion.from);
    setTo(suggestion.to);
    setDate(suggestedDate);
    setTime(suggestedTime);
    setDayIndex(suggestion.dayIndex);
    setAdded(false);
  }

  function addRide() {
    if (!date || !time) return;
    const timeISO = new Date(`${date}T${time}`).toISOString();
    const estimate = provider === "Grab" ? 450 : 500;
    const success = add({
      kind: "ride",
      module: "trip",
      dayIndex,
      title: `${provider} · ${from} to ${to}`,
      price: estimate,
      ride: { provider, from, to, timeISO },
    });
    setAdded(success);
  }

  return (
    <div>
      <PageHeader
        title="Rides"
        subtitle="Schedule airport, hotel, and restaurant rides alongside your trip."
      />
      <div className="mx-auto max-w-3xl p-4 lg:p-8">
        <div className="mb-5 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 shadow-2">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-trip-tint)] text-[var(--color-trip-ink)]">
              <Car size={24} weight="duotone" />
            </span>
            <div>
              <h2 className="text-h2">Plan a ride</h2>
              <p className="text-[0.875rem] text-[var(--color-ink-muted)]">
                Choose Grab or Uber, then add a ride reminder to your trip.
              </p>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="mb-5 rounded-[var(--radius-sm)] bg-[var(--color-trip-tint)] p-4">
              <h3 className="text-h4">Suggested rides from your plan</h3>
              <p className="mt-1 text-[0.875rem] text-[var(--color-ink-muted)]">
                Pick a planned flight or restaurant to prefill a ride reminder. Review it before adding.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={`${suggestion.label}-${index}`}
                    size="sm"
                    variant="secondary"
                    onClick={() => chooseSuggestion(suggestion)}
                  >
                    {suggestion.label} · Day {suggestion.dayIndex + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ride-provider">Ride provider</Label>
              <Select
                id="ride-provider"
                value={provider}
                onChange={(event) => setProvider(event.target.value as RideProvider)}
              >
                <option value="Grab">Grab</option>
                <option value="Uber">Uber</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="ride-date">Date</Label>
              <Input
                id="ride-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ride-from">Pickup</Label>
              <Input
                id="ride-from"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ride-to">Drop-off</Label>
              <Input
                id="ride-to"
                value={to}
                onChange={(event) => setTo(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ride-time">Pickup time</Label>
              <Input
                id="ride-time"
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ride-day">Trip day</Label>
              <Select
                id="ride-day"
                value={dayIndex}
                onChange={(event) => setDayIndex(Number(event.target.value))}
              >
                {Array.from({ length: trip?.days ?? 1 }, (_, index) => (
                  <option key={index} value={index}>
                    Day {index + 1}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-line)] pt-4">
            <p className="text-[0.875rem] text-[var(--color-ink-muted)]">
              Sample estimate: ₱{provider === "Grab" ? "450" : "500"}. Confirm availability and fare in the provider app.
            </p>
            <Button onClick={addRide} disabled={!from.trim() || !to.trim()}>
              Add ride to plan
            </Button>
          </div>
          {added && (
            <p
              className="mt-4 flex items-center gap-2 text-[0.875rem] font-semibold text-[var(--color-success)]"
              role="status"
            >
              <CheckCircle size={18} weight="fill" />
              Ride reminder added to your trip plan.
            </p>
          )}
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
          <div className="flex items-center gap-2">
            <MapPin size={19} className="text-[var(--color-primary-ink)]" />
            <h2 className="text-h3">Ride provider options</h2>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <a
              className="rounded-[var(--radius-sm)] bg-[var(--color-canvas)] p-3 font-semibold hover:bg-[var(--color-sunken)]"
              href="https://www.grab.com/ph/transport/"
              target="_blank"
              rel="noreferrer"
            >
              Grab · availability varies by city
            </a>
            <a
              className="rounded-[var(--radius-sm)] bg-[var(--color-canvas)] p-3 font-semibold hover:bg-[var(--color-sunken)]"
              href="https://www.uber.com/global/en/ride/"
              target="_blank"
              rel="noreferrer"
            >
              Uber · availability varies by city
            </a>
          </div>
          <p className="mt-3 text-[0.75rem] text-[var(--color-ink-muted)]">
            This demo saves a ride reminder in Bookcation. It does not request or confirm a ride with either provider.
          </p>
        </div>
      </div>
    </div>
  );
}
