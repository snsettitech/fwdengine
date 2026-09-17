"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

type CountUpProps = {
  /** The final figure as a string, e.g. "11", "99.95", "4.2". */
  value: string;
  className?: string;
  durationMs?: number;
};

/**
 * Animates a numeric readout when it scrolls into view.
 *
 * Non-numeric values (including the metrics placeholder token) are rendered
 * verbatim and never animated: a placeholder must not masquerade as a
 * settling live figure.
 */
export function CountUp({ value, className, durationMs = 1400 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();

  const target = Number.parseFloat(value);
  const isNumeric = Number.isFinite(target) && /^[\d.]+$/.test(value.trim());
  const decimals = isNumeric && value.includes(".") ? value.split(".")[1].length : 0;
  const shouldAnimate = isNumeric && !reduce;

  /**
   * State holds only the tween's progress, 0 to 1. Everything else is derived
   * during render, so there is no effect that exists purely to push a value
   * into state that was already knowable.
   */
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!shouldAnimate || !inView) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / durationMs, 1);
      setProgress(elapsed);
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [shouldAnimate, inView, durationMs]);

  let display: string;
  if (!isNumeric) {
    display = value;
  } else if (!shouldAnimate) {
    display = target.toFixed(decimals);
  } else {
    // Ease-out quint: fast arrival, long settle. Reads as instrumentation.
    const eased = 1 - Math.pow(1 - progress, 5);
    display = (target * eased).toFixed(decimals);
  }

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
