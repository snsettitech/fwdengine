import { renderOgImage, OG_SIZE } from "@/lib/og";
import { site } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = `${site.name} — ${site.tagline}`;

export default async function Image() {
  return renderOgImage({
    kicker: "Forward deployed engineering for financial institutions",
    title: "We deploy engineers, and the agents they build, inside your institution.",
    footer: site.domain,
  });
}
