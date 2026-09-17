import { notFound } from "next/navigation";
import { renderOgImage, OG_SIZE } from "@/lib/og";
import { getInsight, getInsights, formatInsightDate } from "@/lib/insights";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getInsights().map((insight) => ({ slug: insight.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = getInsight(slug);

  if (!insight) notFound();

  return renderOgImage({
    kicker: insight.category,
    title: insight.title,
    footer: `${formatInsightDate(insight.date)} · ${insight.readingMinutes} min read`,
  });
}
