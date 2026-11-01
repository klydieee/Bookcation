import { useState } from "react";
import { Link } from "react-router-dom";
import { QrCode, Ticket as TicketIcon, Trash } from "@phosphor-icons/react";
import { useTrips } from "@/store/tripStore";
import { usePrefs } from "@/store/prefsStore";
import { money, dateShort } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { DemoBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/PageHeader";

export function BookingsPage() {
  const bookings = useTrips((s) => s.bookings);
  const deleteBooking = useTrips((s) => s.deleteBooking);
  const currency = usePrefs((s) => s.currency);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="Your simulated trip records. Providers are not contacted."
      />
      <div className="p-4 lg:p-8">
        {bookings.length === 0 ? (
          <EmptyState
            icon={TicketIcon}
            title="No bookings yet"
            body="Book a plan from the trip canvas and it shows up here as a boarding pass."
            action={
              <Link to="/app/trips">
                <Button>Open trips</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {bookings.map((b) => (
              <article
                key={b.id}
                className="lift overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] shadow-3"
              >
                <div className="flex items-center justify-between bg-[var(--color-primary)] px-5 py-3 text-[var(--color-on-primary)]">
                  <div>
                    <div className="text-[0.75rem] opacity-80">
                      {b.tripName}
                    </div>
                    <div className="font-display text-[1.25rem] font-bold">
                      {b.planName}
                    </div>
                  </div>
                  <DemoBadge />
                </div>
                <div className="flex items-start gap-4 p-5">
                  <div className="flex-1">
                    <ul className="flex flex-col gap-1 text-[0.875rem]">
                      {b.items.map((it) => (
                        <li key={it.id} className="flex justify-between gap-3">
                          <span className="truncate">{it.title}</span>
                          <span className="tnum">
                            {it.kind === "place"
                              ? "Price on request"
                              : money(it.price, currency)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {b.items.some((item) => item.kind === "place") && (
                      <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
                        Nearby place requests are reminders only. Confirm directly with the business.
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-[var(--color-line-strong)] pt-2">
                      <span className="text-[0.875rem] text-[var(--color-ink-muted)]">
                        {dateShort(b.createdISO)} · Ref{" "}
                        <span className="tnum font-bold">{b.reference}</span>
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="num-md tnum">
                          {money(b.total, currency)}
                        </span>
                        {confirmDeleteId === b.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--color-ink-muted)]">
                              Remove this demo record?
                            </span>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => {
                                deleteBooking(b.id);
                                setConfirmDeleteId(null);
                              }}
                            >
                              Confirm
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
                            aria-label={`Undo booking ${b.reference}`}
                            onClick={() => setConfirmDeleteId(b.id)}
                          >
                            <Trash size={16} />
                            Undo booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 border-l border-dashed border-[var(--color-line-strong)] pl-4">
                    <QrCode size={64} weight="thin" />
                    <span className="text-[0.7rem] tnum text-[var(--color-ink-muted)]">
                      {b.reference}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
