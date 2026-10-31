import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[600px] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="num-xl text-[var(--color-primary-ink)]">404</div>
      <h1 className="text-h1">That page took a different flight</h1>
      <p className="text-[var(--color-ink-muted)]">
        The page you asked for is not here. Head back to the start.
      </p>
      <Link to="/">
        <Button>Go home</Button>
      </Link>
    </main>
  );
}
