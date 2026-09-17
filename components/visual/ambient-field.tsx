"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

type Node = { x: number; y: number; vx: number; vy: number };
type Packet = { edge: number; t: number; speed: number };

const MAX_LINK_DISTANCE = 190;
const NODE_COUNT_DESKTOP = 34;
const NODE_COUNT_MOBILE = 16;

/**
 * The canvas paints raw rgba, so it cannot inherit the CSS custom properties
 * the rest of the site theming runs on. The palette is mirrored here instead,
 * with light mode pulled well back: the same mesh that reads as depth on
 * near-black reads as dirt on white.
 */
const PALETTES = {
  dark: {
    edge: (alpha: number) => `rgba(122, 138, 190, ${alpha * 0.16})`,
    node: "rgba(154, 163, 178, 0.38)",
    packet: (alpha: number) => `rgba(61, 220, 255, ${alpha})`,
  },
  light: {
    edge: (alpha: number) => `rgba(60, 74, 120, ${alpha * 0.1})`,
    node: "rgba(73, 83, 101, 0.26)",
    packet: (alpha: number) => `rgba(53, 53, 214, ${alpha * 0.7})`,
  },
} as const;

/**
 * The persistent background: a sparse mesh of drifting nodes with packets
 * travelling along edges. Suggests a live agent network without resorting to
 * the generic particle-constellation effect.
 *
 * Costs are bounded deliberately:
 *  - canvas 2D, no WebGL context held open behind every page
 *  - device pixel ratio capped at 2
 *  - paused when the tab is hidden or the canvas is scrolled out of view
 *  - not mounted at all under prefers-reduced-motion
 */
export function AmbientField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const palette = resolvedTheme === "light" ? PALETTES.light : PALETTES.dark;

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let edges: [number, number][] = [];
    let packets: Packet[] = [];
    let frame = 0;
    let running = true;

    const isCoarse =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches;
    const nodeCount = isCoarse ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;

    const seed = () => {
      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
      }));
      packets = [];
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const rebuildEdges = () => {
      edges = [];
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (dx * dx + dy * dy < MAX_LINK_DISTANCE * MAX_LINK_DISTANCE) {
            edges.push([i, j]);
          }
        }
      }
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -40) node.x = width + 40;
        if (node.x > width + 40) node.x = -40;
        if (node.y < -40) node.y = height + 40;
        if (node.y > height + 40) node.y = -40;
      }

      rebuildEdges();

      // Edges: hairlines that fade with distance.
      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const dx = nodes[a].x - nodes[b].x;
        const dy = nodes[a].y - nodes[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = 1 - dist / MAX_LINK_DISTANCE;
        ctx.strokeStyle = palette.edge(alpha);
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
      }

      // Nodes: small squares, not dots. Reads as instrumentation.
      for (const node of nodes) {
        ctx.fillStyle = palette.node;
        ctx.fillRect(node.x - 1, node.y - 1, 2, 2);
      }

      // Packets in flight along edges.
      if (edges.length > 0 && packets.length < 7 && Math.random() < 0.035) {
        packets.push({
          edge: Math.floor(Math.random() * edges.length),
          t: 0,
          speed: 0.004 + Math.random() * 0.006,
        });
      }

      packets = packets.filter((packet) => {
        const edge = edges[packet.edge];
        if (!edge) return false;
        packet.t += packet.speed;
        if (packet.t >= 1) return false;

        const [a, b] = edge;
        const x = nodes[a].x + (nodes[b].x - nodes[a].x) * packet.t;
        const y = nodes[a].y + (nodes[b].y - nodes[a].y) * packet.t;
        const fade = Math.sin(packet.t * Math.PI);

        ctx.fillStyle = palette.packet(0.85 * fade);
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        ctx.fillStyle = palette.packet(0.18 * fade);
        ctx.fillRect(x - 4, y - 4, 8, 8);
        return true;
      });

      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    resize();
    frame = requestAnimationFrame(draw);

    const onResize = () => {
      stop();
      resize();
      start();
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    observer.observe(canvas);

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // Re-runs on theme change so the mesh repaints in the new palette.
  }, [reduce, palette]);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
