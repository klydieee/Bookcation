import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Envelope,
  GitFork,
  Path,
  ShieldCheck,
  User,
} from "@phosphor-icons/react";
import { useSession } from "@/store/sessionStore";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { Surface } from "@/components/motion/Fluent";
import { BrandMark } from "@/components/BrandMark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const PITCH = [
  { icon: GitFork, text: "Fork a plan and compare versions before you book." },
  { icon: Path, text: "Flights, hotels, food, and catering on one canvas." },
  { icon: ShieldCheck, text: "Demo mode: nothing is charged, nothing is sent." },
];

export function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const signIn = useSession((s) => s.signIn);
  const continueAsGuest = useSession((s) => s.continueAsGuest);

  const redirect = params.get("redirect") || "/app/trips";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Enter an email to continue, or use Continue as guest.");
      return;
    }
    signIn({ name, email });
    navigate(redirect, { replace: true });
  }

  function guest() {
    continueAsGuest();
    navigate(redirect, { replace: true });
  }

  return (
    <div className="relative min-h-dvh bg-[var(--color-canvas)] text-[var(--color-ink)]">
      {/* top controls */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4 lg:px-8">
        <Link
          to="/"
          className="hover-tint press flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1 text-[var(--color-ink-muted)] hover:bg-[var(--color-sunken)] hover:text-[var(--color-ink)]"
        >
          <ArrowLeft size={18} weight="bold" />
          Back to site
        </Link>
        <ThemeToggle />
      </div>

      {/* soft background light */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-10 top-24 -z-0 h-[380px] w-[380px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 32%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto grid min-h-dvh max-w-[1100px] items-center gap-10 px-4 py-24 lg:grid-cols-2 lg:px-8">
        {/* Pitch panel */}
        <div className="hidden lg:block">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <BrandMark size={32} />
            <span className="font-display text-[1.5rem] font-extrabold tracking-[-0.02em]">
              Bookcation
            </span>
          </Link>
          <h1 className="text-display-lg max-w-[16ch]">
            Welcome back to your drafts.
          </h1>
          <ul className="mt-8 flex flex-col gap-4">
            {PITCH.map((p) => {
              const IconCmp = p.icon;
              return (
                <li key={p.text} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--color-primary-tint)]">
                    <IconCmp
                      size={20}
                      weight="duotone"
                      className="text-[var(--color-primary-ink)]"
                    />
                  </span>
                  <span className="text-[var(--color-ink-muted)]">{p.text}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Form card */}
        <Surface
          material="mica"
          radius="lg"
          depth={3}
          effect={["spotlight", "reveal-border"]}
          className="w-full p-7 lg:p-9"
        >
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <BrandMark size={28} />
            <span className="font-display text-[1.25rem] font-extrabold tracking-[-0.02em]">
              Bookcation
            </span>
          </div>

          <h2 className="text-h1">Sign in</h2>
          <p className="mt-1 text-[var(--color-ink-muted)]">
            This is a demo sign-in. Your session stays on this device and no
            password is needed.
          </p>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-4" noValidate>
            <div>
              <Label htmlFor="login-name">Name (optional)</Label>
              <div className="relative">
                <User
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]"
                />
                <Input
                  id="login-name"
                  autoComplete="name"
                  placeholder="Alex Rivera"
                  className="ps-9"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <Envelope
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]"
                />
                <Input
                  id="login-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="ps-9"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "login-error" : undefined}
                />
              </div>
              {error && (
                <p
                  id="login-error"
                  className="enter-fade mt-1.5 text-[0.875rem] text-[var(--color-error)]"
                >
                  {error}
                </p>
              )}
            </div>

            <Button type="submit" glow className="mt-1 w-full">
              Continue
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[0.8rem] text-[var(--color-ink-muted)]">
            <span className="h-px flex-1 bg-[var(--color-line)]" />
            or
            <span className="h-px flex-1 bg-[var(--color-line)]" />
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={guest}
          >
            Continue as guest
          </Button>

          <p className="mt-5 text-[0.8rem] text-[var(--color-ink-muted)]">
            Demo only. Do not enter a real password anywhere in this app.
          </p>
        </Surface>
      </div>
    </div>
  );
}
