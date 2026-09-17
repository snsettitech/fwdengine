import { cn } from "@/lib/cn";

/**
 * The mark: a forward caret crossing a delivery line inside a bounded cell.
 * Reads as "forward deployed" and as a terminal prompt at the same time.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("h-6 w-6", className)}
    >
      <rect
        x="0.75"
        y="0.75"
        width="22.5"
        height="22.5"
        rx="1.5"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
      <path
        d="M7 7.5L12.5 12L7 16.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="square"
      />
      <path
        d="M13.5 16.5H18"
        stroke="var(--accent-text)"
        strokeWidth="1.9"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-[1.0625rem] font-semibold tracking-[-0.03em] text-[var(--ink)]",
        className,
      )}
    >
      Fwd<span className="text-[var(--ink-muted)]">Engine</span>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-[22px] w-[22px] text-[var(--ink)]" />
      <Wordmark />
    </span>
  );
}
