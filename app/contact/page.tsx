import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { AmbientField } from "@/components/visual/ambient-field";
import { Enter } from "@/components/motion/enter";
import { QualificationForm } from "@/components/forms/qualification-form";
import { CoverageClock } from "@/components/delivery/coverage-clock";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Talk to Us",
  description:
    "Tell us the institution, the constraint and the deadline. If the work is not a fit, we will say so in the first conversation rather than the third.",
  alternates: { canonical: "/contact" },
};

const whatHappensNext = [
  {
    step: "01",
    title: "An engineer reads it",
    body: "Not a sales development representative. The person who replies is someone who would be on the pod.",
  },
  {
    step: "02",
    title: "A 45-minute technical call",
    body: "Your architecture, your control boundary, your deadline. We will tell you in that call whether we think it is achievable.",
  },
  {
    step: "03",
    title: "A written scoping note",
    body: "What a pod would do in the first sixteen weeks, what access it needs, and what would make us walk away.",
  },
] as const;

export default function ContactPage() {
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-28 sm:pt-32 lg:pb-32 lg:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="substrate" />
        <div
          className="absolute -right-[16%] -top-[26%] h-[720px] w-[720px] rounded-full opacity-55 animate-drift"
          style={{
            background:
              "radial-gradient(circle, var(--glow-indigo) 0%, transparent 66%)",
            filter: "blur(34px)",
          }}
        />
        <AmbientField />
      </div>

      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <Enter>
              <Kicker>Talk to us</Kicker>
              <h1 className="type-display mt-6 text-[clamp(2.125rem,1.5rem+2.4vw,3.5rem)]">
                Tell us the institution, the constraint and the deadline.
              </h1>
              <p className="type-lede mt-7">
                If the work is not a fit, we will say so in the first
                conversation rather than the third. The fields on the right are
                the ones that change who replies.
              </p>
            </Enter>

            <Enter delay={0.12} className="mt-12">
              <h2 className="type-kicker">What happens next</h2>
              <ol className="mt-5 border-t border-[var(--line)]">
                {whatHappensNext.map((item) => (
                  <li
                    key={item.step}
                    className="flex gap-5 border-b border-[var(--line)] py-5"
                  >
                    <span className="type-mono mt-0.5 shrink-0 text-[0.6875rem] text-[var(--accent-text)]">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-[0.9375rem] font-semibold text-[var(--ink)]">
                        {item.title}
                      </h3>
                      <p
                        data-dense=""
                        className="mt-1.5 text-[0.875rem] leading-relaxed text-[var(--ink-muted)]"
                      >
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Enter>

            <Enter delay={0.2} className="mt-12">
              <h2 className="type-kicker">Or reach us directly</h2>
              <p className="mt-4">
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="type-mono text-[0.9375rem] text-[var(--accent-text)] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-80"
                >
                  {site.contactEmail}
                </a>
              </p>
              <div className="mt-8">
                <h2 className="type-kicker">Hubs on shift now</h2>
                <CoverageClock compact className="mt-4" />
              </div>
            </Enter>
          </div>

          <Enter delay={0.08}>
            <QualificationForm />
          </Enter>
        </div>
      </Container>
    </section>
  );
}
