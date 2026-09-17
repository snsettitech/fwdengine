import { cn } from "@/lib/cn";

type KickerProps = {
  /** Section number, e.g. "02". Rendered before the label. */
  index?: string;
  children: string;
  className?: string;
};

/**
 * The monospace section label. `// 02 — AGENTIC COMPUTATION LAYER`
 * This is the brand's typographic signature; it should look like system output.
 */
export function Kicker({ index, children, className }: KickerProps) {
  return (
    <p className={cn("type-kicker flex items-center gap-2", className)}>
      <span aria-hidden="true" className="text-[var(--accent-text)]">
        {"//"}
      </span>
      {index ? (
        <>
          <span className="text-[var(--ink-muted)]">{index}</span>
          <span aria-hidden="true" className="opacity-40">
            —
          </span>
        </>
      ) : null}
      <span>{children}</span>
    </p>
  );
}
