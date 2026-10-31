import { useState } from "react";
import { DownloadSimple, Spinner, Warning } from "@phosphor-icons/react";
import { Button } from "./Button";

type State = "idle" | "fetching" | "error";

// Fetches a cross-origin file and saves it via a blob URL so the browser
// triggers an automatic download rather than navigating to the file.
export function DownloadButton({
  href,
  filename,
  label,
  className,
}: {
  href: string;
  filename: string;
  label: string;
  className?: string;
}) {
  const [state, setState] = useState<State>("idle");

  async function handleDownload() {
    if (state === "fetching") return;
    setState("fetching");
    try {
      const res = await fetch(href);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Revoke after a short delay to let the download start.
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      setState("idle");
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  }

  return (
    <Button
      glow
      className={className}
      onClick={handleDownload}
      disabled={state === "fetching"}
      aria-label={
        state === "fetching"
          ? `Downloading ${filename}…`
          : state === "error"
            ? "Download failed — click to retry"
            : label
      }
    >
      {state === "fetching" ? (
        <>
          <Spinner size={18} weight="bold" className="animate-spin" />
          Downloading…
        </>
      ) : state === "error" ? (
        <>
          <Warning size={18} weight="bold" />
          Failed — retry
        </>
      ) : (
        <>
          <DownloadSimple size={18} weight="bold" />
          {label}
        </>
      )}
    </Button>
  );
}
