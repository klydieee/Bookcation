import { Link, useParams } from "react-router-dom";
import { CheckCircle, Lock } from "@phosphor-icons/react";
import { useTrips, planTotal } from "@/store/tripStore";
import { usePrefs } from "@/store/prefsStore";
import { money } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Field";

// Checkout is reached after checkout() already created the booking in the
// canvas, so this page is the confirmation + honesty copy (02 §9).
export function CheckoutPage() {
  const { tripId = "", planId = "" } = useParams();
  const trips = useTrips((s) => s.trips);
  const bookings = useTrips((s) => s.bookings);
  const currency = usePrefs((s) => s.currency);

  const trip = trips.find((t) => t.id === tripId);
  const plan = trip?.plans.find((p) => p.id === planId);
  const booking = bookings.find(
    (b) => b.tripName === trip?.name && b.planName === plan?.name,
  );

  if (!trip || !plan) {
    return (
      <div className="p-8">
        <p>Nothing to check out.</p>
        <Link to="/app/trips" className="text-[var(--color-primary-ink)]">
          Back to trips
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4 lg:p-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <CheckCircle
          size={56}
          weight="fill"
          className="text-[var(--color-success)]"
        />
        <h1 className="text-h1 mt-3">Demo booking created</h1>
        <p className="mt-1 text-[var(--color-ink-muted)]">
          This is a simulated booking. No airline, restaurant, or caterer has
          been contacted.
        </p>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-warning-tint)] px-3 py-2 text-[0.875rem] text-[var(--color-ink)]">
          <Lock size={16} weight="bold" className="text-[var(--color-warning)]" />
          Demo only. Do not enter a real card number.
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4 opacity-70">
          <div className="col-span-2">
            <Label htmlFor="card">Card number</Label>
            <Input id="card" placeholder="4242 4242 4242 4242" disabled />
          </div>
          <div>
            <Label htmlFor="exp">Expiry</Label>
            <Input id="exp" placeholder="12 / 30" disabled />
          </div>
          <div>
            <Label htmlFor="cvc">CVC</Label>
            <Input id="cvc" placeholder="123" disabled />
          </div>
        </div>

        <ul className="mb-4 flex flex-col gap-2 border-t border-[var(--color-line)] pt-4">
          {plan.items.map((it) => (
            <li key={it.id} className="flex justify-between text-[0.875rem]">
              <span className="truncate pr-3">{it.title}</span>
              <span className="tnum">{money(it.price, currency)}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-4">
          <span className="text-h4">Total</span>
          <span className="num-lg tnum">
            {money(planTotal(plan), currency)}
          </span>
        </div>

        {booking && (
          <p className="mt-3 text-[0.875rem] text-[var(--color-ink-muted)]">
            Reference <span className="font-bold tnum">{booking.reference}</span>
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <Link to="/app/bookings" className="flex-1">
            <Button className="w-full">View in bookings</Button>
          </Link>
          <Link to={`/app/trips/${trip.id}`}>
            <Button variant="ghost">Back to canvas</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
