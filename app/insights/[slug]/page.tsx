import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { ButtonLink } from "@/components/ui/button";
import { BackLink } from "@/components/ui/text-link";
import { AmbientField } from "@/components/visual/ambient-field";
import { Enter } from "@/components/motion/enter";
import { Reveal } from "@/components/motion/reveal";
import { getInsight, getInsights, formatInsightDate } from "@/lib/insights";
import { CTA_HREF, site } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getInsights().map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsight(slug);

  if (!insight) return { title: "Insight not found" };

  return {
    title: insight.title,
    description: insight.summary,
    alternates: { canonical: `/insights/${insight.slug}` },
    openGraph: {
      type: "article",
      title: insight.title,
      description: insight.summary,
      publishedTime: insight.date,
      authors: [insight.author],
    },
  };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const insight = getInsight(slug);

  if (!insight) notFound();

  const all = getInsights();
  const position = all.findIndex((item) => item.slug === insight.slug);
  const next = all[(position + 1) % all.length];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: insight.title,
    description: insight.summary,
    datePublished: insight.date,
    author: { "@type": "Organization", name: insight.author },
    publisher: { "@type": "Organization", name: site.legalName, url: site.url },
    url: `${site.url}/insights/${insight.slug}`,
  };

  return (
    <>
      <article>
        <header className="relative isolate overflow-hidden border-b border-[var(--line)] pb-14 pt-28 sm:pt-32 lg:pb-16 lg:pt-40">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="substrate" />
            <div
              className="absolute -right-[10%] -top-[30%] h-[560px] w-[560px] rounded-full opacity-45 animate-drift"
              style={{
                background:
                  "radial-gradient(circle, var(--glow-indigo) 0%, transparent 66%)",
                filter: "blur(34px)",
              }}
            />
            <AmbientField />
          </div>

          <Container width="prose">
            <Enter>
              <BackLink href="/insights">Insights</BackLink>

              <Kicker className="mt-8">{insight.category}</Kicker>

              <h1 className="type-display mt-5 text-[clamp(1.875rem,1.4rem+2.2vw,3.25rem)]">
                {insight.title}
              </h1>

              <p className="type-lede mt-6">{insight.summary}</p>

              <dl className="type-mono mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--line)] pt-5 text-[0.6875rem] text-[var(--ink-dim)]">
                <div className="flex gap-2">
                  <dt className="sr-only">Published</dt>
                  <dd>
                    <time dateTime={insight.date}>
                      {formatInsightDate(insight.date)}
                    </time>
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="sr-only">Author</dt>
                  <dd>{insight.author}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="sr-only">Reading time</dt>
                  <dd>{insight.readingMinutes} min read</dd>
                </div>
              </dl>
            </Enter>
          </Container>
        </header>

        <Container width="prose" className="py-16 lg:py-24">
          <div className="prose-fwd">
            <MDXRemote source={insight.body} />
          </div>
        </Container>
      </article>

      <section className="border-t border-[var(--line)] py-16 lg:py-24">
        <Container width="prose">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Kicker>Talk to us</Kicker>
              <p className="type-headline mt-4 text-[1.375rem]">
                We would rather have this argument in a room than in a comment
                thread.
              </p>
            </div>
            <ButtonLink href={CTA_HREF} size="md" className="shrink-0">
              Talk to Us
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </ButtonLink>
          </Reveal>

          {next && next.slug !== insight.slug ? (
            <Reveal delay={0.1} className="mt-14 border-t border-[var(--line)] pt-7">
              <Link href={`/insights/${next.slug}`} className="group block py-3">
                <span className="type-kicker">Next</span>
                <span className="mt-3 flex items-baseline justify-between gap-6">
                  <span className="type-headline text-[1.125rem] text-[var(--ink)] transition-colors group-hover:text-[var(--accent-text)]">
                    {next.title}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-[var(--ink-dim)] transition-transform duration-200 group-hover:translate-x-1"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Reveal>
          ) : null}
        </Container>
      </section>

      <Script
        id={`insight-schema-${insight.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        // Derived from validated frontmatter; no visitor input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}
