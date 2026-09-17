import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Kicker } from "@/components/ui/kicker";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { PodDeployment } from "@/components/visual/pod-deployment";
import { EngagementSection } from "@/components/home/engagement";
import { theses, podComposition } from "@/content/fde-model";
import { CTA_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "FDE Model",
  description:
    "Forward deployed engineering as a delivery structure: pod composition, weekly ship cadence, the control boundary as an architectural input, and handover as a real ending.",
  alternates: { canonical: "/fde-model" },
};

export default function FdeModelPage() {
  return (
    <>
      <PageHero
        kicker="The FDE Model"
        index="01"
        title="Six positions we hold, and will argue for."
        lede={
          <p>
            Forward deployed engineering is often described as consulting with
            better engineers. It is not. It is a specific claim about where
            software for a regulated institution has to be built, and by whom,
            and what that changes about the architecture.
          </p>
        }
      >
        <ButtonLink href={CTA_HREF} size="lg">
          Deploy a Team
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </ButtonLink>
      </PageHero>

      <Section width="prose" className="pb-8 lg:pb-12">
        <Reveal stagger={0.1} className="space-y-16 lg:space-y-20">
          {theses.map((thesis) => (
            <RevealItem key={thesis.index}>
              <article>
                <div className="flex items-baseline gap-4">
                  <span className="type-mono text-[0.6875rem] text-[var(--accent-text)]">
                    {thesis.index}
                  </span>
                  <h2 className="type-headline text-[clamp(1.5rem,1.25rem+1vw,2rem)]">
                    {thesis.title}
                  </h2>
                </div>
                <div className="prose-fwd mt-5 pl-0 sm:pl-10">
                  {thesis.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              </article>
            </RevealItem>
          ))}
        </Reveal>
      </Section>

      <Section
        index="02"
        kicker="Pod composition"
        headline="Three to five people, and the agents they operate."
        lede={
          <p>
            A pod is small enough to hold the whole problem and senior enough
            that nothing has to be escalated to be decided.
          </p>
        }
        className="border-y border-[var(--line)] bg-[var(--canvas-deep)]"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16">
          <Reveal stagger={0.08}>
            <dl className="border-t border-[var(--line)]">
              {podComposition.map((member) => (
                <RevealItem key={member.role}>
                  <div className="border-b border-[var(--line)] py-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-[1rem] font-semibold tracking-[-0.015em] text-[var(--ink)]">
                        {member.role}
                      </dt>
                      <span className="type-mono shrink-0 text-[0.6875rem] text-[var(--accent-text)]">
                        {member.count}
                      </span>
                    </div>
                    <dd className="type-body mt-2.5">
                      {member.responsibility}
                    </dd>
                  </div>
                </RevealItem>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.12}>
            <PodDeployment />
          </Reveal>
        </div>
      </Section>

      <EngagementSection />

      <section className="border-t border-[var(--line)] py-20 lg:py-28">
        <Container>
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <Kicker>Next</Kicker>
              <p className="type-headline mt-4 text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)]">
                If you disagree with any of the six, that is a good first
                conversation.
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
