"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type NodeState = "idle" | "active" | "done" | "gated";

type GraphNode = {
  readonly id: string;
  readonly label: string;
  readonly x: number;
  readonly y: number;
  /** Milliseconds this node holds while the run passes through it. */
  readonly dwell: number;
  /** Human gates render amber and hold longer. They are the point. */
  readonly gate?: boolean;
};

const NODES: readonly GraphNode[] = [
  { id: "intake", label: "INTAKE", x: 4, y: 52, dwell: 900 },
  { id: "plan", label: "PLAN", x: 104, y: 8, dwell: 1200 },
  { id: "retrieve", label: "RETRIEVE", x: 104, y: 96, dwell: 1100 },
  { id: "execute", label: "EXECUTE", x: 218, y: 52, dwell: 1400 },
  { id: "guard", label: "GUARD", x: 328, y: 8, dwell: 1100 },
  { id: "gate", label: "HUMAN GATE", x: 328, y: 96, dwell: 2400, gate: true },
  { id: "audit", label: "AUDIT", x: 458, y: 52, dwell: 1000 },
] as const;

const EDGES: readonly (readonly [string, string])[] = [
  ["intake", "plan"],
  ["intake", "retrieve"],
  ["plan", "execute"],
  ["retrieve", "execute"],
  ["execute", "guard"],
  ["guard", "gate"],
  ["gate", "audit"],
] as const;

const NODE_WIDTH = 86;
const NODE_HEIGHT = 26;
const GATE_WIDTH = 108;

function nodeWidth(node: GraphNode) {
  return node.gate ? GATE_WIDTH : NODE_WIDTH;
}

function anchor(node: GraphNode, side: "in" | "out") {
  const width = nodeWidth(node);
  return {
    x: side === "in" ? node.x : node.x + width,
    y: node.y + NODE_HEIGHT / 2,
  };
}

/**
 * A compact orchestration graph that runs a request end to end, on a loop.
 *
 * This is an illustration of the execution model, not a telemetry feed. It
 * exists to make one thing visible at a glance: the run stops at the human
 * gate and waits. That pause is deliberate and is held longer than any other
 * step, because it is the product argument.
 */
export function OrchestrationGraph({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? NODES.length : 0);

  useEffect(() => {
    if (reduce) return;
    const node = NODES[step % NODES.length];
    const timer = setTimeout(
      () => setStep((current) => (current + 1) % (NODES.length + 1)),
      node?.dwell ?? 1200,
    );
    return () => clearTimeout(timer);
  }, [step, reduce]);

  const states = useMemo(() => {
    const map = new Map<string, NodeState>();
    NODES.forEach((node, index) => {
      if (reduce || index < step) map.set(node.id, "done");
      else if (index === step) map.set(node.id, node.gate ? "gated" : "active");
      else map.set(node.id, "idle");
    });
    return map;
  }, [step, reduce]);

  const activeEdgeIndex = EDGES.findIndex(
    ([, to]) => states.get(to) === "active" || states.get(to) === "gated",
  );

  const nodeById = useMemo(
    () => new Map(NODES.map((node) => [node.id, node])),
    [],
  );

  return (
    <figure
      className={cn(
        "glass edge-lit rounded-[10px] p-4 sm:p-5",
        className,
      )}
    >
      <figcaption className="mb-4 flex items-center justify-between gap-4">
        <span className="type-kicker">Execution model</span>
        <span className="type-mono flex items-center gap-2 text-[0.625rem] text-[var(--ink-dim)]">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 bg-[var(--accent-text)]"
          />
          illustrative
        </span>
      </figcaption>

      <svg
        viewBox="-6 -2 562 132"
        className="w-full"
        role="img"
        aria-label="An orchestration graph: intake fans out to planning and retrieval, converges on execution, passes a guardrail check, halts at a human approval gate, then writes to the audit log."
      >
        {EDGES.map(([fromId, toId], index) => {
          const from = nodeById.get(fromId);
          const to = nodeById.get(toId);
          if (!from || !to) return null;

          const start = anchor(from, "out");
          const end = anchor(to, "in");
          const midX = (start.x + end.x) / 2;
          const path = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`;
          const traversed = states.get(toId) === "done";
          const live = index === activeEdgeIndex;

          return (
            <g key={`${fromId}-${toId}`}>
              <path
                d={path}
                fill="none"
                stroke={traversed || live ? "var(--accent-text)" : "var(--line-strong)"}
                strokeOpacity={traversed ? 0.45 : live ? 0.8 : 1}
                strokeWidth="1"
              />
              {live && !reduce ? (
                <circle r="2.6" fill="var(--accent-text)">
                  <animateMotion dur="0.9s" repeatCount="indefinite" path={path} />
                </circle>
              ) : null}
            </g>
          );
        })}

        {NODES.map((node) => {
          const state = states.get(node.id) ?? "idle";
          const width = nodeWidth(node);
          const isGate = Boolean(node.gate);
          const accent = isGate ? "var(--amber)" : "var(--accent-text)";

          const stroke =
            state === "idle"
              ? "var(--line-strong)"
              : state === "done"
                ? "var(--line-strong)"
                : accent;

          return (
            <g key={node.id}>
              {state === "active" || state === "gated" ? (
                <rect
                  x={node.x - 4}
                  y={node.y - 4}
                  width={width + 8}
                  height={NODE_HEIGHT + 8}
                  rx="4"
                  fill={accent}
                  fillOpacity="0.1"
                  className={reduce ? undefined : "animate-pulse-node"}
                />
              ) : null}

              <rect
                x={node.x}
                y={node.y}
                width={width}
                height={NODE_HEIGHT}
                rx="2"
                fill="var(--surface-1)"
                fillOpacity={state === "idle" ? 0.55 : 0.92}
                stroke={stroke}
                strokeWidth="1"
              />

              <rect
                x={node.x + 8}
                y={node.y + NODE_HEIGHT / 2 - 2}
                width="4"
                height="4"
                fill={
                  state === "idle"
                    ? "var(--ink-dim)"
                    : state === "done"
                      ? "var(--ink-muted)"
                      : accent
                }
              />

              <text
                x={node.x + 19}
                y={node.y + NODE_HEIGHT / 2 + 3.5}
                fontFamily="var(--font-mono)"
                fontSize="9.5"
                letterSpacing="0.08em"
                fill={state === "idle" ? "var(--ink-dim)" : "var(--ink)"}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <p
        className="type-mono mt-3 text-[0.6875rem] leading-relaxed text-[var(--ink-dim)]"
        aria-live="off"
      >
        {states.get("gate") === "gated"
          ? "> gate.hold — awaiting named approver"
          : "> run.trace — every step recorded, append-only"}
      </p>
    </figure>
  );
}
