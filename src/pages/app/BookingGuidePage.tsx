import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  AirplaneTilt,
  Bed,
  Car,
  CheckCircle,
  CookingPot,
  ForkKnife,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { NearbyGuide } from "@/components/NearbyGuide";
import { PageHeader } from "@/components/PageHeader";
import { TripRouteAnimation } from "@/components/TripRouteAnimation";
import { Button } from "@/components/ui/Button";
import { activePlan, useTrips } from "@/store/tripStore";

const STEPS: {
  key: string;
  title: string;
  question: string;
  description: string;
  path: string;
  icon: Icon;
}[] = [
  {
    key: "flight",
    title: "Flights",
    question: "Do you need a flight?",
    description: "Compare Cebu Pacific, Philippine Airlines, and other carriers.",
    path: "/app/flights",
    icon: AirplaneTilt,
  },
  {
    key: "stay",
    title: "Hotels",
    question: "Would you like to book a hotel?",
    description: "Find a stay in your destination and dates.",
    path: "/app/hotels",
    icon: Bed,
  },
  {
    key: "food",
    title: "Restaurants",
    question: "Would you like to plan a restaurant meal?",
    description: "See destination-based restaurant ideas for dine-in, pickup, or delivery.",
    path: "/app/food",
    icon: ForkKnife,
  },
  {
    key: "catering",
    title: "Catering",
    question: "Do you need catering for a group or event?",
    description: "Compare sample caterers and event venue searches in your destination.",
    path: "/app/catering",
    icon: CookingPot,
  },
  {
    key: "ride",
    title: "Rides",
    question: "Would you like to schedule a ride?",
    description: "Add a Grab or Uber ride to your trip plan.",
    path: "/app/rides",
    icon: Car,
  },
];

function guideUrl(tripId: string, step: number) {
  return `/app/guide/${tripId}?step=${step}`;
}

export function GuideContinueBanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tripId = params.get("guide");
  const step = Number(params.get("step"));

  if (!tripId || !Number.isInteger(step) || step < 0 || step >= STEPS.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-line)] bg-[var(--color-primary-tint)] px-4 py-3 lg:px-8">
      <p className="text-[0.875rem] font-semibold text-[var(--color-primary-ink)]">
        {STEPS[step].title} · Choose what you need, then continue your trip plan.
      </p>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => navigate(guideUrl(tripId, step + 1))}
      >
        Continue trip guide
      </Button>
    </div>
  );
}

export function BookingGuidePage() {
  const { tripId = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const trips = useTrips((state) => state.trips);
  const trip = trips.find((candidate) => candidate.id === tripId);
  const step = Math.max(
    0,
    Math.min(STEPS.length, Number(params.get("step")) || 0),
  );
  const plan = trip ? activePlan(trip) : undefined;
  const hasHotel = Boolean(plan?.items.some((item) => item.kind === "stay"));

  function continueTo(nextStep: number) {
    setParams({ step: String(nextStep) });
  }

  if (!trip) {
    return (
      <div className="p-8">
        <h1 className="text-h1">Trip not found</h1>
        <Link to="/app/trips" className="mt-4 inline-block">
          <Button>Back to trips</Button>
        </Link>
      </div>
    );
  }

  const current = STEPS[step];
  const StepIcon = current?.icon;

  return (
    <div>
      <PageHeader
        title={`Plan ${trip.name}`}
        subtitle={`${trip.destinationCity} · ${trip.days} days · ${trip.travelers} travelers`}
      />
      <div className="mx-auto max-w-4xl p-4 lg:p-8">
        <TripRouteAnimation />

        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.875rem] font-semibold text-[var(--color-primary-ink)]">
              Guided trip plan
            </p>
            <p className="text-[0.875rem] text-[var(--color-ink-muted)]">
              {step < STEPS.length
                ? `Step ${step + 1} of ${STEPS.length}`
                : "Your plan is ready"}
            </p>
          </div>
          <Link to={`/app/trips/${trip.id}`}>
            <Button size="sm" variant="ghost">
              Open trip canvas
            </Button>
          </Link>
        </div>
        <div
          className="mb-6 h-2 overflow-hidden rounded-full bg-[var(--color-sunken)]"
          role="progressbar"
          aria-label="Trip planning progress"
          aria-valuemin={0}
          aria-valuemax={STEPS.length}
          aria-valuenow={step}
        >
          <div
            className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-300"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
          />
        </div>

        {current ? (
          <section className="mb-6 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 shadow-2 sm:p-7">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-primary-tint)] text-[var(--color-primary-ink)]">
                <StepIcon size={24} weight="duotone" />
              </span>
              <div>
                <h1 className="text-h2">{current.question}</h1>
                <p className="mt-1 text-[0.875rem] text-[var(--color-ink-muted)]">
                  {current.description}
                </p>
              </div>
            </div>

            {current.key === "catering" && hasHotel ? (
              <div className="rounded-[var(--radius-sm)] bg-[var(--color-warning-tint)] p-4">
                <p className="font-semibold">
                  Catering is unavailable for this hotel stay.
                </p>
                <p className="mt-1 text-[0.875rem] text-[var(--color-ink-muted)]">
                  Plan meals with restaurant delivery or pickup instead.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link to={`/app/food?guide=${trip.id}&step=${step}`}>
                    <Button size="sm" variant="secondary">
                      Browse food options
                    </Button>
                  </Link>
                  <Button size="sm" onClick={() => continueTo(step + 1)}>
                    Skip to rides
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to={`${current.path}?guide=${trip.id}&step=${step}`}>
                  <Button>
                    Yes, choose {current.title.toLowerCase()}
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  onClick={() => continueTo(step + 1)}
                >
                  No, continue
                </Button>
              </div>
            )}
          </section>
        ) : (
          <section className="mb-6 rounded-[var(--radius-md)] border border-[var(--color-success)] bg-[var(--color-surface)] p-6 text-center shadow-2">
            <CheckCircle
              size={46}
              weight="fill"
              className="mx-auto text-[var(--color-success)]"
            />
            <h1 className="text-h2 mt-3">Your trip draft is ready</h1>
            <p className="mt-2 text-[var(--color-ink-muted)]">
              Review your plan, move items between days, and continue to the demo checkout when you are ready.
            </p>
            <Link to={`/app/trips/${trip.id}`} className="mt-5 inline-block">
              <Button>Review trip plan</Button>
            </Link>
          </section>
        )}

        <NearbyGuide city={trip.destinationCity} initialService="restaurants" />
        <p className="text-[0.75rem] text-[var(--color-ink-muted)]">
          Sample prices and options are for planning only. Bookcation does not place live bookings.
        </p>
      </div>
    </div>
  );
}
