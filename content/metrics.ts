import { activeHubs } from "@/content/hubs";

/**
 * EVERY NUMBER THE SITE SHOWS A PROSPECT LIVES IN THIS FILE.
 * ---------------------------------------------------------------------------
 * The figures below are ILLUSTRATIVE. They are shaped like real operating
 * numbers so the design reads as finished, and they are internally consistent
 * with the rest of the site, but none of them is evidenced.
 *
 * That is fine for a preview, a design review or a pitch deck screenshot. It
 * is not fine on fwdengine.com in front of a bank's procurement team:
 * uptime and control-pass-rate claims are exactly what FTC Operation AI
 * Comply targets, and a CTO who asks "measured against what, over what
 * period?" deserves an answer.
 *
 * Which is what `verified` is for. It does not change how anything renders.
 * It drives one build-time check:
 *
 *   - Any production build that is not a preview prints a loud warning
 *     listing the unverified figures.
 *   - `STRICT_METRICS=1 npm run build` turns that warning into a hard failure.
 *     Set it in whatever deploys the real domain and this becomes impossible
 *     to ship by accident.
 *
 * To go live for real: replace the values with evidenced ones, keep `basis`
 * accurate, flip `verified` to true.
 */

export const PLACEHOLDER = "__REPLACE__" as const;

export type Metric = {
  readonly id: string;
  /** Short label, sentence case. */
  readonly label: string;
  /** The figure itself. `PLACEHOLDER` renders as an empty reserved slot. */
  readonly value: string;
  /** Unit or qualifier rendered at reduced emphasis, e.g. "days", "%". */
  readonly unit?: string;
  /** What the figure is measured against. Required for diligence. */
  readonly basis: string;
  /** True only when the figure is evidenced. Drives the build-time check. */
  readonly verified: boolean;
};

/** A figure with nothing in it at all. Renders as a reserved slot. */
export function isPlaceholder(metric: Pick<Metric, "value">): boolean {
  return metric.value.includes(PLACEHOLDER);
}

/** Headline proof block on the homepage, rendered as a terminal readout. */
export const proofMetrics: readonly Metric[] = [
  {
    id: "time-to-first-agent",
    label: "Time to first agent in production",
    value: "19",
    unit: "days",
    basis:
      "Median calendar days from engagement kickoff to a first agent serving traffic behind a human-approval gate, across completed engagements.",
    verified: false,
  },
  {
    id: "leverage-ratio",
    label: "Engineer-to-agent leverage",
    value: "8.4",
    unit: "agents / FDE",
    basis:
      "Mean count of production agents under active operation per forward deployed engineer, measured at engagement handover.",
    verified: false,
  },
  {
    id: "orchestrator-uptime",
    label: "Orchestrator uptime",
    value: "99.95",
    unit: "%",
    basis:
      "Trailing twelve-month availability of the control plane, measured against the SLA definition in the master services agreement.",
    verified: false,
  },
  {
    id: "control-pass-rate",
    label: "Control evidence pass rate",
    value: "96",
    unit: "%",
    basis:
      "Share of client internal-audit and model-risk reviews cleared without a remediation finding attributable to FwdEngine-delivered systems.",
    verified: false,
  },
] as const;

/* -------------------------------------------------------------------------- */
/* The status strip under the hero                                            */
/* -------------------------------------------------------------------------- */

/**
 * The readout under the hero.
 *
 * `delivery_hubs` is derived from `content/hubs.ts` rather than typed in. A
 * prospect who reads "six hubs" here and then counts five on the Global
 * Delivery page has found a reason not to trust anything else on the site,
 * and that is a very cheap mistake to avoid.
 */
export const statusStrip = {
  fields: [
    { key: "agents_active", value: "142", label: "agents active", verified: false },
    {
      key: "delivery_hubs",
      value: String(activeHubs.length),
      label: "delivery hubs live",
      verified: true,
    },
    { key: "core_integrations", value: "3", label: "core banking integrations live", verified: false },
    { key: "eval_suites", value: "27", label: "evaluation suites green", verified: false },
    { key: "human_gates", value: "61", label: "human approval gates armed", verified: false },
    { key: "regions", value: "5", label: "time zones staffed", verified: true },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* Build-time check                                                           */
/* -------------------------------------------------------------------------- */

const unverified = [
  ...proofMetrics.filter((metric) => !metric.verified).map((m) => m.label),
  ...statusStrip.fields.filter((field) => !field.verified).map((f) => f.label),
];

// Only on the server, only in a production build, and never for a preview
// deployment — a preview is understood to be illustrative.
if (
  typeof window === "undefined" &&
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PUBLIC_PREVIEW !== "1" &&
  unverified.length > 0
) {
  const message =
    `\n[metrics] ${unverified.length} figure(s) on this build are ILLUSTRATIVE, not evidenced:\n` +
    unverified.map((label) => `  - ${label}`).join("\n") +
    `\n[metrics] Edit content/metrics.ts and set verified: true once each is evidenced.` +
    `\n[metrics] Run with STRICT_METRICS=1 to make this a hard failure.\n`;

  if (process.env.STRICT_METRICS === "1") {
    throw new Error(message);
  }
  console.warn(message);
}
