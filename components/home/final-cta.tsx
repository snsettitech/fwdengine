import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { AmbientField } from "@/components/visual/ambient-field";
import { AssembleText, Reveal } from "@/components/motion/reveal";
import { ArrowRight } from "lucide-react";
import { CTA_HREF } from "@/lib/site";

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden py-28 sm:py-32 lg:py-44">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="substrate" />
        <div
          className="absolute left-1/2 top-1/2 h-[720px] w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-60 animate-drift"
          style={{
            background:
              "radial-gradient(ellipse at center, var(--glow-indigo) 0%, transparent 62%)",
            filter: "blur(40px)",
          }}
        />
        <AmbientField />
      </div>

      <Container>
        <div className="max-w-4xl">
          <h2 className="type-display text-[clamp(2.25rem,1.5rem+3.4vw,4.5rem)]">
            <AssembleText text="The pilot is not the hard part." />{" "}
            <span className="text-[var(--ink-muted)]">
              <AssembleText
                text="Getting it into production, under supervision, is."
                delay={0.25}
              />
            </span>
          </h2>

          <Reveal delay={0.5}>
            <p className="type-lede mt-8 max-w-2xl">
              Tell us the institution, the constraint and the deadline. If the
              work is not a fit, we will say so in the first conversation rather
              than the third.
            </p>
          </Reveal>

          <Reveal delay={0.62} className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href={CTA_HREF} size="lg">
              Talk to Us
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </ButtonLink>
            <ButtonLink href="/platform" variant="secondary" size="lg">
              Request Technical Diligence
            </ButtonLink>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
