import { DownloadSimple } from "@phosphor-icons/react";
import { Button } from "./Button";

// GitHub release assets are served with Content-Disposition: attachment, so a
// direct navigation (window.location.href) triggers the browser's native
// download dialog — no fetch(), no CORS issues.
//
// For same-origin files an <a download> tag also works, but window.location
// handles both cases uniformly.
export function DownloadButton({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  filename?: string; // kept for API compat; not needed with location approach
  className?: string;
}) {
  function handleDownload() {
    // Open in a hidden iframe so the current page doesn't navigate away.
    // The server's Content-Disposition: attachment ensures it downloads.
    const a = document.createElement("a");
    a.href = href;
    a.rel = "noopener noreferrer";
    // `download` attribute works for same-origin; for cross-origin GitHub
    // assets the browser still saves the file because of Content-Disposition.
    a.setAttribute("download", "");
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <Button glow className={className} onClick={handleDownload}>
      <DownloadSimple size={18} weight="bold" />
      {label}
    </Button>
  );
}
