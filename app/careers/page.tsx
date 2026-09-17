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
import { archetype, openRoles } from "@/content/careers";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "FwdEngine hires forward deployed engineers: the technical depth to build the system and the composure to be questioned about it by the person accountable for the outcome.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        kicker="Careers"
        index="01"
        title="We hire the engineers who can sit in front of a Head of Risk on Tuesday and ship the change on Thursday."
        lede={<p>{archetype.body}</p>}
      >
        <ButtonLink href="#roles" variant="secondary" size="lg">
          {openRoles.length} open roles
          <ArrowRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        </ButtonLink>
      </PageHero>

      <Section
        index="02"
        kicker="The archetype"
        headline="Four things we screen for, in this order."
      >
        <Reveal
          stagger={0.09}
          className="grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2"
        >
          {archetype.traits.map((trait, index) => (
            <RevealItem key={trait.title} className="bg-[var(--canvas)] p-7 lg:p-9">
              <span className="type-mono text-[0.6875rem] text-[var(--accent-text)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="type-headline mt-4 text-[1.25rem]">{trait.title}</h3>
              <p className="type-body mt-3.5">{trait.body}</p>
            </RevealItem>
          ))}
        </Reveal>
      </Section>

      <Section
        id="roles"
        index="03"
        kicker="Open roles"
        headline="Every role below writes code."
        lede={
          <p>
            Including the lead ones. An engineer who has stopped shipping cannot
            hold technical authority in a client’s room, and we do not pretend
            otherwise.
          </p>
        }
        className="border-y border-[var(--line)] bg-[var(--canvas-deep)]"
      >
        <Reveal stagger={0.07}>
          <ul className="space-y-px">
            {openRoles.map((role) => (
              <RevealListItem key={role.id} className="border-t border-[var(--line)] py-9 last:border-b">
                  <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[1fr_1.6fr]">
                    <div>
                      <h3 className="type-headline text-[1.375rem]">{role.title}</h3>
                      <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
                        <li className="type-mono border border-[var(--line)] px-2 py-1 text-[0.625rem] text-[var(--ink-dim)]">
                          {role.team}
                        </li>
                        <li className="type-mono border border-[var(--line)] px-2 py-1 text-[0.625rem] text-[var(--ink-dim)]">
                          {role.type}
                        </li>
                      </ul>
                      <p className="type-mono mt-4 text-[0.6875rem] leading-relaxed text-[var(--ink-dim)]">
                        {role.locations.join(" · ")}
                      </p>
                    </div>

                    <div>
                      <p className="text-base leading-relaxed text-[var(--ink-muted)]">
                        {role.summary}
                      </p>

                      {role.whatYouDo.length > 0 ? (
                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                          <div>
                            <h4 className="type-kicker">What you do</h4>
                            <ul className="mt-3 space-y-2">
                              {role.whatYouDo.map((item) => (
                                <li key={item} className="flex gap-2.5">
                                  <span
                                    aria-hidden="true"
                                    className="mt-[0.5rem] inline-block h-1 w-1 shrink-0 bg-[var(--accent-text)]"
                                  />
                                  <span className="text-[0.8125rem] leading-relaxed text-[var(--ink-muted)]">
                                    {item}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="type-kicker">What we look for</h4>
                            <ul className="mt-3 space-y-2">
                              {role.whatWeLookFor.map((item) => (
                                <li key={item} className="flex gap-2.5">
                                  <span
                                    aria-hidden="true"
                                    className="mt-[0.5rem] inline-block h-1 w-1 shrink-0 bg-[var(--ink-dim)]"
                                  />
                                  <span className="text-[0.8125rem] leading-relaxed text-[var(--ink-muted)]">
                                    {item}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : null}

                      <p className="mt-6">
                        <a
                          href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(
                            `Application: ${role.title}`,
                          )}`}
                          className="group -my-3 inline-flex items-center gap-2 py-3 text-[0.875rem] text-[var(--accent-text)] transition-opacity hover:opacity-80"
                        >
                          Apply for this role
                          <ArrowRight
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                        </a>
                      </p>
                    </div>
                  </div>
                </RevealListItem>
            ))}
          </ul>
        </Reveal>
      </Section>

      <section className="py-20 lg:py-28">
        <Container>
          <Reveal className="max-w-2xl">
            <Kicker>How we interview</Kicker>
            <p className="type-headline mt-4 text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)]">
              Three conversations, one of them with a client-facing scenario, and
              no take-home longer than two hours.
            </p>
            <p className="type-body mt-6">
              The scenario is real: a constraint you cannot change, a stakeholder
              who is accountable, and a design decision to defend. We are not
              testing whether you get it right. We are watching how you handle
              being told you are wrong.
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
