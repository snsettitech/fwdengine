import type { MetadataRoute } from "next";
import { site, isPreviewDeployment } from "@/lib/site";

// Derived from committed content, so it pre-renders at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // A preview deployment is closed to crawlers outright.
  if (isPreviewDeployment) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The intake route is a POST endpoint; there is nothing to crawl.
        disallow: ["/api/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
