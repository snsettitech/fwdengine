import { Section } from "@/components/layout/section";
import { TextLink } from "@/components/ui/text-link";
import { GlobeStage } from "@/components/delivery/globe-stage";
import { CoverageClock } from "@/components/delivery/coverage-clock";
import { Reveal } from "@/components/motion/reveal";
import { activeHubs, hubs } from "@/content/hubs";

export function GlobalDeliverySection() {
  const plannedCount = hubs.length - activeHubs.length;

  return (
    <Section
      id="global-delivery"
      index="04"
      kicker="Global delivery"
      headline="Follow the sun, with the handoff written down."
      lede={
        <p>
          Agents run continuously. Humans do not. The engineering problem is the
          handoff: what the incoming region needs to know, what is mid-flight,
          and which gate is still waiting on an approver who has gone home.
        </p>
      }
      width="wide"
      headerClassName="max-w-2xl"
    >
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
        <Reveal>
          <GlobeStage className="h-[380px] sm:h-[460px] lg:h-[560px]" />
        </Reveal>

        <Reveal delay={0.12}>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="type-kicker">Hub coverage, live</h3>
            <p className="type-mono text-[0.625rem] text-[var(--ink-dim)]">
              {activeHubs.length} active · {plannedCount} planned
            </p>
          </div>

          <CoverageClock className="mt-5" />

          <p className="type-body mt-7 max-w-lg">
            Each hub owns a shift, not a ticket queue. The outgoing lead writes
            the state of every in-flight run before the incoming lead picks it
            up, and an unacknowledged handoff blocks the shift change rather
            than rolling silently into the next region.
          </p>

          <TextLink href="/global-delivery" className="mt-10">
            How the handoff works
          </TextLink>
        </Reveal>
      </div>
    </Section>
  );
}
