import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Kicker } from "@/components/ui/kicker";
import { BackLink } from "@/components/ui/text-link";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { industries, getIndustry } from "@/content/industries";
import { CTA_HREF } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);

  if (!industry) return { title: "Industry not found" };

  return {
    title: industry.name,
    description: industry.summary,
    alternates: { canonical: `/industries/${industry.slug}` },
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);

  if (!industry) notFound();

  const position = industries.findIndex((item) => item.slug === industry.slug);
  const next = industries[(position + 1) % industries.length];

  return (
    <>
      <PageHero
        kicker={`Industries · ${industry.name}`}
        index={industry.index}
        title={industry.summary}
        aside={
          <div className="glass edge-lit rounded-[10px] p-5">
            <h2 className="type-kicker">Regimes shaping the control design</h2>
            <ul className="mt-4 space-y-2.5">
              {industry.regimes.map((regime) => (
                <li
                  key={regime}
                  className="type-mono flex items-center gap-2.5 text-[0.75rem] text-[var(--ink)]"
                >
                  <span
                    aria-hidden="true"
                    className="inline-block h-1 w-1 shrink-0 bg-[var(--amber)]"
                  />
                  {regime}
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <BackLink href="/industries">All industries</BackLink>
      </PageHero>

      <Section
        index="02"
        kicker="The constraint"
        headline="What actually stops the work here."
        width="prose"
        substrate
      >
        <Reveal className="prose-fwd">
          <p>{industry.constraint}</p>
        </Reveal>
      </Section>

      <Section
        index="03"
        kicker="Workstreams"
        headline={`Where a pod starts in ${industry.name.toLowerCase()}.`}
        lede={
          <p>
            Each of these is scoped to be in production inside one engagement,
            behind a gate, on a bounded slice of real volume.
          </p>
        }
        className="border-y border-[var(--line)] bg-[var(--canvas-deep)]"
      >
        <Reveal
          stagger={0.09}
          className="grid gap-px border border-[var(--line)] bg-[var(--line)] lg:grid-cols-2"
        >
          {industry.workstreams.map((workstream, index) => (
            <RevealItem
              key={workstream.title}
              className="bg-[var(--canvas)] p-7 lg:p-9"
            >
              <span className="type-mono text-[0.6875rem] text-[var(--accent-text)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="type-headline mt-4 text-[1.3125rem]">
                {workstream.title}
              </h3>
              <p className="type-body mt-3.5">
                {workstream.mechanism}
              </p>
            </RevealItem>
          ))}
        </Reveal>
      </Section>

      <section className="py-20 lg:py-28">
        <Container>
          <Reveal className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <Kicker>Talk to us</Kicker>
              <p className="type-headline mt-4 text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)]">
                Tell us which of these is on your board’s agenda this quarter.
              </p>
            </div>
            <ButtonLink href={CTA_HREF} size="lg">
              Deploy a Team
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </ButtonLink>
          </Reveal>

          <Reveal delay={0.1} className="mt-16 border-t border-[var(--line)] pt-7">
            <Link
              href={`/industries/${next.slug}`}
              className="group flex items-baseline justify-between gap-6 py-3"
            >
              <span className="type-kicker">Next industry</span>
              <span className="flex items-center gap-3 text-[1.125rem] text-[var(--ink)] transition-colors group-hover:text-[var(--accent-text)]">
                {next.name}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
