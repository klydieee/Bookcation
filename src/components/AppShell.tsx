import { NavLink, Outlet, Link } from "react-router-dom";
import {
  AirplaneTilt,
  ArrowLeft,
  Bed,
  Car,
  CookingPot,
  ForkKnife,
  GearSix,
  Path,
  SignIn,
  SignOut,
  SuitcaseRolling,
  Ticket as TicketIcon,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { clsx } from "clsx";
import { DemoBanner } from "./DemoBanner";
import { PlanTray } from "./PlanTray";
import { RouteFade } from "./motion/RouteFade";
import { ThemeToggle } from "./ui/ThemeToggle";
import { BrandMark } from "./BrandMark";
import { useSession } from "@/store/sessionStore";
import { GuideContinueBanner } from "@/pages/app/BookingGuidePage";
import { useActivePlanContext } from "@/store/useActivePlan";
import { planTotal } from "@/store/tripStore";
import { usePrefs } from "@/store/prefsStore";
import { money } from "@/lib/format";

interface NavItem {
  to: string;
  label: string;
  icon: Icon;
}

const PLANNING_NAV: NavItem[] = [
  { to: "/app/flights", label: "Flights", icon: AirplaneTilt },
  { to: "/app/hotels", label: "Hotels", icon: Bed },
  { to: "/app/food", label: "Food", icon: ForkKnife },
  { to: "/app/catering", label: "Catering", icon: CookingPot },
  { to: "/app/rides", label: "Rides", icon: Car },
];

const MANAGEMENT_NAV: NavItem[] = [
  { to: "/app/trips", label: "Trips", icon: Path },
  { to: "/app/bookings", label: "Bookings", icon: TicketIcon },
];

export function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--color-canvas)] text-[var(--color-ink)]">
      <DemoBanner />
      <div className="flex flex-1">
        {/* Sidebar (>= lg) */}
        <nav className="hidden w-[264px] shrink-0 flex-col border-r border-[var(--color-line)] bg-[var(--color-surface)] p-4 lg:flex">
          <Link
            to="/"
            className="hover-tint press mb-6 flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1 hover:bg-[var(--color-sunken)]"
            aria-label="Bookcation home"
          >
            <BrandMark size={28} />
            <span className="font-display text-[1.25rem] font-extrabold tracking-[-0.02em]">
              Bookcation
            </span>
          </Link>
          <p className="mb-2 px-3 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            Plan your trip
          </p>
          <ul className="flex flex-col gap-1">
            {PLANNING_NAV.map((item) => (
              <li key={item.to}>
                <SideLink item={item} />
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-[var(--color-line)] pt-4">
            <p className="mb-2 px-3 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              Your travel
            </p>
            <ul className="flex flex-col gap-1">
              {MANAGEMENT_NAV.map((item) => (
                <li key={item.to}>
                  <SideLink item={item} />
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto flex flex-col gap-1 border-t border-[var(--color-line)] pt-3">
            <AccountBlock />
            <Link
              to="/"
              className="hover-tint press flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-base text-[var(--color-ink-muted)] hover:bg-[var(--color-sunken)] hover:text-[var(--color-ink)]"
            >
              <ArrowLeft size={20} weight="bold" />
              Back to site
            </Link>
            <div className="flex items-center justify-between">
              <NavLink
                to="/app/settings"
                className="hover-tint press flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-base text-[var(--color-ink-muted)] hover:bg-[var(--color-sunken)] hover:text-[var(--color-ink)]"
              >
                <GearSix size={20} />
                Settings
              </NavLink>
              <ThemeToggle />
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
          <MobileHeader />
          <ActivePlanBar />
          <GuideContinueBanner />
          <RouteFade>
            <Outlet />
          </RouteFade>
        </main>

        {/* Plan tray (>= xl) */}
        <PlanTray />
      </div>

      {/* Planning categories (< lg); trip management lives in the header menu. */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-[var(--color-line)] bg-[var(--color-surface)] pb-[env(safe-area-inset-bottom)] lg:hidden">
        {PLANNING_NAV.map((item) => (
          <BottomLink key={item.to} item={item} />
        ))}
      </nav>
    </div>
  );
}

// Mobile-only header: the sidebar is hidden below lg, so this keeps the brand
// (home link), settings, and theme toggle reachable on small screens.
function MobileHeader() {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-[var(--color-line)] bg-[var(--color-surface)] px-4 lg:hidden">
      <Link to="/" className="flex items-center gap-2" aria-label="Bookcation home">
        <BrandMark size={24} />
        <span className="font-display text-[1.1rem] font-extrabold tracking-[-0.02em]">
          Bookcation
        </span>
      </Link>
      <details className="group relative ms-auto">
        <summary
          aria-label="Trips and bookings"
          title="Trips and bookings"
          className="hover-tint press grid h-10 w-10 cursor-pointer list-none place-items-center rounded-[var(--radius-sm)] text-[var(--color-ink-muted)] hover:bg-[var(--color-sunken)] hover:text-[var(--color-ink)] [&::-webkit-details-marker]:hidden"
        >
          <SuitcaseRolling size={21} weight="bold" />
        </summary>
        <nav className="absolute right-0 top-full z-30 mt-2 w-48 rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-surface)] p-2 shadow-4">
          {MANAGEMENT_NAV.map((item) => {
            const IconCmp = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium hover:bg-[var(--color-sunken)]"
              >
                <IconCmp size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </details>
      <NavLink
        to="/app/settings"
        aria-label="Settings"
        className="hover-tint press rounded-[var(--radius-sm)] p-2 text-[var(--color-ink-muted)] hover:bg-[var(--color-sunken)] hover:text-[var(--color-ink)]"
      >
        <GearSix size={20} />
      </NavLink>
      <ThemeToggle />
    </header>
  );
}

function ActivePlanBar() {
  const { trip, plan } = useActivePlanContext();
  const currency = usePrefs((state) => state.currency);

  if (!trip || !plan) return null;

  return (
    <div className="sticky top-0 z-10 border-b border-[var(--color-line)] bg-[var(--color-surface)]/95 px-4 py-2 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <SuitcaseRolling
          size={21}
          className="hidden shrink-0 text-[var(--color-trip-ink)] sm:block"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{trip.name}</p>
          <p className="truncate text-xs text-[var(--color-ink-muted)]">
            {trip.destinationCity} · {plan.name} · {plan.items.length} item
            {plan.items.length === 1 ? "" : "s"}
          </p>
        </div>
        <span className="hidden text-right text-xs text-[var(--color-ink-muted)] sm:block">
          <span className="block">Plan total</span>
          <strong className="text-sm text-[var(--color-ink)]">
            {money(planTotal(plan), currency)}
          </strong>
        </span>
        <Link to={`/app/trips/${trip.id}`} className="shrink-0">
          <span className="inline-flex h-9 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-3 text-sm font-semibold text-[var(--color-on-primary)] hover:bg-[var(--color-primary-hover)]">
            Open canvas
          </span>
        </Link>
      </div>
    </div>
  );
}

// Account block: shows the mock session (avatar initial + name) with a sign
// out action, or a Sign in link when there is no session.
function AccountBlock() {
  const session = useSession((s) => s.session);
  const signOut = useSession((s) => s.signOut);

  if (!session) {
    return (
      <Link
        to="/login?redirect=/app/trips"
        className="hover-tint press flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-base text-[var(--color-ink)] hover:bg-[var(--color-sunken)]"
      >
        <SignIn size={20} weight="bold" />
        Sign in
      </Link>
    );
  }

  return (
    <div className="mb-1 flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-pill)] bg-[var(--color-primary-tint)] text-[0.9rem] font-bold text-[var(--color-primary-ink)]">
        {session.name.charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[0.9rem] font-semibold">
          {session.name}
        </div>
        <div className="truncate text-[0.75rem] text-[var(--color-ink-muted)]">
          {session.guest ? "Guest session" : session.email || "Signed in"}
        </div>
      </div>
      <button
        aria-label="Sign out"
        title="Sign out"
        onClick={signOut}
        className="hover-tint press rounded-[var(--radius-sm)] p-2 text-[var(--color-ink-muted)] hover:bg-[var(--color-sunken)] hover:text-[var(--color-ink)]"
      >
        <SignOut size={18} weight="bold" />
      </button>
    </div>
  );
}

function SideLink({ item }: { item: NavItem }) {
  const IconCmp = item.icon;
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        clsx(
          "hover-tint press flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-base",
          isActive
            ? "bg-[var(--color-primary-tint)] text-[var(--color-primary-ink)] font-semibold"
            : "text-[var(--color-ink)] hover:bg-[var(--color-sunken)]",
        )
      }
    >
      {({ isActive }) => (
        <>
          <IconCmp size={22} weight={isActive ? "fill" : "bold"} />
          {item.label}
        </>
      )}
    </NavLink>
  );
}

function BottomLink({ item }: { item: NavItem }) {
  const IconCmp = item.icon;
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        clsx(
          "flex flex-1 flex-col items-center gap-0.5 py-2 text-[0.7rem]",
          isActive
            ? "text-[var(--color-primary-ink)] font-semibold"
            : "text-[var(--color-ink-muted)]",
        )
      }
    >
      {({ isActive }) => (
        <>
          <IconCmp size={24} weight={isActive ? "fill" : "bold"} />
          {item.label}
        </>
      )}
    </NavLink>
  );
}
