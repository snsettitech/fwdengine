import { Section } from "@/components/layout/section";
import { Reveal, RevealListItem } from "@/components/motion/reveal";
import { useCases } from "@/content/use-cases";

export function UseCasesSection() {
  return (
    <Section
      id="use-cases"
      index="05"
      kicker="Where agents earn their place"
      headline="Seven places agentic systems pay for themselves in regulated finance."
      lede={
        <p>
          Each of these states a mechanism and the control that makes it
          deployable. None of them ends with an agent holding a decision right.
        </p>
      }
    >
      <Reveal stagger={0.06}>
        <ol className="border-t border-[var(--line)]">
          {useCases.map((useCase) => (
            <RevealListItem key={useCase.id} className="group grid gap-x-10 gap-y-3 border-b border-[var(--line)] py-8 transition-colors duration-300 hover:bg-[var(--surface-1)]/50 lg:grid-cols-[auto_1fr_1.4fr] lg:py-9">
                <span className="type-mono text-[0.6875rem] text-[var(--ink-dim)] lg:pt-1.5">
                  {useCase.index}
                </span>

                <div className="lg:max-w-[16rem]">
                  <h3 className="type-headline text-[1.375rem] text-[var(--ink)]">
                    {useCase.title}
                  </h3>
                  <p className="type-mono mt-2.5 text-[0.625rem] uppercase tracking-[0.16em] text-[var(--accent-text)]">
                    {useCase.domain}
                  </p>
                </div>

                <div>
                  <p className="text-base leading-relaxed text-[var(--ink-muted)]">
                    {useCase.mechanism}
                  </p>
                  <p
                    data-footnote=""
                    className="mt-3.5 border-l border-[var(--line-strong)] pl-4 text-[0.875rem] leading-relaxed text-[var(--ink-dim)]"
                  >
                    <span className="type-mono mr-2 text-[0.625rem] uppercase tracking-[0.14em] text-[var(--amber)]">
                      Control
                    </span>
                    {useCase.control}
                  </p>
                </div>
              </RevealListItem>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
