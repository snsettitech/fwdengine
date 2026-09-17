import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Kicker } from "@/components/ui/kicker";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";

type SectionProps = {
  id?: string;
  index?: string;
  kicker?: string;
  /** The single job this section does. One headline, no competing ones. */
  headline?: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Faint engineering grid behind the section. */
  substrate?: boolean;
  width?: "default" | "wide" | "prose";
  /** Pull the header to a narrower measure than the body below it. */
  headerClassName?: string;
};

export function Section({
  id,
  index,
  kicker,
  headline,
  lede,
  children,
  className,
  substrate = false,
  width = "default",
  headerClassName,
}: SectionProps) {
  const hasHeader = Boolean(kicker || headline || lede);

  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 py-24 sm:py-28 lg:py-36", className)}
    >
      {substrate ? <div aria-hidden="true" className="substrate" /> : null}
      <Container width={width} className="relative">
        {hasHeader ? (
          <Reveal className={cn("max-w-3xl", headerClassName)} stagger={0.08}>
            {kicker ? <Kicker index={index}>{kicker}</Kicker> : null}
            {headline ? (
              <h2 className="type-headline mt-5 text-[clamp(1.875rem,1.3rem+2.1vw,3rem)]">
                {headline}
              </h2>
            ) : null}
            {lede ? <div className="type-lede mt-6 max-w-2xl">{lede}</div> : null}
          </Reveal>
        ) : null}
        {children ? <div className={cn(hasHeader && "mt-14 lg:mt-20")}>{children}</div> : null}
      </Container>
    </section>
  );
}
