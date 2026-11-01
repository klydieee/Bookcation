import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AirplaneTilt,
  Bed,
  CaretDown,
  Car,
  CookingPot,
  ForkKnife,
  GitDiff,
  GitFork,
  Path,
  ShieldCheck,
  WifiSlash,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { HeroCanvas } from "./HeroCanvas";
import { Reveal } from "@/components/motion/Reveal";
import { Surface } from "@/components/motion/Fluent";
import { usePointerLight } from "@/components/motion/usePointerLight";
import { TripStartLink } from "@/components/TripStartLink";

const MODULES: { heading: string; body: string; icon: Icon; color: string }[] = [
  {
    heading: "Flights",
    body: "Search by airport, compare fares by stops and time, and check prices across nearby dates.",
    icon: AirplaneTilt,
    color: "flight",
  },
  {
    heading: "Hotels",
    body: "Find a stay in your destination and add the dates to your plan.",
    icon: Bed,
    color: "stay",
  },
  {
    heading: "Food",
    body: "Browse restaurants by cuisine and dietary need. Reserve a table, schedule pickup, or order delivery for the day you land.",
    icon: ForkKnife,
    color: "food",
  },
  {
    heading: "Catering",
    body: "Compare sample event caterers and search for nearby venues. Hotel stays use restaurant pickup or delivery instead.",
    icon: CookingPot,
    color: "catering",
  },
  {
    heading: "Trips",
    body: "Every trip keeps its versions. Open Plan A and Plan B next to each other.",
    icon: Path,
    color: "trip",
  },
  {
    heading: "Rides",
    body: "Add Grab or Uber ride reminders between the airport, hotel, and your plans.",
    icon: Car,
    color: "trip",
  },
];

const STEPS = [
  { n: 1, title: "Draft.", body: "Add flights, stays, meals, catering, and rides to a plan." },
  { n: 2, title: "Fork.", body: "Copy the plan in one click and change what you want." },
  { n: 3, title: "Compare.", body: "See what was added, removed, and what the total did." },
  { n: 4, title: "Book.", body: "Choose a plan and check out once." },
];

const TRUST: { icon: Icon; heading: string; body: string }[] = [
  {
    icon: ShieldCheck,
    heading: "Demo mode is honest",
    body: "Searches use sample data, bookings are simulated, and nothing is charged. Every screen that looks like a purchase says so.",
  },
  {
    icon: WifiSlash,
    heading: "Works offline",
    body: "Open and edit saved plans without a connection. Your trips live on your device until you clear them.",
  },
  {
    icon: GitDiff,
    heading: "See the difference",
    body: "Compare two plans side by side with the cost and travel-time deltas laid out before you commit.",
  },
];

const PLATFORMS = ["Web", "macOS", "Windows", "Linux", "Android", "iOS"];
const SERVICE_PROVIDERS = [
  { group: "Airlines", names: ["Cebu Pacific", "Philippine Airlines", "AirAsia Philippines"] },
  { group: "Rides", names: ["Grab", "Uber"] },
  { group: "Food", names: ["Jollibee", "McDonald's", "GrabFood", "foodpanda"] },
];

