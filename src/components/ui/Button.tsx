import { clsx } from "clsx";
import { useRef } from "react";
import type { ButtonHTMLAttributes, ReactNode, MouseEvent } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Diagonal light sweep on hover. */
  sheen?: boolean;
  /** Soft colored halo behind the button. */
  glow?: boolean;
  children: ReactNode;
}

const base =
  "ripple inline-flex items-center justify-center gap-2 font-sans font-semibold rounded-[var(--radius-sm)] transition-[background,transform,box-shadow] duration-[var(--dur-fast)] active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none select-none";

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-[0.875rem]",
  md: "h-11 px-5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  sheen = true,
  glow = false,
  className,
  children,
  onClick,
  ...rest
}: Props) {
  const reduce = usePrefersReducedMotion();
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const variants: Record<Variant, string> = {
    primary:
      "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-hover)] hover:shadow-[0_8px_20px_-6px_var(--color-primary)]",
    secondary:
      "bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-line-strong)] hover:bg-[var(--color-sunken)]",
    ghost:
      "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-sunken)]",
    danger: "bg-[var(--color-error)] text-white hover:opacity-90",
  };

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const el = btnRef.current;
    if (el && !reduce) {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--rx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--ry", `${e.clientY - rect.top}px`);
      el.removeAttribute("data-ripple");
      // reflow so the animation restarts on each click
      void el.offsetWidth;
      el.setAttribute("data-ripple", "on");
    }
    onClick?.(e);
  }

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className={clsx(
        base,
        sizes[size],
        variants[variant],
        sheen && "sheen",
        glow && "glow",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
