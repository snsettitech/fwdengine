"use client";

import { useEffect, useRef } from "react";
import { Section } from "@/components/layout/section";
import { engagementPhases } from "@/content/engagement";

/**
 * The engagement model as a timeline whose spine draws itself as you scroll.
 *
 * GSAP ScrollTrigger drives this rather than Framer Motion because the
 * progress line is scroll-linked (scrubbed), not triggered once.
 *
 * GSAP is imported dynamically, and only once the section is within a screen
 * of the viewport. It is roughly 70KB, it sits well below the fold, and most
 * visitors decide about us before they reach it. Paying for it up front
 * showed up directly in the mobile Lighthouse score.
 */
export function EngagementSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let disposed = false;
    let revert: (() => void) | undefined;

    const setup = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      revert = () => media.revert();

      // The reduced-motion branch simply never creates the tweens.
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const spine = root.querySelector<HTMLElement>("[data-spine]");
        const steps = gsap.utils.toArray<HTMLElement>("[data-phase]", root);

        if (spine) {
          gsap.fromTo(
            spine,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              transformOrigin: "left center",
              scrollTrigger: {
                trigger: root,
                start: "top 72%",
                end: "bottom 78%",
                scrub: 0.6,
              },
            },
          );
        }

        steps.forEach((step, index) => {
          gsap.fromTo(
            step,
            { opacity: 0, y: 26 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              delay: index * 0.06,
              scrollTrigger: { trigger: step, start: "top 88%", once: true },
            },
          );
        });
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        void setup();
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(root);

    return () => {
      disposed = true;
      observer.disconnect();
      revert?.();
    };
  }, []);

  return (
    <Section
      id="engagements"
      index="07"
      kicker="How engagements work"
      headline="Embed, build, ship, operate. Sixteen weeks to production, then a real decision about who runs it."
      lede={
        <p>
          Handover is a first-class ending, not a failure to renew. If your
          engineers hold the repository, the harnesses and the runbooks, and we
          have watched them run an incident, the engagement worked.
        </p>
      }
      width="wide"
      headerClassName="max-w-3xl"
    >
      <div ref={rootRef} className="relative">
        {/* The spine: horizontal on desktop, hidden on stacked mobile. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[38px] hidden h-px bg-[var(--line)] lg:block"
        >
          <div
            data-spine
            className="h-px w-full origin-left bg-[var(--accent-text)]"
          />
        </div>

        <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
          {engagementPhases.map((phase) => (
            <li key={phase.id} data-phase className="relative">
              <div className="flex items-center gap-3">
                <span className="type-mono text-[0.6875rem] text-[var(--accent-text)]">
                  {phase.index}
                </span>
                <span className="type-mono text-[0.625rem] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
                  {phase.duration}
                </span>
              </div>

              <div
                aria-hidden="true"
                className="mt-4 hidden h-3 items-center lg:flex"
              >
                <span className="h-2.5 w-2.5 rotate-45 border border-[var(--accent-text)] bg-[var(--canvas)]" />
              </div>

              <h3 className="type-headline mt-5 text-[1.625rem] lg:mt-6">
                {phase.title}
              </h3>
              <p className="type-body mt-3.5">{phase.summary}</p>

              <ul className="mt-6 space-y-2.5 border-t border-[var(--line)] pt-5">
                {phase.deliverables.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55rem] inline-block h-1 w-1 shrink-0 bg-[var(--ink-dim)]"
                    />
                    <span className="text-[0.8125rem] leading-relaxed text-[var(--ink-muted)]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
