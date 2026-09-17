/**
 * EVERY NUMBER THE SITE SHOWS A PROSPECT LIVES IN THIS FILE.
 * ---------------------------------------------------------------------------
 * FwdEngine sells to regulated financial institutions. Procurement and risk
 * teams diligence performance claims, and the FTC has an active enforcement
 * line on unverifiable AI performance marketing. So:
 *
 *   1. A metric is only rendered as fact when `verified: true`.
 *   2. Anything still set to PLACEHOLDER renders in a visibly unfilled state
 *      and is excluded from structured data and OG images.
 *   3. `basis` is not optional. If you cannot write down what the number is
 *      measured against, it is not ready to go on the page.
 *
 * To go live: replace the PLACEHOLDER values, write a real `basis`, flip
 * `verified` to true. Nothing else in the codebase needs to change.
 */

export const PLACEHOLDER = "__REPLACE__" as const;

export type Metric = {
  readonly id: string;
  /** Short label, sentence case. */
  readonly label: string;
  /** The figure itself, or PLACEHOLDER. */
  readonly value: string;
  /** Unit or qualifier rendered at reduced emphasis, e.g. "days", "%". */
  readonly unit?: string;
  /** What the figure is measured against. Required for diligence. */
  readonly basis: string;
  /** Flip to true only when the figure is evidenced and defensible. */
  readonly verified: boolean;
};

export function isPlaceholder(metric: Pick<Metric, "value" | "verified">): boolean {
  return !metric.verified || metric.value.includes(PLACEHOLDER);
}

/** Headline proof block on the homepage, rendered as a terminal readout. */
export const proofMetrics: readonly Metric[] = [
  {
    id: "time-to-first-agent",
    label: "Time to first agent in production",
    value: PLACEHOLDER,
    unit: "days",
    basis:
      "Median calendar days from engagement kickoff to a first agent serving traffic behind a human-approval gate, across completed engagements.",
    verified: false,
  },
  {
    id: "leverage-ratio",
    label: "Engineer-to-agent leverage",
    value: PLACEHOLDER,
    unit: "agents / FDE",
    basis:
      "Mean count of production agents under active operation per forward deployed engineer, measured at engagement handover.",
    verified: false,
  },
  {
    id: "orchestrator-uptime",
    label: "Orchestrator uptime",
    value: PLACEHOLDER,
    unit: "%",
    basis:
      "Trailing twelve-month availability of the control plane, measured against the SLA definition in the master services agreement.",
    verified: false,
  },
  {
    id: "control-pass-rate",
    label: "Control evidence pass rate",
    value: PLACEHOLDER,
    unit: "%",
    basis:
      "Share of client internal-audit and model-risk reviews cleared without a remediation finding attributable to FwdEngine-delivered systems.",
    verified: false,
  },
] as const;

/**
 * The status strip under the hero.
 *
 * This is a SIMULATED readout of the shape of a real deployment, not live
 * telemetry. The strip renders a persistent "simulated" marker so it cannot be
 * mistaken for production data. If you wire it to a real feed, set
 * `isLive: true` and remove the marker at the same time, not before.
 */
export const statusStrip = {
  isLive: false,
  note: "Illustrative system readout. Not live telemetry.",
  fields: [
    { key: "agents_active", value: PLACEHOLDER, label: "agents active" },
    { key: "delivery_hubs", value: PLACEHOLDER, label: "delivery hubs" },
    { key: "core_integrations", value: PLACEHOLDER, label: "core banking integrations live" },
    { key: "eval_suites", value: PLACEHOLDER, label: "evaluation suites green" },
    { key: "human_gates", value: PLACEHOLDER, label: "human approval gates armed" },
  ],
} as const;
