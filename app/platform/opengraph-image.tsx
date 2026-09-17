import { renderOgImage, OG_SIZE } from "@/lib/og";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "An execution substrate you can read, audit and turn off.";

export default async function Image() {
  return renderOgImage({
    kicker: "Platform",
    title: "An execution substrate you can read, audit and turn off.",
    footer: site.domain,
  });
}
