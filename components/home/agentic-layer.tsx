"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { pipelineStages } from "@/content/platform";
import { cn } from "@/lib/cn";

const signalColor = {
  indigo: "var(--indigo-bright)",
  cyan: "var(--cyan)",
  amber: "var(--amber)",
} as const;

/**
 * The pipeline, as a tab list rather than a row of cards.
 *
 * Six stages is too much to show at once without turning into a wall, and a
 * card grid would flatten the fact that these run in order. Tabs keep the
 * sequence legible and keep one job per screen.
 */
export function AgenticLayerSection() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = pipelineStages.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = active === last ? 0 : active + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = active === 0 ? last : active - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;

    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const stage = pipelineStages[active];

  return (
    <Section
      id="agentic-layer"
      index="03"
      kicker="Agentic computation layer"
      headline="Six stages, an explicit state machine, and a gate that a machine cannot open."
      lede={
        <p>
          Agents here are stateless functions with a prompt and a schema. What
          runs next is decided by infrastructure you can read, not by a model
          reasoning its way through a framework at runtime.
        </p>
      }
      substrate
      width="wide"
      headerClassName="max-w-3xl"
    >
      <div className="glass edge-lit rounded-[10px] p-5 sm:p-7 lg:p-9">
        <div
          role="tablist"
          aria-label="Pipeline stages"
          onKeyDown={onKeyDown}
          className="relative grid gap-2 sm:grid-cols-3 lg:grid-cols-6"
        >
          {pipelineStages.map((item, index) => {
            const selected = index === active;
            const colour = signalColor[item.signal];
            return (
              <button
                key={item.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                role="tab"
                id={`stage-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`stage-panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                className={cn(
                  "group relative flex flex-col items-start gap-2 rounded-[3px] border p-3.5 text-left transition-colors duration-200",
                  selected
                    ? "border-[var(--line-strong)] bg-[var(--surface-2)]"
                    : "border-[var(--line)] bg-transparent hover:border-[var(--line-strong)] hover:bg-[var(--surface-1)]",
                )}
              >
                <span className="flex w-full items-center justify-between gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 shrink-0 transition-opacity"
                    style={{
                      backgroundColor: colour,
                      opacity: selected ? 1 : 0.4,
                    }}
                  />
                  <span className="type-mono text-[0.625rem] text-[var(--ink-dim)]">
                    {item.index}
                  </span>
                </span>
                <span
                  className={cn(
                    "type-mono text-[0.6875rem] leading-tight tracking-[0.1em]",
                    selected ? "text-[var(--ink)]" : "text-[var(--ink-muted)]",
                  )}
                >
                  {item.nodeLabel}
                </span>
                {selected ? (
                  <motion.span
                    layoutId={reduce ? undefined : "stage-underline"}
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-px"
                    style={{ backgroundColor: colour }}
                  />
                ) : null}

                {/* Sequence marker in the gap. These stages run in order and
                    the row has to say so without becoming a card grid. */}
                {index < pipelineStages.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -right-[11px] top-1/2 hidden -translate-y-1/2 items-center lg:flex"
                  >
                    <ChevronRight
                      className="h-3.5 w-3.5 text-[var(--ink-dim)]"
                      strokeWidth={1.5}
                    />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {pipelineStages.map((item, index) => (
          <div
            key={item.id}
            role="tabpanel"
            id={`stage-panel-${item.id}`}
            aria-labelledby={`stage-tab-${item.id}`}
            hidden={index !== active}
            tabIndex={0}
            className="mt-8 focus-visible:outline-2"
          >
            {index === active ? (
              <motion.div
                key={item.id}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-14"
              >
                <div>
                  <h3 className="type-headline text-[clamp(1.5rem,1.2rem+1vw,2.125rem)]">
                    {stage.title}
                  </h3>
                  <p className="type-lede mt-4 text-[1.0625rem]">{stage.summary}</p>
                  {item.signal === "amber" ? (
                    <p className="type-mono mt-6 border-l-2 border-[var(--amber)] pl-4 text-[0.75rem] leading-relaxed text-[var(--amber)]">
                      Human-in-the-loop. No path reaches a consequential action
                      without a named actor.
                    </p>
                  ) : null}
                </div>

                <ul className="space-y-px">
                  {item.detail.map((line) => (
                    <li
                      key={line}
                      className="flex gap-4 border-t border-[var(--line)] py-3.5 last:border-b"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.5rem] inline-block h-1 w-1 shrink-0"
                        style={{ backgroundColor: signalColor[item.signal] }}
                      />
                      <span className="text-base leading-relaxed text-[var(--ink-muted)]">
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  );
}
