import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { CateringOption, CateringQuote } from "@/lib/types";
import { Input, Label } from "@/components/ui/Field";
import { PageHeader } from "@/components/PageHeader";
import { QuoteTicket } from "@/components/tickets/QuoteTicket";
import { useAddToPlan } from "@/store/useAddToPlan";

export function CateringPage() {
  const { add } = useAddToPlan();
  const [options, setOptions] = useState<CateringOption[]>([]);
  const [guests, setGuests] = useState(40);
  const [date, setDate] = useState(() =>
    new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
  );

  useEffect(() => {
    void api.listCateringOptions().then(setOptions);
  }, []);

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
        subtitle="Set a headcount and compare per-person quotes. Add the one that fits."
      />
      <div className="p-4 lg:p-8">
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
      </div>
    </div>
  );
}
