"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { GlobeFallback } from "@/components/delivery/globe-fallback";
import { useHydrated } from "@/lib/use-hydrated";

const GlobeScene = dynamic(() => import("@/components/three/globe-scene"), {
  ssr: false,
  loading: () => <GlobeFallback />,
});

type NetworkInformation = { saveData?: boolean };

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

/**
 * Whether this device should be asked to run the 3D scene at all.
 *
 * The viewport gate is not squeamishness, it is measured: on a throttled
 * mid-tier phone the scene cost 2.2 seconds of main-thread blocking and took
 * the page's Lighthouse performance score to 51. The SVG projection is drawn
 * from the same hub data, so a phone gets a real picture of the delivery
 * network instead of a slideshow.
 */
function deviceCanAfford(): boolean {
  if (!hasWebGL()) return false;

  const saveData =
    (navigator as Navigator & { connection?: NetworkInformation }).connection
      ?.saveData === true;
  if (saveData) return false;

  // Hardware concurrency is a coarse proxy, and absent on some browsers, so
  // its absence is not treated as a failure.
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores > 0 && cores < 4) return false;

  return window.matchMedia("(min-width: 1024px)").matches;
}

/**
 * Mounts the 3D globe only when it is about to be seen, and only when the
 * device and the visitor's preferences say it is welcome.
 *
 * The three.js bundle is code-split and never requested on a page view that
 * does not reach this section, which is what keeps the homepage's LCP and
 * main-thread time off the critical path.
 */
export function GlobeStage({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const hydrated = useHydrated();
  const reduce = useReducedMotion();

  // Probed during render rather than in an effect: it is a one-time read of
  // the environment, not state that needs synchronising.
  const allowed = useMemo(() => (hydrated ? deviceCanAfford() : false), [hydrated]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !allowed || shouldMount) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      // One screen of lead time. Any more and the three.js chunk competes
      // with the work that is actually on screen.
      { rootMargin: "200px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [allowed, shouldMount]);

  const useScene = allowed && !reduce && shouldMount;

  return (
    <div
      ref={containerRef}
      className={className}
      // The scene is decorative; the hub table beneath it carries the content.
      aria-hidden={useScene ? "true" : undefined}
    >
      {useScene ? <GlobeScene /> : <GlobeFallback />}
    </div>
  );
}
