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
import { useEffect } from "react";
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
    description: "Compare route options for your destination and dates.",
    path: "/app/flights",
    icon: AirplaneTilt,
  },
  {
    key: "stay",
    title: "Hotels",
    question: "Would you like to book a hotel?",
    description: "Browse map-listed stays for your trip dates.",
    path: "/app/hotels",
    icon: Bed,
  },
  {
    key: "food",
    title: "Restaurants",
    question: "Would you like to plan a restaurant meal?",
    description: "Choose a nearby restaurant and add a table, pickup, or delivery request.",
    path: "/app/food",
    icon: ForkKnife,
  },
  {
    key: "catering",
    title: "Catering",
    question: "Do you need catering for a group or event?",
    description: "Find map-listed caterers and event places in your destination.",
    path: "/app/catering",
    icon: CookingPot,
  },
  {
    key: "ride",
    title: "Rides",
    question: "Would you like to schedule a ride?",
    description: "Prefill ride locations and times from your planned flights, hotels, and restaurant reservations.",
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
        onClick={() =>
          navigate(
            `${guideUrl(tripId, step + 1)}&status=skipped&service=${STEPS[step].key}`,
          )
        }
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
  const hasHotel = Boolean(
    plan?.items.some(
      (item) =>
        item.kind === "stay" ||
        (item.kind === "place" &&
          item.placeBooking.service === "hotels"),
    ),
  );
  const transitionStatus = params.get("status");
  const transitionService = params.get("service");
  const serviceLabels: Record<string, string> = {
    flight: "Flights",
    stay: "Hotels",
    food: "Restaurants",
    catering: "Catering",
    ride: "Rides",
  };

  useEffect(() => {
    if (
      (transitionStatus !== "added" && transitionStatus !== "skipped") ||
      !transitionService
    ) {
      return;
    }
    const timer = window.setTimeout(() => {
      setParams({ step: String(step) }, { replace: true });
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [setParams, step, transitionService, transitionStatus]);

  useEffect(() => {
    if (
      !hasHotel ||
      step !== 3 ||
      transitionStatus === "added" ||
      transitionStatus === "skipped"
    ) {
      return;
    }
    setParams(
      { step: String(step + 1), status: "skipped", service: "catering" },
      { replace: true },
    );
  }, [hasHotel, setParams, step, transitionStatus]);

  function continueTo(nextStep: number) {
    setParams({
      step: String(nextStep),
      status: "skipped",
      service: current?.key ?? "flight",
    });
  }

  function dismissTransition() {
    setParams({ step: String(step) }, { replace: true });
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
  const transitioning =
    (transitionStatus === "added" || transitionStatus === "skipped") &&
    Boolean(transitionService);

  return (
    <div>
      <PageHeader
        title={`Plan ${trip.name}`}
        subtitle={`${trip.destinationCity} · ${trip.days} days · ${trip.travelers} travelers`}
      />
      <div className="mx-auto max-w-4xl p-4 lg:p-8">
        {transitioning ? (
          <section
            className="enter-up mb-6 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 text-center shadow-2 sm:p-8"
            role="status"
            aria-live="polite"
          >
            <div className="mx-auto max-w-xl">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--color-primary-ink)]">
                {transitionStatus === "added" ? "Added to your trip" : "Step skipped"}
              </p>
              <h1 className="text-h2 mt-2">
                {transitionService && serviceLabels[transitionService]
                  ? `${serviceLabels[transitionService]} ${transitionStatus === "added" ? "saved" : "skipped"}`
                  : "Moving to the next step"}
              </h1>
              <p className="mt-2 text-[0.875rem] text-[var(--color-ink-muted)]">
                {transitionStatus === "added"
                  ? `${serviceLabels[transitionService ?? ""] ?? "This service"} is in ${plan?.name ?? "your trip plan"}.`
                  : transitionService === "catering" && hasHotel
                    ? "Catering is skipped when your plan includes a hotel. You can arrange restaurant pickup or delivery instead."
                    : transitionService === "ride"
                      ? "No ride reminder was added. Arrange transport separately or commute as planned."
                    : `No ${serviceLabels[transitionService ?? ""]?.toLowerCase() ?? "service"} was added.`}
                {current ? ` Next up: ${current.title}.` : " Your trip draft is ready."}
              </p>
              {transitionStatus === "added" && (
                <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
                  This is saved to your trip draft only; no provider has been contacted.
                </p>
              )}
              <div className="mt-5">
                <TripRouteAnimation />
              </div>
              <Button className="mt-3" onClick={dismissTransition}>
                {current ? `Continue to ${current.title}` : "Review your trip"}
              </Button>
              <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
                Continuing automatically…
              </p>
            </div>
          </section>
        ) : (
        <>
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
          className="mb-6 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-4 shadow-1 sm:px-5"
          role="group"
          aria-label="Trip planning progress"
        >
          <span
            className="sr-only"
            role="progressbar"
            aria-label="Trip planning steps completed"
            aria-valuemin={0}
            aria-valuemax={STEPS.length}
            aria-valuenow={step}
          />
          <div className="relative">
            <div className="absolute inset-x-[10%] top-[2.75rem] border-t-2 border-dashed border-[var(--color-line-strong)]" />
            <span
              className="trip-guide-plane absolute top-0 z-10 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary-tint)] text-[var(--color-primary-ink)] shadow-2"
              style={{ left: `${10 + Math.min(step, STEPS.length - 1) * 20}%` }}
              aria-hidden="true"
            >
              <AirplaneTilt size={17} weight="fill" />
            </span>
            <ol className="grid grid-cols-5">
              {STEPS.map((item, index) => {
                const Step = item.icon;
                const completed = index < step;
                const active = step < STEPS.length && index === step;
                return (
                  <li
                    key={item.key}
                    className="flex min-w-0 flex-col items-center pt-7 text-center"
                    aria-current={active ? "step" : undefined}
                  >
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full border ${
                        completed
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                          : active
                            ? "border-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-primary-ink)] ring-2 ring-[var(--color-primary-tint)]"
                            : "border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink-muted)]"
                      }`}
                    >
                      {completed ? (
                        <CheckCircle size={17} weight="fill" />
                      ) : (
                        <Step size={16} weight={active ? "duotone" : "regular"} />
                      )}
                    </span>
                    <span
                      className={`mt-2 text-[0.625rem] leading-3 sm:text-xs ${
                        active
                          ? "font-bold text-[var(--color-primary-ink)]"
                          : completed
                            ? "font-medium text-[var(--color-ink)]"
                            : "text-[var(--color-ink-muted)]"
                      }`}
                    >
                      {item.title}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
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
                  {current.key === "ride" &&
                  (current.description + " You can skip this if you already have transport or plan to commute.")}
                  {current.key !== "ride" && current.description}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
                <Link to={`${current.path}?guide=${trip.id}&step=${step}`}>
                  <Button>
                    {current.key === "ride"
                      ? "Plan rides"
                      : `Yes, choose ${current.title.toLowerCase()}`}
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  onClick={() => continueTo(step + 1)}
                >
                  {current.key === "ride"
                    ? "I already have transport / I'll commute"
                    : "No, continue"}
                </Button>
              </div>
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
        </>
        )}
      </div>
    </div>
  );
}
