import { renderOgImage, OG_SIZE } from "@/lib/og";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Six positions we hold, and will argue for.";

export default async function Image() {
  return renderOgImage({
    kicker: "The FDE Model",
    title: "Six positions we hold, and will argue for.",
    footer: site.domain,
  });
}
