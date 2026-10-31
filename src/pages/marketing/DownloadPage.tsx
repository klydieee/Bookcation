import { Link } from "react-router-dom";
import {
  AndroidLogo,
  AppleLogo,
  ArrowSquareOut,
  CheckCircle,
  Clock,
  DeviceMobile,
  Globe,
  GithubLogo,
  LinuxLogo,
  WindowsLogo,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { Surface } from "@/components/motion/Fluent";
import { Reveal } from "@/components/motion/Reveal";

type Status = "available" | "browser" | "building" | "soon";

interface DownloadCard {
  icon: Icon;
  heading: string;
  detail: string;
  status: Status;
  version?: string;
  size?: string;
  primaryLabel: string;
  href?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  to?: string;
  unavailableReason?: string;
}

const GITHUB_RELEASES = "https://github.com/klydieee/Bookcation/releases";
// Pinned to the exact release tag so URLs are stable and work immediately.
const RELEASE_BASE =
  "https://github.com/klydieee/Bookcation/releases/download/v0.1.0";

const CARDS: DownloadCard[] = [
  {
    icon: WindowsLogo,
    heading: "Windows",
    detail: "Windows 10 or later. 64-bit. NSIS installer or MSI package.",
    status: "available",
    version: "0.1.0",
    size: "2.1 MB",
    primaryLabel: "Download installer (.exe)",
    href: `${RELEASE_BASE}/Bookcation_0.1.0_x64-setup.exe`,
    secondaryLabel: "Download .msi instead",
    secondaryHref: `${RELEASE_BASE}/Bookcation_0.1.0_x64_en-US.msi`,
  },
  {
    icon: Globe,
    heading: "Browser",
    detail: "Works in any current browser. Install as a PWA from the address bar.",
    status: "browser",
    primaryLabel: "Open Bookcation",
    to: "/app/trips",
  },
  {
    icon: AndroidLogo,
    heading: "Android",
    detail: "Direct APK sideload. Allow installs from your browser when prompted.",
    status: "available",
    version: "0.1.0",
    size: "3.8 MB",
    primaryLabel: "Download APK",
    href: `${RELEASE_BASE}/app-debug.apk`,
  },
  {
    icon: LinuxLogo,
    heading: "Linux",
    detail: "AppImage (all distros) and .deb (Debian / Ubuntu).",
    status: "building",
    primaryLabel: "Download for Linux",
    unavailableReason: "Linux build is running in CI. Check the releases page.",
  },
  {
    icon: AppleLogo,
    heading: "Mac",
    detail: "macOS 13 or later. Apple silicon and Intel universal binary.",
    status: "building",
    primaryLabel: "Download for macOS",
    unavailableReason: "macOS build is running in CI. Check the releases page.",
  },
  {
    icon: DeviceMobile,
    heading: "iPhone and iPad",
    detail: "iOS 16 or later. TestFlight beta.",
    status: "soon",
    primaryLabel: "Join TestFlight",
    unavailableReason: "Needs Apple signing credentials before it can ship.",
  },
];

export function DownloadPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-20 lg:px-6">
      <h1 className="text-display-lg">Bookcation on every screen you use</h1>
      <p className="text-body-lg mt-4 max-w-[60ch] text-[var(--color-ink-muted)]">
        Download the desktop app, install it on your phone, or open it in your
        browser right now.
      </p>

      {/* Status legend */}
      <div className="mt-6 flex flex-wrap gap-5 text-[0.875rem]">
        <span className="flex items-center gap-1.5 text-[var(--color-success)]">
          <CheckCircle size={16} weight="fill" />
          Ready to download
        </span>
        <span className="flex items-center gap-1.5 text-[var(--color-catering-ink)]">
          <Clock size={16} weight="fill" />
          CI building now
        </span>
        <span className="flex items-center gap-1.5 text-[var(--color-ink-muted)]">
          <Clock size={16} weight="bold" />
          Coming soon
        </span>
      </div>

      {/* CI notice */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-sunken)] px-5 py-4">
        <p className="text-[0.875rem] text-[var(--color-ink-muted)]">
          The <strong className="text-[var(--color-ink)]">v0.1.0</strong> CI run
          is building macOS and Linux artifacts right now. Windows and Android
          are already attached to the release.
        </p>
        <a
          href={GITHUB_RELEASES}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1.5 text-[0.875rem] font-semibold text-[var(--color-primary-ink)] hover:underline"
        >
          <GithubLogo size={16} weight="bold" />
          View all releases
          <ArrowSquareOut size={14} />
        </a>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c, i) => (
          <Reveal key={c.heading} delay={i * 60}>
            <DownloadCardItem card={c} />
          </Reveal>
        ))}
      </div>

      {/* Build info */}
      <div className="mt-10 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-sunken)] p-5 text-[0.875rem] text-[var(--color-ink-muted)]">
        <p className="font-semibold text-[var(--color-ink)]">About these builds</p>
        <ul className="mt-2 list-inside list-disc flex flex-col gap-1.5">
          <li>
            All builds are demo mode: sample data, simulated bookings, nothing is charged.
          </li>
          <li>
            Windows and Android are built natively; macOS and Linux build via
            GitHub Actions on tagged releases.
          </li>
          <li>
            iOS needs an Apple Developer account and signing credentials — not yet
            configured.
          </li>
          <li>
            If a download button shows a browser error, the artifact may still be
            building.{" "}
            <a
              href={GITHUB_RELEASES}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary-ink)] underline underline-offset-2"
            >
              Check the releases page
            </a>{" "}
            for the latest assets.
          </li>
        </ul>
      </div>
    </main>
  );
}

