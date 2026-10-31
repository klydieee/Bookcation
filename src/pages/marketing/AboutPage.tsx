export function AboutPage() {
  return (
    <main className="mx-auto max-w-[800px] px-4 py-20 lg:px-6">
      <h1 className="text-display-lg">One plan for the whole trip</h1>
      <div className="mt-6 flex flex-col gap-4 text-body-lg text-[var(--color-ink-muted)]">
        <p>
          Bookcation is built around one idea: a trip is a draft until you book
          it. Flights, meals, and catering belong on the same page, and changing
          one should show you what it does to the rest.
        </p>
        <p>
          The app keeps every version of your plan, so trying a different flight
          or a different dinner costs nothing. You decide when a draft becomes a
          booking.
        </p>
      </div>
    </main>
  );
}
