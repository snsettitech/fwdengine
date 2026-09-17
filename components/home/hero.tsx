import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Kicker } from "@/components/ui/kicker";
import { AmbientField } from "@/components/visual/ambient-field";
import { OrchestrationGraph } from "@/components/visual/orchestration-graph";
import { Enter, EnterWords } from "@/components/motion/enter";
import { StatusStrip } from "@/components/home/status-strip";
import { ArrowRight } from "lucide-react";
import { CTA_HREF } from "@/lib/site";

/**
 * The hero is deliberately free of Framer Motion.
 *
 * Everything above the fold animates in CSS so the headline paints
 * immediately. See `components/motion/enter.tsx` for why.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-40">
      {/* Volumetric light. Two sources, offset, heavily diffused. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="substrate" />
        <div
          className="absolute -right-[18%] -top-[28%] h-[820px] w-[820px] rounded-full opacity-70 animate-drift"
          style={{
            background:
              "radial-gradient(circle, var(--glow-indigo) 0%, transparent 65%)",
            filter: "blur(30px)",
          }}
        />
        <div
          className="absolute -left-[22%] top-[34%] h-[620px] w-[620px] rounded-full opacity-50 animate-drift"
          style={{
            background:
              "radial-gradient(circle, var(--glow-cyan) 0%, transparent 68%)",
            filter: "blur(40px)",
            animationDelay: "-8s",
          }}
        />
        <AmbientField />
      </div>

      <Container width="wide">
        <div className="grid items-start gap-14 pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-16">
          <div className="max-w-2xl">
            <Enter>
              <Kicker>Forward deployed engineering for financial institutions</Kicker>
            </Enter>

            {/* Line breaks are deliberate: the grey clause is the middle beat,
                so the sentence reads as three phrases rather than reflowing. */}
            <h1 className="type-display mt-6 text-[clamp(2.25rem,1.5rem+2.9vw,4.125rem)]">
              <EnterWords text="We deploy engineers," delay={0.05} />{" "}
              <EnterWords
                text="and the agents they build,"
                delay={0.19}
                className="text-[var(--ink-muted)]"
              />{" "}
              <EnterWords text="inside your institution." delay={0.4} />
            </h1>

            <Enter delay={0.58}>
              <p className="type-lede mt-7 max-w-xl">
                FwdEngine embeds forward-based delivery teams into banks, insurers
                and asset managers to design, ship and operate agentic AI systems
                in production. No pilots that die in committee. No vendor black
                boxes.
              </p>
            </Enter>

            <Enter delay={0.7} className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink href={CTA_HREF} size="lg">
                Deploy a Team
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </ButtonLink>
              <ButtonLink href="/platform" variant="secondary" size="lg">
                See the Platform
              </ButtonLink>
            </Enter>
          </div>

          <Enter delay={0.42} className="lg:pl-4 lg:pt-14">
            <OrchestrationGraph />
          </Enter>
        </div>
      </Container>

      <StatusStrip />
    </section>
  );
}
