import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * First-viewport entrance, CSS only.
 *
 * Use this above the fold; use `Reveal` below it.
 *
 * The distinction is about Largest Contentful Paint. Framer Motion serialises
 * its hidden `initial` state into the server HTML, so anything it wraps is
 * transparent until hydration completes, and LCP ignores transparent text.
 * These components are server components with no JavaScript at all: the
 * animation is a stylesheet rule, it begins at first paint, and it finishes
 * whether or not the bundle ever arrives.
 */
export function Enter({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Seconds before this element starts. */
  delay?: number;
}) {
  return (
    <div
      className={cn("fwd-enter", className)}
      style={{ "--enter-delay": `${delay}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * Headline text that assembles word by word.
 *
 * Each word carries its own animation delay. Screen readers get the whole
 * string from the surrounding heading, so the spans need no extra handling:
 * they are still real text in document order.
 */
export function EnterWords({
  text,
  className,
  delay = 0,
  stagger = 0.04,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="fwd-enter-word"
          style={
            { "--enter-delay": `${delay + index * stagger}s` } as React.CSSProperties
          }
        >
          {index < words.length - 1 ? `${word} ` : word}
        </span>
      ))}
    </span>
  );
}
