/**
 * The agentic computation layer.
 *
 * `pipelineStages` drives the animated pipeline diagram on the homepage and
 * the deep architecture page. Order is the execution order; the diagram reads
 * left to right and the return path is the human gate feeding back to plan.
 */

export type PipelineStage = {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  /** Short label used inside the diagram node. */
  readonly nodeLabel: string;
  readonly summary: string;
  readonly detail: readonly string[];
  /** Which signal colour the node carries. Amber is reserved for human gates. */
  readonly signal: "indigo" | "cyan" | "amber";
};

export const pipelineStages: readonly PipelineStage[] = [
  {
    id: "plan",
    index: "01",
    title: "Planning agents",
    nodeLabel: "PLAN",
    summary:
      "Decompose a request into a typed task graph against the tools that actually exist in your estate, and refuse the ones that do not.",
    detail: [
      "Task decomposition bounded by a declared tool manifest, not open-ended autonomy",
      "Every plan is a serialisable graph, inspectable before a single tool call fires",
      "Cost and latency budgets attached at plan time and enforced at execution",
      "Replans on failure are capped and logged; there is no unbounded retry loop",
    ],
    signal: "indigo",
  },
  {
    id: "retrieve",
    index: "02",
    title: "Retrieval and context assembly",
    nodeLabel: "RETRIEVE",
    summary:
      "Fetch from the corpora this request is entitled to reach, and record what was read at the moment it was read.",
    detail: [
      "Entitlements resolved at the index boundary, so information barriers are structural",
      "Hybrid lexical and dense retrieval with reranking over your own documents",
      "Every retrieved span is pinned to the answer it supports, for later citation",
      "Corpus freshness stamped into the record; a stale read is visible, not silent",
    ],
    signal: "cyan",
  },
  {
    id: "execute",
    index: "03",
    title: "Execution agents",
    nodeLabel: "EXECUTE",
    summary:
      "Call tools inside an isolation cell with a scoped credential, a time budget and no ambient network access.",
    detail: [
      "One cell per engagement: scoped credentials, egress allowlist, no shared state",
      "Tool calls are typed and schema-validated in both directions",
      "Writes default to draft. Post, send and decide rights are withheld unless granted",
      "Deterministic replay from the recorded call log, for incident reconstruction",
    ],
    signal: "indigo",
  },
  {
    id: "guard",
    index: "04",
    title: "Guardrail and compliance agents",
    nodeLabel: "GUARD",
    summary:
      "Check the output against policy, jurisdiction and prohibited-inference rules before any human sees it.",
    detail: [
      "Policy checks run as separate graded agents, not as instructions inside the main prompt",
      "Prohibited-inference rules enforced by evaluation, not by asking the model nicely",
      "Prompt-injection resistance tested against your own adversarial corpus on every release",
      "A failed check stops the run and raises the reason; it does not silently degrade",
    ],
    signal: "cyan",
  },
  {
    id: "gate",
    index: "05",
    title: "Human approval gates",
    nodeLabel: "HUMAN GATE",
    summary:
      "Route to the role that holds the authority today, with the evidence already assembled, and wait.",
    detail: [
      "Gates map to existing authority: the credit officer, the MLRO, the licensed adjuster",
      "The approver sees the recommendation, the evidence and what the system was unsure about",
      "Approve, amend and reject are all first-class outcomes and all are recorded",
      "No path exists that reaches a consequential action without a named human actor",
    ],
    signal: "amber",
  },
  {
    id: "audit",
    index: "06",
    title: "Evaluation and audit",
    nodeLabel: "EVAL + AUDIT",
    summary:
      "Score every run against your adjudicated cases and emit an append-only record your auditor can read.",
    detail: [
      "Evaluation suites seeded from your historical decisions, not public benchmarks",
      "Model and prompt versions recorded per output; upgrades gated on regression",
      "Append-only audit log covering every AI output and every human decision",
      "Drift monitoring against the baseline captured in week one of the engagement",
    ],
    signal: "cyan",
  },
] as const;

/** Cross-cutting architecture principles for the Platform page. */
export const architecturePrinciples: readonly {
  readonly title: string;
  readonly body: string;
}[] = [
  {
    title: "Model agnostic by construction",
    body: "Providers sit behind one versioned interface. Swapping a frontier model, or running two in parallel for comparison, is a configuration change and a regression run, not a rebuild. Institutions that cannot take a hard dependency on a single vendor are the ones we built this for.",
  },
  {
    title: "The state machine owns control flow",
    body: "Agents are stateless functions with a prompt and a schema. What runs next is decided by an explicit state machine in your infrastructure, not by a model reasoning its way through a framework. This is the difference between a system you can reason about at three in the morning and one you cannot.",
  },
  {
    title: "Isolation cells, one per engagement",
    body: "Compute, credentials, indexes and logs are separated per engagement. There is no shared inference pool across clients and no shared vector index. Cross-tenant contamination is prevented by topology rather than by policy.",
  },
  {
    title: "Untrusted input, everywhere",
    body: "Documents, emails, and third-party API responses are treated as adversarial input. Extraction is separated from reasoning, extraction output is data and never instruction, and injection resistance is a test in the release gate rather than a hope.",
  },
  {
    title: "Runs in your estate",
    body: "Deployment targets your cloud account, your VPC and your key management. Data residency follows your existing obligations because the compute never leaves them. Where an on-premise path is required, the control plane supports it.",
  },
  {
    title: "Evidence is a build artefact",
    body: "The model risk pack is generated continuously from live run data, starting in week two. By the time internal audit asks, the evidence already exists and covers the period they care about, rather than being reconstructed afterwards.",
  },
] as const;

/**
 * What the platform deliberately does not do.
 *
 * These are not unreached roadmap items. They are excluded by design, and the
 * exclusions are a large part of what makes the rest deployable inside a
 * regulated institution.
 */
export const exclusions: readonly {
  readonly title: string;
  readonly body: string;
}[] = [
  {
    title: "No auto-decision path",
    body: "There is no state transition to a consequential outcome without a named human actor. This is asserted in tests, not described in a policy document.",
  },
  {
    title: "No third-party data enrichment in decisioning",
    body: "Cross-checking an applicant against purchased data sets is how a software vendor becomes a consumer reporting agency. We stay out of that regime entirely.",
  },
  {
    title: "No inference on protected or proxy attributes",
    body: "Age, date of birth, graduation year, postcode as a proxy, name weighting and employment-gap penalties are excluded at the prompt and enforced in the evaluation gate.",
  },
  {
    title: "No affect, tone or facial analysis",
    body: "Not in claims, not in servicing, not in hiring. The research base is weak and the regulatory exposure is severe.",
  },
  {
    title: "No shared inference pool across clients",
    body: "One isolation cell per engagement. Cross-tenant separation is a property of the topology, not a promise in a contract.",
  },
] as const;
