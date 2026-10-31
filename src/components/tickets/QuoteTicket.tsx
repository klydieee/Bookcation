import { CookingPot } from "@phosphor-icons/react";
import type { CateringQuote } from "@/lib/types";
import { Ticket } from "@/components/ui/Ticket";
import { ModuleBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { money } from "@/lib/format";
import { usePrefs } from "@/store/prefsStore";
import { CountUp } from "@/components/motion/CountUp";

export function QuoteTicket({
  quote,
  onAdd,
  selected,
}: {
  quote: CateringQuote;
  onAdd?: () => void;
  selected?: boolean;
}) {
  const currency = usePrefs((s) => s.currency);
  return (
    <Ticket
      module="catering"
      selected={selected}
      body={
        <div className="flex flex-col gap-2">
          <ModuleBadge module="catering">
            <CookingPot size={14} weight="bold" />
            {quote.caterer}
          </ModuleBadge>
          <div className="text-h3">{quote.style}</div>
          {/* receipt feel: itemized lines on dashed rules */}
          <dl className="text-[0.875rem]">
            <div className="flex justify-between border-b border-dashed border-[var(--color-line)] py-1">
              <dt className="text-[var(--color-ink-muted)]">Guests</dt>
              <dd className="tnum">{quote.guests}</dd>
            </div>
            <div className="flex justify-between border-b border-dashed border-[var(--color-line)] py-1">
              <dt className="text-[var(--color-ink-muted)]">Per person</dt>
              <dd className="tnum">{money(quote.perPerson, currency)}</dd>
            </div>
          </dl>
        </div>
      }
      stub={
        <>
          <div>
            <CountUp
              className="num-lg tnum block"
              value={quote.total}
              format={(n) => money(n, currency)}
            />
            <div className="text-[0.75rem] text-[var(--color-ink-muted)]">
              total
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
