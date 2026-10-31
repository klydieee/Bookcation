import { Link } from "react-router-dom";
import {
  AndroidLogo,
  AppleLogo,
  CheckCircle,
  Clock,
  DeviceMobile,
  Globe,
  LinuxLogo,
  WindowsLogo,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { Surface } from "@/components/motion/Fluent";
import { Reveal } from "@/components/motion/Reveal";

type Status = "available" | "browser" | "soon";

interface DownloadCard {
  icon: Icon;
  heading: string;
  detail: string;
  status: Status;
  version?: string;
  size?: string;
  primaryLabel: string;
  secondaryLabel?: string;
  href?: string;
  filename?: string;
  secondaryHref?: string;
  secondaryFilename?: string;
  to?: string;
  unavailableReason?: string;
}

// Real artifacts are produced by the CI release workflow and attached to the
// GitHub release. The hrefs below point to the current release assets.
// Update RELEASE_BASE when a new release is tagged.
const RELEASE_BASE =
  "https://github.com/klydieee/Bookcation/releases/latest/download";

const CARDS: DownloadCard[] = [
  {
    icon: WindowsLogo,
    heading: "Windows",
    detail: "Windows 10 or later. 64-bit installer.",
    status: "available",
    version: "0.1.0",
    size: "2.1 MB",
    primaryLabel: "Download installer (.exe)",
    href: `${RELEASE_BASE}/Bookcation_0.1.0_x64-setup.exe`,
    filename: "Bookcation_0.1.0_x64-setup.exe",
    secondaryLabel: "Download .msi",
    secondaryHref: `${RELEASE_BASE}/Bookcation_0.1.0_x64_en-US.msi`,
    secondaryFilename: "Bookcation_0.1.0_x64_en-US.msi",
  },
  {
    icon: Globe,
    heading: "Browser",
    detail: "Works in any current browser and installs as a PWA.",
    status: "browser",
    primaryLabel: "Open Bookcation",
    to: "/app/trips",
  },
  {
    icon: AndroidLogo,
    heading: "Android",
    detail: "Direct APK install. Enable installs from your browser when asked.",
    status: "available",
    version: "0.1.0",
    size: "3.8 MB",
    primaryLabel: "Download APK",
    href: `${RELEASE_BASE}/Bookcation_0.1.0_debug.apk`,
    filename: "Bookcation_0.1.0_debug.apk",
  },
  {
    icon: AppleLogo,
    heading: "Mac",
    detail: "macOS 13 or later. Apple silicon and Intel (universal).",
    status: "soon",
    primaryLabel: "Download for macOS",
    unavailableReason: "macOS build requires a Mac runner. Available via CI.",
  },
  {
    icon: LinuxLogo,
    heading: "Linux",
    detail: "AppImage (all distros) and .deb (Debian / Ubuntu).",
    status: "soon",
    primaryLabel: "Download for Linux",
    unavailableReason:
      "Linux build is configured. Available once CI publishes a release.",
  },
  {
    icon: DeviceMobile,
    heading: "iPhone and iPad",
    detail: "iOS 16 or later. TestFlight beta.",
    status: "soon",
    primaryLabel: "Join TestFlight",
    unavailableReason: "iOS build requires macOS and Apple signing credentials.",
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
      <div className="mt-6 flex flex-wrap gap-4 text-[0.875rem]">
        <span className="flex items-center gap-1.5 text-[var(--color-success)]">
          <CheckCircle size={16} weight="fill" />
          Available now
        </span>
        <span className="flex items-center gap-1.5 text-[var(--color-ink-muted)]">
          <Clock size={16} weight="fill" />
          Coming soon
        </span>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c, i) => (
          <Reveal key={c.heading} delay={i * 60}>
            <DownloadCardItem card={c} />
          </Reveal>
        ))}
      </div>

      <div className="mt-10 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-sunken)] p-5 text-[0.875rem] text-[var(--color-ink-muted)]">
        <p className="font-semibold text-[var(--color-ink)]">About these builds</p>
        <ul className="mt-2 flex flex-col gap-1.5 list-disc list-inside">
          <li>
            Windows and Android installers are built and attached to the{" "}
            <a
              href="https://github.com/klydieee/Bookcation/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary-ink)] underline"
            >
              GitHub release
            </a>
            .
          </li>
          <li>
            macOS, Linux, and iOS builds are produced by the CI workflow on a
            tagged release. Push a <code>v*</code> tag to trigger them.
          </li>
          <li>
            All builds are demo mode: sample data, simulated bookings, nothing
            is charged.
          </li>
        </ul>
      </div>
    </main>
  );
}

function DownloadCardItem({ card: c }: { card: DownloadCard }) {
  const IconCmp = c.icon;
  const available = c.status === "available" || c.status === "browser";

  return (
    <Surface
      effect={available ? ["spotlight", "reveal-border"] : "none"}
      material={available ? "surface" : "none"}
      radius="md"
      depth={available ? 2 : 0}
      lift={available}
      className={[
        "relative flex h-full flex-col p-6",
        available
          ? "bg-[var(--color-surface)] border border-[var(--color-line)]"
          : "border border-dashed border-[var(--color-line)] bg-[var(--color-canvas)] opacity-70",
      ].join(" ")}
    >
      {/* Status badge */}
      <span
        className={[
          "absolute right-4 top-4 flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-1 text-[0.75rem] font-semibold",
          c.status === "available"
            ? "bg-[var(--color-success-tint)] text-[var(--color-success)]"
            : c.status === "browser"
              ? "bg-[var(--color-primary-tint)] text-[var(--color-primary-ink)]"
              : "bg-[var(--color-sunken)] text-[var(--color-ink-muted)]",
        ].join(" ")}
      >
        {c.status === "available" && (
          <CheckCircle size={12} weight="fill" />
        )}
        {c.status === "browser" && <Globe size={12} weight="bold" />}
        {c.status === "soon" && <Clock size={12} weight="fill" />}
        {c.status === "available"
          ? "Available"
          : c.status === "browser"
            ? "Web app"
            : "Coming soon"}
      </span>

      <IconCmp
        size={32}
        weight="duotone"
        className={
          available
            ? "text-[var(--color-primary-ink)]"
            : "text-[var(--color-ink-muted)]"
        }
      />
      <h3 className="text-h3 mt-3">{c.heading}</h3>
      <p className="mt-1 flex-1 text-[0.875rem] text-[var(--color-ink-muted)]">
        {c.detail}
      </p>

      {/* Version + size */}
      {c.version && (
        <p className="mt-2 text-[0.75rem] text-[var(--color-ink-muted)]">
          v{c.version} · {c.size}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {c.status === "available" && c.href && c.filename && (
          <>
            <DownloadButton
              href={c.href}
              filename={c.filename}
              label={c.primaryLabel}
              className="w-full"
            />
            {c.secondaryLabel && c.secondaryHref && c.secondaryFilename && (
              <DownloadButton
                href={c.secondaryHref}
                filename={c.secondaryFilename}
                label={c.secondaryLabel}
                className="w-full"
              />
            )}
          </>
        )}

        {c.status === "browser" && c.to && (
          <Link to={c.to}>
            <Button glow className="w-full">
              <Globe size={18} weight="bold" />
              {c.primaryLabel}
            </Button>
          </Link>
        )}

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
