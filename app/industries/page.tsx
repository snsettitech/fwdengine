import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Section } from "@/components/layout/section";
import { Reveal, RevealListItem } from "@/components/motion/reveal";
import { industries } from "@/content/industries";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "How FwdEngine deploys agentic systems across banking, asset and wealth management, insurance and payments, and the supervisory regime that shapes each one.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        kicker="Industries"
        index="01"
        title="Four sectors, four different reasons the work is hard."
        lede={
          <p>
            The agentic architecture is shared. The constraint that decides
            whether anything reaches production is not. A latency budget on an
            authorisation path and an information barrier across a research desk
            are different engineering problems with the same surface.
          </p>
        }
      />

      <Section>
        <Reveal stagger={0.08}>
          <ul className="border-t border-[var(--line)]">
            {industries.map((industry) => (
              <RevealListItem key={industry.slug} className="border-b border-[var(--line)]">
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="group grid gap-x-12 gap-y-4 py-9 transition-colors duration-300 hover:bg-[var(--surface-1)]/50 lg:grid-cols-[auto_1fr_1.5fr_auto] lg:items-start lg:py-11"
                  >
                    <span className="type-mono text-[0.6875rem] text-[var(--ink-dim)] lg:pt-2">
                      {industry.index}
                    </span>

                    <h2 className="type-headline text-[clamp(1.5rem,1.2rem+1vw,2rem)] text-[var(--ink)]">
                      {industry.name}
                    </h2>

                    <div>
                      <p className="text-base leading-relaxed text-[var(--ink-muted)]">
                        {industry.summary}
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
                        {industry.regimes.map((regime) => (
                          <li
                            key={regime}
                            className="type-mono border border-[var(--line)] px-2 py-1 text-[0.625rem] text-[var(--ink-dim)]"
                          >
                            {regime}
                          </li>
                        ))}
                      </ul>
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
      </Section>
    </>
  );
}
