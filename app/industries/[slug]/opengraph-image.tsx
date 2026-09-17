import { notFound } from "next/navigation";
import { renderOgImage, OG_SIZE } from "@/lib/og";
import { industries, getIndustry } from "@/content/industries";

export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);

  if (!industry) notFound();

  return renderOgImage({
    kicker: `Industries · ${industry.name}`,
    title: industry.summary,
    footer: industry.regimes.slice(0, 3).join(" · "),
  });
}
