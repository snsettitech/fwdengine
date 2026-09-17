import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * A standalone inline call to action, as distinct from a link inside a
 * sentence.
 *
 * The negative margin paired with vertical padding is deliberate: it grows the
 * hit area past 44px for a thumb without moving the text, so the link sits
 * where the layout expects it and is still comfortable to tap.
 */
export function TextLink({
  href,
  children,
  className,
  tone = "accent",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  tone?: "accent" | "muted";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group -my-3 inline-flex items-center gap-2 py-3 text-[0.875rem] transition-colors",
        tone === "accent"
          ? "text-[var(--accent-text)] hover:opacity-80"
          : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
        className,
      )}
    >
      {children}
      <ArrowRight
        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </Link>
  );
}

/** Same hit-area treatment, arrow on the left, for "back to" navigation. */
export function BackLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        // py-3.5 rather than py-3: at 13px the line box is ~19.5px, and 3
        // would leave the box a half-pixel short of the 44px minimum.
        "group -my-3.5 inline-flex items-center gap-2 py-3.5 text-[0.8125rem] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]",
        className,
      )}
    >
      <ArrowRight
        className="h-4 w-4 rotate-180 transition-transform duration-200 group-hover:-translate-x-0.5"
        strokeWidth={1.8}
        aria-hidden="true"
      />
      {children}
    </Link>
  );
}
