import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import type { CateringOption, CateringQuote } from "@/lib/types";
import { NearbyGuide } from "@/components/NearbyGuide";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { PageHeader } from "@/components/PageHeader";
import { QuoteTicket } from "@/components/tickets/QuoteTicket";
import { useAddToPlan } from "@/store/useAddToPlan";
import { useActivePlanContext } from "@/store/useActivePlan";

export function CateringPage() {
  const { add } = useAddToPlan();
  const { trip, plan } = useActivePlanContext();
  const city = trip?.destinationCity ?? "";
  const hasHotel = Boolean(plan?.items.some((item) => item.kind === "stay"));
  const [options, setOptions] = useState<CateringOption[]>([]);
  const [guests, setGuests] = useState(40);
  const [date, setDate] = useState(() =>
    new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
  );

  useEffect(() => {
    if (!city) {
      setOptions([]);
      return;
    }

    let active = true;
    void api.listCateringOptions(city).then((results) => {
      if (active) setOptions(results);
    });
    return () => {
      active = false;
    };
  }, [city]);

  const quotes: CateringQuote[] = options
    .filter((o) => guests >= o.minGuests)
    .map((o) => ({
      optionId: o.id,
      caterer: o.caterer,
      style: o.style,
      guests,
      perPerson: o.perPerson,
      total: o.perPerson * guests,
      dateISO: new Date(date).toISOString(),
    }))
    .sort((a, b) => a.total - b.total);

  return (
    <div>
      <PageHeader
        title="Catering"
        subtitle={
          city
            ? `Explore sample catering options and event venues for your ${city} trip.`
            : "Choose a trip destination or use your location to explore nearby services."
        }
      />
      <div className="p-4 lg:p-8">
        <NearbyGuide city={city} initialService="catering" />
        {city && (
          <section className="mb-6 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
            <h2 className="text-h3">Event venues around {city}</h2>
            <p className="mt-1 text-[0.875rem] text-[var(--color-ink-muted)]">
              Search Google Maps for current event halls, function rooms, and outdoor venues.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["event venues", "function halls", "conference centers"].map((term) => (
                <a
                  key={term}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${term} ${city}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[var(--radius-pill)] border border-[var(--color-line-strong)] px-3 py-1.5 text-[0.875rem] font-semibold hover:bg-[var(--color-sunken)]"
                >
                  {term}
                </a>
              ))}
            </div>
          </section>
        )}

        {!city ? (
          <p className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 text-[0.875rem] text-[var(--color-ink-muted)]">
            Catering samples are only shown for a selected trip destination. Use the map above for live local results.
          </p>
        ) : hasHotel ? (
          <section className="rounded-[var(--radius-md)] border border-[var(--color-warning)] bg-[var(--color-warning-tint)] p-5">
            <h2 className="text-h3">Catering is unavailable with a hotel stay</h2>
            <p className="mt-2 text-[0.875rem] text-[var(--color-ink-muted)]">
              Choose restaurant delivery or pickup for meals during your stay.
            </p>
            <Link to="/app/food" className="mt-4 inline-block">
              <Button>Browse delivery and pickup</Button>
            </Link>
          </section>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 shadow-2 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Label htmlFor="guests">
                  Headcount: <span className="tnum font-bold">{guests}</span>
                </Label>
                <input
                  id="guests"
                  type="range"
                  min={2}
                  max={200}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full accent-[var(--color-catering)]"
                />
              </div>
              <div className="sm:w-48">
                <Label htmlFor="cdate">Date</Label>
                <Input
                  id="cdate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4">
              {quotes.map((q) => (
                <QuoteTicket
                  key={q.optionId}
                  quote={q}
                  onAdd={() =>
                    add({
                      kind: "catering",
                      module: "catering",
                      dayIndex: 0,
                      title: `${q.caterer} · ${q.style} for ${q.guests}`,
                      price: q.total,
                      quote: q,
                    })
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
