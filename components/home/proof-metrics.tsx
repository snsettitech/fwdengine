import { Section } from "@/components/layout/section";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { proofMetrics, isPlaceholder } from "@/content/metrics";
import { cn } from "@/lib/cn";

/**
 * The proof block, rendered as a terminal readout.
 *
 * Each figure is shown with the definition it is measured against, because a
 * number without a stated basis is the thing a diligence team throws out
 * first. A metric left as a placeholder renders as a reserved slot rather
 * than a broken value.
 */
export function ProofMetricsSection() {
  return (
    <Section
      id="proof"
      index="06"
      kicker="Proof"
      headline="Four numbers, and what each one is measured against."
      lede={
        <p>
          A figure without a stated basis is not evidence, it is decoration.
          Each of these carries the definition a diligence team would ask for
          anyway.
        </p>
      }
    >
      <Reveal className="glass edge-lit overflow-hidden rounded-[10px]">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--surface-1)]/60 px-5 py-3">
          <span className="type-mono text-[0.6875rem] text-[var(--ink-dim)]">
            fwdengine://metrics
          </span>
          <span className="type-mono flex items-center gap-2 text-[0.625rem] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 bg-[var(--accent-text)] animate-pulse-node"
            />
            {proofMetrics.length} tracked
          </span>
        </div>

        <Reveal stagger={0.1}>
          <dl className="grid divide-y divide-[var(--line)] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
            {proofMetrics.map((metric, index) => {
              const pending = isPlaceholder(metric);
              return (
                <RevealItem
                  key={metric.id}
                  className={cn(
                    "px-5 py-7 lg:px-7 lg:py-9",
                    index > 0 && "sm:border-l sm:border-[var(--line)]",
                    index === 2 && "lg:border-l",
                    "sm:[&:nth-child(3)]:border-t sm:[&:nth-child(3)]:border-[var(--line)] sm:[&:nth-child(4)]:border-t sm:[&:nth-child(4)]:border-[var(--line)]",
                    "lg:[&:nth-child(3)]:border-t-0 lg:[&:nth-child(4)]:border-t-0",
                  )}
                >
                  <dt className="type-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.14em] text-[var(--ink-dim)]">
                    {metric.label}
                  </dt>
                  <dd className="mt-4">
                    {pending ? (
                      // A reserved slot, not a broken value.
                      <span className="flex h-[clamp(1.75rem,1.3rem+1.4vw,2.75rem)] items-center">
                        <span
                          aria-hidden="true"
                          className="h-px w-14 bg-[var(--line-strong)]"
                        />
                        <span className="sr-only">Not yet published</span>
                      </span>
                    ) : (
                      <span className="type-mono block text-[clamp(1.75rem,1.3rem+1.4vw,2.75rem)] font-medium leading-none text-[var(--ink)]">
                        <CountUp value={metric.value} />
                        {metric.unit ? (
                          <span className="ml-1.5 text-[0.4em] tracking-[0.1em] text-[var(--ink-dim)]">
                            {metric.unit}
                          </span>
                        ) : null}
                      </span>
                    )}
                    <p
                      data-footnote=""
                      className="mt-4 text-[0.8125rem] leading-relaxed text-[var(--ink-dim)]"
                    >
                      {metric.basis}
                    </p>
                  </dd>
                </RevealItem>
              );
            })}
          </dl>
        </Reveal>
      </Reveal>
    </Section>
  );
}
