import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Kicker } from "@/components/ui/kicker";
import {
  Reveal,
  RevealItem,
  RevealListItem,
} from "@/components/motion/reveal";
import { OrchestrationGraph } from "@/components/visual/orchestration-graph";
import {
  pipelineStages,
  architecturePrinciples,
  exclusions,
} from "@/content/platform";
import { CTA_HREF } from "@/lib/site";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "The FwdEngine agentic computation layer: planning, retrieval, execution in isolation cells, guardrail agents, human approval gates, and continuous evaluation with an append-only audit record.",
  alternates: { canonical: "/platform" },
};

const deploymentFacts = [
  { label: "Runs in", value: "Your cloud account, your VPC, your KMS" },
  { label: "Control flow", value: "Explicit state machine in Postgres" },
  { label: "Providers", value: "Model agnostic behind one versioned interface" },
  { label: "Isolation", value: "One compute cell per engagement" },
  { label: "Audit", value: "Append-only, emitted to your log estate" },
] as const;

export default function PlatformPage() {
  return (
    <>
      <PageHero
        kicker="Platform"
        index="01"
        title="An execution substrate you can read, audit and turn off."
        lede={
          <p>
            Agents are stateless functions with a prompt and a schema. The state
            machine that decides what runs next lives in your infrastructure, in
            code your engineers can read. Nothing about this architecture asks
            you to trust a model with control flow.
          </p>
        }
        aside={
          <dl className="glass edge-lit rounded-[10px] divide-y divide-[var(--line)]">
            {deploymentFacts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1 px-5 py-3.5">
                <dt className="type-mono text-[0.625rem] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
                  {fact.label}
                </dt>
                <dd className="text-[0.875rem] text-[var(--ink)]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        }
      >
        <ButtonLink href={CTA_HREF} size="lg">
          Request Technical Diligence
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </ButtonLink>
      </PageHero>

      <Section
        index="02"
        kicker="Execution model"
        headline="One request, six stages, and a gate no machine can open."
        lede={
          <p>
            The run below is the shape of every engagement. What changes between
            clients is the tool manifest, the corpora and who holds the gate.
          </p>
        }
        substrate
      >
        <Reveal>
          <OrchestrationGraph />
        </Reveal>

        <Reveal stagger={0.08} className="mt-16 grid gap-px border border-[var(--line)] bg-[var(--line)] lg:grid-cols-2">
          {pipelineStages.map((stage) => (
            <RevealItem key={stage.id} className="bg-[var(--canvas)] p-7 lg:p-9">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5"
                  style={{
                    backgroundColor:
                      stage.signal === "amber"
                        ? "var(--amber)"
                        : stage.signal === "cyan"
                          ? "var(--cyan)"
                          : "var(--indigo-bright)",
                  }}
                />
                <span className="type-mono text-[0.625rem] tracking-[0.14em] text-[var(--ink-dim)]">
                  {stage.index} · {stage.nodeLabel}
                </span>
              </div>

              <h3 className="type-headline mt-4 text-[1.375rem]">{stage.title}</h3>
              <p className="type-body mt-3">{stage.summary}</p>

              <ul className="mt-6 space-y-2.5 border-t border-[var(--line)] pt-5">
                {stage.detail.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.5rem] inline-block h-1 w-1 shrink-0 bg-[var(--ink-dim)]"
                    />
                    <span className="text-[0.8125rem] leading-relaxed text-[var(--ink-muted)]">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </Reveal>
      </Section>

      <Section
        index="03"
        kicker="Architecture principles"
        headline="Six decisions that are hard to reverse, made deliberately."
        className="border-y border-[var(--line)] bg-[var(--canvas-deep)]"
      >
        <Reveal stagger={0.08} className="grid gap-x-16 gap-y-10 lg:grid-cols-2">
          {architecturePrinciples.map((principle, index) => (
            <RevealItem key={principle.title}>
              <div className="flex gap-5">
                <span className="type-mono mt-1 shrink-0 text-[0.6875rem] text-[var(--accent-text)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="type-headline text-[1.25rem]">{principle.title}</h3>
                  <p className="type-body mt-3">{principle.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </Section>

      <Section
        index="04"
        kicker="What we will not build"
        headline="The boundary matters as much as the capability."
        lede={
          <p>
            A platform is defined by what it refuses. These are not roadmap
            items we have not reached yet. They are excluded by design, and the
            exclusions are part of what makes the rest deployable.
          </p>
        }
      >
        <Reveal stagger={0.08}>
          <ul className="border-t border-[var(--line)]">
            {exclusions.map((item, index) => (
              <RevealListItem key={item.title} className="grid gap-x-10 gap-y-2 border-b border-[var(--line)] py-7 lg:grid-cols-[auto_1fr_1.6fr]">
                  <span className="type-mono text-[0.6875rem] text-[var(--amber)] lg:pt-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-[var(--ink)]">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed text-[var(--ink-muted)]">
                    {item.body}
                  </p>
                </RevealListItem>
            ))}
          </ul>
        </Reveal>
      </Section>

      <section className="border-t border-[var(--line)] py-20 lg:py-28">
        <Container>
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <Kicker>Next</Kicker>
              <p className="type-headline mt-4 text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)]">
                Bring us your architecture review and your model risk policy.
              </p>
            </div>
            <ButtonLink href={CTA_HREF} size="lg">
              Talk to Us
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
