"use client";

import { useReducedMotion } from "motion/react";
import { statusStrip, PLACEHOLDER } from "@/content/metrics";
import { cn } from "@/lib/cn";

/**
 * The system readout under the hero.
 *
 * Two rules hold this component together:
 *  1. While `statusStrip.isLive` is false, a persistent "simulated" marker is
 *     rendered and cannot be styled away. A prospect must never mistake this
 *     for production telemetry.
 *  2. Unfilled figures render the raw placeholder token in amber. It is meant
 *     to be impossible to ship by accident.
 */
export function StatusStrip() {
  const reduce = useReducedMotion();
  const fields = statusStrip.fields;

  const row = (keySuffix: string, ariaHidden: boolean) => (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      {fields.map((field) => {
        const unfilled = field.value.includes(PLACEHOLDER);
        return (
          <li
            key={`${field.key}-${keySuffix}`}
            className="flex items-center gap-2.5 whitespace-nowrap px-6 text-[0.75rem]"
          >
            <span
              aria-hidden="true"
              className={cn(
                "inline-block h-1.5 w-1.5",
                unfilled ? "bg-[var(--amber)]" : "bg-[var(--accent-text)]",
              )}
            />
            <span
              className={cn(
                "type-mono",
                unfilled
                  ? "text-[var(--amber)]"
                  : "font-medium text-[var(--ink)]",
              )}
            >
              {field.value}
            </span>
            <span className="type-mono text-[var(--ink-dim)]">{field.label}</span>
            <span aria-hidden="true" className="pl-6 text-[var(--line-strong)]">
              ·
            </span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="relative border-y border-[var(--line)] bg-[var(--canvas-deep)]/60 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[96rem] items-stretch">
        <p className="z-10 flex shrink-0 items-center gap-2 border-r border-[var(--line)] bg-[var(--canvas)] px-5 py-3 sm:px-8 lg:px-12">
          <span className="type-mono text-[0.625rem] uppercase tracking-[0.18em] text-[var(--amber)]">
            {statusStrip.isLive ? "Live" : "Simulated"}
          </span>
        </p>

        <div className="group relative flex-1 overflow-hidden py-3">
          {reduce ? (
            <div className="overflow-x-auto">{row("static", false)}</div>
          ) : (
            <div
              className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
              style={{ ["--marquee-duration" as string]: "52s" }}
            >
              {row("a", false)}
              {row("b", true)}
            </div>
          )}

          {/* Fade the strip into the page edges rather than cutting it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-24"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--canvas))",
            }}
          />
        </div>
      </div>

      {!statusStrip.isLive ? (
        <p className="sr-only">{statusStrip.note}</p>
      ) : null}
    </div>
  );
}
