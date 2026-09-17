import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Kicker } from "@/components/ui/kicker";
import { Reveal } from "@/components/motion/reveal";
import { openRoles } from "@/content/careers";
import { ArrowRight } from "lucide-react";

export function CareersTeaser() {
  const listedRoles = openRoles.filter((role) => role.id !== "general-application");

  return (
    <section
      id="careers"
      className="relative scroll-mt-24 border-y border-[var(--line)] bg-[var(--canvas-deep)] py-24 sm:py-28 lg:py-32"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-20">
          <Reveal>
            <Kicker index="08">Careers</Kicker>
            <p className="type-headline mt-6 text-[clamp(1.75rem,1.3rem+2vw,2.875rem)]">
              We hire the engineers who can sit in front of a Head of Risk on
              Tuesday and ship the change on Thursday.
            </p>
            <p className="type-body mt-6 max-w-xl">
              That combination is rarer than either half. The failure mode we
              screen hardest against is the engineer who is brilliant in a
              repository and silent in a room.
            </p>
            <div className="mt-9">
              <ButtonLink href="/careers" variant="secondary" size="lg">
                See the archetype and open roles
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="type-kicker">Currently hiring</p>
            <ul className="mt-5 border-t border-[var(--line)]">
              {listedRoles.map((role) => (
                <li key={role.id} className="border-b border-[var(--line)] py-4">
                  <p className="text-[0.9375rem] text-[var(--ink)]">{role.title}</p>
                  <p className="type-mono mt-1.5 text-[0.6875rem] text-[var(--ink-dim)]">
                    {role.locations.join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
