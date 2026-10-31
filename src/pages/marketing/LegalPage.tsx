export function LegalPage({ kind }: { kind: "terms" | "privacy" }) {
  const title = kind === "terms" ? "Terms of Use" : "Privacy Policy";
  return (
    <main className="mx-auto max-w-[800px] px-4 py-20 lg:px-6">
      <div className="mb-6 rounded-[var(--radius-sm)] border border-[var(--color-warning)] bg-[var(--color-warning-tint)] px-4 py-3 text-[0.875rem] text-[var(--color-ink)]">
        These pages are placeholders and are not legal advice. Replace them with
        reviewed text before launch.
      </div>
      <h1 className="text-display-lg">{title}</h1>
      <p className="text-body-lg mt-4 text-[var(--color-ink-muted)]">
        Placeholder content. The final {title.toLowerCase()} will be provided
        before launch.
      </p>
    </main>
  );
}
