// Bookmark with a dotted route to a Mango destination dot (03 §7 logo).
export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      role="img"
    >
      <path
        d="M14 6H50a4 4 0 0 1 4 4V58L32 44 10 58V10a4 4 0 0 1 4-4Z"
        fill="var(--color-primary)"
      />
      <path
        d="M22 37C22 26 31 20 43 18"
        fill="none"
        stroke="var(--color-on-primary)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="0.1 5.2"
      />
      <circle cx="22" cy="37" r="3" fill="var(--color-on-primary)" />
      <circle cx="43" cy="18" r="4.2" fill="var(--color-catering)" />
    </svg>
  );
}
