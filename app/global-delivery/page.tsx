import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
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
import { GlobeStage } from "@/components/delivery/globe-stage";
import { CoverageClock } from "@/components/delivery/coverage-clock";
import { hubs, activeHubs } from "@/content/hubs";
import { CTA_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Global Delivery",
  description:
    "FwdEngine delivery hubs across seven time zones, the shift handoff protocol that makes follow-the-sun engineering work, and how agent operation continues when humans hand over.",
  alternates: { canonical: "/global-delivery" },
};

const handoffProtocol = [
  {
    title: "State of every in-flight run, written down",
    body: "The outgoing lead records what is mid-flight, what is blocked, and what changed in the client's environment during the shift. Not a status summary: the actual run identifiers and their current stage.",
  },
  {
    title: "Gates that are still waiting, named",
    body: "A run halted at a human gate is the most common thing to lose across a handoff. Each one carries the approver, when it was raised, and what happens if it is still open at the next shift change.",
  },
  {
    title: "Acknowledgement blocks the change",
    body: "The incoming lead acknowledges explicitly. An unacknowledged handoff holds the shift change rather than rolling silently into the next region, because a silent roll is how a run sits untouched for sixteen hours.",
  },
  {
    title: "Agents keep running, supervision moves",
    body: "The agent fleet does not stop for a shift change. What moves is who is accountable for it, and the audit record names that person for every minute of the run.",
  },
] as const;

export default function GlobalDeliveryPage() {
  const plannedHubs = hubs.filter((hub) => hub.status === "planned");

  return (
    <>
      <PageHero
        kicker="Global delivery"
        index="01"
        title="Seven hubs, one engineering organisation, and a handoff that is written down."
        lede={
          <p>
            Follow-the-sun delivery is easy to claim and hard to operate. The
            hard part is not staffing time zones. It is making sure nothing
            falls into the gap between them.
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

      <Section width="wide" className="pb-12 lg:pb-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <Reveal>
            <GlobeStage className="h-[380px] sm:h-[480px] lg:h-[600px]" />
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="type-kicker">Local time, live</h2>
              <p className="type-mono text-[0.625rem] text-[var(--ink-dim)]">
                {activeHubs.length} active · {plannedHubs.length} planned
              </p>
            </div>
            <CoverageClock className="mt-5" />
            <p className="type-mono mt-5 text-[0.6875rem] leading-relaxed text-[var(--ink-dim)]">
              Shift window 09:00 to 18:00 local. Times resolve in your browser,
              including daylight saving.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section
        index="02"
        kicker="Hub focus"
        headline="Hubs are not interchangeable."
        lede={
          <p>
            Each one carries a supervisory context and a capability. Routing a
            European banking engagement through a hub with no ECB exposure
            produces work that has to be redone.
          </p>
        }
        className="border-y border-[var(--line)] bg-[var(--canvas-deep)]"
      >
        <Reveal stagger={0.07}>
          <ul className="border-t border-[var(--line)]">
            {hubs.map((hub) => (
              <RevealListItem key={hub.id} className="grid gap-x-10 gap-y-2.5 border-b border-[var(--line)] py-7 lg:grid-cols-[1fr_auto_2fr] lg:items-baseline">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={
                        hub.status === "active"
                          ? "inline-block h-1.5 w-1.5 bg-[var(--accent-text)]"
                          : "inline-block h-1.5 w-1.5 bg-[var(--amber)]"
                      }
                    />
                    <h3 className="type-headline text-[1.25rem]">{hub.city}</h3>
                    {hub.status === "planned" ? (
                      <span className="type-mono text-[0.625rem] uppercase tracking-[0.14em] text-[var(--amber)]">
                        planned
                      </span>
                    ) : null}
                  </div>

                  <p className="type-mono text-[0.6875rem] text-[var(--ink-dim)] lg:min-w-[10rem]">
                    {hub.country}
                  </p>

                  <p className="text-base leading-relaxed text-[var(--ink-muted)]">
                    {hub.focus}
                  </p>
                </RevealListItem>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section
        index="03"
        kicker="Handoff protocol"
        headline="What moves at a shift change."
        lede={
          <p>
            Four things transfer, in this order, every time. It is deliberately
            boring, because the interesting version loses runs.
          </p>
        }
      >
        <Reveal
          stagger={0.09}
          className="grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2"
        >
          {handoffProtocol.map((step, index) => (
            <RevealItem key={step.title} className="bg-[var(--canvas)] p-7 lg:p-9">
              <span className="type-mono text-[0.6875rem] text-[var(--accent-text)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="type-headline mt-4 text-[1.25rem]">{step.title}</h3>
              <p className="type-body mt-3.5">{step.body}</p>
            </RevealItem>
          ))}
        </Reveal>
      </Section>

      <section className="border-t border-[var(--line)] py-20 lg:py-28">
        <Container>
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <Kicker>Coverage</Kicker>
              <p className="type-headline mt-4 text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)]">
                Tell us your time zone and your change window. We will tell you
                which hubs carry the engagement.
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
