import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { AmbientField } from "@/components/visual/ambient-field";
import { Enter } from "@/components/motion/enter";

type PageHeroProps = {
  kicker: string;
  index?: string;
  title: string;
  lede?: ReactNode;
  /** Optional right-hand column: a diagram, a readout, a clock. */
  aside?: ReactNode;
  children?: ReactNode;
};

/**
 * Header for every page below the homepage. Same light treatment as the hero
 * so the brand does not change character between the front door and the rooms
 * behind it.
 *
 * Entrance is CSS (`Enter`), not Framer Motion: the h1 here is the page's LCP
 * element, and Framer Motion would keep it transparent until hydration.
 */
export function PageHero({
  kicker,
  index,
  title,
  lede,
  aside,
  children,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-[var(--line)] pb-16 pt-28 sm:pt-32 lg:pb-20 lg:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="substrate" />
        <div
          className="absolute -right-[14%] -top-[34%] h-[680px] w-[680px] rounded-full opacity-55 animate-drift"
          style={{
            background:
              "radial-gradient(circle, var(--glow-indigo) 0%, transparent 66%)",
            filter: "blur(34px)",
          }}
        />
        <AmbientField />
      </div>

      <Container>
        <div
          className={
            aside
              ? "grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16"
              : ""
          }
        >
          <div className="max-w-3xl">
            <Enter>
              <Kicker index={index}>{kicker}</Kicker>
              <h1 className="type-display mt-6 text-[clamp(2.125rem,1.5rem+2.6vw,3.875rem)]">
                {title}
              </h1>
            </Enter>
            {lede ? (
              <Enter delay={0.12}>
                <div className="type-lede mt-7 max-w-2xl">{lede}</div>
              </Enter>
            ) : null}
            {children ? (
              <Enter delay={0.2} className="mt-9">
                {children}
              </Enter>
            ) : null}
          </div>

          {aside ? <Enter delay={0.18}>{aside}</Enter> : null}
        </div>
      </Container>
    </section>
  );
}
