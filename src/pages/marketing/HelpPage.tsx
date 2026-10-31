const SECTIONS = [
  {
    title: "Plans and versions",
    items: [
      {
        q: "What is a plan version?",
        a: "A copy of your trip that you can change without touching the original. Fork Plan A to make Plan B, then compare them.",
      },
      {
        q: "How do I compare two plans?",
        a: "Open a trip, choose Compare plans, and pick two versions. Added, removed, and changed items are highlighted, with the cost and travel-time difference at the top.",
      },
    ],
  },
  {
    title: "Flights, food and catering",
    items: [
      {
        q: "What does a clash warning mean?",
        a: "Two items overlap or cannot fit, such as a dinner during a flight. Select the warning to see the suggested fix.",
      },
      {
        q: "Can I book for a group?",
        a: "Add travelers at checkout, and use catering to compare quotes by headcount.",
      },
    ],
  },
  {
    title: "Bookings and demo mode",
    items: [
      {
        q: "Is this a real booking?",
        a: "Right now Bookcation is a working preview. Searches use sample data, bookings are simulated, and nothing is charged.",
      },
      {
        q: "How do I erase everything?",
        a: "Go to Settings, then Data, then Reset demo data.",
      },
    ],
  },
];

export function HelpPage() {
  return (
    <main className="mx-auto max-w-[800px] px-4 py-20 lg:px-6">
      <h1 className="text-display-lg">Help</h1>
      <div className="mt-8 flex flex-col gap-10">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-h1 mb-4">{s.title}</h2>
            <div className="flex flex-col gap-5">
              {s.items.map((it) => (
                <div key={it.q}>
                  <h3 className="text-h4">{it.q}</h3>
                  <p className="mt-1 text-[var(--color-ink-muted)]">{it.a}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
