import { AirplaneTilt } from "@phosphor-icons/react";
import type { FlightOffer } from "@/lib/types";
import { Ticket } from "@/components/ui/Ticket";
import { ModuleBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { money, timeOf, duration } from "@/lib/format";
import { usePrefs } from "@/store/prefsStore";

export function FlightTicket({
  offer,
  onAdd,
  selected,
}: {
  offer: FlightOffer;
  onAdd?: () => void;
  selected?: boolean;
}) {
  const currency = usePrefs((s) => s.currency);
  const stops =
    offer.stops === 0
      ? "Nonstop"
      : `${offer.stops} stop${offer.stops > 1 ? "s" : ""}`;

  return (
    <Ticket
      module="flight"
      selected={selected}
      body={
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <ModuleBadge module="flight">
              <AirplaneTilt size={14} weight="bold" />
              {offer.airline}
            </ModuleBadge>
            <span className="text-[0.875rem] text-[var(--color-ink-muted)]">
              {offer.airlineCode} {offer.id.slice(-3)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <div className="num-md tnum">{timeOf(offer.departISO)}</div>
              <div className="text-[0.875rem] text-[var(--color-ink-muted)]">
                {offer.from.code}
              </div>
            </div>
            <div className="flex-1 border-t-[1.5px] border-dashed border-[var(--color-line-strong)]" />
            <AirplaneTilt
              size={18}
              weight="fill"
              className="text-[var(--color-flight)]"
            />
            <div className="flex-1 border-t-[1.5px] border-dashed border-[var(--color-line-strong)]" />
            <div className="text-right">
              <div className="num-md tnum">{timeOf(offer.arriveISO)}</div>
              <div className="text-[0.875rem] text-[var(--color-ink-muted)]">
                {offer.to.code}
              </div>
            </div>
          </div>
          <div className="text-[0.875rem] text-[var(--color-ink-muted)]">
            {duration(offer.durationMin)} · {stops} · {offer.cabin}
          </div>
        </div>
      }
      stub={
        <>
          <div>
            <div className="num-lg tnum">{money(offer.price, currency)}</div>
            <div className="text-[0.75rem] text-[var(--color-ink-muted)]">
              {offer.tripType}
            </div>
          </div>
          {onAdd && (
            <Button size="sm" onClick={onAdd}>
              Add to plan
            </Button>
          )}
        </>
      }
    />
  );
}
