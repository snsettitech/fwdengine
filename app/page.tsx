import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { ProblemSection } from "@/components/home/problem";
import { FdeModelSection } from "@/components/home/fde-model";
import { AgenticLayerSection } from "@/components/home/agentic-layer";
import { GlobalDeliverySection } from "@/components/home/global-delivery";
import { UseCasesSection } from "@/components/home/use-cases";
import { ProofMetricsSection } from "@/components/home/proof-metrics";
import { EngagementSection } from "@/components/home/engagement";
import { CareersTeaser } from "@/components/home/careers-teaser";
import { FinalCta } from "@/components/home/final-cta";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <FdeModelSection />
      <AgenticLayerSection />
      <GlobalDeliverySection />
      <UseCasesSection />
      <ProofMetricsSection />
      <EngagementSection />
      <CareersTeaser />
      <FinalCta />
    </>
  );
}
