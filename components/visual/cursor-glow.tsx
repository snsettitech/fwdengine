"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * A soft light that trails the pointer, lifting whatever it passes over.
 * Desktop only: mounted only for fine pointers, so touch devices never pay
 * for it and never get a stuck glow at the last tap position.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    const apply = () => setEnabled(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!enabled || reduce) return;
    const element = ref.current;
    if (!element) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let frame = 0;
    let visible = false;

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        element.style.opacity = "1";
      }
    };

    const onLeave = () => {
      visible = false;
      element.style.opacity = "0";
    };

    const tick = () => {
      // Lag the pointer slightly: the light has mass.
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      element.style.transform = `translate3d(${currentX - 300}px, ${currentY - 300}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, reduce]);

  if (!enabled || reduce) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[600px] w-[600px] opacity-0 transition-opacity duration-500 mix-blend-screen"
      style={{
        background:
          "radial-gradient(circle, var(--glow-indigo) 0%, transparent 62%)",
        filter: "blur(40px)",
      }}
    />
  );
}