export function HomePage() {
  return (
    <main>
      {/* Hero: split with bleed (03 §10.1 option A) */}
      <section className="relative mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-20 lg:grid-cols-12 lg:px-6 lg:py-28">
        {/* soft background light */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 right-0 -z-10 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 30%, transparent), transparent 70%)",
          }}
        />
        <div className="lg:col-span-5">
          <span className="mb-4 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1 text-[0.8rem] font-semibold text-[var(--color-ink-muted)]">
            <GitFork size={14} weight="bold" className="text-[var(--color-primary-ink)]" />
            Plan versions, built in
          </span>
          <h1 className="text-display-xl">
            Every trip deserves a second draft.
          </h1>
          <p className="text-body-lg mt-5 max-w-[56ch] text-[var(--color-ink-muted)]">
            Bookcation brings flights, stays, restaurant meals, catering, and
            rides together on one canvas. Compare options, adjust the plan, and
            review the total before checkout.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <TripStartLink>
              <Button glow>Start a trip</Button>
            </TripStartLink>
            <a href="#fork">
              <Button variant="secondary">See how plans work</Button>
            </a>
          </div>
        </div>
        <div className="lg:col-span-7">
          <HeroCanvas />
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 pb-10 lg:px-6">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 lg:p-8">
          <h2 className="text-h2">Providers Filipino travelers may recognize</h2>
          <p className="mt-2 max-w-[70ch] text-[0.875rem] text-[var(--color-ink-muted)]">
            These names help you plan around familiar services. This preview does not have live inventory or booking integrations, and it does not claim formal partnerships.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {SERVICE_PROVIDERS.map((provider) => (
              <div key={provider.group}>
                <h3 className="text-h4">{provider.group}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {provider.names.map((name) => (
                    <span
                      key={name}
                      className="rounded-[var(--radius-pill)] border border-[var(--color-line)] bg-[var(--color-canvas)] px-3 py-1.5 text-[0.875rem] font-semibold"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One plan for the whole trip */}
      <section className="mx-auto max-w-[1200px] px-4 py-20 lg:px-6">
        <h2 className="text-display-lg max-w-[20ch]">
          One plan for the whole trip
        </h2>
        <p className="text-body-lg mt-4 max-w-[64ch] text-[var(--color-ink-muted)]">
          Flights, tables, and catering sit side by side on a day-by-day canvas.
          Add from search, drag between days, and Bookcation flags anything that
          clashes, like a dinner booked while you are still in the air.
        </p>

        {/* Modules — spotlight + reveal-border cards, each with its own hue */}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {MODULES.map((m, i) => {
            const IconCmp = m.icon;
            return (
              <Reveal
                key={m.heading}
                delay={i * 70}
                className={i === 0 ? "md:col-span-2" : ""}
              >
                <Surface
                  effect={["spotlight", "reveal-border"]}
                  radius="md"
                  lift
                  className="h-full p-6"
                >
                  <span
                    className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)]"
                    style={{ background: `var(--color-${m.color}-tint)` }}
                  >
                    <IconCmp
                      size={24}
                      weight="duotone"
                      style={{ color: `var(--color-${m.color}-ink)` }}
                    />
                  </span>
                  <h3 className="text-h2">{m.heading}</h3>
                  <p className="mt-2 text-[var(--color-ink-muted)]">{m.body}</p>
                </Surface>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Gate to plate — acrylic band over a colored field */}
      <section className="mx-auto max-w-[1200px] px-4 py-10 lg:px-6">
        <div
          className="relative overflow-hidden geo p-[1px]"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary), var(--color-trip))",
          }}
        >
          <Surface
            material="acrylic"
            radius="lg"
            depth={3}
            className="flex flex-col items-start gap-4 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12"
          >
            <div>
              <h2 className="text-display-lg">Land with a table waiting</h2>
              <p className="text-body-lg mt-3 max-w-[52ch] text-[var(--color-ink-muted)]">
                Landing at 6:40 pm? Bookcation lists restaurants open when you
                arrive and still taking reservations, so dinner is sorted before
                baggage claim.
              </p>
            </div>
            <Link to="/app/food" className="shrink-0">
              <Button variant="secondary">Browse food</Button>
            </Link>
          </Surface>
        </div>
      </section>

      {/* Draft, fork, compare, book — a true sequence */}
      <section id="fork" className="mx-auto max-w-[1200px] px-4 py-20 lg:px-6">
        <h2 className="text-display-lg">Draft it. Fork it. Book it.</h2>
        <p className="text-body-lg mt-4 max-w-[64ch] text-[var(--color-ink-muted)]">
          Start with a plan. Fork it to try a cheaper flight or a nicer dinner.
          Compare the two and keep the one you like.
        </p>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 90}>
              <Surface
                material="mica"
                radius="md"
                effect="spotlight"
                lift
                className="h-full p-5"
              >
                <div className="num-xl text-[var(--color-primary-ink)]">
                  {String(s.n).padStart(2, "0")}
                </div>
                <h3 className="text-h3 mt-2">{s.title}</h3>
                <p className="mt-1 text-[var(--color-ink-muted)]">{s.body}</p>
              </Surface>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Why you can trust the preview (no fabricated proof, per 02 §8) */}
      <section className="mx-auto max-w-[1200px] px-4 py-20 lg:px-6">
        <h2 className="text-display-lg max-w-[22ch]">
          Honest about what this preview does
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TRUST.map((t, i) => {
            const IconCmp = t.icon;
            return (
              <Reveal key={t.heading} delay={i * 80}>
                <Surface
                  effect="reveal-border"
                  radius="md"
                  lift
                  className="h-full p-6"
                >
                  <IconCmp
                    size={28}
                    weight="duotone"
                    className="text-[var(--color-primary-ink)]"
                  />
                  <h3 className="text-h3 mt-3">{t.heading}</h3>
                  <p className="mt-2 text-[var(--color-ink-muted)]">{t.body}</p>
                </Surface>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Platforms — mica chips */}
      <section className="mx-auto max-w-[1200px] px-4 py-20 lg:px-6">
        <h2 className="text-display-lg max-w-[22ch]">
          On every screen you plan from
        </h2>
        <p className="text-body-lg mt-4 max-w-[64ch] text-[var(--color-ink-muted)]">
          Use Bookcation in your browser, on macOS and Windows, or on iOS and
          Android. In this preview your plans stay on your device.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {PLATFORMS.map((p) => (
            <span
              key={p}
              className="mica geo-md press border border-[var(--color-line)] px-5 py-2.5 text-[0.95rem] font-semibold"
            >
              {p}
            </span>
          ))}
          <Link to="/download">
            <Button variant="ghost" size="sm" className="h-full">
              See downloads
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[800px] px-4 py-20 lg:px-6">
        <h2 className="text-display-lg mb-6">Questions</h2>
        <div className="flex flex-col gap-2">
          {FAQ.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* Final CTA — the only centered block, on a glowing acrylic card */}
      <section className="mx-auto max-w-[900px] px-4 py-24 lg:px-6">
        <Surface
          material="mica"
          radius="lg"
          depth={3}
          effect="glow"
          className="flex flex-col items-center gap-6 p-12 text-center"
        >
          <h2 className="text-display-lg">Your next trip starts as a draft.</h2>
          <TripStartLink>
            <Button glow>Start a trip</Button>
          </TripStartLink>
        </Surface>
      </section>
    </main>
  );
}

