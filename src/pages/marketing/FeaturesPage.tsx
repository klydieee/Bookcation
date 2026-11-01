import { TripStartLink } from "@/components/TripStartLink";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Surface } from "@/components/motion/Fluent";

const FEATURES = [
  {
    heading: "One canvas",
    body: "Flights, meals, and catering are cards on a day-by-day board.",
  },
  {
    heading: "Fork and compare",
    body: "Copy a plan into Plan B, edit it freely, and see what changed against Plan A.",
  },
  {
    heading: "Clash detection",
    body: "The canvas flags conflicts, like a meal booked while you are in the air.",
  },
  {
    heading: "One checkout",
    body: "See the plan total, then book every item in a single simulated checkout.",
  },
];

export function FeaturesPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-20 lg:px-6">
      <h1 className="text-display-lg">What Bookcation does</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {FEATURES.map((f, i) => (
          <Reveal key={f.heading} delay={i * 70}>
            <Surface
              effect={["spotlight", "reveal-border"]}
              radius="md"
              lift
              className="h-full p-6"
            >
              <h2 className="text-h2">{f.heading}</h2>
              <p className="mt-2 text-[var(--color-ink-muted)]">{f.body}</p>
            </Surface>
          </Reveal>
        ))}
      </div>
      <div className="mt-10 inline-block">
        <TripStartLink>
          <Button>Start a trip</Button>
        </TripStartLink>
      </div>
    </main>
  );
}
