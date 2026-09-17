import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { industries } from "@/content/industries";
import { getInsights } from "@/lib/insights";

// Derived from committed content, so it pre-renders at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "monthly", priority: 1, lastModified: now },
    { url: `${site.url}/platform`, changeFrequency: "monthly", priority: 0.9, lastModified: now },
    { url: `${site.url}/fde-model`, changeFrequency: "monthly", priority: 0.9, lastModified: now },
    { url: `${site.url}/industries`, changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${site.url}/global-delivery`, changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${site.url}/insights`, changeFrequency: "weekly", priority: 0.8, lastModified: now },
    { url: `${site.url}/careers`, changeFrequency: "weekly", priority: 0.7, lastModified: now },
    { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.7, lastModified: now },
  ];

  const industryRoutes: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: `${site.url}/industries/${industry.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: now,
  }));

  const insightRoutes: MetadataRoute.Sitemap = getInsights().map((insight) => ({
    url: `${site.url}/insights/${insight.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
    lastModified: new Date(`${insight.date}T00:00:00Z`),
  }));

  return [...staticRoutes, ...industryRoutes, ...insightRoutes];
}
