import { Section } from "@/components/layout/section";
import { TextLink } from "@/components/ui/text-link";
import { PodDeployment } from "@/components/visual/pod-deployment";
import { Reveal, RevealItem } from "@/components/motion/reveal";

const principles = [
  {
    title: "The pod works in your stack, not next to it",
    body: "Access, network path and isolation boundary are signed off in week one. Nothing is built against an extract that will later need porting.",
  },
  {
    title: "Humans and agents are on the same pod",
    body: "An FDE writes the harness, the agent runs the volume, and the engineer who built it is the one paged when it misbehaves. There is no handover to an operations vendor.",
  },
  {
    title: "Weekly ship cadence, in your environment",
    body: "Every week produces something a client engineer can run. If a week produces only a document, the week failed.",
  },
  {
    title: "The control boundary is written before the code",
    body: "What an agent may read, what it may propose and what it may never decide is agreed with risk and security before the first build, because it determines the architecture.",
  },
] as const;

export function FdeModelSection() {
  return (
    <Section
      id="fde-model"
      index="02"
      kicker="The FDE Model"
      headline="A pod lands inside your estate and starts shipping in week two."
      lede={
        <p>
          Forward deployed engineering is a delivery structure, not a job title.
          Three to five engineers, embedded, with the authority to build and the
          obligation to ship on a weekly cadence against your real systems.
        </p>
      }
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16">
        <Reveal stagger={0.1} className="space-y-px">
          {principles.map((principle, index) => (
            <RevealItem
              key={principle.title}
              className="border-t border-[var(--line)] py-6 last:border-b"
            >
              <div className="flex gap-5">
                <span className="type-mono mt-1 shrink-0 text-[0.6875rem] text-[var(--ink-dim)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-[var(--ink)]">
                    {principle.title}
                  </h3>
                  <p className="type-body mt-2">{principle.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}

          <RevealItem className="pt-8">
            <TextLink href="/fde-model">Read the methodology in full</TextLink>
          </RevealItem>
        </Reveal>

        <Reveal delay={0.15} distance={24}>
          <PodDeployment />
        </Reveal>
      </div>
    </Section>
  );
}
