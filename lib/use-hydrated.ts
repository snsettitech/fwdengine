"use client";

import { useSyncExternalStore } from "react";

/* -------------------------------------------------------------------------- */
/* Hydration                                                                  */
/* -------------------------------------------------------------------------- */

/** A store that never changes: the value differs only between server and client. */
const noopSubscribe = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

/**
 * True once the component has hydrated in the browser, false during SSR and
 * the first client render.
 *
 * Use this instead of `useEffect(() => setMounted(true), [])`. Both produce
 * the same result, but this reads the server/client difference as a snapshot
 * rather than scheduling a state update, so there is no cascading render.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, getTrue, getFalse);
}

/* -------------------------------------------------------------------------- */
/* Shared clock                                                               */
/* -------------------------------------------------------------------------- */

const TICK_MS = 30_000;

/**
 * One clock for the whole page.
 *
 * All three arguments to `useSyncExternalStore` are module-level and
 * referentially stable. That is not a style preference: an inline `subscribe`
 * is a new function on every render, so React tears down and re-creates the
 * subscription each time, and if subscribing publishes a value the result is
 * an unbounded render loop (React error #185). This cost an afternoon once.
 */
const clock: {
  now: Date | null;
  listeners: Set<() => void>;
  timer: ReturnType<typeof setInterval> | null;
} = { now: null, listeners: new Set(), timer: null };

function subscribeToClock(onChange: () => void): () => void {
  clock.listeners.add(onChange);

  if (clock.timer === null) {
    // Publish a fresh value as the subscription opens. React re-reads the
    // snapshot immediately after subscribing, so there is no need to notify,
    // and notifying here is what creates the loop.
    clock.now = new Date();
    clock.timer = setInterval(() => {
      clock.now = new Date();
      for (const listener of clock.listeners) listener();
    }, TICK_MS);
  }

  return () => {
    clock.listeners.delete(onChange);
    if (clock.listeners.size === 0 && clock.timer !== null) {
      clearInterval(clock.timer);
      clock.timer = null;
    }
  };
}

const getClockSnapshot = () => clock.now;
const getClockServerSnapshot = (): Date | null => null;

/**
 * The current time, refreshed every 30 seconds.
 *
 * Returns null until hydrated: the server has no meaningful "now" for the
 * visitor's clock, and rendering one produces a hydration mismatch.
 */
export function useNow(): Date | null {
  return useSyncExternalStore(
    subscribeToClock,
    getClockSnapshot,
    getClockServerSnapshot,
  );
}
