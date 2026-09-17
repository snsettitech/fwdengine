"use client";

import { useReducedMotion } from "motion/react";
import { statusStrip, isPlaceholder } from "@/content/metrics";

/**
 * The system readout under the hero: a slow marquee of operating figures.
 *
 * It pauses on hover so a number can actually be read, and under
 * prefers-reduced-motion it becomes a plain scrollable row instead.
 */
export function StatusStrip() {
  const reduce = useReducedMotion();
  const fields = statusStrip.fields.filter((field) => !isPlaceholder(field));

  if (fields.length === 0) return null;

  const row = (keySuffix: string, ariaHidden: boolean) => (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      {fields.map((field) => (
        <li
          key={`${field.key}-${keySuffix}`}
          className="flex items-center gap-2.5 whitespace-nowrap px-6 text-[0.75rem]"
        >
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 bg-[var(--accent-text)]"
          />
          <span className="type-mono font-medium text-[var(--ink)]">
            {field.value}
          </span>
          <span className="type-mono text-[var(--ink-dim)]">{field.label}</span>
          <span aria-hidden="true" className="pl-6 text-[var(--line-strong)]">
            ·
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative border-y border-[var(--line)] bg-[var(--canvas-deep)]/60 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[96rem] items-stretch">
        <p className="z-10 flex shrink-0 items-center gap-2 border-r border-[var(--line)] bg-[var(--canvas)] px-5 py-3 sm:px-8 lg:px-12">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 bg-[var(--accent-text)] animate-pulse-node"
          />
          <span className="type-mono text-[0.625rem] uppercase tracking-[0.18em] text-[var(--ink-dim)]">
            System
          </span>
        </p>

        <div className="group relative flex-1 overflow-hidden py-3">
          {reduce ? (
            <div className="overflow-x-auto">{row("static", false)}</div>
          ) : (
            <div
              className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
              style={{ ["--marquee-duration" as string]: "58s" }}
            >
              {row("a", false)}
              {row("b", true)}
            </div>
          )}

          {/* Fade the strip into the page edge rather than cutting it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-24"
            style={{
              background: "linear-gradient(to right, transparent, var(--canvas))",
            }}
          />
        </div>
      </div>
    </div>
  );
}