function DownloadCardItem({ card: c }: { card: DownloadCard }) {
  const IconCmp = c.icon;
  const isReady = c.status === "available" || c.status === "browser";
  const isBuilding = c.status === "building";

  return (
    <Surface
      effect={isReady ? ["spotlight", "reveal-border"] : "none"}
      material={isReady ? "surface" : "none"}
      radius="md"
      depth={isReady ? 2 : 0}
      lift={isReady}
      className={[
        "relative flex h-full flex-col p-6",
        isReady
          ? "bg-[var(--color-surface)] border border-[var(--color-line)]"
          : isBuilding
            ? "border border-dashed border-[var(--color-catering)] bg-[var(--color-catering-tint)]/30"
            : "border border-dashed border-[var(--color-line)] bg-[var(--color-canvas)] opacity-60",
      ].join(" ")}
    >
      {/* Status badge */}
      <span
        className={[
          "absolute right-4 top-4 flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2.5 py-1 text-[0.72rem] font-semibold",
          c.status === "available"
            ? "bg-[var(--color-success-tint)] text-[var(--color-success)]"
            : c.status === "browser"
              ? "bg-[var(--color-primary-tint)] text-[var(--color-primary-ink)]"
              : c.status === "building"
                ? "bg-[var(--color-catering-tint)] text-[var(--color-catering-ink)]"
                : "bg-[var(--color-sunken)] text-[var(--color-ink-muted)]",
        ].join(" ")}
      >
        {c.status === "available" && <CheckCircle size={12} weight="fill" />}
        {c.status === "browser" && <Globe size={12} weight="bold" />}
        {(c.status === "building" || c.status === "soon") && (
          <Clock size={12} weight="fill" />
        )}
        {c.status === "available"
          ? "Available"
          : c.status === "browser"
            ? "Web app"
            : c.status === "building"
              ? "Building in CI"
              : "Coming soon"}
      </span>

      <IconCmp
        size={32}
        weight="duotone"
        className={
          isReady
            ? "text-[var(--color-primary-ink)]"
            : isBuilding
              ? "text-[var(--color-catering-ink)]"
              : "text-[var(--color-ink-muted)]"
        }
      />
      <h3 className="text-h3 mt-3">{c.heading}</h3>
      <p className="mt-1 flex-1 text-[0.875rem] text-[var(--color-ink-muted)]">
        {c.detail}
      </p>

      {c.version && (
        <p className="mt-2 text-[0.75rem] text-[var(--color-ink-muted)]">
          v{c.version} · {c.size}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {/* Available: real download */}
        {c.status === "available" && c.href && (
          <>
            <DownloadButton
              href={c.href}
              label={c.primaryLabel}
              className="w-full"
            />
            {c.secondaryLabel && c.secondaryHref && (
              <DownloadButton
                href={c.secondaryHref}
                label={c.secondaryLabel}
                className="w-full"
              />
            )}
          </>
        )}

        {/* Browser: open app */}
        {c.status === "browser" && c.to && (
          <Link to={c.to}>
            <Button glow className="w-full">
              <Globe size={18} weight="bold" />
              {c.primaryLabel}
            </Button>
          </Link>
        )}

        {/* Building: link to releases page */}
        {c.status === "building" && (
          <>
            <a
              href={GITHUB_RELEASES}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="secondary" className="w-full">
                <GithubLogo size={18} weight="bold" />
                Check releases page
                <ArrowSquareOut size={14} />
              </Button>
            </a>
            {c.unavailableReason && (
              <p className="text-[0.75rem] text-[var(--color-ink-muted)]">
                {c.unavailableReason}
              </p>
            )}
          </>
        )}

        {/* Coming soon: disabled */}
        {c.status === "soon" && (
          <>
            <Button variant="secondary" className="w-full" disabled>
              <Clock size={18} weight="bold" />
              {c.primaryLabel}
            </Button>
            {c.unavailableReason && (
              <p className="text-[0.75rem] text-[var(--color-ink-muted)]">
                {c.unavailableReason}
              </p>
            )}
          </>
        )}
      </div>
    </Surface>
  );
}
