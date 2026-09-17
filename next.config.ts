import type { NextConfig } from "next";

/**
 * Two build targets.
 *
 * Default: a Node/Vercel deployment. `/api/contact` is a real route handler,
 * so this is the only target where the qualification form works.
 *
 * `STATIC_PREVIEW=1 npm run build`: a fully static `out/` for any static host.
 * The form has nowhere to post and falls back to its error state with the
 * direct email address; everything else exports as static files.
 *
 * Set `BASE_PATH` when the host serves the site from a sub-directory rather
 * than a domain root, e.g. `/fwdengine` on GitHub Pages. Without it every
 * asset and link is requested from the origin root and nothing resolves.
 */
const isStaticPreview = process.env.STATIC_PREVIEW === "1";
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
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
