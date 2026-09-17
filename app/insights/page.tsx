import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Section } from "@/components/layout/section";
import { Reveal, RevealListItem } from "@/components/motion/reveal";
import { getInsights, formatInsightDate } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Engineering notes from FwdEngine on agentic architecture, evaluation harnesses, control design and security for financial institutions.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  const insights = getInsights();

  return (
    <>
      <PageHero
        kicker="Insights"
        index="01"
        title="Engineering notes, not thought leadership."
        lede={
          <p>
            What we have learned building agentic systems inside regulated
            institutions, written for the engineers and risk functions who have
            to live with the decisions.
          </p>
        }
      />

      <Section>
        {insights.length === 0 ? (
          <Reveal className="glass rounded-[10px] px-7 py-14 text-center">
            <p className="type-headline text-[1.25rem]">
              Nothing published yet.
            </p>
            <p className="type-body mx-auto mt-3 max-w-md">
              The first notes are in review. Add an MDX file to{" "}
              <code className="type-mono">content/insights/</code> and it appears
              here on the next build.
            </p>
          </Reveal>
        ) : (
          <Reveal stagger={0.08}>
            <ul className="border-t border-[var(--line)]">
              {insights.map((insight) => (
                <RevealListItem key={insight.slug} className="border-b border-[var(--line)]">
                    <Link
                      href={`/insights/${insight.slug}`}
                      className="group grid gap-x-12 gap-y-4 py-9 transition-colors duration-300 hover:bg-[var(--surface-1)]/50 lg:grid-cols-[10rem_1fr_auto] lg:items-start lg:py-11"
                    >
                      <div className="type-mono text-[0.6875rem] leading-relaxed text-[var(--ink-dim)]">
                        <p className="text-[var(--accent-text)]">
                          {insight.category}
                        </p>
                        <p className="mt-1.5">{formatInsightDate(insight.date)}</p>
                        <p className="mt-1.5">{insight.readingMinutes} min read</p>
                      </div>

                      <div className="max-w-2xl">
                        <h2 className="type-headline text-[clamp(1.3125rem,1.1rem+0.8vw,1.75rem)] text-[var(--ink)]">
                          {insight.title}
                        </h2>
                        <p className="mt-3 text-base leading-relaxed text-[var(--ink-muted)]">
                          {insight.summary}
                        </p>
                      </div>

                      <ArrowRight
                        className="h-5 w-5 shrink-0 text-[var(--ink-dim)] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[var(--accent-text)] lg:mt-2"
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </Link>
                  </RevealListItem>
              ))}
            </ul>
          </Reveal>
        )}
      </Section>
    </>
  );
}
