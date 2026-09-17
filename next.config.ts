import type { NextConfig } from "next";

/**
 * `STATIC_PREVIEW=1 npm run build` produces a fully static `out/` directory
 * that can be dropped on any static host for a shareable preview.
 *
 * The production target is a Node/Vercel deployment, because `/api/contact`
 * is a real route handler. In preview mode that route cannot exist, so the
 * qualification form has nowhere to post and falls back to its error state
 * with the direct email address. Everything else — all 34 pages, the globe,
 * the OpenGraph images — exports as static files.
 */
const isStaticPreview = process.env.STATIC_PREVIEW === "1";

const nextConfig: NextConfig = {
  ...(isStaticPreview
    ? {
        output: "export",
        // Emit `/platform/index.html` and link to `/platform/`, so hosts that
        // only do directory-index resolution still serve deep links.
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