const FAQ = [
  {
    q: "Is this a real booking?",
    a: "Right now Bookcation is a working preview. Searches use sample data, bookings are simulated, and nothing is charged.",
  },
  {
    q: "Where are my plans stored?",
    a: "On this device, in your browser or app. You can erase them any time in Settings.",
  },
  {
    q: "What is a plan version?",
    a: "A copy of your trip that you can change without touching the original. Fork Plan A to make Plan B, then compare them.",
  },
  {
    q: "Can I book for a group?",
    a: "Add travelers at checkout, and use catering to compare quotes by headcount.",
  },
  {
    q: "Which devices does it run on?",
    a: "Any current browser, macOS, Windows, Android, and iOS through TestFlight or the App Store.",
  },
  {
    q: "Does it work offline?",
    a: "You can open and edit saved plans without a connection.",
  },
  {
    q: "When does Bookcation use my location?",
    a: "Only after you tap Use my location and allow the browser prompt. Coordinates update the embedded Google Map and are not saved to your trip.",
  },
  {
    q: "Does Bookcation confirm rides with Grab or Uber?",
    a: "No. It can save a ride reminder to your trip plan. Confirm availability and request a ride in the provider app.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const { ref, onPointerMove } = usePointerLight<HTMLDivElement>();
  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className="reveal-border hover-tint geo-md border border-[var(--color-line)] bg-[var(--color-surface)]"
    >
      <button
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="text-h4">{q}</span>
        <CaretDown
          size={18}
          weight="bold"
          className={"caret-spin " + (open ? "rotate-180" : "")}
        />
      </button>
      <div className="collapsible" data-open={open}>
        <div className="collapsible-inner">
          <p className="px-5 pb-4 text-[var(--color-ink-muted)]">{a}</p>
        </div>
      </div>
    </div>
  );
}
