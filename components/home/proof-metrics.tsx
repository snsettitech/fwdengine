import { Section } from "@/components/layout/section";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { proofMetrics, isPlaceholder } from "@/content/metrics";
import { cn } from "@/lib/cn";

export function ProofMetricsSection() {
  const unverified = proofMetrics.filter(isPlaceholder).length;

  return (
    <Section
      id="proof"
      index="06"
      kicker="Proof"
      headline="Four numbers, and what each one is measured against."
      lede={
        <p>
          A figure without a stated basis is not evidence, it is decoration. Each
          of these carries the definition a diligence team would ask for anyway.
        </p>
      }
    >
      <Reveal className="glass edge-lit overflow-hidden rounded-[10px]">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--surface-1)]/60 px-5 py-3">
          <span className="type-mono text-[0.6875rem] text-[var(--ink-dim)]">
            fwdengine://metrics
          </span>
          <span className="type-mono flex items-center gap-2 text-[0.625rem] uppercase tracking-[0.16em]">
            <span
              aria-hidden="true"
              className={cn(
                "inline-block h-1.5 w-1.5",
                unverified > 0 ? "bg-[var(--amber)]" : "bg-[var(--accent-text)]",
              )}
            />
            <span className={unverified > 0 ? "text-[var(--amber)]" : "text-[var(--accent-text)]"}>
              {unverified > 0 ? `${unverified} unverified` : "verified"}
            </span>
          </span>
        </div>

        {unverified > 0 ? (
          <p className="border-b border-[var(--line)] bg-[var(--amber)]/[0.06] px-5 py-3 text-[0.8125rem] leading-relaxed text-[var(--amber)]">
            Build state: these figures are not yet published. Replace the values
            in <code className="type-mono">content/metrics.ts</code> and set{" "}
            <code className="type-mono">verified: true</code> once each one is
            evidenced. Nothing here should reach a prospect unfilled.
          </p>
        ) : null}

        <Reveal stagger={0.1}>
          <dl className="grid divide-y divide-[var(--line)] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
            {proofMetrics.map((metric, index) => {
              const unfilled = isPlaceholder(metric);
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
                    <span
                      className={cn(
                        "type-mono block text-[clamp(1.75rem,1.3rem+1.4vw,2.75rem)] font-medium leading-none",
                        unfilled ? "text-[var(--amber)]" : "text-[var(--ink)]",
                      )}
                    >
                      {unfilled ? metric.value : <CountUp value={metric.value} />}
                      {metric.unit && !unfilled ? (
                        <span className="ml-1.5 text-[0.4em] tracking-[0.1em] text-[var(--ink-dim)]">
                          {metric.unit}
                        </span>
                      ) : null}
                    </span>
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
