import { renderOgImage, OG_SIZE } from "@/lib/og";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "We hire engineers who can sit in front of a Head of Risk and ship the change that week.";

export default async function Image() {
  return renderOgImage({
    kicker: "Careers",
    title: "We hire engineers who can sit in front of a Head of Risk and ship the change that week.",
    footer: site.domain,
  });
}
