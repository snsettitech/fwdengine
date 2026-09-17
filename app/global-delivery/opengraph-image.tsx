import { renderOgImage, OG_SIZE } from "@/lib/og";
import { site } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Seven hubs, one engineering organisation, and a handoff that is written down.";

export default async function Image() {
  return renderOgImage({
    kicker: "Global delivery",
    title: "Seven hubs, one engineering organisation, and a handoff that is written down.",
    footer: site.domain,
  });
}
