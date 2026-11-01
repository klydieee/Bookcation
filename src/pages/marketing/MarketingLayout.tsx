import { Link, NavLink, Outlet } from "react-router-dom";
import { List, X } from "@phosphor-icons/react";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { DemoBanner } from "@/components/DemoBanner";
import { RouteFade } from "@/components/motion/RouteFade";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { TripStartLink } from "@/components/TripStartLink";

export function MarketingLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-[var(--color-canvas)] text-[var(--color-ink)]">
      <DemoBanner />
      <header className="sticky top-0 z-30 border-b border-[var(--color-line)] bg-[var(--color-canvas)]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 lg:px-6">
          <Link to="/" className="flex items-center gap-2">
            <BrandMark size={28} />
            <span className="font-display text-[1.25rem] font-extrabold tracking-[-0.02em]">
              Bookcation
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <MarketingNavLink to="/features">Features</MarketingNavLink>
            <MarketingNavLink to="/download">Download</MarketingNavLink>
            <MarketingNavLink to="/help">Help</MarketingNavLink>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="hidden sm:block">
              <Button size="sm" variant="ghost">
                Sign in
              </Button>
            </Link>
            <span className="hidden sm:block">
              <TripStartLink>
                <Button size="sm">Start a trip</Button>
              </TripStartLink>
            </span>
            <button
              aria-label="Menu"
              className="rounded-[var(--radius-sm)] p-2 hover:bg-[var(--color-sunken)] md:hidden"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={22} /> : <List size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="enter-up border-t border-[var(--color-line)] px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-2">
              <MarketingNavLink to="/features">Features</MarketingNavLink>
              <MarketingNavLink to="/download">Download</MarketingNavLink>
              <MarketingNavLink to="/help">Help</MarketingNavLink>
              <TripStartLink>
                <Button size="sm" className="mt-2 w-full">
                  Start a trip
                </Button>
              </TripStartLink>
            </nav>
          </div>
        )}
      </header>

      <RouteFade>
        <Outlet />
      </RouteFade>

      <footer className="border-t border-[var(--color-line)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-10 lg:px-6">
          <div className="flex items-center gap-2">
            <BrandMark size={24} />
            <span className="font-display text-[1.125rem] font-extrabold">
              Gate to plate.
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-[0.875rem] text-[var(--color-ink-muted)]">
            <Link to="/about">About</Link>
            <Link to="/help">Help</Link>
            <Link to="/legal/terms">Terms of Use</Link>
            <Link to="/legal/privacy">Privacy Policy</Link>
          </div>
          <p className="text-[0.75rem] text-[var(--color-ink-muted)]">
            Sample data. Bookings in this preview are simulated.
          </p>
        </div>
      </footer>
    </div>
  );
}

function MarketingNavLink({
  to,
  children,
}: {
  to: string;
  children: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "link-underline text-base " +
        (isActive
          ? "text-[var(--color-primary-ink)] font-semibold"
          : "text-[var(--color-ink)] hover:text-[var(--color-primary-ink)]")
      }
    >
      {children}
    </NavLink>
  );
}
