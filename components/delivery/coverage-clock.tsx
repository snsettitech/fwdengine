"use client";

import { activeHubs, hubs, type Hub } from "@/content/hubs";
import { cn } from "@/lib/cn";
import { useNow } from "@/lib/use-hydrated";

const SHIFT_START = 9;
const SHIFT_END = 18;

function localHour(hub: Hub, now: Date): number {
  // Intl resolves daylight saving for us; hand-rolled offset arithmetic
  // would be wrong twice a year in four of these cities.
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: hub.tz,
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);
  const hour = parts.find((part) => part.type === "hour")?.value ?? "0";
  return Number.parseInt(hour, 10) % 24;
}

function localTime(hub: Hub, now: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: hub.tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
}

/**
 * Live local time per hub, and which hubs are inside a 09:00-18:00 shift
 * right now. This is real: it is computed from the visitor's own clock, so it
 * carries no placeholder marking.
 */
export function CoverageClock({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const now = useNow();
  const list = compact ? activeHubs : hubs;

  // Render a stable skeleton before hydration: server and client clocks differ.
  if (!now) {
    return (
      <div className={cn("type-mono text-[0.6875rem] text-[var(--ink-dim)]", className)}>
        <span className="opacity-60">Resolving hub coverage…</span>
      </div>
    );
  }

  const onShift = activeHubs.filter((hub) => {
    const hour = localHour(hub, now);
    return hour >= SHIFT_START && hour < SHIFT_END;
  });

  if (compact) {
    return (
      <div className={cn("type-mono text-[0.6875rem]", className)}>
        <div className="flex items-center gap-2 text-[var(--ink-dim)]">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 bg-[var(--accent-text)] animate-pulse-node"
          />
          <span>
            {onShift.length} of {activeHubs.length} hubs on shift
          </span>
        </div>
        <ul className="mt-2.5 space-y-1">
          {list.map((hub) => (
            <li key={hub.id} className="flex items-center justify-between gap-6">
              <span className="text-[var(--ink-muted)]">{hub.city}</span>
              <span className="tabular-nums text-[var(--ink-dim)]">
                {localTime(hub, now)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={cn("type-mono", className)}>
      <ul className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {list.map((hub) => {
          const hour = localHour(hub, now);
          const active = hub.status === "active" && hour >= SHIFT_START && hour < SHIFT_END;
          return (
            <li
              key={hub.id}
              className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-3.5 sm:grid-cols-[1.2fr_2fr_auto]"
            >
              <span className="flex items-center gap-2.5 text-[0.8125rem] text-[var(--ink)]">
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-block h-1.5 w-1.5 shrink-0",
                    active
                      ? "bg-[var(--accent-text)] animate-pulse-node"
                      : hub.status === "planned"
                        ? "bg-[var(--ink-dim)] opacity-40"
                        : "bg-[var(--ink-dim)]",
                  )}
                />
                {hub.city}
                {hub.status === "planned" ? (
                  <span className="text-[0.625rem] uppercase tracking-[0.14em] text-[var(--amber)]">
                    planned
                  </span>
                ) : null}
              </span>
              <span className="hidden text-[0.75rem] text-[var(--ink-dim)] sm:block">
                {active ? "On shift" : hub.status === "planned" ? "Not yet staffed" : "Off shift"}
              </span>
              <span className="tabular-nums text-[0.8125rem] text-[var(--ink-muted)]">
                {localTime(hub, now)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
