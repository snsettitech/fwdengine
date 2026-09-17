import { Section } from "@/components/layout/section";
import { Reveal, RevealItem } from "@/components/motion/reveal";

const failures = [
  {
    id: "legacy",
    title: "The data is where nobody is allowed to go",
    body: "The answer lives in a core platform on a release cadence measured in quarters, behind a change board that meets fortnightly. Every proposal requiring a core change dies there. The proposals that survive are the ones that never needed one.",
  },
  {
    id: "compliance",
    title: "Compliance is treated as a final gate",
    body: "A model risk review at the end of a build is an autopsy. By then the architecture has already decided whether per-decision reasoning can be produced, and it usually cannot. The control design has to come before the first line of code, not after the demo.",
  },
  {
    id: "vendor",
    title: "Vendor-shaped solutions meet bank-shaped problems",
    body: "The platform was built for a generic institution. Yours has forty years of accumulated specificity: exception handling nobody documented, a policy manual that contradicts itself in two places, and an operator who knows which of the two is enforced. Generic software cannot absorb that. Engineers sitting in the room can.",
  },
  {
    id: "pilot",
    title: "The pilot was never allowed to become production",
    body: "It ran on extracted data, in an isolated sandbox, against a use case chosen for demonstrability rather than value. It worked. It was also structurally incapable of promotion, because nothing about it touched the controls, the auth model or the audit estate it would need to satisfy.",
  },
] as const;

export function ProblemSection() {
  return (
    <Section
      id="problem"
      index="01"
      kicker="Why this does not ship today"
      headline="Institutions are not slow at AI. They are slow at deploying software into regulated infrastructure."
      lede={
        <p>
          And AI is software. The constraint is almost never model capability.
          Four things stop the work, and all four are engineering and governance
          problems with known shapes.
        </p>
      }
      substrate
    >
      <Reveal stagger={0.1} className="grid gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
        {failures.map((failure, index) => (
          <RevealItem key={failure.id} className="bg-[var(--canvas)] p-7 lg:p-9">
            <span className="type-mono text-[0.6875rem] text-[var(--ink-dim)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="type-headline mt-4 text-[1.375rem] text-[var(--ink)]">
              {failure.title}
            </h3>
            <p className="type-body mt-4">{failure.body}</p>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
