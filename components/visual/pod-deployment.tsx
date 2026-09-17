"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

const STACK = [
  { id: "channels", label: "CHANNELS", detail: "web · mobile · branch · advisor desktop" },
  { id: "core", label: "CORE + LEDGER", detail: "read plane only, no write path taken" },
  { id: "data", label: "DATA PLATFORM", detail: "same feeds your warehouse already takes" },
  { id: "controls", label: "CONTROLS + AUDIT", detail: "your IAM, your log estate, your evidence" },
] as const;

const POD = [
  { id: "lead", label: "LEAD FDE", kind: "human" },
  { id: "platform", label: "PLATFORM ENG", kind: "human" },
  { id: "domain", label: "DOMAIN ENG", kind: "human" },
  { id: "agents", label: "AGENT FLEET", kind: "agent" },
] as const;

const SLAB_X = 236;
const SLAB_WIDTH = 318;
const SLAB_HEIGHT = 52;
const SLAB_GAP = 14;
const SLAB_TOP = 46;

/**
 * The FDE model as a diagram: a pod lands inside the client's existing stack
 * and wires into the layers it is permitted to touch.
 *
 * The visual argument is the absence of a new layer. Nothing is replaced;
 * the pod attaches to what is already there.
 */
export function PodDeployment({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  const slabY = (index: number) => SLAB_TOP + index * (SLAB_HEIGHT + SLAB_GAP);

  const draw = (delay: number) =>
    reduce
      ? { initial: undefined, animate: undefined }
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
          viewport: { once: true, margin: "-15% 0px" },
        };

  return (
    <figure className={cn("glass edge-lit rounded-[10px] p-5 sm:p-7", className)}>
      <figcaption className="mb-5 flex items-center justify-between gap-4">
        <span className="type-kicker">Deployment topology</span>
        <span className="type-mono text-[0.625rem] text-[var(--ink-dim)]">
          pod → existing stack
        </span>
      </figcaption>

      <svg
        viewBox="0 0 608 322"
        className="w-full"
        role="img"
        aria-label="A three-engineer pod with an agent fleet attaches to four existing layers of a client stack: channels, core and ledger, data platform, and controls and audit. No new layer is introduced."
      >
        {/* Client stack bracket. It sits to the right of the slabs so it never
            crosses the connectors coming in from the pod on the left. */}
        <motion.path
          d={`M ${SLAB_X + SLAB_WIDTH + 14} ${SLAB_TOP - 14} L ${SLAB_X + SLAB_WIDTH + 24} ${SLAB_TOP - 14} L ${SLAB_X + SLAB_WIDTH + 24} ${slabY(3) + SLAB_HEIGHT + 14} L ${SLAB_X + SLAB_WIDTH + 14} ${slabY(3) + SLAB_HEIGHT + 14}`}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth="1"
          {...draw(0.1)}
        />
        <text
          x={SLAB_X + SLAB_WIDTH + 40}
          y={(SLAB_TOP + slabY(3) + SLAB_HEIGHT) / 2}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="9"
          letterSpacing="0.16em"
          fill="var(--ink-dim)"
          transform={`rotate(-90 ${SLAB_X + SLAB_WIDTH + 40} ${(SLAB_TOP + slabY(3) + SLAB_HEIGHT) / 2})`}
        >
          YOUR ESTATE
        </text>

        {/* Stack slabs */}
        {STACK.map((layer, index) => {
          const y = slabY(index);
          return (
            <motion.g
              key={layer.id}
              initial={reduce ? undefined : { opacity: 0, x: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-15% 0px" }}
            >
              <rect
                x={SLAB_X}
                y={y}
                width={SLAB_WIDTH}
                height={SLAB_HEIGHT}
                rx="3"
                fill="var(--surface-1)"
                fillOpacity="0.8"
                stroke="var(--line-strong)"
                strokeWidth="1"
              />
              <rect x={SLAB_X} y={y} width="2" height={SLAB_HEIGHT} fill="var(--accent-text)" fillOpacity="0.55" />
              <text
                x={SLAB_X + 16}
                y={y + 21}
                fontFamily="var(--font-mono)"
                fontSize="10"
                letterSpacing="0.12em"
                fill="var(--ink)"
              >
                {layer.label}
              </text>
              <text
                x={SLAB_X + 16}
                y={y + 38}
                fontFamily="var(--font-mono)"
                fontSize="8.5"
                fill="var(--ink-dim)"
              >
                {layer.detail}
              </text>
            </motion.g>
          );
        })}

        {/* Connectors from pod to each layer */}
        {STACK.map((layer, index) => {
          const y = slabY(index) + SLAB_HEIGHT / 2;
          const startY = 161;
          const path = `M 194 ${startY} C 214 ${startY}, 214 ${y}, ${SLAB_X - 2} ${y}`;
          return (
            <motion.path
              key={`link-${layer.id}`}
              d={path}
              fill="none"
              stroke="var(--accent-text)"
              strokeOpacity="0.6"
              strokeWidth="1"
              {...draw(0.55 + index * 0.12)}
            />
          );
        })}

        {/* The pod */}
        <motion.g
          initial={reduce ? undefined : { opacity: 0, y: -26 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-15% 0px" }}
        >
          <rect
            x="18"
            y="86"
            width="176"
            height="150"
            rx="4"
            fill="var(--surface-2)"
            fillOpacity="0.72"
            stroke="var(--indigo)"
            strokeOpacity="0.55"
            strokeWidth="1"
          />
          <text
            x="32"
            y="108"
            fontFamily="var(--font-mono)"
            fontSize="9"
            letterSpacing="0.16em"
            fill="var(--ink-dim)"
          >
            FWDENGINE POD
          </text>
          {POD.map((member, index) => {
            const y = 122 + index * 26;
            const isAgent = member.kind === "agent";
            return (
              <g key={member.id}>
                <rect
                  x="32"
                  y={y}
                  width="148"
                  height="20"
                  rx="2"
                  fill="var(--canvas)"
                  fillOpacity="0.85"
                  stroke={isAgent ? "var(--accent-text)" : "var(--line-strong)"}
                  strokeOpacity={isAgent ? 0.6 : 1}
                  strokeWidth="1"
                />
                <rect
                  x="40"
                  y={y + 8}
                  width="4"
                  height="4"
                  fill={isAgent ? "var(--accent-text)" : "var(--ink-muted)"}
                />
                <text
                  x="52"
                  y={y + 14}
                  fontFamily="var(--font-mono)"
                  fontSize="8.5"
                  letterSpacing="0.1em"
                  fill="var(--ink)"
                >
                  {member.label}
                </text>
              </g>
            );
          })}
        </motion.g>
      </svg>
    </figure>
  );
}
